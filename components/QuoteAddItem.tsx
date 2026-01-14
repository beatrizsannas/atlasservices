import React from 'react';

interface QuoteAddItemProps {
  onBack: () => void;
  onAddItem: (type: 'custom' | 'part' | 'service') => void;
}

export const QuoteAddItem: React.FC<QuoteAddItemProps> = ({ onBack, onAddItem }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] pb-safe">
      <div className="bg-[#0B2A5B] px-4 pt-safe pb-6 shadow-md rounded-b-[32px] mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex size-10 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors -ml-2 text-white"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>

          <h1 className="text-xl font-bold text-white leading-tight flex-1 text-center pr-8">
            Adicionar Item
          </h1>
        </div>

        <div className="px-2 pb-2">
          <p className="text-white/80 text-sm font-medium text-center leading-relaxed max-w-[280px] mx-auto">
            Escolha o tipo de item que deseja adicionar ao orçamento
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-4">
        <button
          onClick={() => onAddItem('custom')}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left active:scale-[0.98] transition-all group hover:shadow-md hover:border-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </div>

          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-primary text-[24px] group-hover:text-white">edit_note</span>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-primary mb-1">Item Avulso</h3>
            <p className="text-sm text-gray-500 leading-snug">Entrada manual rápida para itens que não estão cadastrados.</p>
          </div>
        </button>

        <button
          onClick={() => onAddItem('part')}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left active:scale-[0.98] transition-all group hover:shadow-md hover:border-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-primary text-[24px] group-hover:text-white">inventory_2</span>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-primary mb-1">Equipamento</h3>
            <p className="text-sm text-gray-500 leading-snug">Selecionar peças ou equipamentos do seu estoque.</p>
          </div>
        </button>

        <button
          onClick={() => onAddItem('service')}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left active:scale-[0.98] transition-all group hover:shadow-md hover:border-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-primary text-[24px] group-hover:text-white">handyman</span>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-primary mb-1">Serviço</h3>
            <p className="text-sm text-gray-500 leading-snug">Selecionar mão de obra ou serviços do catálogo.</p>
          </div>
        </button>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={onBack}
          className="w-full py-4 rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};