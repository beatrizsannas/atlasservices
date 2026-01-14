import React from 'react';

interface ViewQuoteProps {
  onBack: () => void;
  validityDate?: string;
}

export const ViewQuote: React.FC<ViewQuoteProps> = ({ onBack, validityDate = '2023-11-24' }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-safe font-display text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-primary text-white shadow-md transition-all duration-300">
        <div className="flex items-center gap-4 px-4 h-16 pt-safe">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center pr-8">Visualizar Orçamento</h1>
        </div>
      </header>

      <main className="pt-24 px-4 pb-12 flex flex-col items-center min-h-screen">
        <div className="w-full max-w-md bg-white text-gray-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1),0_4px_10px_-2px_rgba(0,0,0,0.05)] relative rounded-b-lg">
          <div className="h-2 w-full bg-primary"></div>
          <div className="p-8">
            <div className="flex flex-col items-center text-center border-b border-gray-200 pb-8 mb-8">
              <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative bg-white">
                <img 
                  alt="Company Logo" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgNqZnBfRrlq9nQBCnfmlB7fJYXPUmTNV57MrnVLVQvHRhsQV2YNo7zV_dvNIAy-eNwK1H34pci8OPBroqHajXgcsqnVLgPvk1vaxFCZbdEIg6gvf9yRZklDJusnvJ8po8obUdUz1ZYo6udHfHVOipZ48Wu6D-0RaDx-ItW65N76-O8kepcvKEDXhF4GiB083sjb5zhtfMvRNdtrWNDhhKgjv785jz5roK-s-4TQZ8uEfNOdnHkpNxP0GO4x33LDYZOrQWlV30LWMf"
                />
              </div>
              <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">Atlas Services</h2>
              <div className="text-xs text-gray-500 space-y-1 font-medium">
                <p>CNPJ: 45.123.789/0001-90</p>
                <p>Rua das Palmeiras, 405 - São Paulo, SP</p>
                <p>(11) 98765-4321</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Dados do Cliente</h3>
              <div className="text-sm">
                <p className="font-bold text-gray-900 text-base">Roberto Silva</p>
                <p className="text-gray-500 mt-1">roberto.silva@email.com</p>
                <p className="text-gray-500">(11) 99999-8888</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Itens do Orçamento</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500">
                    <th className="text-left font-semibold pb-3 pl-14">Descrição</th>
                    <th className="text-right font-semibold pb-3 pr-1">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          <img alt="AC Unit" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHPMvffUsu94dlv6GhSpL6DCljP8ES83Bzrer2Z_zysOiNoEEgwV0D0C2xqBrxj3cFKT4hjmjhO5l_Ft-KLPEDrKUkj1cb8axp0t9JUSZ3o9eD73eim0s57ZJkEIjt1w8DNbkO120ts3YnQMqNTIHZyOx-TQGOzLgHrQnQA6U6X82mO2iAK7LaTtvl2g6qR5uYIAx28an8T3_VdxAOypyaiQSXOA_q7QyQ4izh0vrpKTGpsGmNz8H19qePRFfdB6ZOGVYFpphRu5QO"/>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-snug">Manutenção de Ar Condicionado</p>
                          <p className="text-xs text-gray-500 mt-1">1 x R$ 250,00</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-1 text-right align-top font-medium text-gray-700">
                      R$ 250,00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          <img alt="Gas Canister" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3yxZ04G3Nc9xYG3fhseJrF3FM1nky6UtzyObVl2Xy7GBMN2higjaggKEpG-3CWDh-358ThGCq6dK1s66BBvfWLKdHlOQPgUJKR_YhpyWXyckwoHFU0IFLqkCy3YY37OqJM6r1cIAUxqAy4qHhRmjPeBltiS8F5VJyxEsMVbr4g4vJJQylAxhseusf-PcBpq9DIET3jbH6jdQ4mjkR8fXmye4SOt9xLrJXR51mkxC9_5pSpu0WLwga6s82YOGpUpI76ZXah_VbAUR"/>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-snug">Gás Refrigerante R410A</p>
                          <p className="text-xs text-gray-500 mt-1">2 x R$ 90,00</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-1 text-right align-top font-medium text-gray-700">
                      R$ 180,00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 pt-6 flex flex-col gap-2 items-end">
              <div className="flex justify-between w-full max-w-[280px] text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800">R$ 430,00</span>
              </div>
              <div className="flex justify-between w-full max-w-[280px] text-sm">
                <span className="text-gray-500">Descontos</span>
                <span className="font-medium text-gray-800">R$ 0,00</span>
              </div>
              <div className="flex justify-between items-center w-full max-w-[280px] mt-3 pt-3 border-t border-gray-100">
                <span className="text-base font-bold text-primary">Total</span>
                <span className="text-2xl font-bold text-primary whitespace-nowrap">R$ 430,00</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
              <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">chat</span>
                Enviar via WhatsApp
              </button>
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">download</span>
                Baixar PDF
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-gray-400 italic">
                Este orçamento é válido até o dia {formatDate(validityDate)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};