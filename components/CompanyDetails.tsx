import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface CompanyDetailsProps {
  onBack: () => void;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    cnpj: '',
    professional_id: '',
    company_phone: '',
    company_email: '',
    address: '',
    quote_notes: '',
    avatar_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const { showAlert } = useAlert();

  const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('logos').getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));

    } catch (error: any) {
      console.error('Error uploading logo:', error);
      showAlert('Erro', 'Erro ao fazer upload da logo: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('company_name, cnpj, professional_id, company_phone, company_email, address, quote_notes, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData({
          company_name: data.company_name || '',
          cnpj: data.cnpj || '',
          professional_id: data.professional_id || '',
          company_phone: data.company_phone || '',
          company_email: data.company_email || '',
          address: data.address || '',
          quote_notes: data.quote_notes || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates = {
        id: user.id,
        ...formData,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      showAlert('Sucesso', 'Dados da empresa salvos com sucesso!', 'success');
    } catch (error: any) {
      console.error('Error saving company details:', error);
      showAlert('Erro', 'Erro ao salvar dados: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="bg-background-light text-[#111418] min-h-screen flex flex-col overflow-hidden">
      <header className="flex items-center bg-primary text-white p-4 justify-between sticky top-0 z-10 shadow-md">
        <button
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10 font-display">
          Dados da Empresa
        </h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-safe">
        <div className="flex flex-col items-center justify-center pt-8 pb-6">
          <label className="relative group cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={uploadLogo}
              className="hidden"
              disabled={uploading}
            />
            <div className={`h-28 w-28 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center shadow-sm hover:border-primary transition-colors overflow-hidden relative ${uploading ? 'opacity-50' : ''}`}>
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-primary transition-colors">photo_camera</span>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <span className="material-symbols-outlined animate-spin text-primary">refresh</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-1 bg-primary text-white p-2 rounded-full border-4 border-[#F2F3F5] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-xs font-bold">add</span>
            </div>
          </label>
          <p className="mt-3 text-sm font-medium text-primary cursor-pointer">
            {uploading ? 'Enviando...' : 'Adicionar Logo da Empresa'}
          </p>
        </div>

        <div className="px-4">
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-5 border border-gray-100">
            <InputGroup
              label="Nome da Empresa"
              placeholder="Digite o nome da empresa"
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
            />
            <InputGroup
              label="CNPJ / CPF"
              placeholder="00.000.000/0000-00"
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
            />

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 ml-1">
                <label className="text-sm font-semibold text-gray-700">Número do Profissional</label>
                <div className="group relative flex items-center">
                  <span className="material-symbols-outlined text-gray-400 text-[18px] cursor-help hover:text-primary transition-colors">help</span>
                </div>
              </div>
              <input
                className="w-full rounded-lg border-gray-200 bg-gray-50 text-[#111418] text-base p-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-gray-400"
                placeholder="Registro ou Identificação"
                type="text"
                name="professional_id"
                value={formData.professional_id}
                onChange={handleChange}
              />
            </div>

            <InputGroup
              label="Telefone Comercial"
              placeholder="(00) 00000-0000"
              type="tel"
              name="company_phone"
              value={formData.company_phone}
              onChange={handleChange}
            />
            <InputGroup
              label="E-mail Comercial"
              placeholder="contato@empresa.com"
              type="email"
              name="company_email"
              value={formData.company_email}
              onChange={handleChange}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Endereço Completo</label>
              <textarea
                className="w-full rounded-lg border-gray-200 bg-gray-50 text-[#111418] text-base p-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none placeholder:text-gray-400"
                placeholder="Rua, Número, Bairro, Cidade - UF"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="px-4 mt-8 mb-4">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 px-1">Dados Adicionais</h3>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Observações do Orçamento</label>
              <p className="text-xs text-gray-400 mb-2 ml-1">Estas informações aparecerão no rodapé dos orçamentos (ex: dados bancários, chave PIX).</p>
              <textarea
                className="w-full rounded-lg border-gray-200 bg-gray-50 text-[#111418] text-base p-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-gray-400"
                placeholder={`Chave PIX: 00.000.000/0001-00\nBanco: Exemplo\nAgência: 0001\nConta: 12345-6`}
                rows={5}
                name="quote_notes"
                value={formData.quote_notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-4 mt-4 mb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary hover:bg-[#0d346b] text-white font-semibold rounded-xl py-4 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">check</span>
                <span>Salvar Alterações</span>
              </>
            )}

          </button>
        </div>
      </main>
    </div>
  );
};

const InputGroup: React.FC<{
  label: string;
  placeholder: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, placeholder, type, name, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <input
      className="w-full rounded-lg border-gray-200 bg-gray-50 text-[#111418] text-base p-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-gray-400"
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
);