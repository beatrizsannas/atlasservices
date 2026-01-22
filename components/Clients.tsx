import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface ClientsProps {
  onClientClick: () => void;
  onBack: () => void;
  onNewClient?: () => void;
  onEditClient?: (id: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({ onClientClick, onBack, onNewClient, onEditClient }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        setClients(data);
      }
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      showAlert('Erro', 'Erro ao carregar clientes: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = await showConfirm('Excluir Cliente', 'Tem certeza que deseja excluir este cliente?');
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;

      setClients(clients.filter(client => client.id !== id));
      showAlert('Sucesso', 'Cliente excluído com sucesso.', 'success');
    } catch (error: any) {
      console.error('Error deleting client:', error);
      showAlert('Erro', 'Erro ao excluir cliente: ' + error.message, 'error');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(search.toLowerCase())) ||
    (client.phone && client.phone.includes(search))
  );

  return (
    <div className="flex flex-col h-full bg-background-light">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-[#0B2A5B] px-4 py-4 text-white shadow-md">
        <button
          onClick={onBack}
          className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors -ml-2"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Clientes</h1>
        <button
          onClick={onNewClient}
          className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors -mr-2"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
        </button>
      </header>

      <div className="px-4 py-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
          </div>
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              phone={client.phone}
              email={client.email}
              onClick={onClientClick}
              onDelete={(e) => handleDelete(e, client.id)}
              onEdit={(e) => {
                e.stopPropagation();
                if (onEditClient) onEditClient(client.id);
              }}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            {search ? 'Nenhum cliente encontrado para a busca.' : 'Nenhum cliente cadastrado.'}
          </div>
        )}
      </main>
    </div>
  );
};

interface ClientCardProps {
  name: string;
  phone: string;
  email?: string;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ name, phone, email, onClick, onDelete, onEdit }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer"
  >
    <div className="flex flex-col gap-1">
      <h3 className="font-bold text-[#111418] text-base">{name}</h3>
      <div className="flex flex-col gap-0.5">
        {phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="material-symbols-outlined text-[14px]">call</span>
            {phone}
          </div>
        )}
        {email && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="material-symbols-outlined text-[14px]">mail</span>
            {email}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
        onClick={onEdit}
      >
        <span className="material-symbols-outlined text-[20px]">edit</span>
      </button>
      <button
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        onClick={onDelete}
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  </div>
);