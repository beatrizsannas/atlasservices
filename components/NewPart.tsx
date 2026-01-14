import React from 'react';
import { Screen } from '../App';

interface NewPartProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export const NewPart: React.FC<NewPartProps> = ({ onBack, onNavigate }) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      e.target.value = parseFloat(e.target.value).toFixed(2);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] overflow-x-hidden">
      <header className="bg-[#0B2A5B] pt-safe sticky top-0 z-50 shadow-md transition-colors duration-200">
        <div className="px-4 h-[60px] flex items-center justify-between text-white">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Cadastrar Peça</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex flex-col px-4 pt-6 pb-12 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">Informações da Peça</h2>

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            {/* Photo Upload */}
            <div className="flex justify-center w-full">
              <div className="relative w-32 h-32 group">
                <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 shadow-sm transition-all group-hover:bg-gray-100 group-hover:border-primary/50 cursor-pointer">
                  <span className="material-symbols-outlined text-3xl mb-1 group-hover:text-primary transition-colors">photo_camera</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide group-hover:text-primary transition-colors">Adicionar Foto</span>
                </div>
                <input accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
              </div>
            </div>

            {/* Part Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="part-name">Nome da Peça</label>
              <input
                className="w-full bg-gray-50 text-gray-900 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/50 py-3 px-4 text-base placeholder-gray-400 shadow-sm transition-colors outline-none focus:ring-2"
                id="part-name"
                placeholder="Ex: Cabo HDMI 2m"
                type="text"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="category">Categoria</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-gray-50 text-gray-900 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/50 py-3 px-4 text-base shadow-sm transition-colors pr-10 outline-none focus:ring-2 cursor-pointer"
                  id="category"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value === 'nova-categoria') {
                      onNavigate('new-category');
                    }
                  }}
                >
                  <option disabled value="">Selecione uma categoria</option>
                  <option value="eletrica">Elétrica</option>
                  <option value="hidraulica">Hidráulica</option>
                  <option value="acessorios">Acessórios em geral</option>
                  <option value="informatica">Informática</option>
                  <option value="outros">Outros</option>
                  <option value="nova-categoria" className="font-bold text-primary bg-blue-50">+ Nova categoria</option>
                  <option value="editar-categorias" className="text-gray-500">Editar categorias</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            {/* Quantity and Min Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="initial-qty">Qtd. Inicial</label>
                <input
                  className="w-full bg-gray-50 text-gray-900 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/50 py-3 px-4 text-base placeholder-gray-400 shadow-sm transition-colors outline-none focus:ring-2"
                  id="initial-qty"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1" htmlFor="min-stock">
                  Estoque Mín.
                  <span className="material-symbols-outlined text-gray-400 text-[16px]" title="Alerta de reposição">info</span>
                </label>
                <input
                  className="w-full bg-gray-50 text-gray-900 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/50 py-3 px-4 text-base placeholder-gray-400 shadow-sm transition-colors outline-none focus:ring-2"
                  id="min-stock"
                  placeholder="0"
                  type="number"
                />
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="cost-price">Valor Custo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm font-medium">R$</span>
                  <input
                    className="w-full bg-gray-50 text-gray-900 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/50 py-3 pl-10 pr-4 text-base placeholder-gray-400 shadow-sm transition-colors outline-none focus:ring-2"
                    id="cost-price"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="sale-price">Valor Venda</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm font-medium">R$</span>
                  <input
                    className="w-full bg-gray-50 text-gray-900 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/50 py-3 pl-10 pr-4 text-base placeholder-gray-400 shadow-sm transition-colors outline-none focus:ring-2"
                    id="sale-price"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="text-xs text-gray-500 flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">info</span>
                <p>O "Estoque Mínimo" define quando você receberá alertas de reposição para este item.</p>
              </div>
              <button
                onClick={onBack}
                className="w-full bg-primary hover:bg-[#092247] text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">save</span>
                Salvar Peça
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};