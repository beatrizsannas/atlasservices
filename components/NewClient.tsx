import React from 'react';

interface NewClientProps {
  onBack: () => void;
}

export const NewClient: React.FC<NewClientProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light font-display text-[#111418] overflow-x-hidden min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-[#0B2A5B] px-4 py-4 shadow-md flex justify-between items-center transition-colors duration-200">
        <button
          onClick={onBack}
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>close</span>
        </button>
        <h1 className="text-lg font-bold text-white absolute left-1/2 -translate-x-1/2">Novo Cliente</h1>
        <div className="w-10"></div>
      </div>

      <main className="flex-1 flex flex-col p-4 pb-safe">
        <div className="bg-white p-6 rounded-[16px] shadow-sm border border-gray-100 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="name">Nome Completo</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">person</span>
              <input
                className="w-full pl-10 pr-4 py-3 rounded-[16px] border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder-gray-400 text-sm transition-all text-gray-800"
                id="name"
                placeholder="Ex: Ana Clara Silva"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="phone">Telefone</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">phone_iphone</span>
              <input
                className="w-full pl-10 pr-4 py-3 rounded-[16px] border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder-gray-400 text-sm transition-all text-gray-800"
                id="phone"
                placeholder="(00) 00000-0000"
                type="tel"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="email">E-mail</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
              <input
                className="w-full pl-10 pr-4 py-3 rounded-[16px] border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder-gray-400 text-sm transition-all text-gray-800"
                id="email"
                placeholder="cliente@email.com"
                type="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="address">Endereço</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">location_on</span>
              <input
                className="w-full pl-10 pr-4 py-3 rounded-[16px] border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder-gray-400 text-sm transition-all text-gray-800"
                id="address"
                placeholder="Rua, Número, Bairro"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="notes">Observações</label>
            <textarea
              className="w-full px-4 py-3 rounded-[16px] border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder-gray-400 text-sm transition-all resize-none text-gray-800"
              id="notes"
              placeholder="Adicione notas sobre o cliente..."
              rows={4}
            ></textarea>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={onBack}
            className="w-full bg-primary text-white font-semibold py-4 rounded-[16px] shadow-md shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">save</span>
            Salvar Cliente
          </button>
        </div>
      </main>
    </div>
  );
};