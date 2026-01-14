import React from 'react';
import { Screen } from '../App';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <>
      <DailySummary />
      <MonthlyProgress onNavigate={onNavigate} />
      <DailyAgenda />
    </>
  );
};

const DailySummary: React.FC = () => {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#111418]">Resumo do dia</h3>
        <span className="text-sm text-gray-500">24 Out</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>calendar_month</span>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+2 hoje</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#111418]">12</p>
            <p className="text-sm font-medium text-gray-500 leading-tight mt-1">Serviços agendados</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-sky-blue/20 rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>check_circle</span>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+5% mês</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#111418]">45</p>
            <p className="text-sm font-medium text-gray-500 leading-tight mt-1">Serviços realizados</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MonthlyProgress: React.FC<{ onNavigate: (screen: Screen) => void }> = ({ onNavigate }) => {
  return (
    <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-bold text-[#111418]">Progresso Mensal</h3>
          <p className="text-xs text-gray-500 mt-1">Total de 57 serviços</p>
        </div>
        <button
          onClick={() => onNavigate('monthly-progress')}
          className="text-primary text-sm font-medium hover:underline"
        >
          Ver tudo
        </button>
      </div>
      <div className="h-48 w-full flex items-end justify-between gap-3 px-2">
        <Bar height="h-24" color="bg-sky-blue/30" value="24" label="Jan" />
        <Bar height="h-32" color="bg-sky-blue/50" value="32" label="Fev" />
        <Bar height="h-20" color="bg-sky-blue/80" value="20" label="Mar" />
        <Bar height="h-40" color="bg-primary" value="45" label="Abr" isHighlighted />
      </div>
    </section>
  );
};

const Bar: React.FC<{ height: string; color: string; value: string; label: string; isHighlighted?: boolean }> = ({ height, color, value, label, isHighlighted }) => (
  <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
    <div className={`w-full ${color} rounded-t-lg relative ${height} transition-all hover:opacity-80 ${isHighlighted ? 'shadow-md shadow-primary/20' : ''}`}>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {value}
      </div>
    </div>
    <span className={`text-xs ${isHighlighted ? 'font-bold text-primary' : 'font-medium text-gray-500'}`}>
      {label}
    </span>
  </div>
);

const DailyAgenda: React.FC = () => {
  return (
    <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-[#111418]">Agenda do Dia</h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">24 Out</span>
      </div>
      <div className="flex flex-col gap-3">
        <AgendaItem
          time="09:00"
          client="Roberto Silva"
          service="Manutenção de Ar"
          status="Em breve"
          statusColor="bg-amber-50 text-amber-700 border-amber-100"
        />
        <AgendaItem
          time="14:30"
          client="Ana Costa"
          service="Instalação Elétrica"
          status="Agendado"
          statusColor="bg-sky-blue/10 text-primary border-sky-blue/20"
        />
        <AgendaItem
          time="16:00"
          client="Carlos Mendes"
          service="Orçamento"
          status="Pendente"
          statusColor="bg-gray-50 text-gray-600 border-gray-100"
        />
      </div>
    </section>
  );
};

interface AgendaItemProps {
  time: string;
  client: string;
  service: string;
  status: string;
  statusColor: string;
}

const AgendaItem: React.FC<AgendaItemProps> = ({ time, client, service, status, statusColor }) => (
  <div className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-sky-blue/30 transition-colors bg-white shadow-sm cursor-pointer">
    <div className="pr-4 border-r border-gray-100 min-w-[4rem]">
      <span className="block text-sm font-bold text-[#111418]">{time}</span>
    </div>
    <div className="flex-1 px-4 min-w-0">
      <h4 className="text-sm font-bold text-[#111418] leading-tight truncate">{client}</h4>
      <p className="text-xs text-gray-500 mt-1 truncate">{service}</p>
    </div>
    <div>
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium border ${statusColor}`}>
        {status}
      </span>
    </div>
  </div>
);