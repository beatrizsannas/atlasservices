import React, { useEffect } from 'react';
import { Screen } from '../App';
import { supabase } from '../supabaseClient';
import { useCache } from '../contexts/CacheContext';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { dashboardData, setDashboardData } = useCache();
  // If we have data, we are not loading (visually), but we might be refreshing in bg
  const loading = !dashboardData;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // If no cache, we might want to show spinner, but 'loading' derived state handles that.
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

      const startOfYearStr = `${year}-01-01`;
      const endOfYearStr = `${year}-12-31`;

      // Parallelize requests
      const [scheduledRes, completedMonthRes, yearCompletedRes, agendaRes] = await Promise.all([
        // 1. Daily Summary: Scheduled Today
        supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('date', todayStr)
          .eq('status', 'scheduled')
          .neq('status', 'deleted'),

        // 2. Monthly Summary: Completed This Month
        supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('date', startOfMonthStr)
          .lte('date', endOfMonthStr)
          .eq('status', 'completed')
          .neq('status', 'deleted'),

        // 3. Monthly Progress (Yearly Data)
        supabase
          .from('appointments')
          .select('id, date')
          .eq('user_id', user.id)
          .gte('date', startOfYearStr)
          .lte('date', endOfYearStr)
          .eq('status', 'completed')
          .neq('status', 'deleted'),

        // 4. Agenda: Today's Appointments
        supabase
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
          .limit(5)
      ]);

      // Process Results
      const scheduledCount = scheduledRes.count || 0;
      const completedCount = completedMonthRes.count || 0;

      // Process Monthly Stats
      let monthlyStats: { label: string, count: number, fullDate: string }[] = [];
      if (yearCompletedRes.data) {
        const counts = Array(12).fill(0);
        yearCompletedRes.data.forEach((app: any) => {
          if (!app.date) return;
          const parts = app.date.split('-');
          if (parts.length > 1) {
            const mIndex = parseInt(parts[1], 10) - 1;
            if (mIndex >= 0 && mIndex < 12) counts[mIndex]++;
          }
        });

        const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        monthlyStats = monthLabels.map((label, idx) => ({
          label,
          count: counts[idx],
          fullDate: new Date(year, idx, 1).toISOString()
        })).slice(0, 6);
      }

      // Process Agenda
      let agendaItems: any[] = [];
      if (agendaRes.data) {
        agendaItems = agendaRes.data.map((app: any) => {
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
        });
      }

      // Update Cache
      setDashboardData({
        scheduled: scheduledCount,
        completed: completedCount,
        monthlyStats,
        agendaItems,
        lastUpdated: Date.now()
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }

  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  // Use values from cache or defaults if loading (though usually loading state is handled by not rendering or showing skeleton if needed, but here we just show what we have or empty)
  const stats = dashboardData || { scheduled: 0, completed: 0, monthlyStats: [], agendaItems: [] };

  return (
    <>
      <DailySummary date={today} scheduled={stats.scheduled} completed={stats.completed} />
      <MonthlyProgress onNavigate={onNavigate} data={stats.monthlyStats} />
      <DailyAgenda date={today} items={stats.agendaItems} loading={loading} />
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

const MonthlyProgress: React.FC<{ onNavigate: (screen: Screen) => void, data: { label: string, count: number }[] }> = ({ onNavigate, data }) => {
  // Find max for scaling
  const maxCount = Math.max(...data.map(d => d.count), 5);
  const totalServices = data.reduce((acc, curr) => acc + curr.count, 0);

  // Helper to determine color based on index or logic. 
  // The image implies a progression or just active vs inactive. 
  // Let's use: Current month (last one with data?) = Dark. Others = varying light blues to create depth?
  // Or just Light Blue for past, Dark for current.
  // The image shows Jan(Light), Fev(Light), Mar(Medium?), Abr(Dark).
  // I'll simulate a gradient of blues for the bars.

  return (
    <section className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-bold text-[#111418]">Progresso Mensal</h3>
          <p className="text-xs text-gray-500 mt-1">Total de {totalServices} serviços</p>
        </div>
        <button
          onClick={() => onNavigate('finance')}
          className="text-primary text-sm font-medium hover:underline"
        >
          Ver tudo
        </button>
      </div>
      <div className="h-48 w-full flex items-end justify-between gap-4 px-2">
        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-xs text-gray-400">Sem dados</p>
          </div>
        ) : (
          data.map((item, index) => {
            const heightPercent = (item.count / maxCount) * 100;
            // Highlight the current month (assuming last in the list is current/latest for now, or check real date)
            // But 'data' is slice(0,6).
            // Let's assume the last item is the "current" one relevant to the user or simply the one with most activity? 
            // The image shows April (Abr) as Dark.
            // Let's make the bar with the Current Month index Dark, others Light.
            const isCurrentMonth = index === new Date().getMonth();

            // Logic updated per user feedback:
            // If the month has data (count > 0), use the prominent Dark Blue (bg-primary).
            // Otherwise, use varied light blues to maintain the aesthetic but distinct from white.

            let barColor = "bg-[#E0F2FE]"; // Default light
            if (index === 1) barColor = "bg-[#BAE6FD]";
            if (index === 2) barColor = "bg-[#7DD3FC]";

            // Ensure even 0 count has a tiny visible bar so we know it rendered
            // Using explicit hex #0B2A5B instead of bg-primary to ensure verification
            if (isCurrentMonth || item.count > 0) {
              barColor = "bg-[#0B2A5B]";
            } else if (index > 2) {
              barColor = "bg-[#E0F2FE]";
            }

            return (
              <Bar
                key={index}
                heightStyle={{ height: `${Math.max(heightPercent, 8)}%` }}
                color={barColor}
                value={item.count.toString()}
                label={item.label}
                isHighlighted={isCurrentMonth}
              />
            );
          })
        )}
      </div>
    </section>
  );
};

const Bar: React.FC<{ heightStyle: React.CSSProperties; color: string; value: string; label: string; isHighlighted?: boolean }> = ({ heightStyle, color, value, label, isHighlighted }) => (
  <div className="flex flex-col items-center gap-3 w-full h-full justify-end group cursor-pointer">
    <div
      className={`w-full ${color} rounded-t-2xl relative transition-all hover:opacity-90`}
      style={heightStyle}
    >
      {/* Tooltip on hover only, cleanest look */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        {value}
      </div>
    </div>
    <span className={`text-xs ${isHighlighted ? 'font-bold text-[#0B2A5B]' : 'font-medium text-gray-500'}`}>
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