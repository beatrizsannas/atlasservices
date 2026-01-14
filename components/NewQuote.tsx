import React, { useState } from 'react';

interface NewQuoteProps {
  onBack: () => void;
  onGenerate: (date: string) => void;
  onAddItem: () => void; // Keep for compatibility if needed, though UI has its own button
}

export const NewQuote: React.FC<NewQuoteProps> = ({ onBack, onGenerate }) => {
  // Mock initial state for items based on the design
  const [items, setItems] = useState([
    { id: 1, name: 'Manutenção de Ar Condicionado', type: 'Serviço • 12.000 BTU', quantity: 1, price: 250.00 },
    { id: 2, name: 'Gás Refrigerante R410A', type: 'Peça • Kg', quantity: 2, price: 180.00 }
  ]);

  const handleQuantityChange = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handlePriceChange = (id: number, newPrice: string) => {
    // Simple price update logic (in a real app, strict masking would be good)
    const numericPrice = parseFloat(newPrice.replace(',', '.'));
    if (!isNaN(numericPrice)) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, price: numericPrice } : item));
    }
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const discount = 0;
  const total = subtotal - discount;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] overflow-x-hidden pb-32">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0B2A5B] text-white shadow-md">
        <div className="flex items-center gap-4 px-4 h-16 pt-safe">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center pr-8">Novo Orçamento</h1>
        </div>
      </header>

      <main className="pt-20 px-4 pb-32 flex flex-col gap-6">
        <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cliente</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
              </div>
              <select className="block w-full pl-10 pr-10 py-3 border-gray-200 rounded-lg bg-gray-50 focus:ring-[#0B2A5B] focus:border-[#0B2A5B] appearance-none text-sm outline-none">
                <option disabled selected value="">Buscar cliente...</option>
                <option value="1">Roberto Silva</option>
                <option value="2">Ana Costa</option>
                <option value="3">Carlos Mendes</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">arrow_drop_down</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Data de Validade</label>
            <div className="relative">
              <input
                className="block w-full px-3 py-3 border-gray-200 rounded-lg bg-gray-50 focus:ring-[#0B2A5B] focus:border-[#0B2A5B] text-sm outline-none"
                type="date"
                defaultValue="2023-11-24"
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-base font-bold text-gray-800">Itens do Orçamento</h2>
          </div>

          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
              <div className="flex items-center justify-between gap-4 mt-3">
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#0B2A5B]"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#0B2A5B]"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 mr-1">Preço Un.</label>
                  <div className="flex items-center gap-1.5 group/edit cursor-pointer">
                    <div className="relative flex items-center">
                      <span className="absolute left-2 text-sm font-bold text-[#0B2A5B]">R$</span>
                      <input
                        className="w-24 pl-8 pr-2 py-1 text-right text-sm font-bold text-[#0B2A5B] bg-gray-50 border-gray-200 rounded-md focus:ring-1 focus:ring-[#0B2A5B] focus:border-[#0B2A5B] border-0 group-hover/edit:ring-1 group-hover/edit:ring-[#0B2A5B]/30 outline-none"
                        type="text"
                        value={formatCurrency(item.price)}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      />
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover/edit:text-[#0B2A5B] transition-colors">edit</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#0B2A5B]/30 rounded-xl text-[#0B2A5B] font-medium hover:bg-[#0B2A5B]/5 transition-colors">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Adicionar Item
          </button>
        </section>

        <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-2">
          <h2 className="text-base font-bold text-gray-800 mb-4">Resumo</h2>
          <div className="space-y-3 mb-6 border-b border-gray-100 pb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">R$ {formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Desconto</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-[16px]">edit</span>
                <span className="font-medium text-emerald-600">- R$ {formatCurrency(discount)}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-[#0B2A5B]">R$ {formatCurrency(total)}</span>
          </div>
          <button
            onClick={() => onGenerate(new Date().toISOString())}
            className="w-full bg-[#0B2A5B] hover:bg-[#09224a] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0B2A5B]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">description</span>
            Gerar Orçamento
          </button>
        </section>
      </main>
    </div>
  );
};