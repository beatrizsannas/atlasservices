import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ClientsProps {
  onClientClick: () => void;
  onBack: () => void;
  onNewClient?: () => void;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export const Clients: React.FC<ClientsProps> = ({ onClientClick, onBack, onNewClient }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

      if (error) throw error;
      if (data) setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Erro ao excluir cliente.');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background-light">
      {/* Header & Search Combined Sticky Container */}
      <div className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-gray-200 transition-colors duration-200 shadow-sm">
        {/* Header Row */}
        <div className="px-4 py-3 flex justify-between items-center relative">
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

        {/* Search Row */}
        <div className="px-4 pb-4">
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input
                className="w-full pl-10 pr-4 py-3 rounded-[16px] border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-gray-400 text-sm transition-all text-gray-800"
                placeholder="Buscar cliente..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="px-4 py-4">
        <div className="bg-card-blue p-5 rounded-[20px] shadow-sm flex items-center justify-between border border-transparent">
          <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
            <span className="text-sm font-medium text-primary/70 uppercase tracking-wide">Visão Geral</span>
            <h2 className="text-2xl font-bold text-primary leading-tight break-words">Total de Clientes: {loading ? '...' : clients.length}</h2>
          </div>
          <div className="bg-white/40 rounded-full p-3 shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">group</span>
          </div>
        </div>
      </div>

      {/* Client List */}
      <main className="flex flex-col gap-3 px-4 pb-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando clientes...</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Nenhum cliente encontrado.</div>
        ) : (
          filteredClients.map(client => (
            <ClientCard
              key={client.id}
              name={client.name}
              phone={client.phone}
              onClick={onClientClick}
              onDelete={(e) => handleDelete(e, client.id)}
            />
          ))
        )}
      </main>
    </div>
  );
};

interface ClientCardProps {
  name: string;
  phone: string;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ name, phone, onClick, onDelete }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-[16px] shadow-sm flex items-center justify-between border border-transparent hover:border-primary/10 transition-all cursor-pointer group"
  >
    <div className="flex flex-col gap-1">
      <h2 className="text-base font-semibold text-[#111418]">{name}</h2>
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
        <span className="text-sm">{phone || 'Sem telefone'}</span>
      </div>
    </div>

    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3 pr-1">
        <button
          className="text-[#0B2A5B] hover:opacity-80 transition-opacity p-1"
          onClick={(e) => { e.stopPropagation(); /* Placeholder for edit */ }}
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button
          className="text-[#8A8F98] hover:opacity-80 transition-opacity p-1"
          onClick={onDelete}
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  </div>
);