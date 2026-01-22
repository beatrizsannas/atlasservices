import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface ClientDetailsProps {
  onBack: () => void;
  clientId: string | null;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ onBack, clientId }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'equipment'>('history');
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    console.log('ClientDetails mounted for ID:', clientId);
    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      // Fetch Client Info
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      // Fetch Services (Appointments for now, assuming they represent services)
      // In a real app we might have a separate 'services_history' or filter appointments
      const { data: servicesData, error: servicesError } = await supabase
        .from('appointments')
        .select('*, services(title, price)') // assuming relation
        .eq('client_id', clientId)
        .order('start_time', { ascending: false })
        .limit(5);

      if (servicesData) setServices(servicesData);

    } catch (error: any) {
      console.error('Error fetching client details:', error);
      showAlert('Erro', 'Erro ao carregar detalhes do cliente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (!client && !loading) return <div>Cliente não encontrado.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background-light pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md px-4 py-3 border-b border-gray-200 flex justify-between items-center transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[#111418]">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-[#0B2A5B]">Detalhes do Cliente</h1>
        </div>
        <button className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors text-[#0B2A5B]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>edit</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
        </div>
      ) : (
        <main className="flex flex-col gap-4 px-4 py-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#E8EDF5] flex items-center justify-center text-[#0B2A5B] text-2xl font-bold">
                {getInitials(client.name)}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-[#111418]">{client.name}</h2>
                <div className="flex">
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium">Ativo</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              {client.phone && (
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  <span>{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                  <span>{client.email}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  <span>{client.address}{client.number ? `, ${client.number}` : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === 'history'
                ? 'bg-[#0B2A5B] text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              Histórico de Serviços
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === 'equipment'
                ? 'bg-[#0B2A5B] text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              Equipamentos
            </button>
          </div>

          {/* Content based on Tab */}
          {activeTab === 'history' ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-1 mt-2">
                <h3 className="text-base font-bold text-[#111418]">Últimos Serviços</h3>
                <span className="text-sm font-medium text-[#0B2A5B] cursor-pointer hover:underline">Ver todos</span>
              </div>

              {services.length > 0 ? (
                services.map((service: any) => (
                  <div key={service.id} className="bg-white p-5 rounded-[20px] shadow-sm flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400">{formatDate(service.start_time)}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${service.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
                          }`}>
                          {service.status === 'completed' ? 'Concluído' : 'Agendado'}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#111418]">
                        {service.services?.title || 'Serviço Personalizado'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {service.notes || 'Sem observações'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-sm text-[#111418]">
                        {service.services?.price ? formatCurrency(service.services.price) : '-'}
                      </span>
                      <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">Nenhum serviço registrado.</div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-center py-10 text-gray-500">
                Funcionalidade de equipamentos em breve.
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};