import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface NewQuoteProps {
  onBack: () => void;
  onGenerate: (date: string, quoteId?: string) => void;
  onAdd: () => void;
  quoteId?: string | null;
}

export const NewQuote: React.FC<NewQuoteProps> = ({ onBack, onGenerate, quoteId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [validityDate, setValidityDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [fetchingDeps, setFetchingDeps] = useState(true);

  // Add Item Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'service' | 'part' | 'custom'>('service');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Dependencies data
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [partsList, setPartsList] = useState<any[]>([]);

  useEffect(() => {
    fetchDependencies();
    if (quoteId) {
      fetchQuoteDetails();
    }
  }, [quoteId]);

  useEffect(() => {
    if (isModalOpen) {
      filterResults();
    }
  }, [modalTab, searchQuery, servicesList, partsList, isModalOpen]);

  const fetchDependencies = async () => {
    try {
      const { data: clientsData } = await supabase.from('clients').select('id, name');
      if (clientsData) setClients(clientsData);

      const { data: servicesData } = await supabase.from('services').select('id, title, price, description');
      if (servicesData) setServicesList(servicesData);

      const { data: partsData } = await supabase.from('inventory_parts').select('id, name, sale_price, category, image_url');
      if (partsData) setPartsList(partsData);

      setFetchingDeps(false);
    } catch (error) {
      console.error('Error fetching deps', error);
    }
  }

  const fetchQuoteDetails = async () => {
    if (!quoteId) return;

    try {
      setLoading(true);

      // Fetch Quote
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (quoteError) throw quoteError;

      if (quote) {
        setSelectedClientId(quote.client_id);
        setValidityDate(quote.valid_until);
        setDiscount(quote.discount || 0);
      }

      // Fetch Items
      const { data: items, error: itemsError } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', quoteId);

      if (itemsError) throw itemsError;

      if (items) {
        const mappedItems = items.map((item: any) => ({
          id: Date.now() + Math.random(), // Temporary ID for UI
          original_id: item.related_id, // We might need to store this better if we want to track deps
          name: item.description,
          type: item.item_type === 'service' ? 'Serviço' : (item.item_type === 'part' ? 'Peça' : 'Personalizado'),
          origin: item.item_type,
          quantity: item.quantity,
          price: item.unit_price
        }));
        setItems(mappedItems);
      }

    } catch (error: any) {
      console.error('Error fetching quote details:', error);
      showAlert('Erro', 'Erro ao carregar orçamento: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const filterResults = () => {
    if (modalTab === 'service') {
      setSearchResults(servicesList.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())));
    } else if (modalTab === 'part') {
      setSearchResults(partsList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  }

  const addItem = (item: any, type: 'service' | 'part' | 'custom') => {
    const newItem = {
      id: Date.now(), // temporary UI ID
      original_id: item.id || null, // DB ID if service/part
      name: modalTab === 'custom' ? item.name : (modalTab === 'service' ? item.title : item.name),
      type: modalTab === 'custom' ? 'Personalizado' : (modalTab === 'service' ? 'Serviço' : 'Peça'),
      origin: type,
      quantity: 1,
      price: modalTab === 'custom' ? parseFloat(item.price) : (modalTab === 'service' ? item.price : item.sale_price),
      imageUrl: item.image_url || null
    };
    setItems(prev => [...prev, newItem]);
    setIsModalOpen(false);
    setSearchQuery('');
  }

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('customName') as HTMLInputElement).value;
    const price = (form.elements.namedItem('customPrice') as HTMLInputElement).value;

    if (name && price) {
      addItem({ name, price }, 'custom');
    }
  }

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
    const numericPrice = parseFloat(newPrice.replace(',', '.'));
    if (!isNaN(numericPrice)) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, price: numericPrice } : item));
    }
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  // Discount State
  const [discount, setDiscount] = useState(0);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [tempDiscount, setTempDiscount] = useState('');
  const { showAlert } = useAlert();

  const total = Math.max(0, subtotal - discount);

  const openDiscountModal = () => {
    setTempDiscount(discount.toFixed(2));
    setIsDiscountModalOpen(true);
  }

  const handleBlurDiscount = () => {
    const val = parseFloat(tempDiscount.replace(',', '.'));
    if (!isNaN(val)) {
      setTempDiscount(val.toFixed(2));
    } else {
      setTempDiscount('0.00');
    }
  }

  const applyDiscount = () => {
    const val = parseFloat(tempDiscount.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      setDiscount(val);
    }
    setIsDiscountModalOpen(false);
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSave = async () => {
    if (!selectedClientId) {
      showAlert('Atenção', 'Selecione um cliente.', 'warning');
      return;
    }
    if (items.length === 0) {
      showAlert('Atenção', 'Adicione pelo menos um item.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Create or Update Quote
      let quoteData: any;

      if (quoteId) {
        // Update
        const { data, error } = await supabase.from('quotes').update({
          client_id: selectedClientId,
          valid_until: validityDate,
          total_amount: total,
          discount: discount,
          status: 'pending' // Reset to pending on edit? Or keep? Let's keep pending logic for now.
        }).eq('id', quoteId).select().single();

        if (error) throw error;
        quoteData = data;

        // Delete existing items to replace with new ones (simple approach)
        const { error: deleteError } = await supabase.from('quote_items').delete().eq('quote_id', quoteId);
        if (deleteError) throw deleteError;

      } else {
        // Insert
        const { data, error } = await supabase.from('quotes').insert({
          user_id: user.id,
          client_id: selectedClientId,
          valid_until: validityDate,
          total_amount: total,
          discount: discount,
          status: 'pending'
        }).select().single();

        if (error) throw error;
        quoteData = data;
      }

      // 2. Create Quote Items
      const quoteItems = items.map(item => ({
        quote_id: quoteData.id,
        item_type: item.origin, // service, part, custom
        description: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        related_id: item.original_id || null
      }));

      const { error: itemsError } = await supabase.from('quote_items').insert(quoteItems);

      if (itemsError) throw itemsError;

      onGenerate(validityDate, quoteData.id); // Or navigate to view-quote with ID

    } catch (error: any) {
      console.error('Error saving quote:', error);
      showAlert('Erro', 'Erro ao salvar orçamento: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

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
              <select
                className="block w-full pl-10 pr-10 py-3 border-gray-200 rounded-lg bg-gray-50 focus:ring-[#0B2A5B] focus:border-[#0B2A5B] appearance-none text-sm outline-none"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option disabled value="">Buscar cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
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
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
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
                <div className="flex items-start gap-3">
                  {item.origin === 'part' && (
                    <div
                      className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 bg-cover bg-center border border-gray-200 flex items-center justify-center"
                      style={item.imageUrl ? { backgroundImage: `url("${item.imageUrl}")` } : {}}
                    >
                      {!item.imageUrl && <span className="material-symbols-outlined text-gray-400 text-[24px]">inventory_2</span>}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
              <div className="flex items-center justify-between gap-4 mt-3 pl-[60px]">
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#0B2A5B]/30 rounded-xl text-[#0B2A5B] font-medium hover:bg-[#0B2A5B]/5 transition-colors"
          >
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
              <button
                onClick={openDiscountModal}
                className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-gray-400 text-[16px]">edit</span>
                <span className="font-medium text-emerald-600">- R$ {formatCurrency(discount)}</span>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-[#0B2A5B]">R$ {formatCurrency(total)}</span>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#0B2A5B] hover:bg-[#09224a] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0B2A5B]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">description</span>}
            {loading ? 'Salvando...' : 'Gerar Orçamento'}
          </button>
        </section>
      </main>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#0B2A5B] text-white">
              <h3 className="font-bold text-lg">Adicionar Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full"><span className="material-symbols-outlined">close</span></button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 bg-gray-50 border-b border-gray-100">
              <button
                onClick={() => setModalTab('service')}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${modalTab === 'service' ? 'bg-[#0B2A5B] text-white' : 'text-gray-500 hover:bg-gray-200'}`}
              >Serviços</button>
              <button
                onClick={() => setModalTab('part')}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${modalTab === 'part' ? 'bg-[#0B2A5B] text-white' : 'text-gray-500 hover:bg-gray-200'}`}
              >Peças</button>
              <button
                onClick={() => setModalTab('custom')}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${modalTab === 'custom' ? 'bg-[#0B2A5B] text-white' : 'text-gray-500 hover:bg-gray-200'}`}
              >Personalizado</button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {modalTab !== 'custom' && (
                <div className="mb-4 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                  <input
                    type="text"
                    placeholder={modalTab === 'service' ? "Buscar serviço..." : "Buscar peça..."}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B2A5B]/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                {modalTab === 'service' && searchResults.map(item => (
                  <button key={item.id} onClick={() => addItem(item, 'service')} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 text-left group transition-all">
                    <div>
                      <div className="font-bold text-[#111418]">{item.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{item.description || 'Sem descrição'}</div>
                    </div>
                    <div className="text-[#0B2A5B] font-bold">
                      + R$ {item.price ? item.price.toFixed(2) : '0.00'}
                    </div>
                  </button>
                ))}
                {modalTab === 'part' && searchResults.map(item => (
                  <button key={item.id} onClick={() => addItem(item, 'part')} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 text-left group transition-all">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 bg-cover bg-center border border-gray-200 flex items-center justify-center"
                        style={item.image_url ? { backgroundImage: `url("${item.image_url}")` } : {}}
                      >
                        {!item.image_url && <span className="material-symbols-outlined text-gray-400 text-[20px]">inventory_2</span>}
                      </div>
                      <div>
                        <div className="font-bold text-[#111418]">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                    </div>
                    <div className="text-[#0B2A5B] font-bold">
                      + R$ {item.sale_price ? item.sale_price.toFixed(2) : '0.00'}
                    </div>
                  </button>
                ))}

                {modalTab === 'custom' && (
                  <form onSubmit={handleCustomAdd} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nome do Item</label>
                      <input name="customName" type="text" required className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#0B2A5B]/20" placeholder="Ex: Mão de obra extra" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Preço (R$)</label>
                      <input name="customPrice" type="number" step="0.01" required className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#0B2A5B]/20" placeholder="0.00" />
                    </div>
                    <button type="submit" className="w-full bg-[#0B2A5B] text-white font-bold py-3 rounded-xl shadow-lg mt-2">
                      Adicionar Item
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-[#111418] mb-4">Adicionar Desconto</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Desconto (R$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0B2A5B]/20 text-lg font-semibold"
                placeholder="0,00"
                value={tempDiscount}
                onChange={(e) => setTempDiscount(e.target.value)}
                onBlur={handleBlurDiscount}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={applyDiscount}
                className="flex-1 py-3 text-white font-bold bg-[#0B2A5B] rounded-xl hover:bg-[#09224a] shadow-lg shadow-[#0B2A5B]/20"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};