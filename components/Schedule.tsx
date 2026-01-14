import React, { useState, useRef } from 'react';

interface ScheduleProps {
  onNewAppointment?: () => void;
  onAppointmentClick?: () => void;
  onReschedule?: () => void;
  onBack: () => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ onNewAppointment, onAppointmentClick, onReschedule, onBack }) => {
  const [activeTab, setActiveTab] = useState('Hoje');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State for date inputs
  const [startDate, setStartDate] = useState('2023-10-12');
  const [endDate, setEndDate] = useState('');

  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

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
    // Optionally reset tab to 'Hoje' or keep 'Outro' selected visually
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

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
        {/* Today Section */}
        <div>
          <div className="flex items-center gap-2 py-2 mb-3">
            <span className="material-symbols-outlined text-[#637188] text-sm">event</span>
            <h4 className="text-[#637188] text-sm font-bold uppercase tracking-wider">Hoje, 12 de Outubro</h4>
          </div>

          <AppointmentCard
            status="Agendado"
            statusColor="bg-blue-50 text-primary ring-blue-700/10"
            dotColor="bg-primary"
            time="09:00 - 10:00"
            title="Consultoria de Marketing"
            personName="Ana Silva"
            personImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAXaNc2ARxJ6KvD7LGucVUekfTg9nWW4BrQXNKYa318d9QFeZ9xr2bg6qf1S7mkUn5b-8Ii5JWUJ1NKXnVvpwPYpPgpL9Mw8FGQ6i_61hAV_W4e7bsu6vxbEEy6naFbgvdZDz1SA7J0cQlIc9K92_AdifW0A5IrUtnz-hQ6WV9LEC9Fk6fbpo2s_wmONDOQKTkYxIZVpow9hinJ8hO-RXoQBsK7G4vIMxw6pvcG8_Wh1GzCDx0PaQFhDWxObFIgaIF87iz8mdDR4wwG"
            onDetailsClick={onAppointmentClick}
            onReschedule={onReschedule}
          />

          <AppointmentCard
            status="Concluído"
            statusColor="bg-teal-50 text-teal-700 ring-teal-700/10"
            iconStatus="check"
            time="14:00 - 15:30"
            title="Fotografia de Produto"
            personName="Tech Solutions"
            initials="TS"
            isOpacityReduced
            onDetailsClick={onAppointmentClick}
            onReschedule={onReschedule}
          />
        </div>

        {/* Tomorrow Section */}
        <div>
          <div className="flex items-center gap-2 py-2 mb-3 mt-4">
            <span className="material-symbols-outlined text-[#637188] text-sm">calendar_today</span>
            <h4 className="text-[#637188] text-sm font-bold uppercase tracking-wider">Amanhã, 13 de Outubro</h4>
          </div>

          <AppointmentCard
            status="Cancelado"
            statusColor="bg-gray-100 text-gray-600 ring-gray-500/10"
            iconStatus="close"
            time="08:00 - 09:00"
            title="Reunião de Briefing"
            personName="Julia Mendes"
            personImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAlBSMwLnNVj4FlYICIv-B1MDmenMwNmkI08WgsWPM8Oi5PkkfCUtX4zBDLHXsGlCYwH3XberTbNcS6SsgFLjADoBqR3jg_ZVxYYTOEWvtB7JF-DTWgN_LysBB9QN12t1-4xTnxlrCPyuruZLre0LHizdHCu0zQExk6XfK-qHR3AXkpogxuLzVeKL8RfuhlWQCJwvUXXE6J7SOHNrnY3wfjGyBpO-ZA1F_Osq9nCd128Q5r-J_-9n0Zs0ZCkTsATAgX0QImsGnbQS0a"
            isCancelled
            onDetailsClick={onAppointmentClick}
            onReschedule={onReschedule}
          />

          <AppointmentCard
            status="Agendado"
            statusColor="bg-blue-50 text-primary ring-blue-700/10"
            dotColor="bg-primary"
            time="10:30 - 12:00"
            title="Edição de Vídeo"
            personName="Canal TechDaily"
            initials="YT"
            initialsColor="bg-orange-100 text-orange-600"
            onDetailsClick={onAppointmentClick}
            onReschedule={onReschedule}
          />
        </div>
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
              onClick={closeFilter}
              className="w-full bg-[#0b2a5b] hover:bg-[#092248] text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
  onDetailsClick?: () => void;
  onReschedule?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  status, statusColor, dotColor, iconStatus, time, title, personName, personImage, initials, initialsColor, isOpacityReduced, isCancelled, onDetailsClick, onReschedule
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
              <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">check_circle</span>
                Serviço Concluído
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onReschedule?.();
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-50"
              >
                <span className="material-symbols-outlined text-gray-400 text-[20px]">edit_calendar</span>
                Reagendar
              </button>
              <button className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-50">
                <span className="material-symbols-outlined text-[20px]">cancel</span>
                Cancelar
              </button>
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