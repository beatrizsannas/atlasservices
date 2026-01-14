import React, { useState, useRef, useEffect } from 'react';

interface NewAppointmentProps {
  onBack: () => void;
}

export const NewAppointment: React.FC<NewAppointmentProps> = ({ onBack }) => {
  const [appointmentType, setAppointmentType] = useState<'service' | 'quote'>('service');

  // Calendar States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(''); // Format: YYYY-MM-DD

  // Internal Calendar Logic State
  const [viewDate, setViewDate] = useState(new Date());
  const [tempDate, setTempDate] = useState('');

  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const services = [
    "Instalação de Ar Condicionado",
    "Manutenção Preventiva",
    "Limpeza Química",
    "Carga de Gás"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openCalendar = () => {
    // Initialize view based on selected date or current date
    const initialDate = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
    setViewDate(initialDate);
    setTempDate(selectedDate);
    setIsCalendarOpen(true);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number, type: 'prev' | 'current' | 'next') => {
    if (type !== 'current') return; // For simplicity, only allow selecting current month days in this view

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setTempDate(dateStr);
  };

  const confirmDate = () => {
    setSelectedDate(tempDate);
    setIsCalendarOpen(false);
  };

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, type: 'prev' });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, type: 'current' });
    }

    // Next month days to fill 42 cells (6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, type: 'next' });
    }

    return days;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] antialiased overflow-x-hidden">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light shadow-xl">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-[#0B2A5B] p-4 shadow-md text-white">
          <button
            onClick={onBack}
            className="flex items-center justify-center -ml-2 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold">Novo Agendamento</h1>
          <div className="w-10"></div> {/* Spacer for center alignment */}
        </header>

        <main className="flex-1 flex flex-col gap-5 px-4 py-6 pb-32">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-semibold text-[#111418]">Cliente</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">person_search</span>
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  className="w-full bg-gray-50 text-[#111418] placeholder-gray-400 text-sm rounded-xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary pl-10 pr-10 py-3.5 transition-all outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#111418]">Tipo de Agendamento</label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="service"
                    checked={appointmentType === 'service'}
                    onChange={() => {
                      setAppointmentType('service');
                      setSelectedService('');
                    }}
                    className="peer sr-only"
                  />
                  <div className="w-full py-2.5 text-sm font-medium text-center rounded-lg text-gray-500 peer-checked:bg-[#0B2A5B] peer-checked:text-white peer-checked:shadow-sm transition-all duration-200">
                    Serviço
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="quote"
                    checked={appointmentType === 'quote'}
                    onChange={() => {
                      setAppointmentType('quote');
                      setSelectedService('');
                    }}
                    className="peer sr-only"
                  />
                  <div className="w-full py-2.5 text-sm font-medium text-center rounded-lg text-gray-500 peer-checked:bg-[#0B2A5B] peer-checked:text-white peer-checked:shadow-sm transition-all duration-200">
                    Orçamento
                  </div>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2" ref={dropdownRef}>
              <label className="text-sm font-semibold text-[#111418]">
                {appointmentType === 'service' ? 'Serviço' : 'Orçamento'}
              </label>
              <div className="relative">
                <div
                  className="w-full bg-gray-50 text-[#111418] text-sm rounded-xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary pl-4 pr-10 py-3.5 cursor-pointer flex items-center justify-between"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={!selectedService ? "text-gray-400" : ""}>
                    {selectedService || (appointmentType === 'service' ? 'Selecione um serviço...' : 'Selecione um orçamento...')}
                  </span>
                  <span className={`material-symbols-outlined text-gray-500 text-[20px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {services.map((service, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => {
                          setSelectedService(service);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#111418]">Data</label>
              <div className="relative cursor-pointer" onClick={openCalendar}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">calendar_today</span>
                </div>
                <input
                  className="w-full bg-gray-50 text-[#111418] text-sm rounded-xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary pl-10 pr-4 py-3.5 transition-all outline-none appearance-none h-[48px] cursor-pointer"
                  type="text"
                  readOnly
                  placeholder="DD/MM/AAAA"
                  value={formatDate(selectedDate)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#111418]">Horário de Início</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">schedule</span>
                  </div>
                  <input
                    className="w-full bg-gray-50 text-[#111418] text-sm rounded-xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary pl-10 pr-2 py-3.5 transition-all outline-none appearance-none"
                    type="time"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#111418]">Horário de Término</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">schedule</span>
                  </div>
                  <input
                    className="w-full bg-gray-50 text-[#111418] text-sm rounded-xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary pl-10 pr-2 py-3.5 transition-all outline-none appearance-none"
                    type="time"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#111418]">Observações</label>
            <textarea
              className="w-full bg-gray-50 text-[#111418] placeholder-gray-400 text-sm rounded-xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary p-3.5 transition-all outline-none resize-none"
              placeholder="Adicione detalhes importantes sobre o agendamento..."
              rows={3}
            ></textarea>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-light/95 backdrop-blur-md z-40 pb-8 safe-area-bottom border-t border-transparent">
          <button
            onClick={onBack}
            className="w-full bg-primary hover:bg-[#09224a] text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Confirmar Agendamento
          </button>
        </div>

        {/* Calendar Modal */}
        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-all" onClick={() => setIsCalendarOpen(false)}></div>
            <div className="relative w-full max-w-[340px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between py-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <h3 className="text-base font-bold text-[#111418] capitalize">
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-7 text-center">
                  <span className="text-xs font-bold text-gray-400">D</span>
                  <span className="text-xs font-bold text-gray-400">S</span>
                  <span className="text-xs font-bold text-gray-400">T</span>
                  <span className="text-xs font-bold text-gray-400">Q</span>
                  <span className="text-xs font-bold text-gray-400">Q</span>
                  <span className="text-xs font-bold text-gray-400">S</span>
                  <span className="text-xs font-bold text-gray-400">S</span>
                </div>
                <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
                  {generateCalendarDays().map((dayObj, index) => {
                    // Check if this specific day is selected
                    const isSelected = tempDate &&
                      dayObj.type === 'current' &&
                      parseInt(tempDate.split('-')[2]) === dayObj.day &&
                      parseInt(tempDate.split('-')[1]) === (viewDate.getMonth() + 1) &&
                      parseInt(tempDate.split('-')[0]) === viewDate.getFullYear();

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(dayObj.day, dayObj.type as any)}
                        className={`
                          h-9 w-9 flex items-center justify-center rounded-full text-sm transition-colors
                          ${dayObj.type === 'current' ? 'text-[#111418] hover:bg-gray-100' : 'text-gray-300'}
                          ${isSelected ? '!bg-primary !text-white !font-bold shadow-md' : ''}
                        `}
                      >
                        {dayObj.day}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setIsCalendarOpen(false)} className="flex-1 py-3 rounded-xl border border-primary/20 text-primary font-semibold text-sm hover:bg-blue-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={confirmDate} className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-[#09224a] transition-all shadow-[0_4px_10px_rgba(11,42,91,0.2)]">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};