import React from 'react';

interface QuoteSelectEquipmentProps {
  onBack: () => void;
}

export const QuoteSelectEquipment: React.FC<QuoteSelectEquipmentProps> = ({ onBack }) => {
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
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button className="p-1 text-gray-400 hover:text-primary dark:hover:text-sky-blue">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-medium whitespace-nowrap shadow-sm shadow-primary/20">Todos</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 text-xs font-medium whitespace-nowrap">Climatização</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 text-xs font-medium whitespace-nowrap">Peças</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 text-xs font-medium whitespace-nowrap">Ferramentas</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 text-xs font-medium whitespace-nowrap">Elétrica</button>
          </div>
        </section>

        <section className="flex flex-col gap-4 pb-6">
          {/* Selected Item Card */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-l-primary border-y border-r border-gray-100 dark:border-gray-700 dark:border-l-sky-blue flex gap-4">
            <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden relative">
              <img alt="Compressor" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjFA8Ib507T2t8gAkmfsErzp10Ik8flJCuYDy5YVOTelgSQ-mY4MTykjprDorrRBpf1cUPkxMIx9ueW0iH8syqGzH3XbyzhNrC25jg7mrMxcuACWaW5HwGcaDavG9bSAQjfPQScKE7v18GaDAv-b5u9SqKG7WvIrkbmlMjf-y96dtLMgZfagG4llKO4-TEXmbGir59GG17-Kw8R4SQ9EzRPPGzZj12ZWCxW53GS5vKq5TGP2Cf9bsE9fJVvM9gCSZdEOi-Pl11NgQK"/>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Compressor Rotativo 12000 BTUs</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Climatização • R$ 450,00</p>
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded inline-block">12 em estoque</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 h-8">
                  <button className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="w-8 text-center text-sm font-medium dark:text-white">1</span>
                  <button className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
                <button className="text-xs font-semibold text-primary dark:text-sky-blue flex items-center gap-1">
                  Confirmar
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </button>
              </div>
            </div>
          </div>

          <EquipmentItem 
            title="Gás Refrigerante R410A (Botija 11.3kg)"
            category="Peças"
            price="R$ 850,00"
            stock="5 em estoque"
            stockColor="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCLtdTZphU-fhqWK4nbDQAs2AuIjcYOv1l9o3py1Tcwt8rS6hH2O6Iv4g-tr2THtXPG2UgrZ6O4Cd6eq6nwDuPxVHYI1fDmkqD1MyEvQ8z0-_r6u13e1vBtII4g7JSyk9lbmleRnOGCGVpDFZfBQoxypW3YTkP03mlcxDYgQHESjyAMzzZsaAM2ekNSWCr-z7exhI83rtlj9k3cndv5Jm8xHPdIMs0-WgIK8XGHqMpCY5mH0gzGeEZG5xTnT7L5E0xkhGLW-7yzYMNz"
          />

          <EquipmentItem 
            title="Capacitor Duplo 45+5 uF"
            category="Elétrica"
            price="R$ 35,00"
            stock="2 em estoque"
            stockColor="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDUUvhtYhP9CiQO2tIv4HSuDhbo9etCvmUa8c0i4AwRL3hAw3z4JBqgixMQAhHUQZlUcC7Wv6D9HJ5DSN0FahNu-KpKpO3RpMKuolBIPw6JtpB7AD9JwQs0JvGFT0Aoj3eYQzzhKZwNIE864SMpCr_3ThXLR2K5Lfbr9mf1dOyg5BTlJBsc48jHjfb-GWRKKHY7Bz-lfWalomQ6AlTGqCOCdvhVrtAyzw7B84QhYTos2-jS2n661cY63ezaN1u15LAsJY6tOoMNroe_"
          />

          <EquipmentItem 
            title='Tubo de Cobre Flexível 1/4"'
            category="Materiais"
            price="R$ 22,00/m"
            stock="50m em estoque"
            stockColor="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDcO88MyaAwQ8p3EYd4iNBAXxzmCh8UUWS6AzTdrR1gtX1QGpPuXEREfdA6jrO5U2-vgT3PlB7kkN5QNLltJMz83DM1jaBOPo4PxQWn3cF_IsVWDz0Do57vzMMTWV16oKRElSjOLG5U3mojA8oruthQA80wYB0lv3ZIWJ8pMgn_l_rNlRvI688PYx2gOYzW49ROhNAN7G7GKzch0GW4A0A89brRYMMcibsEvebGuZ1ujDUCk3DwquaSY28EJ-E5qosQYN85m9Ly2CFf"
          />

          {/* Out of Stock Item */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 opacity-75">
            <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center"></div>
              <img alt="Suporte" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnVb7sL8YyIUncy6qwrg6X1-Zya68ywaCYjt85WZooyGdWfvcGCcrBZJAHbdlOSaZt_uyLK3p2Q4PLH3AnBW6DWf88DjgV4eeV6P1zcraHnIe7Gu4QZ97ADE4kzI2maQWo-Y5uSXVe19deCMvsuhAjObizs8_6QYH1scKWy3UQAHCEmiAoC-pdlQ_4fX7ZbH2ANnjXT5fJfqhYnU--r_Kx9kVXYGiQ9Ke0Dkb2Uv5QCqr3baHZ4e1cdRJPS3x-FocUVcyEq5n-4VHg"/>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Suporte para Condensadora 400mm</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Acessórios • R$ 65,00</p>
                <p className="text-[10px] font-medium text-red-600 dark:text-red-400 mt-0.5 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded inline-block">Esgotado</p>
              </div>
              <div className="flex justify-end mt-2">
                <button className="text-gray-400 text-xs font-medium cursor-not-allowed" disabled>
                  Indisponível
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center active:scale-95 transition-transform">
          <span className="material-symbols-outlined">check</span>
        </button>
      </div>
    </div>
  );
};

interface EquipmentItemProps {
  title: string;
  category: string;
  price: string;
  stock: string;
  stockColor: string;
  image: string;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({ title, category, price, stock, stockColor, image }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
    <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
      <img alt={title} className="w-full h-full object-cover" src={image} />
    </div>
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category} • {price}</p>
        <p className={`text-[10px] font-medium mt-0.5 px-1.5 py-0.5 rounded inline-block ${stockColor}`}>{stock}</p>
      </div>
      <div className="flex justify-end mt-2">
        <button className="bg-primary/10 dark:bg-sky-blue/10 hover:bg-primary/20 text-primary dark:text-sky-blue px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Adicionar
        </button>
      </div>
    </div>
  </div>
);