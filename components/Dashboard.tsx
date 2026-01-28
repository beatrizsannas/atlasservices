import React, { useEffect, useState } from 'react';
import { Screen } from '../App';
import { supabase } from '../supabaseClient';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [scheduledCount, setScheduledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [agendaItems, setAgendaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      // Use local date strings YYYY-MM-DD
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const sm = String(startOfMonth.getMonth() + 1).padStart(2, '0');
      const sd = String(startOfMonth.getDate()).padStart(2, '0');
      const startOfMonthStr = `${startOfMonth.getFullYear()}-${sm}-${sd}`;

      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const em = String(endOfMonth.getMonth() + 1).padStart(2, '0');
      const ed = String(endOfMonth.getDate()).padStart(2, '0');
      const endOfMonthStr = `${endOfMonth.getFullYear()}-${em}-${ed}`;

      // 1. Daily Summary: Scheduled Today
      const { count: scheduledToday } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('date', todayStr)
        .eq('status', 'scheduled')
        .neq('status', 'deleted');

      setScheduledCount(scheduledToday || 0);

      // 2. Monthly Summary: Completed This Month
      // Uses already calculated startOfMonthStr/endOfMonthStr

      const { count: completedMonth } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('date', startOfMonthStr)
        .lte('date', endOfMonthStr)
        .eq('status', 'completed')
        .neq('status', 'deleted');

      setCompletedCount(completedMonth || 0);

      // 3. Agenda: Today's Appointments
      const { data: agendaData } = await supabase
        .from('appointments')
        .select(`
                id,
                date,
                title,
                start_time,
                status,
                type,
                clients (name)
            `)
        .eq('user_id', user.id)
        .eq('date', todayStr)
        .neq('status', 'deleted')
        .order('start_time', { ascending: true })
        .limit(5);

      if (agendaData) {
        const items = await Promise.all(agendaData.map(async (app: any) => {
          const serviceName = app.title || (app.type === 'quote' ? 'Orçamento' : 'Serviço');

          let statusLabel = 'Agendado';
          let statusColor = 'bg-sky-blue/10 text-primary border-sky-blue/20';
          if (app.status === 'completed') {
            statusLabel = 'Concluído';
            statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
          } else if (app.status === 'cancelled') {
            statusLabel = 'Cancelado';
            statusColor = 'bg-red-50 text-red-700 border-red-100';
          }

          return {
            id: app.id,
            time: app.start_time ? app.start_time.substring(0, 5) : '--:--',
            client: app.clients?.name || 'Cliente',
            service: serviceName,
            status: statusLabel,
            statusColor: statusColor
          }
        }));
        setAgendaItems(items);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return (
    <>
      <DailySummary date={today} scheduled={scheduledCount} completed={completedCount} />
      <MonthlyProgress onNavigate={onNavigate} />
      <DailyAgenda date={today} items={agendaItems} loading={loading} />
    </>
  );
};

interface DailySummaryProps {
  date: string;
  scheduled: number;
  completed: number;
}

const DailySummary: React.FC<DailySummaryProps> = ({ date, scheduled, completed }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#111418]">Resumo do dia</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>calendar_month</span>
            </div>
            {/* Trend could be calculated if we compare to yesterday, static for now or remove if no data */}
            {/* <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+2 hoje</span> */}
          </div>
          <div>
            <p className="text-3xl font-bold text-[#111418]">{scheduled}</p>
            <p className="text-sm font-medium text-gray-500 leading-tight mt-1">Serviços agendados</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-sky-blue/20 rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>check_circle</span>
            </div>
            {/* <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+5% mês</span> */}
          </div>
          <div>
            <p className="text-3xl font-bold text-[#111418]">{completed}</p>
            <p className="text-sm font-medium text-gray-500 leading-tight mt-1">Realizados (Mês)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MonthlyProgress: React.FC<{ onNavigate: (screen: Screen) => void }> = ({ onNavigate }) => {
  // Static for now, hard to chart with just simple data. 
  // Ideally fetch aggregates. Leaving static structure but user should know it requires more complex queries for real bars.
  return (
    <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-bold text-[#111418]">Progresso Mensal</h3>
          <p className="text-xs text-gray-500 mt-1">Visualização Geral</p>
        </div>
        <button
          onClick={() => onNavigate('finance')} // Redirecting to Finance or Monthly Progress screen
          className="text-primary text-sm font-medium hover:underline"
        >
          Ver tudo
        </button>
      </div>
      <div className="h-48 w-full flex items-end justify-between gap-3 px-2 opacity-50 pointer-events-none grayscale">
        {/* Placeholder bars to show UI structure until we implement aggregation */}
        <Bar height="h-24" color="bg-sky-blue/30" value="24" label="Jan" />
        <Bar height="h-32" color="bg-sky-blue/50" value="32" label="Fev" />
        <Bar height="h-20" color="bg-sky-blue/80" value="20" label="Mar" />
        <Bar height="h-40" color="bg-primary" value="45" label="Abr" isHighlighted />
      </div>
      <div className="text-center text-xs text-gray-400 mt-2 italic">Dados do gráfico em desenvolvimento</div>
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

interface DailyAgendaProps {
  date: string;
  items: any[];
  loading: boolean;
}

const DailyAgenda: React.FC<DailyAgendaProps> = ({ date, items, loading }) => {
  return (
    <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-[#111418]">Agenda do Dia</h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded capitalize">{date}</span>
      </div>
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center text-sm text-gray-400 py-4">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-4">Nenhum agendamento para hoje.</div>
        ) : (
          items.map(item => (
            <AgendaItem
              key={item.id}
              time={item.time}
              client={item.client}
              service={item.service}
              status={item.status}
              statusColor={item.statusColor}
            />
          ))
        )}
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