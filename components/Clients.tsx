import React from 'react';

interface ClientsProps {
  onClientClick: () => void;
  onBack: () => void;
  onNewClient?: () => void;
}

export const Clients: React.FC<ClientsProps> = ({ onClientClick, onBack, onNewClient }) => {
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
              />
            </div>
            <button className="bg-white w-[48px] flex items-center justify-center rounded-[16px] shadow-sm text-primary hover:bg-gray-50 active:scale-95 transition-all border border-transparent">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="px-4 py-4">
        <div className="bg-card-blue p-5 rounded-[20px] shadow-sm flex items-center justify-between border border-transparent">
          <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
            <span className="text-sm font-medium text-primary/70 uppercase tracking-wide">Visão Geral</span>
            <h2 className="text-2xl font-bold text-primary leading-tight break-words">Total de Clientes: 124</h2>
          </div>
          <div className="bg-white/40 rounded-full p-3 shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">group</span>
          </div>
        </div>
      </div>

      {/* Client List */}
      <main className="flex flex-col gap-3 px-4 pb-6">
        <ClientCard name="Ana Clara Silva" phone="(11) 98765-4321" serviceCount={8} onClick={onClientClick} />
        <ClientCard name="Carlos Eduardo" phone="(21) 99888-7777" serviceCount={3} onClick={onClientClick} />
        <ClientCard name="Fernanda Oliveira" phone="(31) 97654-3210" serviceCount={12} onClick={onClientClick} />
        <ClientCard name="João Pedro Santos" phone="(41) 96543-2109" serviceCount={1} onClick={onClientClick} />
        <ClientCard name="Mariana Costa" phone="(51) 95432-1098" serviceCount={5} onClick={onClientClick} />
        <ClientCard name="Rafael Souza" phone="(61) 94321-0987" serviceCount={9} onClick={onClientClick} />
      </main>
    </div>
  );
};

interface ClientCardProps {
  name: string;
  phone: string;
  serviceCount: number;
  onClick: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ name, phone, serviceCount, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-[16px] shadow-sm flex items-center justify-between border border-transparent hover:border-primary/10 transition-all cursor-pointer group"
  >
    <div className="flex flex-col gap-1">
      <h2 className="text-base font-semibold text-[#111418]">{name}</h2>
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
        <span className="text-sm">{phone}</span>
      </div>
    </div>

    <div className="flex flex-col items-end gap-2">
      <span className="bg-sky-blue/20 text-primary text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
        Serviços: {serviceCount}
      </span>
      <div className="flex items-center gap-3 pr-1">
        <button
          className="text-[#0B2A5B] hover:opacity-80 transition-opacity p-1"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button
          className="text-[#8A8F98] hover:opacity-80 transition-opacity p-1"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  </div>
);