import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface QuoteSelectEquipmentProps {
  onBack: () => void;
  // In a real flow, we would probably pass onSelect to return the selected item
}

interface Part {
  id: string;
  name: string;
  category: string;
  quantity: number;
  min_stock: number;
  cost_price: number;
  sale_price: number;
}

export const QuoteSelectEquipment: React.FC<QuoteSelectEquipmentProps> = ({ onBack }) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_parts')
        .select('*')
        .gt('quantity', 0) // Only show items in stock? Or show all. Let's show all but mark out of stock.
        .order('name');

      if (error) throw error;
      if (data) setParts(data);
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prev => {
      const newQty = (prev[id] || 0) - 1;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === 'Peças') matchesFilter = part.category === 'Peças';
    // Add other mocks if categories match, but typically we filter by checking strings

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white pb-safe overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-primary text-white shadow-md">
        <div className="flex items-center gap-4 px-4 h-16 pt-safe">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center pr-8">Selecionar Equipamento</h1>
        </div>
      </header>

      <main className="pt-20 px-4 pb-32 flex flex-col gap-6 mt-safe mt-2">
        <section className="sticky top-[64px] z-40 -mx-4 px-4 py-2 bg-background-light dark:bg-background-dark backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
            </div>
            <input
              className="block w-full pl-10 pr-4 py-3 border-none shadow-sm rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary dark:focus:ring-sky-blue placeholder-gray-400 text-sm outline-none"
              placeholder="Buscar por nome ou categoria..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Simple filter tabs could go here */}
        </section>

        <section className="flex flex-col gap-4 pb-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Carregando itens...</div>
          ) : filteredParts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum item encontrado.</div>
          ) : (
            filteredParts.map(part => {
              const qtySelected = selectedItems[part.id] || 0;
              const isOutOfStock = part.quantity <= 0;

              return (
                <EquipmentItem
                  key={part.id}
                  title={part.name}
                  category={part.category || 'Geral'}
                  price={`R$ ${part.sale_price.toFixed(2)}`}
                  stock={`${part.quantity} em estoque`}
                  stockColor={isOutOfStock ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50"}
                  qtySelected={qtySelected}
                  onAdd={() => !isOutOfStock && handleAddItem(part.id)}
                  onRemove={() => handleRemoveItem(part.id)}
                  disabled={isOutOfStock}
                />
              );
            })
          )}
        </section>
      </main>

      {Object.keys(selectedItems).length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={onBack} // In real app, this would confirm selection
            className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">check</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface EquipmentItemProps {
  title: string;
  category: string;
  price: string;
  stock: string;
  stockColor: string;
  qtySelected: number;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({ title, category, price, stock, stockColor, qtySelected, onAdd, onRemove, disabled }) => (
  <div className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 ${qtySelected > 0 ? 'border-l-4 border-l-primary dark:border-l-sky-blue' : ''} ${disabled ? 'opacity-75' : ''}`}>
    <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
      <span className="material-symbols-outlined text-gray-400 text-3xl">inventory_2</span>
    </div>
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category} • {price}</p>
        <p className={`text-[10px] font-medium mt-0.5 px-1.5 py-0.5 rounded inline-block ${stockColor}`}>{disabled ? 'Esgotado' : stock}</p>
      </div>

      <div className="flex justify-end mt-2">
        {qtySelected > 0 ? (
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 h-8">
            <button onClick={onRemove} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="w-8 text-center text-sm font-medium dark:text-white">{qtySelected}</span>
            <button onClick={onAdd} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-400 transition-colors" disabled={disabled}>
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary/10 dark:bg-sky-blue/10 hover:bg-primary/20 text-primary dark:text-sky-blue'}`}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Adicionar
          </button>
        )}
      </div>
    </div>
  </div>
);