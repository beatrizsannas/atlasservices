import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface ScheduleProps {
  onNewAppointment?: () => void;
  onAppointmentClick?: () => void;
  onReschedule?: () => void;
  onBack: () => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ onNewAppointment, onAppointmentClick, onReschedule, onBack }) => {
  const [activeTab, setActiveTab] = useState('Hoje');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  // State for date inputs
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAppointments();
  }, [activeTab, startDate, endDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('appointments')
        .select(`
                id,
                start_time,
                end_time,
                status,
                type,
                related_id,
                notes,
                clients (name, avatar_url),
                services (title)
            `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      if (activeTab === 'Hoje') {
        query = query
          .gte('start_time', startOfDay.toISOString())
          .lt('start_time', endOfDay.toISOString());
      } else if (activeTab === 'Semana') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        query = query
          .gte('start_time', startOfWeek.toISOString())
          .lt('start_time', endOfWeek.toISOString());
      } else if (activeTab === 'Mês') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        query = query
          .gte('start_time', startOfMonth.toISOString())
          .lt('start_time', endOfMonth.toISOString());
      } else if (activeTab === 'Outro' && startDate && endDate) {
        // For 'Outro', we might not want to query immediately until applied? 
        // But here we rely on state. If activeTab is Outro, startDate and endDate should be used.
        // We'll require user to hit "Apply" which probably updates startDate/endDate state or just `fetchAppointments` call.
        // But here useEffect dependencies include them. Let's assume startDate/endDate are set by filter.
        query = query
          .gte('start_time', `${startDate}T00:00:00`)
          .lt('start_time', `${endDate}T23:59:59`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        // Process data for display
        // We need to fetch quotes titles if type is quote?
        // The query above joins services. If type is quote, we don't have title.
        // We can fetch quotes separately or use a separate query.
        // For simplicity, let's fetch quotes ids and titles if there are any quote type appointments.

        const appointmentList = await Promise.all(data.map(async (app: any) => {
          let title = 'Agendamento';
          if (app.type === 'service' && app.services) {
            title = app.services.title;
          } else if (app.type === 'quote') {
            // Fetch quote title
            // Optimization: Bulk fetch quotes? Or just one by one for now (less complex).
            const { data: quote } = await supabase.from('quotes').select('id').eq('id', app.related_id).single();
            if (quote) {
              title = `Orçamento #${quote.id.substr(0, 8)}`;
            } else {
              title = 'Orçamento';
            }
          }

          // Parse time
          const start = new Date(app.start_time);
          const end = new Date(app.end_time);
          const timeString = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

          return {
            id: app.id,
            status: app.status === 'scheduled' ? 'Agendado' : (app.status === 'completed' ? 'Concluído' : 'Cancelado'),
            statusColor: app.status === 'scheduled' ? 'bg-blue-50 text-primary ring-blue-700/10' : (app.status === 'completed' ? 'bg-teal-50 text-teal-700 ring-teal-700/10' : 'bg-gray-100 text-gray-600 ring-gray-500/10'),
            dotColor: app.status === 'scheduled' ? 'bg-primary' : undefined,
            iconStatus: app.status === 'completed' ? 'check' : (app.status === 'cancelled' ? 'close' : undefined),
            time: timeString,
            title: title,
            personName: app.clients?.name || 'Cliente desconhecido',
            personImage: app.clients?.avatar_url,
            initials: app.clients?.name ? app.clients.name.substring(0, 2).toUpperCase() : '??',
            isCancelled: app.status === 'cancelled',
            isOpacityReduced: app.status === 'completed',
            date: start, // for grouping
            rawStatus: app.status // for actions
          };
        }));

        setAppointments(appointmentList);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchAppointments(); // Refresh
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erro ao atualizar status.');
    }
  };

  const showDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'Outro') {
      setIsFilterOpen(true);
    }
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const applyFilter = () => {
    // Trigger fetch by changing state or just calling fetch (fetch depends on startDate/endDate)
    fetchAppointments();
    closeFilter();
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Group appointments by day
  const groupedAppointments = appointments.reduce((groups: any, appointment: any) => {
    const dateKey = appointment.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(appointment);
    return groups;
  }, {});

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background-light relative">
      {/* Header & Tabs Combined Sticky Container */}
      <div className="sticky top-0 z-40 bg-background-light/95 backdrop-blur-md shadow-sm border-b border-gray-200 transition-colors duration-200">
        {/* Header Row */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors -ml-2"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 ml-2">Agendamentos</h2>
          <div className="flex items-center justify-end">
            <button
              onClick={onNewAppointment}
              className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 text-[#637188] hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="px-4 pb-3">
          <div className="flex h-10 w-full items-center justify-center rounded-xl bg-gray-200/50 p-1">
            <TabButton label="Hoje" active={activeTab === 'Hoje'} onClick={() => handleTabClick('Hoje')} />
            <TabButton label="Semana" active={activeTab === 'Semana'} onClick={() => handleTabClick('Semana')} />
            <TabButton label="Mês" active={activeTab === 'Mês'} onClick={() => handleTabClick('Mês')} />
            <TabButton label="Outro" active={activeTab === 'Outro'} onClick={() => handleTabClick('Outro')} />
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-8 px-4 pt-6 pb-24">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando agendamentos...</div>
        ) : Object.keys(groupedAppointments).length === 0 ? (
          <div className="text-center py-10 text-gray-500">Nenhum agendamento encontrado para este período.</div>
        ) : (
          Object.keys(groupedAppointments).map((dateKey) => (
            <div key={dateKey}>
              <div className="flex items-center gap-2 py-2 mb-3">
                <span className="material-symbols-outlined text-[#637188] text-sm">event</span>
                <h4 className="text-[#637188] text-sm font-bold uppercase tracking-wider capitalize">{dateKey}</h4>
              </div>
              {groupedAppointments[dateKey].map((app: any) => (
                <AppointmentCard
                  key={app.id}
                  id={app.id}
                  status={app.status}
                  statusColor={app.statusColor}
                  dotColor={app.dotColor}
                  iconStatus={app.iconStatus}
                  time={app.time}
                  title={app.title}
                  personName={app.personName}
                  personImage={app.personImage}
                  initials={app.initials}
                  isOpacityReduced={app.isOpacityReduced}
                  isCancelled={app.isCancelled}
                  rawStatus={app.rawStatus}
                  onDetailsClick={onAppointmentClick}
                  onReschedule={onReschedule}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ))
        )}
      </main>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#111418]/60 backdrop-blur-sm transition-opacity"
            onClick={closeFilter}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full bg-[#F2F3F5] rounded-t-3xl p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] pb-safe animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={closeFilter}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors -ml-2"
              >
                <span className="material-symbols-outlined text-[#111418]">arrow_back</span>
              </button>
              <h3 className="text-lg font-bold text-[#111418] tracking-tight">Filtrar Período</h3>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
              <div className="mb-5">
                <label className="block text-xs font-bold text-[#637188] uppercase tracking-wider mb-2">Data Início</label>
                <div
                  className="group relative flex items-center bg-[#F6F7F8] border border-transparent focus-within:border-primary/50 focus-within:bg-white rounded-xl px-4 py-3.5 transition-all duration-200 cursor-pointer"
                  onClick={() => showDatePicker(startDateInputRef)}
                >
                  <span className="material-symbols-outlined text-primary mr-3">calendar_today</span>
                  <input
                    ref={startDateInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <div className={`flex-1 text-sm font-semibold ${startDate ? 'text-[#111418]' : 'text-gray-400'}`}>
                    {startDate ? formatDate(startDate) : 'Selecionar data'}
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#637188] uppercase tracking-wider mb-2">Data Fim</label>
                <div
                  className="group relative flex items-center bg-[#F6F7F8] border border-transparent focus-within:border-primary/50 focus-within:bg-white rounded-xl px-4 py-3.5 transition-all duration-200 cursor-pointer"
                  onClick={() => showDatePicker(endDateInputRef)}
                >
                  <span className="material-symbols-outlined text-primary mr-3">event</span>
                  <input
                    ref={endDateInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <div className={`flex-1 text-sm font-semibold ${endDate ? 'text-[#111418]' : 'text-gray-400 font-normal'}`}>
                    {endDate ? formatDate(endDate) : 'Selecionar data'}
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
                </div>
              </div>
            </div>

            <button
              onClick={applyFilter}
              className="w-full bg-[#0b2a5b] hover:bg-[#09224a] text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Aplicar Filtro</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

const TabButton: React.FC<{ label: string; active?: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 font-medium leading-normal transition-all ${active ? 'bg-white text-primary shadow-sm' : 'text-[#637188] hover:text-primary'}`}
  >
    <span className="truncate text-xs font-semibold z-10 relative">{label}</span>
  </button>
);

interface AppointmentCardProps {
  id: string; // Add ID
  status: string;
  statusColor: string;
  dotColor?: string;
  iconStatus?: string;
  time: string;
  title: string;
  personName: string;
  personImage?: string;
  initials?: string;
  initialsColor?: string;
  isOpacityReduced?: boolean;
  isCancelled?: boolean;
  rawStatus: string; // Add raw status for logic
  onDetailsClick?: () => void;
  onReschedule?: () => void;
  onUpdateStatus: (id: string, newStatus: string) => void; // Add update handler
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id, status, statusColor, dotColor, iconStatus, time, title, personName, personImage, initials, initialsColor, isOpacityReduced, isCancelled, rawStatus, onDetailsClick, onReschedule, onUpdateStatus
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`group relative flex flex-col gap-5 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent transition-all hover:shadow-md mb-4 ${isOpacityReduced ? 'opacity-80 hover:opacity-100' : ''}`}>
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1.5 rounded-full text-gray-400 bg-white/90 hover:bg-gray-100 hover:text-primary transition-colors shadow-sm backdrop-blur-sm"
        >
          <span className="material-symbols-outlined text-[20px] block">more_vert</span>
        </button>
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              {rawStatus !== 'completed' && rawStatus !== 'cancelled' && (
                <button
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  onClick={() => {
                    onUpdateStatus(id, 'completed');
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">check_circle</span>
                  Serviço Concluído
                </button>
              )}
              {/* Reschedule might be just another editing action, but for now just call prop */}
              {/* <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onReschedule?.();
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-50"
              >
                <span className="material-symbols-outlined text-gray-400 text-[20px]">edit_calendar</span>
                Reagendar
              </button> */}
              {rawStatus !== 'cancelled' && (
                <button
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-50"
                  onClick={() => {
                    onUpdateStatus(id, 'cancelled');
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                  Cancelar
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusColor}`}>
              {dotColor && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}></span>}
              {iconStatus && <span className="material-symbols-outlined text-[10px] mr-1">{iconStatus}</span>}
              {status}
            </span>
            <span className={`text-xs text-[#637188] font-medium ${isCancelled ? 'line-through' : ''}`}>{time}</span>
          </div>
          <h3 className={`text-lg font-bold leading-tight pr-6 ${isCancelled ? 'text-[#637188] line-through decoration-gray-400' : 'text-[#111418]'}`}>
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            {personImage ? (
              <div
                className="size-6 rounded-full bg-gray-200 bg-center bg-cover"
                style={{ backgroundImage: `url("${personImage}")` }}
              />
            ) : (
              <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${initialsColor || 'bg-primary/10 text-primary'}`}>
                {initials}
              </div>
            )}
            <p className="text-[#637188] text-sm font-normal">{personName}</p>
          </div>
        </div>
      </div>

      <div className="flex mt-2 pt-4 border-t border-gray-100">
        <button
          onClick={onDetailsClick}
          className="w-full rounded-lg bg-background-light py-3 text-xs font-bold text-[#637188] hover:bg-gray-200 transition-colors"
        >
          Detalhes
        </button>
      </div>
    </div>
  );
};