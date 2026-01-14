import React from 'react';

interface QuoteItemAvulsoProps {
  onBack: () => void;
}

export const QuoteItemAvulso: React.FC<QuoteItemAvulsoProps> = ({ onBack }) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      e.target.value = parseFloat(e.target.value).toFixed(2);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white pb-safe">
      <header className="fixed top-0 left-0 w-full z-50 bg-primary text-white shadow-md">
        <div className="flex items-center gap-4 px-4 h-16 pt-safe">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center pr-8">Item Avulso</h1>
        </div>
      </header>

      <main className="pt-24 px-4 pb-8 flex flex-col gap-6 h-full justify-between min-h-[calc(100dvh-64px)]">
        <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-6 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nome do Item</label>
            <div className="relative">
              <input 
                className="block w-full px-3 py-3.5 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-primary focus:border-primary dark:text-white text-base placeholder-gray-400 transition-shadow outline-none border focus:ring-1" 
                placeholder="Ex: Cabo de Rede 5m" 
                type="text"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantidade</label>
              <div className="flex items-center w-full h-[50px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <button className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-primary active:bg-gray-200 dark:active:bg-gray-800 transition-colors border-r border-gray-200 dark:border-gray-700">
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <input 
                  className="flex-1 h-full text-center bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white font-semibold outline-none" 
                  inputMode="numeric" 
                  type="number" 
                  defaultValue="1"
                />
                <button className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-primary active:bg-gray-200 dark:active:bg-gray-800 transition-colors border-l border-gray-200 dark:border-gray-700">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>
            
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Valor Unit.</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">R$</span>
                <input 
                  className="block w-full pl-9 pr-3 py-3.5 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-primary focus:border-primary dark:text-white text-base text-right font-medium outline-none border focus:ring-1" 
                  inputMode="decimal" 
                  placeholder="0.00" 
                  type="number"
                  step="0.01"
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 pt-5 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Calculado</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">1 x R$ 0,00</span>
              </div>
              <span className="text-2xl font-bold text-primary dark:text-sky-blue">R$ 0,00</span>
            </div>
          </div>
        </section>
        
        <div className="mt-auto mb-4">
          <button 
            onClick={onBack}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Confirmar Item
          </button>
        </div>
      </main>
    </div>
  );
};