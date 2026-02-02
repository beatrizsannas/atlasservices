import React from 'react';

interface PremiumProps {
  onBack: () => void;
}

export const Premium: React.FC<PremiumProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light text-[#111418] overflow-hidden">
      <header className="sticky top-0 z-50 px-4 py-3 flex justify-between items-center bg-background-light/90 backdrop-blur-md">
        <button
          onClick={onBack}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-safe">
        <div className="px-5 py-2 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-100/50 transform rotate-3">
            <span className="material-symbols-outlined text-amber-600 text-3xl">workspace_premium</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-display">Escolha o Melhor para Você</h1>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
            Desbloqueie todo o potencial do seu negócio com nossos planos exclusivos.
          </p>
        </div>

        <div className="mt-8 px-5 space-y-6 pb-8">
          {/* Card Profissional */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative transform transition-all hover:scale-[1.01] duration-300">
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl z-20">
              Recomendado
            </div>
            <div className="p-6 pb-4 flex flex-col items-center border-b border-gray-50">
              <h3 className="text-primary font-bold text-lg mb-3 tracking-wide">Plano Profissional</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-gray-400">R$</span>
                <span className="text-5xl font-bold text-gray-900">39,90</span>
                <span className="text-gray-400 font-medium">/mês</span>
              </div>
              <p className="text-center text-sm text-gray-500 mb-2">Ideal para profissionais autônomos em crescimento.</p>
            </div>
            <div className="p-6 bg-gray-50/50">
              <ul className="space-y-3">
                <FeatureItem text="Gestão completa de clientes" />
                <FeatureItem text="Orçamentos ilimitados" />
                <FeatureItem text="Agenda inteligente" />
                <FeatureItem text="Relatórios financeiros básicos" />
              </ul>
              <button className="w-full mt-6 bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-[#0d346b] active:scale-[0.98] transition-all">
                Assinar Agora
              </button>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-3">
    <div className="bg-green-100 rounded-full p-0.5 mt-0.5">
      <span className="material-symbols-outlined text-green-600 text-base font-bold">check</span>
    </div>
    <span className="text-gray-700 font-medium text-sm pt-0.5">{text}</span>
  </li>
);