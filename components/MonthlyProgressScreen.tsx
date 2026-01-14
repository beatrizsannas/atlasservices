import React from 'react';
import { Screen } from '../App';

interface MonthlyProgressScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export const MonthlyProgressScreen: React.FC<MonthlyProgressScreenProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] pb-32">
      <div className="sticky top-0 z-50 bg-[#0B2A5B] px-4 py-4 shadow-md flex items-center justify-between text-white pb-safe pt-safe">
        <button
          onClick={onBack}
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/10 transition-colors -ml-2"
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Progresso Mensal</h1>
        <div className="w-10"></div>
      </div>

      <main className="flex flex-col gap-6 px-4 pt-6">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111418]">Desempenho Anual</h3>
              <p className="text-xs text-gray-500 mt-1">Últimos 12 meses</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-[10px] font-medium text-gray-600">Serviços</span>
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
            <div className="h-48 min-w-[500px] flex items-end justify-between gap-3 pt-4">
              <Bar height="h-16" label="Mai" />
              <Bar height="h-20" label="Jun" />
              <Bar height="h-24" label="Jul" opacity="bg-sky-blue/40" />
              <Bar height="h-28" label="Ago" opacity="bg-sky-blue/40" />
              <Bar height="h-24" label="Set" opacity="bg-sky-blue/50" />
              <Bar height="h-32" label="Out" opacity="bg-sky-blue/50" />
              <Bar height="h-36" label="Nov" opacity="bg-sky-blue/60" />
              <Bar height="h-28" label="Dez" opacity="bg-sky-blue/60" />
              <Bar height="h-24" label="Jan" opacity="bg-sky-blue/30" />
              <Bar height="h-32" label="Fev" opacity="bg-sky-blue/50" />
              <div className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full bg-sky-blue/80 rounded-t-lg relative h-20 transition-all hover:bg-primary/80">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">20 serviços</div>
                </div>
                <span className="text-[10px] font-medium text-gray-500 uppercase">Mar</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full bg-primary rounded-t-lg relative h-40 transition-all shadow-md shadow-primary/20">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-100 transition-opacity whitespace-nowrap z-10">45 serviços</div>
                </div>
                <span className="text-[10px] font-bold text-primary uppercase">Abr</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <MonthlyCard
            month="Abril 2024"
            isCurrent
            services="45"
            growth="12%"
            growthPositive
            revenue="R$ 5.4k"
            icon="calendar_month"
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <MonthlyCard
            month="Março 2024"
            services="20"
            growth="-5%"
            growthPositive={false}
            revenue="R$ 2.8k"
            icon="history"
            iconBg="bg-gray-50"
            iconColor="text-gray-500"
          />
          <MonthlyCard
            month="Fevereiro 2024"
            services="32"
            growth="8%"
            growthPositive
            revenue="R$ 4.1k"
            icon="history"
            iconBg="bg-gray-50"
            iconColor="text-gray-500"
          />
          <MonthlyCard
            month="Janeiro 2024"
            services="24"
            growth="0%"
            isNeutral
            revenue="R$ 3.0k"
            icon="history"
            iconBg="bg-gray-50"
            iconColor="text-gray-500"
          />
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="relative flex justify-between items-center px-6 h-[72px]">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <button className="flex items-center justify-center h-[60px] w-[60px] rounded-full bg-[#0B2A5B] text-white shadow-lg shadow-[#0B2A5B]/30 border-4 border-white hover:scale-105 transition-transform">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add</span>
            </button>
          </div>
          <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center gap-1 w-16 group h-full">
            <span className="material-symbols-outlined text-primary filled" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="text-[10px] font-medium text-primary">Início</span>
          </button>
          <button onClick={() => onNavigate('schedule')} className="flex flex-col items-center justify-center gap-1 w-16 group h-full">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">calendar_month</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">Agenda</span>
          </button>
          <div className="w-16"></div>
          <button onClick={() => onNavigate('clients')} className="flex flex-col items-center justify-center gap-1 w-16 group h-full">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">group</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">Clientes</span>
          </button>
          <button onClick={() => onNavigate('settings')} className="flex flex-col items-center justify-center gap-1 w-16 group h-full">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">settings</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">Ajustes</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

const Bar: React.FC<{ height: string; label: string; opacity?: string }> = ({ height, label, opacity }) => (
  <div className="flex flex-col items-center gap-2 flex-1 group">
    <div className={`w-full ${opacity || 'bg-sky-blue/30'} rounded-t-lg relative ${height} transition-all hover:bg-primary/80`}></div>
    <span className="text-[10px] font-medium text-gray-400 uppercase">{label}</span>
  </div>
);

interface MonthlyCardProps {
  month: string;
  isCurrent?: boolean;
  services: string;
  growth: string;
  growthPositive?: boolean;
  isNeutral?: boolean;
  revenue: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const MonthlyCard: React.FC<MonthlyCardProps> = ({
  month, isCurrent, services, growth, growthPositive, isNeutral, revenue, icon, iconBg, iconColor
}) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </div>
        <h2 className="text-lg font-bold text-[#111418]">{month}</h2>
      </div>
      {isCurrent && (
        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-100">Atual</span>
      )}
    </div>
    <div className="grid grid-cols-3 gap-2 divide-x divide-gray-100">
      <div className="flex flex-col gap-1 pr-2">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Serviços</p>
        <p className="text-xl font-bold text-[#111418]">{services}</p>
      </div>
      <div className="flex flex-col gap-1 px-2">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Crescimento</p>
        <div className="flex items-center gap-1">
          {isNeutral ? (
            <span className="material-symbols-outlined text-gray-400 text-sm">remove</span>
          ) : (
            <span className={`material-symbols-outlined text-sm ${growthPositive ? 'text-green-500' : 'text-red-400'}`}>
              {growthPositive ? 'trending_up' : 'trending_down'}
            </span>
          )}
          <p className={`text-xl font-bold ${isNeutral
              ? 'text-gray-500'
              : growthPositive
                ? 'text-green-600'
                : 'text-red-500'
            }`}>
            {growth}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 pl-2">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Faturamento</p>
        <p className={`text-xl font-bold ${isCurrent ? 'text-primary' : 'text-gray-600'}`}>
          {revenue}
        </p>
      </div>
    </div>
  </div>
);