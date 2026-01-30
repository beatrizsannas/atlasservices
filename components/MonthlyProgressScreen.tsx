import React, { useEffect, useState } from 'react';
import { Screen } from '../App';
import { useCache } from '../contexts/CacheContext';
import { supabase } from '../supabaseClient'; // In case we need to fetch if cache is empty

interface MonthlyProgressScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export const MonthlyProgressScreen: React.FC<MonthlyProgressScreenProps> = ({ onBack, onNavigate }) => {
  const { dashboardData, isStale } = useCache();
  const [loading, setLoading] = useState(!dashboardData);
  // We'll use local state for data if we need to fetch it (though we should have it from Dashboard)
  // If user lands here directly (unlikely) or cache is cleared, we might need a fallback fetch or just redirect.
  // For now, let's assume dashboardData is populated or we wait for it if we were to implement fetching here.
  // But to keep it simple and given the architecture, if no data, maybe show empty or "Loading..." (and maybe trigger dashboard fetch?)

  const stats = dashboardData?.monthlyStats || [];

  // Create a reversed list for the "List" view (Newest first)
  // Filter out future months? Or just show till current month?
  const currentMonthIndex = new Date().getMonth();
  const validStats = stats.slice(0, currentMonthIndex + 1);
  const reversedStats = [...validStats].reverse();

  const totalServices = validStats.reduce((acc, curr) => acc + curr.count, 0);

  // Find max for chart scaling
  const maxCount = Math.max(...stats.map(s => s.count), 5);

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
        {/* Chart Section */}
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
              {stats.map((month, index) => {
                const isCurrent = index === currentMonthIndex;
                const heightPercent = (month.count / maxCount) * 100;
                const heightClass = `h-[${Math.max(Math.floor(heightPercent), 10)}%]`; // Tailwind might not support dynamic arb values well without full JIT on style

                // Using style for height to be precise
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                    <div
                      className={`w-full rounded-t-lg relative transition-all hover:bg-primary/80 ${isCurrent ? 'bg-primary shadow-md shadow-primary/20' : 'bg-sky-blue/40'}`}
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                    >
                      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded transition-opacity whitespace-nowrap z-10 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {month.count} serviços
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium uppercase ${isCurrent ? 'text-primary font-bold' : 'text-gray-400'}`}>{month.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Monthly Details List */}
        <section className="flex flex-col gap-4">
          {reversedStats.map((month, index) => {
            // reversedStats[index] is the current item.
            // We need to compare with the PREVIOUS month chronologically.
            // In reversed list, the "next" item (index + 1) is the previous month chronologically.
            const prevMonth = reversedStats[index + 1];

            let growth = 0;
            let growthPositive = true;
            let isNeutral = true;

            if (prevMonth && prevMonth.count > 0) {
              growth = Math.round(((month.count - prevMonth.count) / prevMonth.count) * 100);
              isNeutral = growth === 0;
              growthPositive = growth > 0;
            } else if (prevMonth && prevMonth.count === 0 && month.count > 0) {
              growth = 100; // technically infinite, but show 100% or something
              isNeutral = false;
              growthPositive = true;
            } else if (!prevMonth) {
              isNeutral = true; // No previous data
            }

            const isCurrent = month.label === stats[currentMonthIndex]?.label;
            const fullYear = new Date().getFullYear(); // simplifying year

            return (
              <MonthlyCard
                key={month.label}
                month={`${getFullMonthName(month.label)} ${fullYear}`}
                isCurrent={isCurrent}
                services={month.count.toString()}
                growth={`${growth > 0 ? '+' : ''}${growth}%`}
                growthPositive={growthPositive}
                isNeutral={isNeutral}
                revenue={`R$ ${(month.revenue || 0).toLocaleString('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })}`}
                icon="calendar_month"
                iconBg={isCurrent ? "bg-primary/10" : "bg-gray-50"}
                iconColor={isCurrent ? "text-primary" : "text-gray-500"}
              />
            );
          })}
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="relative flex justify-between items-center px-6 h-[72px]">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <button
              onClick={() => onNavigate('new-appointment')}
              className="flex items-center justify-center h-[60px] w-[60px] rounded-full bg-[#0B2A5B] text-white shadow-lg shadow-[#0B2A5B]/30 border-4 border-white hover:scale-105 transition-transform">
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

const getFullMonthName = (shortLabel: string) => {
  const map: Record<string, string> = {
    'Jan': 'Janeiro', 'Fev': 'Fevereiro', 'Mar': 'Março', 'Abr': 'Abril', 'Mai': 'Maio', 'Jun': 'Junho',
    'Jul': 'Julho', 'Ago': 'Agosto', 'Set': 'Setembro', 'Out': 'Outubro', 'Nov': 'Novembro', 'Dez': 'Dezembro'
  };
  return map[shortLabel] || shortLabel;
}

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