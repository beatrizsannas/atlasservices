import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface ClientsProps {
  onClientClick: (id: string) => void;
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
    <div className="flex flex-col h-full bg-background-light overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md px-4 py-3 border-b border-gray-200 flex justify-between items-center relative transition-colors duration-200">
        <button
          onClick={onBack}
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">Clientes</h1>
        <button
          onClick={onNewClient}
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>add</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="px-4 py-4 sticky top-[65px] z-40 bg-background-light">
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              className="w-full pl-10 pr-4 py-3 rounded-[16px] border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-gray-400 text-sm transition-all text-gray-800"
              placeholder="Buscar cliente..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-white w-[48px] flex items-center justify-center rounded-[16px] shadow-sm text-primary hover:bg-gray-50 active:scale-95 transition-all border border-transparent">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="px-4 pb-4">
        <div className="bg-card-blue p-5 rounded-[20px] shadow-sm flex items-center justify-between border border-transparent">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-primary/70 uppercase tracking-wide">Visão Geral</span>
            <h2 className="text-2xl font-bold text-primary">Total de Clientes: {loading ? '...' : clients.length}</h2>
          </div>
          <div className="bg-white/40 rounded-full p-2.5">
            <span className="material-symbols-outlined text-primary text-2xl">group</span>
          </div>
        </div>
      </div>

      {/* Client List */}
      <main className="flex flex-col gap-3 px-4 pb-32">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
          </div>
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => onClientClick(client.id)}
              className="bg-white p-4 rounded-[16px] shadow-sm flex items-center justify-between border border-transparent hover:border-primary/10 transition-all cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-[#111418]">{client.name}</h2>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
                  <span className="text-sm">{client.phone || 'Sem telefone'}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-sky-blue/20 text-primary text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
                  Serviços: -
                </span>
                <div className="flex items-center gap-3 pr-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEditClient) onEditClient(client.id);
                    }}
                    className="text-[#0B2A5B] hover:opacity-80 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, client.id)}
                    className="text-[#8A8F98] hover:opacity-80 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            {search ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
          </div>
        )}
      </main>
    </div>
  );
};