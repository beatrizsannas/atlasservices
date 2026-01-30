import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { AlertDialog, AlertType } from './ui/AlertDialog';

interface InventoryProps {
  onBack: () => void;
  onNewPart?: () => void;
  onEditPart?: (id: string) => void;
}

interface Part {
  id: string;
  name: string;
  category: string;
  quantity: number;
  min_stock: number;
  cost_price: number;
  sale_price: number;
  image_url?: string | null;
}

export const Inventory: React.FC<InventoryProps> = ({ onBack, onNewPart, onEditPart }) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => { }
  });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_parts')
        .select('*')
        .order('name');

      if (error) throw error;
      if (data) setParts(data);
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { label: 'Esgotado', color: 'text-red-600', dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]', bg: 'bg-red-50 text-red-600 border border-red-100' };
    if (quantity <= minStock) return { label: 'Baixo', color: 'text-orange-600', dot: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]', bg: 'bg-orange-50 text-orange-600 border border-orange-100' };
    return { label: 'Bom', color: 'text-green-600', dot: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]', bg: 'bg-gray-100 text-gray-600' };
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === 'Em Estoque') matchesFilter = part.quantity > 0;
    if (filter === 'Abaixo do Mínimo') matchesFilter = part.quantity <= part.min_stock;
    if (filter === 'Crítico') matchesFilter = part.quantity === 0;

    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setAlertState({
      isOpen: true,
      title: 'Excluir Peça',
      message: 'Tem certeza que deseja excluir esta peça?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('inventory_parts').delete().eq('id', id);
          if (error) throw error;
          fetchParts();
          setAlertState(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting part:', error);
          setAlertState({
            isOpen: true,
            title: 'Erro',
            message: 'Erro ao excluir peça.',
            type: 'error',
            onConfirm: () => setAlertState(prev => ({ ...prev, isOpen: false }))
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background-light">
      {/* Header - Blue background as per design */}
      <header className="bg-primary pt-safe sticky top-0 z-50 shadow-md transition-colors duration-200">
        <div className="px-4 h-[60px] flex items-center justify-between text-white">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Estoque de Peças</h1>
          <button
            onClick={onNewPart}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col px-4 pt-4 gap-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
          </span>
          <input
            className="w-full bg-white text-sm text-gray-700 placeholder-gray-400 rounded-xl border-none shadow-sm py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Buscar peças, categorias..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterButton label="Todos" active={filter === 'Todos'} onClick={() => setFilter('Todos')} />
          <FilterButton label="Em Estoque" active={filter === 'Em Estoque'} onClick={() => setFilter('Em Estoque')} />
          <FilterButton label="Abaixo do Mínimo" active={filter === 'Abaixo do Mínimo'} onClick={() => setFilter('Abaixo do Mínimo')} />
          <FilterButton label="Crítico" active={filter === 'Crítico'} onClick={() => setFilter('Crítico')} />
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Carregando estoque...</div>
          ) : filteredParts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum item encontrado.</div>
          ) : (
            filteredParts.map(part => {
              const status = getStatus(part.quantity, part.min_stock);
              return (
                <InventoryCard
                  key={part.id}
                  id={part.id}
                  icon="inventory_2"
                  name={part.name}
                  category={part.category || 'Geral'}
                  quantity={part.quantity}
                  status={status.label}
                  statusColor={status.color}
                  dotColor={status.dot}
                  qtyBg={status.bg}
                  imageUrl={part.image_url}
                  onEdit={() => onEditPart?.(part.id)}
                  onDelete={() => handleDelete(part.id)}
                />
              );
            })
          )}
        </div>
      </main>

      <AlertDialog
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
        onCancel={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

const FilterButton: React.FC<{ label: string; active?: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-none px-4 py-2 rounded-full text-xs font-medium shadow-sm whitespace-nowrap transition-all active:scale-95 ${active
      ? 'bg-primary text-white font-semibold'
      : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
      }`}
  >
    {label}
  </button>
);

interface InventoryCardProps {
  id: string;
  icon: string;
  name: string;
  category: string;
  quantity: number;
  status: string;
  statusColor: string;
  dotColor: string;
  qtyBg: string;
  imageUrl?: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  id, icon, name, category, quantity, status, statusColor, dotColor, qtyBg, imageUrl, onEdit, onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between hover:border-primary/5 transition-all relative group">
      <div className="flex items-start gap-4 flex-1">
        <div
          className="h-16 w-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 bg-cover bg-center border border-gray-100"
          style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : {}}
        >
          {!imageUrl && <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '24px' }}>{icon}</span>}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[#111418] leading-tight mb-1">{name}</h3>
          <p className="text-xs text-gray-500 mb-2">{category}</p>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${qtyBg}`}>
              Qtd: {quantity}
            </span>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100">
              <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
              <span className={`text-[10px] font-medium ${statusColor}`}>{status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
        >
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 w-32 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit?.(); }}
                className="w-full text-left px-4 py-2 text-sm text-[#111418] hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Editar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Excluir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
};