import React from 'react';

interface ServicesProps {
  onBack: () => void;
  onNewService?: () => void;
  onEditService?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onBack, onNewService, onEditService }) => {
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
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar bg-background-light pb-32">
        <div className="flex flex-col gap-3 px-4 mt-4">
          <ServiceCard
            title="Manutenção de PC"
            duration="2h estimadas"
            price="R$ 150,00"
            onEdit={onEditService}
          />
          <ServiceCard
            title="Formatação Completa"
            duration="3h estimadas"
            price="R$ 100,00"
            onEdit={onEditService}
          />
          <ServiceCard
            title="Instalação de Rede"
            duration="4h estimadas"
            price="R$ 250,00"
            onEdit={onEditService}
          />
          <ServiceCard
            title="Backup e Cloud"
            duration="1h estimada"
            price="R$ 80,00"
            onEdit={onEditService}
          />
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
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, duration, price, onEdit }) => (
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
        <button className="text-gray-400 hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  </div>
);