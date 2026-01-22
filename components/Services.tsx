import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

export interface Service {
  id: string;
  title: string;
  duration_minutes: number;
  price: number;
  description: string;
}

interface ServicesProps {
  onBack: () => void;
  onNewService?: () => void;
  onEditService?: (service: Service) => void;
}

export const Services: React.FC<ServicesProps> = ({ onBack, onNewService, onEditService }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('title');

      if (error) throw error;
      if (data) setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = await showConfirm('Excluir Serviço', 'Tem certeza que deseja excluir este serviço?');
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setServices(prev => prev.filter(s => s.id !== id));
      showAlert('Sucesso', 'Serviço excluído com sucesso.', 'success');
    } catch (error) {
      console.error('Error deleting service:', error);
      showAlert('Erro', 'Erro ao excluir serviço.', 'error');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins} min`;
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display overflow-hidden">
      <header className="flex items-center bg-[#0B2A5B] p-4 pt-5 pb-4 justify-between shrink-0 z-10 shadow-md sticky top-0">
        <button
          onClick={onBack}
          className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:bg-white/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Meus Serviços</h2>
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={onNewService}
            className="flex items-center justify-center rounded-xl size-12 text-white bg-transparent hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>
      </header>

      <div className="bg-white px-4 py-3 border-b border-gray-100 shrink-0 sticky top-[72px] z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            placeholder="Buscar serviços..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar bg-background-light pb-32">
        <div className="flex flex-col gap-3 px-4 mt-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Carregando serviços...</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum serviço encontrado.</div>
          ) : (
            filteredServices.map(service => (
              <ServiceCard
                key={service.id}
                title={service.title}
                duration={formatDuration(service.duration_minutes)}
                price={`R$ ${service.price.toFixed(2).replace('.', ',')}`}
                onEdit={() => onEditService && onEditService(service)}
                onDelete={(e) => handleDelete(e, service.id)}
              />
            ))
          )}
          <div className="h-20"></div>
        </div>
      </main>
    </div>
  );
};

interface ServiceCardProps {
  title: string;
  duration: string;
  price: string;
  onEdit?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, duration, price, onEdit, onDelete }) => (
  <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-4 flex-1">
      <div className="flex flex-col justify-center">
        <p className="text-[#111418] text-base font-semibold leading-normal line-clamp-1">{title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[#637188] text-[16px]">schedule</span>
          <p className="text-[#637188] text-xs font-medium leading-normal">{duration}</p>
        </div>
      </div>
    </div>
    <div className="shrink-0 flex flex-col items-end gap-1.5">
      <p className="text-primary text-base font-bold leading-normal">{price}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={onEdit}
          className="text-[#0B2A5B] hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  </div>
);