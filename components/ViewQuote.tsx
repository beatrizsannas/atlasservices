import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ViewQuoteProps {
  onBack: () => void;
  validityDate?: string;
  quoteId?: string;
}

export const ViewQuote: React.FC<ViewQuoteProps> = ({ onBack, validityDate = '2023-11-24', quoteId }) => {
  const [quote, setQuote] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quoteId) {
      fetchQuoteData();
    }
  }, [quoteId]);

  const fetchQuoteData = async () => {
    try {
      setLoading(true);
      // Fetch Quote
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (quoteError) throw quoteError;
      setQuote(quoteData);

      // Fetch Client
      if (quoteData.client_id) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('*')
          .eq('id', quoteData.client_id)
          .single();
        if (clientData) setClient(clientData);
      }

      // Fetch Items
      const { data: itemsData, error: itemsError } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', quoteId);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

    } catch (error) {
      console.error('Error fetching quote details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading && quoteId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#0B2A5B]">progress_activity</span>
      </div>
    )
  }

  // Fallback if no quote loaded (shouldn't happen if flow is correct)
  if (!quote && !loading && quoteId) {
    return <div className="p-10 text-center">Orçamento não encontrado.</div>
  }

  // Use props validityDate if quote doesn't have one (though it should)
  const finalValidityDate = quote?.valid_until || validityDate;
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const discount = quote?.discount || 0;
  const total = quote?.total_amount || 0;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-safe font-display text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0B2A5B] text-white shadow-md transition-all duration-300">
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
          <div className="h-2 w-full bg-[#0B2A5B]"></div>
          <div className="p-8">
            <div className="flex flex-col items-center text-center border-b border-gray-200 pb-8 mb-8">
              <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative bg-white">
                <img
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgNqZnBfRrlq9nQBCnfmlB7fJYXPUmTNV57MrnVLVQvHRhsQV2YNo7zV_dvNIAy-eNwK1H34pci8OPBroqHajXgcsqnVLgPvk1vaxFCZbdEIg6gvf9yRZklDJusnvJ8po8obUdUz1ZYo6udHfHVOx33LDYZOrQWlV30LWMf"
                />
              </div>
              <h2 className="text-2xl font-bold text-[#0B2A5B] tracking-tight mb-2">Atlas Services</h2>
              <div className="text-xs text-gray-500 space-y-1 font-medium">
                <p>CNPJ: 45.123.789/0001-90</p>
                <p>Rua das Palmeiras, 405 - São Paulo, SP</p>
                <p>(11) 98765-4321</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Dados do Cliente</h3>
              <div className="text-sm">
                <p className="font-bold text-gray-900 text-base">{client?.name || 'Cliente'}</p>
                <p className="text-gray-500 mt-1">{client?.email || 'email@exemplo.com'}</p>
                <p className="text-gray-500">{client?.phone || '(00) 00000-0000'}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Itens do Orçamento</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500">
                    <th className="text-left font-semibold pb-3">Descrição</th>
                    <th className="text-right font-semibold pb-3 pr-1">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div>
                            <p className="font-semibold text-gray-900 leading-snug">{item.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.quantity} x R$ {formatCurrency(item.unit_price)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-1 text-right align-top font-medium text-gray-700">
                        R$ {formatCurrency(item.quantity * item.unit_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 pt-6 flex flex-col gap-2 items-end">
              <div className="flex justify-between w-full max-w-[280px] text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800">R$ {formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between w-full max-w-[280px] text-sm">
                <span className="text-gray-500">Descontos</span>
                <span className="font-medium text-gray-800 text-emerald-600">- R$ {formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between items-center w-full max-w-[280px] mt-3 pt-3 border-t border-gray-100">
                <span className="text-base font-bold text-[#0B2A5B]">Total</span>
                <span className="text-2xl font-bold text-[#0B2A5B] whitespace-nowrap">R$ {formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
              <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">chat</span>
                Enviar via WhatsApp
              </button>
              <button className="w-full bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-bold py-3 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">download</span>
                Baixar PDF
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-gray-400 italic">
                Este orçamento é válido até o dia {formatDate(finalValidityDate)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};