import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface QuotesProps {
  onBack: () => void;
  onNewQuote?: () => void;
  onFilter?: () => void;
}

export const Quotes: React.FC<QuotesProps> = ({ onBack, onNewQuote, onFilter }) => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, [filter]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('quotes')
        .select(`
                id,
                total_amount,
                status,
                created_at,
                valid_until,
                clients (name)
            `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'Todos') {
        // Map filter label to status value if needed
        // Assuming status in DB: 'pending', 'approved', 'cancelled', 'draft'
        let statusFilter = '';
        if (filter === 'Pendentes') statusFilter = 'pending';
        else if (filter === 'Aprovados') statusFilter = 'approved';
        else if (filter === 'Cancelados') statusFilter = 'cancelled';

        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching quotes:', error);
      } else {
        const formattedQuotes = data.map((q: any) => {
          let statusLabel = 'Pendente';
          let statusColor = 'bg-amber-50 text-amber-700 border border-amber-100';

          if (q.status === 'approved') {
            statusLabel = 'Aprovado';
            statusColor = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
          } else if (q.status === 'cancelled') {
            statusLabel = 'Cancelado';
            statusColor = 'bg-gray-100 text-gray-600 border border-gray-200';
          } else if (q.status === 'expired') {
            statusLabel = 'Expirado';
            statusColor = 'bg-red-50 text-red-700 border border-red-100';
          }

          return {
            id: q.id,
            client: q.clients?.name || 'Cliente desconhecido',
            date: new Date(q.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + ', ' + new Date(q.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            value: `R$ ${(q.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            status: statusLabel,
            statusColor: statusColor
          };
        });
        setQuotes(formattedQuotes);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter(q => q.client.toLowerCase().includes(search.toLowerCase()));

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
              placeholder="Buscar cliente..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={onFilter} // Keeps original functionality, though we have tabs below
            aria-label="Filtrar"
            className="flex-none h-12 w-12 flex items-center justify-center rounded-[12px] bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors shadow-sm backdrop-blur-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>tune</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterChip label="Todos" active={filter === 'Todos'} onClick={() => setFilter('Todos')} />
          <FilterChip label="Pendentes" active={filter === 'Pendentes'} onClick={() => setFilter('Pendentes')} />
          <FilterChip label="Aprovados" active={filter === 'Aprovados'} onClick={() => setFilter('Aprovados')} />
          <FilterChip label="Cancelados" active={filter === 'Cancelados'} onClick={() => setFilter('Cancelados')} />
        </div>
      </div>

      {/* Content */}
      <main className="flex flex-col gap-4 px-4 pt-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando orçamentos...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Nenhum orçamento encontrado.</div>
        ) : (
          filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              client={quote.client}
              date={quote.date}
              value={quote.value}
              status={quote.status}
              statusColor={quote.statusColor}
            />
          ))
        )}
      </main>
    </div>
  );
};

const FilterChip: React.FC<{ label: string; active?: boolean; onClick?: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${active
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