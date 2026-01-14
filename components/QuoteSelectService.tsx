import React, { useState } from 'react';

interface QuoteSelectServiceProps {
  onBack: () => void;
  onSelect: (service: any) => void;
}

export const QuoteSelectService: React.FC<QuoteSelectServiceProps> = ({ onBack, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: '1',
      title: 'Limpeza de Ar Condicionado',
      price: 'R$ 180,00',
      duration: '1h 30m',
      icon: 'ac_unit',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Instalação Elétrica Residencial',
      price: 'R$ 120,00',
      duration: '2h 00m',
      icon: 'electrical_services',
      color: 'bg-amber-500'
    },
    {
      id: '3',
      title: 'Manutenção de Aquecedor a Gás',
      price: 'R$ 250,00',
      duration: '1h 00m',
      icon: 'fire_extinguisher',
      color: 'bg-red-500'
    },
    {
      id: '4',
      title: 'Visita Técnica de Avaliação',
      price: 'R$ 80,00',
      duration: '30m',
      icon: 'assignment',
      color: 'bg-indigo-500'
    },
    {
      id: '5',
      title: 'Troca de Disjuntores',
      price: 'R$ 90,00',
      duration: '45m',
      icon: 'bolt',
      color: 'bg-yellow-600'
    },
    {
      id: '6',
      title: 'Reparo de Encanamento',
      price: 'R$ 150,00',
      duration: '1h 15m',
      icon: 'plumbing',
      color: 'bg-cyan-500'
    }
  ];

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] pb-safe overflow-x-hidden">
      <header className="bg-[#0B2A5B] pt-safe sticky top-0 z-50 shadow-md">
        <div className="px-4 h-[60px] flex items-center justify-between text-white">
          <button
            onClick={onBack}
            className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold">Selecionar Serviço</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="sticky top-20 z-40 -mx-4 px-4 pb-2 bg-background-light transition-all">
        <div className="px-4 py-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3.5 border-none rounded-lg bg-white focus:ring-2 focus:ring-primary text-sm shadow-sm placeholder-gray-400 outline-none"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-2 flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Serviços Disponíveis</h2>
          <button className="text-primary text-xs font-semibold">Ver todos</button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredServices.map((service) => (
            <ServiceItem
              key={service.id}
              title={service.title}
              price={service.price}
              duration={service.duration}
              icon={service.icon}
              color={service.color}
              onClick={() => onSelect(service)}
            />
          ))}

          {filteredServices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <span className="material-symbols-outlined text-gray-400 text-3xl">search_off</span>
              </div>
              <p className="text-gray-500 font-medium">Nenhum serviço encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

interface ServiceItemProps {
  title: string;
  price: string;
  duration: string;
  icon: string;
  color: string;
  onClick: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ title, price, duration, icon, color, onClick }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white shadow-sm`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-tight">{title}</h3>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="font-bold text-primary">{price}</span>
            <span className="text-gray-300 h-3 border-l border-gray-300"></span>
            <span className="text-gray-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">schedule</span>
              {duration}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined">add</span>
      </div>
    </div>
  );
};