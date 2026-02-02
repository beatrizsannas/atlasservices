import React, { useState } from 'react';

interface AdvancedFilterProps {
  onBack: () => void;
  onApply: () => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ onBack, onApply }) => {
  // Filter States
  const [startDate, setStartDate] = useState<string>('2023-10-16'); // Default value as per image
  const [endDate, setEndDate] = useState<string>('');

  // Calendar Modal States
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [activeDateField, setActiveDateField] = useState<'start' | 'end' | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date(2023, 9, 1)); // Oct 2023 default

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00'); // Fix timezone issues
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()].substring(0, 3);
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const openCalendar = (field: 'start' | 'end') => {
    const initialDateStr = field === 'start' ? startDate : endDate;
    if (initialDateStr) {
      setViewDate(new Date(initialDateStr + 'T12:00:00'));
    } else {
      setViewDate(new Date());
    }
    setActiveDateField(field);
    setShowCalendar(true);
  };

  const handleDateSelect = (day: number, type: 'prev' | 'current' | 'next') => {
    let newDate = new Date(viewDate);

    if (type === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (type === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    }

    newDate.setDate(day);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(newDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;

    if (activeDateField === 'start') {
      setStartDate(dateString);
    } else {
      setEndDate(dateString);
    }
    setShowCalendar(false);
    setActiveDateField(null);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
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

    // Next month days to fill grid (usually 35 or 42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, type: 'next' });
    }

    return days;
  };

  // Check if a specific day is currently selected
  const isSelected = (day: number, type: string) => {
    if (type !== 'current') return false;

    const currentTarget = activeDateField === 'start' ? startDate : endDate;
    if (!currentTarget) return false;

    const [y, m, d] = currentTarget.split('-').map(Number);
    return y === viewDate.getFullYear() && m === (viewDate.getMonth() + 1) && d === day;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      e.target.value = parseFloat(e.target.value).toFixed(2);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] pb-safe">
      <header className="sticky top-0 z-40 bg-[#0B2A5B] px-4 pt-safe pb-4 shadow-md transition-colors duration-200">
        <div className="flex items-center justify-between h-14 text-white">
          <button
            onClick={onBack}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold">Filtro Avançado</h1>
          <button className="text-sm font-medium text-sky-blue/80 hover:text-sky-blue transition-colors">Limpar</button>
        </div>
      </header>

      <main className="flex flex-col gap-4 px-4 pt-6 pb-24">
        {/* Período */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Período</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5" onClick={() => openCalendar('start')}>
                <label className="text-xs font-medium text-primary">Data Início</label>
                <div className="relative cursor-pointer">
                  <input
                    className={`w-full px-3 py-2.5 bg-white rounded-lg text-sm focus:ring-0 transition-all font-medium pointer-events-none ${startDate ? 'border-2 border-primary text-primary' : 'border-none text-gray-400'}`}
                    type="text"
                    value={startDate ? formatDateDisplay(startDate) : ''}
                    placeholder="Selecione"
                    readOnly
                  />
                  <span className={`material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-sm ${startDate ? 'text-primary' : 'text-gray-400'}`}>calendar_month</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5" onClick={() => openCalendar('end')}>
                <label className="text-xs font-medium text-gray-400">Data Fim</label>
                <div className="relative cursor-pointer">
                  <input
                    className={`w-full px-3 py-2.5 bg-gray-50 rounded-lg text-sm transition-all font-medium pointer-events-none ${endDate ? 'border-2 border-primary text-primary bg-white' : 'border-none text-gray-400'}`}
                    type="text"
                    value={endDate ? formatDateDisplay(endDate) : ''}
                    placeholder="Selecione"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Cliente</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            <input
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Buscar ou selecionar cliente..."
              type="text"
            />
          </div>
        </div>

        {/* Número do Orçamento */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Número do Orçamento</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">tag</span>
            <input
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Ex: ORC-ABC-0001"
              type="text"
            />
          </div>
        </div>

        {/* Faixa de Valor */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Faixa de Valor</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">Mínimo (R$)</label>
              <input
                className="w-full px-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="0.00"
                type="number"
                step="0.01"
                onBlur={handleBlur}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">Máximo (R$)</label>
              <input
                className="w-full px-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="10000.00"
                type="number"
                step="0.01"
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>

        {/* Ordenar por */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Ordenar por</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer hover:border-primary/30 transition-all">
              <span className="text-sm font-medium">Mais recentes</span>
              <input defaultChecked className="text-primary focus:ring-primary h-4 w-4 bg-gray-100 border-gray-300" name="order" type="radio" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg border border-transparent bg-gray-50 cursor-pointer hover:border-primary/30 transition-all">
              <span className="text-sm font-medium text-gray-700">Maior valor</span>
              <input className="text-primary focus:ring-primary h-4 w-4 bg-gray-100 border-gray-300" name="order" type="radio" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg border border-transparent bg-gray-50 cursor-pointer hover:border-primary/30 transition-all">
              <span className="text-sm font-medium text-gray-700">Menor valor</span>
              <input className="text-primary focus:ring-primary h-4 w-4 bg-gray-100 border-gray-300" name="order" type="radio" />
            </label>
          </div>
        </div>

        <div className="mt-4 mb-8">
          <button
            onClick={onApply}
            className="w-full bg-[#0B2A5B] hover:bg-[#092248] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#0B2A5B]/20 active:scale-[0.98] transition-all"
          >
            Aplicar Filtros
          </button>
        </div>
      </main>

      {/* Custom Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-4 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-lg p-2">
              <div className="flex items-center justify-between mb-4 px-1">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="text-sm font-bold text-gray-900 capitalize">
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>

              <div className="grid grid-cols-7 text-center mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
                  <span key={day} className="text-[10px] font-medium text-gray-400 uppercase">{day}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                {generateCalendarDays().map((dateObj, idx) => {
                  const selected = isSelected(dateObj.day, dateObj.type as string);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(dateObj.day, dateObj.type as 'prev' | 'current' | 'next')}
                      disabled={dateObj.type !== 'current' && false} // Optional: disable non-current month interaction
                      className={`
                                h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-full transition-all
                                ${dateObj.type === 'current'
                          ? selected
                            ? 'bg-primary text-white font-bold shadow-md shadow-primary/30'
                            : 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-300'
                        }
                            `}
                    >
                      {dateObj.day}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => { setShowCalendar(false); setActiveDateField(null); }}
                className="w-full mt-6 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};