import React, { useState } from 'react';

interface FinanceProps {
  onBack: () => void;
  onNewTransaction: () => void;
}

export const Finance: React.FC<FinanceProps> = ({ onBack, onNewTransaction }) => {
  const [activeFilter, setActiveFilter] = useState('Hoje');

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
            <h2 className="text-4xl font-bold text-[#111418] mb-6">R$ 12.450,00</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <span className="material-symbols-outlined text-emerald-600 text-sm font-bold">arrow_downward</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">Entradas</span>
                </div>
                <p className="text-lg font-bold text-emerald-700">R$ 4.280,00</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-red-100 rounded-full">
                    <span className="material-symbols-outlined text-red-600 text-sm font-bold">arrow_upward</span>
                  </div>
                  <span className="text-xs font-semibold text-red-700">Saídas</span>
                </div>
                <p className="text-lg font-bold text-red-700">R$ 1.150,00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterButton label="Hoje" active={activeFilter === 'Hoje'} onClick={() => setActiveFilter('Hoje')} />
          <FilterButton label="Semana" active={activeFilter === 'Semana'} onClick={() => setActiveFilter('Semana')} />
          <FilterButton label="Mês" active={activeFilter === 'Mês'} onClick={() => setActiveFilter('Mês')} />
          <FilterButton label="Outro" active={activeFilter === 'Outro'} onClick={() => setActiveFilter('Outro')} />
        </section>

        {/* Cash Flow List */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#111418]">Fluxo de Caixa</h3>
            <button className="text-primary text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-lg">bar_chart</span>
              Ver Relatórios
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <TransactionItem
              icon="computer"
              title="Manutenção de PC"
              date="Hoje, 14:30"
              amount="+ R$ 350,00"
              type="income"
              iconBg="bg-sky-blue/20"
              iconColor="text-primary"
            />
            <TransactionItem
              icon="shopping_cart"
              title="Compra de Cabos"
              date="Ontem, 09:15"
              amount="- R$ 120,00"
              type="expense"
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />
            <TransactionItem
              icon="wifi"
              title="Configuração de Rede"
              date="22 Out, 16:00"
              amount="+ R$ 450,00"
              type="income"
              iconBg="bg-sky-blue/20"
              iconColor="text-primary"
            />
            <TransactionItem
              icon="settings_suggest"
              title="Formatação Notebook"
              date="21 Out, 11:30"
              amount="+ R$ 180,00"
              type="income"
              iconBg="bg-sky-blue/20"
              iconColor="text-primary"
            />
            <TransactionItem
              icon="local_gas_station"
              title="Combustível"
              date="20 Out, 18:20"
              amount="- R$ 250,00"
              type="expense"
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />
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