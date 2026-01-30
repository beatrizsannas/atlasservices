import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ViewQuoteProps {
  onBack: () => void;
  validityDate?: string;
  quoteId?: string;
  onEdit?: (id: string) => void;
}

export const ViewQuote: React.FC<ViewQuoteProps> = ({ onBack, validityDate, quoteId, onEdit }) => {
  const [quote, setQuote] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [client, setClient] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ViewQuote mounted, quoteId:', quoteId);
    if (quoteId) {
      fetchQuoteData();
    }
  }, [quoteId]);

  // Derived state
  const finalValidityDate = React.useMemo(() => {
    if (quote?.valid_until) return quote.valid_until;
    if (quote?.created_at) {
      const d = new Date(quote.created_at);
      d.setDate(d.getDate() + 15);
      return d.toISOString().split('T')[0];
    }
    return validityDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }, [quote, validityDate]);
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const discount = quote?.discount || 0;
  const total = quote?.total_amount || 0;

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

      // Fetch Company (Profile)
      if (quoteData.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', quoteData.user_id)
          .single();
        if (profileData) setCompany(profileData);
      }

      // Fetch Items
      const { data: itemsData, error: itemsError } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', quoteId);

      if (itemsError) throw itemsError;
      if (itemsError) throw itemsError;

      // Fetch images for parts
      let itemsWithImages = itemsData || [];
      const partIds = itemsData
        ?.filter((item: any) => item.item_type === 'part' && item.related_id)
        .map((item: any) => item.related_id) || [];

      if (partIds.length > 0) {
        const { data: partsImages } = await supabase
          .from('inventory_parts')
          .select('id, image_url')
          .in('id', partIds);

        if (partsImages) {
          const imageMap = partsImages.reduce((acc: any, part: any) => {
            acc[part.id] = part.image_url;
            return acc;
          }, {});

          itemsWithImages = itemsData.map((item: any) => ({
            ...item,
            image_url: item.related_id ? imageMap[item.related_id] : null
          }));
        }
      }

      setItems(itemsWithImages);

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

  const handleWhatsApp = () => {
    if (!quote || !client || !items) return;

    let message = `*Orçamento - ${company?.company_name || 'Sua Empresa'}*\n\n`;
    message += `Olá ${client.name}, segue o orçamento solicitado:\n\n`;

    items.forEach(item => {
      message += `• ${item.quantity}x ${item.description}: R$ ${formatCurrency(item.quantity * item.unit_price)}\n`;
    });

    message += `\n*Total: R$ ${formatCurrency(total)}*\n`;
    if (discount > 0) message += `(Desconto: R$ ${formatCurrency(discount)})\n`;

    message += `\nVálido até: ${formatDate(finalValidityDate)}\n`;
    message += `\n${company?.company_phone ? `Contato: ${company.company_phone}` : ''}`;

    const encodedMessage = encodeURIComponent(message);
    const phone = client.phone?.replace(/\D/g, '') || '';

    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
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

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-safe font-display text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0B2A5B] text-white shadow-md transition-all duration-300 print:hidden">
        <div className="flex items-center gap-4 px-4 h-16 pt-safe">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center pr-8">Visualizar Orçamento</h1>
          <button
            onClick={() => quoteId && onEdit && onEdit(quoteId)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-4 pb-12 flex flex-col items-center min-h-screen print:p-0 print:pt-0 print:pb-0">
        <div className="w-full max-w-md bg-white text-gray-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1),0_4px_10px_-2px_rgba(0,0,0,0.05)] relative rounded-b-lg print:max-w-full print:shadow-none print:rounded-none">
          <div className="h-2 w-full bg-[#0B2A5B]"></div>
          <div className="p-8">
            <div className="flex flex-col items-center text-center border-b border-gray-200 pb-8 mb-8">
              <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative bg-white flex items-center justify-center">
                {company?.avatar_url ? (
                  <img
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                    src={company.avatar_url}
                  />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-gray-300">storefront</span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-[#0B2A5B] tracking-tight mb-2">{company?.company_name || 'Nome da Empresa'}</h2>
              <div className="text-xs text-gray-500 space-y-1 font-medium">
                {company?.cnpj && <p>CNPJ: {company.cnpj}</p>}
                {company?.professional_id && <p>Registro: {company.professional_id}</p>}
                {company?.address && <p>{company.address}</p>}
                {company?.company_phone && <p>{company.company_phone}</p>}
                {company?.company_email && <p>{company.company_email}</p>}
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
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.description}
                              className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 object-cover border border-gray-100"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{item.description}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{item.quantity} x R$ {formatCurrency(item.unit_price)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 font-medium text-gray-900 align-top pt-4">R$ {formatCurrency(item.quantity * item.unit_price)}</td>
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

            {/* Additional Notes Section */}
            {company?.quote_notes && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Dados Adicionais</h3>
                <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">
                  {company.quote_notes}
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3 print:hidden">
              <button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">chat</span>
                Enviar via WhatsApp
              </button>
              <button
                onClick={handlePrint}
                className="w-full bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-bold py-3 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">download</span>
                Baixar PDF
              </button>
            </div>

            <div className="mt-8 text-center print:fixed print:bottom-0 print:left-0 print:w-full print:pb-8">
              <p className="text-[10px] text-gray-400 italic">
                Este orçamento é válido por 15 dias (até o dia {(() => {
                  const baseDate = quote?.created_at ? new Date(quote.created_at) : new Date();
                  baseDate.setDate(baseDate.getDate() + 15);
                  return formatDate(baseDate.toISOString().split('T')[0]);
                })()})
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};