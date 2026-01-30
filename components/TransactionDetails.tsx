import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface TransactionDetailsProps {
    transactionId: string;
    onBack: () => void;
    onUpdate?: () => void;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transactionId, onBack, onUpdate }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const [viewDate, setViewDate] = useState(new Date());
    const [tempDate, setTempDate] = useState('');
    const [transaction, setTransaction] = useState<any>(null);
    const [formData, setFormData] = useState({
        amount: '',
        title: '',
        date: '',
        category: '',
        notes: '',
        type: 'income' as 'income' | 'expense'
    });
    const { showAlert } = useAlert();

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    useEffect(() => {
        fetchTransaction();
    }, [transactionId]);

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

    const fetchTransaction = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('id', transactionId)
                .single();

            if (error) throw error;

            setTransaction(data);
            setFormData({
                amount: data.amount.toString(),
                title: data.title,
                date: data.date,
                category: data.category,
                notes: data.notes || '',
                type: data.type
            });
        } catch (error: any) {
            console.error('Error fetching transaction:', error);
            showAlert('Erro', 'Erro ao carregar transação.', 'error');
            onBack();
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const [y, m, d] = dateString.split('-');
        return `${d}/${m}/${y}`;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getCategoryLabel = (category: string, type: string) => {
        if (type === 'income') {
            switch (category) {
                case 'service': return 'Serviços';
                case 'sale': return 'Vendas';
                case 'consulting': return 'Consultoria';
                case 'other': return 'Outros';
                default: return category;
            }
        } else {
            switch (category) {
                case 'equipment': return 'Equipamento';
                case 'rework': return 'Retrabalho';
                case 'investment': return 'Investimento';
                case 'other': return 'Outros';
                default: return category;
            }
        }
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

    const handleSave = async () => {
        if (!formData.amount || !formData.title || !formData.category || !formData.date) {
            showAlert('Atenção', 'Por favor, preencha todos os campos obrigatórios.', 'warning');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('transactions')
                .update({
                    amount: parseFloat(formData.amount),
                    title: formData.title,
                    date: formData.date,
                    category: formData.category,
                    notes: formData.notes
                })
                .eq('id', transactionId);

            if (error) throw error;

            showAlert('Sucesso', 'Transação atualizada com sucesso!', 'success');
            setIsEditing(false);
            if (onUpdate) onUpdate();
            fetchTransaction();
        } catch (error: any) {
            console.error('Error updating transaction:', error);
            showAlert('Erro', 'Erro ao atualizar transação.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', transactionId);

            if (error) throw error;

            showAlert('Sucesso', 'Transação excluída com sucesso!', 'success');
            if (onUpdate) onUpdate();
            onBack();
        } catch (error: any) {
            console.error('Error deleting transaction:', error);
            showAlert('Erro', 'Erro ao excluir transação.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
            </div>
        );
    }

    if (!transaction) return null;

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
                    <h1 className="text-lg font-bold text-white tracking-wide">Detalhes da Transação</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">{isEditing ? 'close' : 'edit'}</span>
                    </button>
                </div>
            </header>

            <main className="px-4 py-6 max-w-md mx-auto w-full flex-1">
                {/* Transaction Type Badge */}
                <div className="mb-6 flex items-center justify-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${transaction.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                        <span className="material-symbols-outlined text-[20px]">
                            {transaction.type === 'income' ? 'arrow_circle_up' : 'arrow_circle_down'}
                        </span>
                        <span className="font-semibold">{transaction.type === 'income' ? 'Receita' : 'Despesa'}</span>
                    </div>
                </div>

                {/* Amount Display */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Valor</label>
                    {isEditing ? (
                        <div className={`flex items-end gap-2 border-b-2 transition-colors pb-2 ${transaction.type === 'income' ? 'border-emerald-500' : 'border-red-500'
                            }`}>
                            <span className={`text-2xl font-bold pb-1 ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                }`}>R$</span>
                            <input
                                className="block w-full border-none p-0 text-4xl font-bold bg-transparent focus:ring-0 text-[#111418]"
                                inputMode="decimal"
                                type="number"
                                step="0.01"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                            />
                        </div>
                    ) : (
                        <div className={`text-4xl font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                            {formatCurrency(transaction.amount)}
                        </div>
                    )}
                </div>

                {/* Transaction Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 mb-5">
                    <div className="p-4">
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Título</label>
                        {isEditing ? (
                            <input
                                className="w-full bg-transparent border-none p-0 text-base font-semibold text-[#111418] focus:ring-0"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="text-base font-semibold text-[#111418]">{transaction.title}</div>
                        )}
                    </div>

                    <div
                        className={`p-4 flex items-center justify-between ${isEditing ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                        onClick={isEditing ? openCalendar : undefined}
                    >
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Data</label>
                            <div className="text-base font-semibold text-[#111418]">
                                {formatDate(isEditing ? formData.date : transaction.date)}
                            </div>
                        </div>
                        {isEditing && <span className="material-symbols-outlined text-gray-400">calendar_month</span>}
                    </div>

                    <div className="p-4 relative" ref={categoryDropdownRef}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Categoria</label>
                        {isEditing ? (
                            <>
                                <div
                                    className="w-full bg-transparent border-none p-0 text-base font-semibold text-[#111418] cursor-pointer flex items-center justify-between"
                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                >
                                    <span>{getCategoryLabel(formData.category, transaction.type)}</span>
                                    <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </div>

                                {isCategoryDropdownOpen && (
                                    <div className="absolute left-4 right-4 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto">
                                        {transaction.type === 'income' ? (
                                            <>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50" onClick={() => { setFormData(prev => ({ ...prev, category: 'service' })); setIsCategoryDropdownOpen(false); }}>Serviços</button>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50" onClick={() => { setFormData(prev => ({ ...prev, category: 'sale' })); setIsCategoryDropdownOpen(false); }}>Vendas</button>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50" onClick={() => { setFormData(prev => ({ ...prev, category: 'consulting' })); setIsCategoryDropdownOpen(false); }}>Consultoria</button>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50" onClick={() => { setFormData(prev => ({ ...prev, category: 'other' })); setIsCategoryDropdownOpen(false); }}>Outros</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50" onClick={() => { setFormData(prev => ({ ...prev, category: 'equipment' })); setIsCategoryDropdownOpen(false); }}>Equipamento</button>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50" onClick={() => { setFormData(prev => ({ ...prev, category: 'rework' })); setIsCategoryDropdownOpen(false); }}>Retrabalho</button>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50" onClick={() => { setFormData(prev => ({ ...prev, category: 'investment' })); setIsCategoryDropdownOpen(false); }}>Investimento</button>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-[#111418] hover:bg-gray-50" onClick={() => { setFormData(prev => ({ ...prev, category: 'other' })); setIsCategoryDropdownOpen(false); }}>Outros</button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-base font-semibold text-[#111418]">
                                {getCategoryLabel(transaction.category, transaction.type)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Observações</label>
                    {isEditing ? (
                        <textarea
                            className="w-full bg-gray-50 rounded-xl border-none p-3 text-sm text-[#111418] focus:ring-2 focus:ring-primary/20 resize-none"
                            rows={3}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    ) : (
                        <div className="text-sm text-[#111418] whitespace-pre-wrap">
                            {transaction.notes || 'Nenhuma observação'}
                        </div>
                    )}
                </div>

                {/* Delete Button */}
                {!isEditing && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">delete</span>
                        <span>Excluir Transação</span>
                    </button>
                )}
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
                            <button onClick={() => setIsCalendarOpen(false)} className="flex-1 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">Cancelar</button>
                            <button onClick={confirmDate} className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                            <span className="material-symbols-outlined text-red-600">delete</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#111418] text-center mb-2">Excluir Transação?</h3>
                        <p className="text-sm text-gray-600 text-center mb-6">Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Button (only when editing) */}
            {isEditing && (
                <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-8 z-40 safe-area-bottom">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#0B2A5B]/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined">save</span>
                        )}
                        <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};
