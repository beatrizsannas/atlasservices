import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';
import { useCache } from '../contexts/CacheContext';

interface QuotesProps {
  onBack: () => void;
  onNewQuote?: () => void;
  onFilter?: () => void;
  onEditQuote?: (id: string) => void;
  onViewQuote?: (id: string) => void;
  onScheduleQuote?: (id: string) => void;
}

// ... imports

export const Quotes: React.FC<QuotesProps> = ({ onBack, onNewQuote, onFilter, onEditQuote, onViewQuote, onScheduleQuote }) => {
  const { quotesCache, setQuotesCache, isStale, invalidateCache } = useCache();
  const [quotes, setQuotes] = useState<any[]>(quotesCache?.data || []);
  const [loading, setLoading] = useState(!quotesCache?.data);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [activeMenuQuoteId, setActiveMenuQuoteId] = useState<string | null>(null);
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    // Only fetch if no cache or stale or filter changed (though filter is client-side usually? 
    // Wait, the original code had server-side filtering for status. 
    // For performance, we should fetch ALL and filter client-side if possible, OR utilize cache for 'Todos' and fetch if specific filter?
    // The implementation plan suggested fetching in background. 

    // Let's adopt a hybrid: If 'Todos' and cache exists, use it. If specific filter, maybe still fetch or filter locally if we have all.
    // The previous implementation fetched from DB on filter change.
    // To optimize, let's fetch ALL quotes once, cache them, and do client-side filtering for status!
    // This will be much faster.

    if (!quotesCache || isStale(quotesCache.lastUpdated)) {
      fetchQuotes();
    } else {
      // If we have cache, update local state
      setQuotes(quotesCache.data);
      setLoading(false);
    }

    // Close menu on click outside
    const handleClickOutside = () => setActiveMenuQuoteId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [filter]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Always fetch all to enable client-side filtering and caching
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
            statusColor: statusColor,
            rawStatus: q.status
          };
        });

        setQuotes(formattedQuotes);
        setQuotesCache(formattedQuotes);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('quotes').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchQuotes(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('Erro', 'Erro ao atualizar status.', 'error');
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('Excluir Orçamento', 'Tem certeza que deseja excluir este orçamento?');
    if (!confirmed) return;
    try {
      const { error } = await supabase.from('quotes').delete().eq('id', id);
      if (error) throw error;
      fetchQuotes(); // Refresh list
      showAlert('Sucesso', 'Orçamento excluído com sucesso.', 'success');
    } catch (error) {
      console.error('Error deleting quote:', error);
      showAlert('Erro', 'Erro ao excluir orçamento.', 'error');
    }
  }

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuQuoteId(activeMenuQuoteId === id ? null : id);
  }

  // Client-side filtering
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = q.client.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Todos') return matchesSearch;
    if (filter === 'Pendentes') return matchesSearch && q.rawStatus === 'pending';
    if (filter === 'Aprovados') return matchesSearch && q.rawStatus === 'approved';
    if (filter === 'Cancelados') return matchesSearch && q.rawStatus === 'cancelled';
    return matchesSearch;
  });

  const handleCardClick = (id: string) => {
    if (onViewQuote) onViewQuote(id);
  }

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background-light">
      {/* ... Header and Search ... */}
      {/* (Keeping existing header code implicitly by not touching it if I target correctly, but I need to be careful with replace) */}
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
            <div
              key={quote.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 relative active:scale-[0.99] transition-transform"
              style={{ zIndex: activeMenuQuoteId === quote.id ? 50 : 'auto' }}
            >
              {/* Main Clickable Area (Everything except top right menu area) */}
              <div
                className="p-4 pr-12 cursor-pointer"
                onClick={() => handleCardClick(quote.id)}
              >
                <div className="flex flex-col gap-1 mb-4">
                  <h3 className="font-bold text-[#111418] text-base">{quote.client}</h3>
                  <span className="text-xs text-gray-500">Criado em {quote.date}</span>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500 font-medium">Valor Total</p>
                    <p className="text-lg font-bold text-primary">{quote.value}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium ${quote.statusColor}`}>
                    {quote.status}
                  </span>
                </div>
              </div>

              {/* Menu Area (Isolated from main click) */}
              <div className="absolute top-2 right-2 z-20">
                <button
                  onClick={(e) => toggleMenu(e, quote.id)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                >
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>

                {/* Dropdown Menu */}
                {activeMenuQuoteId === quote.id && (
                  <div
                    className="absolute top-10 right-0 bg-white rounded-xl shadow-xl py-2 w-48 z-30 border border-gray-100 origin-top-right animate-in fade-in zoom-in-95 duration-200"

                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(quote.id, 'approved');
                        setActiveMenuQuoteId(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 flex items-center gap-3 transition-colors font-medium text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Aprovar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onScheduleQuote) onScheduleQuote(quote.id);
                        setActiveMenuQuoteId(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 text-gray-700 hover:text-purple-700 flex items-center gap-3 transition-colors font-medium text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">event</span>
                      Agendar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditQuote) onEditQuote(quote.id);
                        setActiveMenuQuoteId(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-700 flex items-center gap-3 transition-colors font-medium text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(quote.id, 'cancelled');
                        setActiveMenuQuoteId(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 text-gray-700 hover:text-gray-900 flex items-center gap-3 transition-colors font-medium text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                      Cancelar
                    </button>
                    <div className="my-1 border-t border-gray-100"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(quote.id);
                        setActiveMenuQuoteId(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors font-medium text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
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
  onMenu: (e: React.MouseEvent) => void;
  showMenu: boolean;
  onApprove: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  client, date, value, status, statusColor,
  onMenu, showMenu, onApprove, onCancel, onDelete
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative z-auto">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <h3 className="font-bold text-[#111418] text-base">{client}</h3>
        <span className="text-xs text-gray-500 mt-0.5">Criado em {date}</span>
      </div>
      <div className="relative">
        <button
          onClick={onMenu}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
        </button>
        {showMenu && (
          <div className="absolute right-0 top-8 bg-white shadow-xl rounded-lg border border-gray-100 py-1 w-40 z-10 animate-scale-in">
            <button onClick={(e) => { e.stopPropagation(); onApprove(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span> Aprovar
            </button>
            <button onClick={(e) => { e.stopPropagation(); onCancel(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-500 text-[18px]">cancel</span> Cancelar
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">delete</span> Excluir
            </button>
          </div>
        )}
      </div>
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