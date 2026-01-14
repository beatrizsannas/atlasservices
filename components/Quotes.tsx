import React from 'react';

interface QuotesProps {
  onBack: () => void;
  onNewQuote?: () => void;
  onFilter?: () => void;
}

export const Quotes: React.FC<QuotesProps> = ({ onBack, onNewQuote, onFilter }) => {
  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background-light">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0B2A5B] px-4 pt-safe pb-4 shadow-md transition-colors duration-200">
        <div className="flex items-center justify-between h-14 text-white">
          <button
            onClick={onBack}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold">Orçamentos</h1>
          <button
            onClick={onNewQuote}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-2 mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '20px' }}>search</span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue/50 sm:text-sm shadow-sm backdrop-blur-sm"
              placeholder="Buscar cliente ou serviço..."
              type="text"
            />
          </div>
          <button
            onClick={onFilter}
            aria-label="Filtrar"
            className="flex-none h-12 w-12 flex items-center justify-center rounded-[12px] bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors shadow-sm backdrop-blur-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>tune</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterChip label="Todos" active />
          <FilterChip label="Pendentes" />
          <FilterChip label="Aprovados" />
          <FilterChip label="Cancelados" />
        </div>
      </div>

      {/* Content */}
      <main className="flex flex-col gap-4 px-4 pt-6">
        <QuoteCard
          client="Roberto Silva"
          date="24 Out, 09:30"
          value="R$ 450,00"
          status="Pendente"
          statusColor="bg-amber-50 text-amber-700 border border-amber-100"
        />
        <QuoteCard
          client="Condomínio Flores"
          date="23 Out, 14:15"
          value="R$ 1.250,00"
          status="Aprovado"
          statusColor="bg-emerald-50 text-emerald-700 border border-emerald-100"
        />
        <QuoteCard
          client="Ana Costa"
          date="22 Out, 11:00"
          value="R$ 85,00"
          status="Cancelado"
          statusColor="bg-gray-100 text-gray-600 border border-gray-200"
        />
        <QuoteCard
          client="Padaria Central"
          date="20 Out, 16:45"
          value="R$ 3.400,00"
          status="Aprovado"
          statusColor="bg-emerald-50 text-emerald-700 border border-emerald-100"
        />
        <QuoteCard
          client="Mariana Lopes"
          date="19 Out, 10:20"
          value="R$ 220,00"
          status="Pendente"
          statusColor="bg-amber-50 text-amber-700 border border-amber-100"
        />
      </main>
    </div>
  );
};

const FilterChip: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${active
      ? 'bg-white text-[#0B2A5B] shadow-sm'
      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
    }`}>
    {label}
  </button>
);

interface QuoteCardProps {
  client: string;
  date: string;
  value: string;
  status: string;
  statusColor: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ client, date, value, status, statusColor }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <h3 className="font-bold text-[#111418] text-base">{client}</h3>
        <span className="text-xs text-gray-500 mt-0.5">Criado em {date}</span>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
      </button>
    </div>
    <div className="flex justify-between items-end mt-1">
      <div className="flex flex-col">
        <p className="text-xs text-gray-500 font-medium">Valor Total</p>
        <p className="text-lg font-bold text-primary">{value}</p>
      </div>
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium ${statusColor}`}>
        {status}
      </span>
    </div>
  </div>
);