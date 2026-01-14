import React, { useState } from 'react';

interface ClientDetailsProps {
  onBack: () => void;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'equipment'>('history');

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md px-4 py-3 border-b border-gray-200 flex justify-between items-center transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-800">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-primary">Detalhes do Cliente</h1>
        </div>
        <button className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>edit</span>
        </button>
      </div>

      <main className="flex flex-col gap-4 px-4 py-4">
        {/* Profile Card */}
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-transparent flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              AC
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-[#111418]">Ana Clara Silva</h2>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Ativo</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 w-full"></div>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <span className="material-symbols-outlined text-[20px] text-gray-400">phone</span>
              <span>(11) 98765-4321</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <span className="material-symbols-outlined text-[20px] text-gray-400">mail</span>
              <span>ana.clara@email.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <span className="material-symbols-outlined text-[20px] text-gray-400">location_on</span>
              <span>Rua das Flores, 123 - Centro</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-all ${activeTab === 'history'
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            Histórico de Serviços
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'equipment'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            Equipamentos
          </button>
        </div>

        {/* Content based on Tab */}
        {activeTab === 'history' ? (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-base font-semibold text-gray-900">Últimos Serviços</h3>
              <span className="text-xs font-medium text-primary cursor-pointer">Ver todos</span>
            </div>

            <ServiceCard
              date="15 Out 2023"
              status="Concluído"
              title="Manutenção Preventiva"
              subtitle="Ar Condicionado Split 12000 BTUs"
              price="R$ 350,00"
            />
            <ServiceCard
              date="02 Set 2023"
              status="Concluído"
              title="Instalação Elétrica"
              subtitle="Quadro de Distribuição"
              price="R$ 850,00"
            />
            <ServiceCard
              date="20 Ago 2023"
              status="Concluído"
              title="Limpeza de Filtros"
              subtitle="Manutenção de Rotina"
              price="R$ 120,00"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center mb-1 px-1">
              <h3 className="text-base font-semibold text-gray-900">Equipamentos do Cliente</h3>
              <button className="text-primary">
                <span className="material-symbols-outlined text-xl">add_circle</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-[12px] shadow-sm flex flex-col gap-2">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">ac_unit</span>
                </div>
                <h4 className="text-xs font-semibold text-[#111418]">Samsung WindFree</h4>
                <p className="text-[10px] text-gray-500">Instalado: 15/10/2023</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

interface ServiceCardProps {
  date: string;
  status: string;
  title: string;
  subtitle: string;
  price: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ date, status, title, subtitle, price }) => (
  <div className="bg-white p-4 rounded-[16px] shadow-sm flex items-center justify-between border border-transparent hover:border-primary/5 transition-all">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400">{date}</span>
        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{status}</span>
      </div>
      <h4 className="text-sm font-semibold text-[#111418]">{title}</h4>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="font-semibold text-sm text-[#111418]">{price}</span>
      <span className="material-symbols-outlined text-gray-300 text-[18px]">chevron_right</span>
    </div>
  </div>
);