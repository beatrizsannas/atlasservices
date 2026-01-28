import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FinanceReports } from './FinanceReports';

interface FinanceProps {
  onBack: () => void;
  onNewTransaction: () => void;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
}

export const Finance: React.FC<FinanceProps> = ({ onBack, onNewTransaction }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'reports'>('dashboard');

  useEffect(() => {
    fetchTransactions();
  }, [activeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      // Apply date filters if needed based on activeFilter
      const today = new Date();
      if (activeFilter === 'Hoje') {
        query = query.eq('date', today.toISOString().split('T')[0]);
      } else if (activeFilter === 'Semana') {
        const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        query = query.gte('date', lastWeek.toISOString().split('T')[0]);
      } else if (activeFilter === 'Mês') {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        query = query.gte('date', firstDayOfMonth.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, total: income - expense };
  };

  const { income, expense, total } = calculateTotals();

  if (currentScreen === 'reports') {
    return <FinanceReports onBack={() => setCurrentScreen('dashboard')} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md px-4 py-3 border-b border-gray-200 flex justify-between items-center transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[#111418]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold text-primary leading-none">Gestão Financeira</h1>
          </div>
        </div>
        <button
          onClick={onNewTransaction}
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
        </button>
      </div>

      <main className="flex flex-col gap-6 px-4 pt-6">
        {/* Balance Card */}
        <section>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Saldo Total</p>
            <h2 className="text-4xl font-bold text-[#111418] mb-6">R$ {total.toFixed(2).replace('.', ',')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <span className="material-symbols-outlined text-emerald-600 text-sm font-bold">arrow_downward</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">Entradas</span>
                </div>
                <p className="text-lg font-bold text-emerald-700">R$ {income.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-red-100 rounded-full">
                    <span className="material-symbols-outlined text-red-600 text-sm font-bold">arrow_upward</span>
                  </div>
                  <span className="text-xs font-semibold text-red-700">Saídas</span>
                </div>
                <p className="text-lg font-bold text-red-700">R$ {expense.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterButton label="Todos" active={activeFilter === 'Todos'} onClick={() => setActiveFilter('Todos')} />
          <FilterButton label="Hoje" active={activeFilter === 'Hoje'} onClick={() => setActiveFilter('Hoje')} />
          <FilterButton label="Semana" active={activeFilter === 'Semana'} onClick={() => setActiveFilter('Semana')} />
          <FilterButton label="Mês" active={activeFilter === 'Mês'} onClick={() => setActiveFilter('Mês')} />
        </section>

        {/* Cash Flow List */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#111418]">Fluxo de Caixa</h3>
            <button
              onClick={() => setCurrentScreen('reports')}
              className="text-primary text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">bar_chart</span>
              Ver Relatórios
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Carregando transações...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Nenhuma transação encontrada.</div>
            ) : (
              transactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  icon={transaction.type === 'income' ? (transaction.category === 'service' ? 'computer' : 'attach_money') : 'shopping_cart'} // Simplified icon logic
                  title={transaction.title}
                  date={new Date(transaction.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  amount={`${transaction.type === 'income' ? '+' : '-'} R$ ${transaction.amount.toFixed(2).replace('.', ',')}`}
                  type={transaction.type}
                  iconBg={transaction.type === 'income' ? "bg-sky-blue/20" : "bg-red-100"}
                  iconColor={transaction.type === 'income' ? "text-primary" : "text-red-600"}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const FilterButton: React.FC<{ label: string; active?: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${active
      ? 'bg-primary text-white font-semibold shadow-sm shadow-primary/30'
      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
      }`}
  >
    {label}
  </button>
);

interface TransactionItemProps {
  icon: string;
  title: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  iconBg: string;
  iconColor: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ icon, title, date, amount, type, iconBg, iconColor }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary/20 transition-colors cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#111418]">{title}</h4>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
    <span className={`text-sm font-bold ${type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
      {amount}
    </span>
  </div>
);