import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface NewTransactionProps {
  onBack: () => void;
  onSave?: () => void;
}

export const NewTransaction: React.FC<NewTransactionProps> = ({ onBack, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [formData, setFormData] = useState({
    amount: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    notes: ''
  });
  const { showAlert } = useAlert();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
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

            <div className="p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors cursor-pointer relative">
              <div className="flex-1 pointer-events-none">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Data</label>
                <div className="text-base font-semibold text-[#111418]">{formData.date || 'Selecionar Data'}</div>
              </div>
              <input
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">calendar_month</span>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors relative">
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Categoria</label>
                <select
                  className="w-full bg-transparent border-none p-0 text-base font-semibold text-[#111418] focus:ring-0 appearance-none cursor-pointer"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option disabled value="">Selecione</option>
                  {transactionType === 'income' ? (
                    <>
                      <option value="service">Serviços</option>
                      <option value="sale">Vendas</option>
                      <option value="consulting">Consultoria</option>
                      <option value="other">Outros</option>
                    </>
                  ) : (
                    <>
                      <option value="equipment">Equipamento</option>
                      <option value="rework">Retrabalho</option>
                      <option value="investment">Investimento</option>
                      <option value="other">Outros</option>
                    </>
                  )}
                </select>
              </div>
              <span className="material-symbols-outlined text-gray-400 pointer-events-none shrink-0">expand_more</span>
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