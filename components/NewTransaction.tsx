import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface NewTransactionProps {
  onBack: () => void;
  onSave?: () => void;
}

export const NewTransaction: React.FC<NewTransactionProps> = ({ onBack, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [tempDate, setTempDate] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    notes: ''
  });
  const { showAlert } = useAlert();

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}/${m}/${y}`;
  };

  const openCalendar = () => {
    const initialDate = formData.date ? new Date(formData.date + 'T12:00:00') : new Date();
    setViewDate(initialDate);
    setTempDate(formData.date);
    setIsCalendarOpen(true);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number, type: 'prev' | 'current' | 'next') => {
    if (type !== 'current') return;
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setTempDate(dateStr);
  };

  const confirmDate = () => {
    setFormData(prev => ({ ...prev, date: tempDate }));
    setIsCalendarOpen(false);
  };

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, type: 'prev' });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, type: 'current' });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, type: 'next' });
    }
    return days;
  };

  const handleAmountBlur = () => {
    if (formData.amount) {
      const num = parseFloat(formData.amount);
      if (!isNaN(num)) {
        setFormData(prev => ({ ...prev, amount: num.toFixed(2) }));
      }
    }
  };

  const handleSave = async () => {
    if (!formData.amount || !formData.title || !formData.category || !formData.date) {
      showAlert('Atenção', 'Por favor, preencha valor, título, data e categoria.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: transactionType,
        amount: parseFloat(formData.amount),
        title: formData.title,
        date: formData.date,
        category: formData.category,
        notes: formData.notes
      });

      if (error) throw error;

      if (onSave) onSave();
      onBack();
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      showAlert('Erro', 'Erro ao salvar transação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] pb-safe">
      <header className="bg-[#0B2A5B] pt-safe sticky top-0 z-50 shadow-md">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-white tracking-wide">Nova Transação</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-md mx-auto w-full flex-1">
        {/* Toggle Switch */}
        <div className="bg-gray-200 p-1.5 rounded-xl flex mb-6 relative shadow-inner">
          <button
            onClick={() => setTransactionType('income')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 transform active:scale-95 duration-200 ${transactionType === 'income'
              ? 'bg-white text-[#0B2A5B] shadow-sm'
              : 'text-gray-500 hover:bg-gray-50/50'
              }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${transactionType === 'income' ? 'text-emerald-500 filled' : 'text-gray-400'}`}
              style={transactionType === 'income' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              arrow_circle_up
            </span>
            Receita
          </button>
          <button
            onClick={() => setTransactionType('expense')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 transform active:scale-95 duration-200 ${transactionType === 'expense'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-500 hover:bg-gray-50/50'
              }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${transactionType === 'expense' ? 'text-red-500 filled' : 'text-gray-400'}`}
              style={transactionType === 'expense' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              arrow_circle_down
            </span>
            Despesa
          </button>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Valor da Transação</label>
            <div className={`flex items-end gap-2 border-b-2 transition-colors pb-2 focus-within:border-primary ${transactionType === 'income' ? 'border-emerald-500/20 focus-within:!border-emerald-500' : 'border-red-500/20 focus-within:!border-red-500'
              }`}>
              <span className={`text-2xl font-bold pb-1 ${transactionType === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>R$</span>
              <input
                className="block w-full border-none p-0 text-4xl font-bold bg-transparent focus:ring-0 text-[#111418] placeholder-gray-300"
                inputMode="decimal"
                placeholder="0.00"
                type="number"
                step="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleAmountBlur}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">{/* Removed overflow-hidden to allow dropdown */}
            <div className="p-4 hover:bg-gray-50 transition-colors">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Título da Transação</label>
              <input
                className="w-full bg-transparent border-none p-0 text-base font-semibold text-[#111418] focus:ring-0 placeholder-gray-400"
                placeholder={transactionType === 'income' ? "Ex: Venda de Peça" : "Ex: Compra de Material"}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div
              className="p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={openCalendar}
            >
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Data</label>
                <div className="text-base font-semibold text-[#111418]">
                  {formData.date ? formatDate(formData.date) : 'Selecionar Data'}
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">calendar_month</span>
            </div>

            <div className="p-4 hover:bg-gray-50 transition-colors relative" ref={categoryDropdownRef}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Categoria</label>
              <div
                className="w-full bg-transparent border-none p-0 text-base font-semibold text-[#111418] cursor-pointer flex items-center justify-between"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              >
                <span className={formData.category ? 'text-[#111418]' : 'text-gray-400'}>
                  {formData.category ? (
                    transactionType === 'income' ? (
                      formData.category === 'service' ? 'Serviços' :
                        formData.category === 'sale' ? 'Vendas' :
                          formData.category === 'consulting' ? 'Consultoria' : 'Outros'
                    ) : (
                      formData.category === 'equipment' ? 'Equipamento' :
                        formData.category === 'rework' ? 'Retrabalho' :
                          formData.category === 'investment' ? 'Investimento' : 'Outros'
                    )
                  ) : 'Selecione'}
                </span>
                <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>

              {isCategoryDropdownOpen && (
                <div className="absolute left-4 right-4 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                  {transactionType === 'income' ? (
                    <>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: 'service' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        Serviços
                      </button>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: 'sale' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        Vendas
                      </button>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: 'consulting' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        Consultoria
                      </button>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: 'other' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        Outros
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: 'equipment' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        Equipamento
                      </button>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: 'rework' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        Retrabalho
                      </button>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: 'investment' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        Investimento
                      </button>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: 'other' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        Outros
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="block text-xs font-semibold text-gray-500 mb-2">Observações</label>
            <textarea
              className="w-full bg-gray-50 rounded-xl border-none p-3 text-sm text-[#111418] focus:ring-2 focus:ring-primary/20 resize-none placeholder-gray-400"
              placeholder="Adicione detalhes, número de nota fiscal, ou informações do cliente..."
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </form>
      </main>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsCalendarOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h3 className="text-lg font-bold text-[#111418]">
                  {monthNames[viewDate.getMonth()]} de {viewDate.getFullYear()}
                </h3>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((item, idx) => {
                  const isSelected = tempDate === `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${item.day.toString().padStart(2, '0')}`;
                  const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), item.day).toDateString() && item.type === 'current';
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(item.day, item.type as 'prev' | 'current' | 'next')}
                      disabled={item.type !== 'current'}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all ${item.type !== 'current' ? 'text-gray-300 cursor-not-allowed' :
                          isSelected ? 'bg-primary text-white font-bold shadow-md' :
                            isToday ? 'bg-primary/10 text-primary font-semibold' :
                              'text-[#111418] hover:bg-gray-100'
                        }`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="flex-1 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDate}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-8 z-40 safe-area-bottom">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#0B2A5B]/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined">save</span>
          )}
          <span>{loading ? 'Salvando...' : 'Salvar Transação'}</span>
        </button>
      </div>
    </div>
  );
};