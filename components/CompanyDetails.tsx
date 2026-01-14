import React from 'react';

interface CompanyDetailsProps {
  onBack: () => void;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ onBack }) => {
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
          <div className="relative group cursor-pointer">
            <div className="h-28 w-28 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center shadow-sm hover:border-primary transition-colors overflow-hidden">
              <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-primary transition-colors">photo_camera</span>
            </div>
            <div className="absolute bottom-0 right-1 bg-primary text-white p-2 rounded-full border-4 border-[#F2F3F5] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-xs font-bold">add</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-primary cursor-pointer">Adicionar Logo da Empresa</p>
        </div>

        <div className="px-4">
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-5 border border-gray-100">
            <InputGroup label="Nome da Empresa" placeholder="Digite o nome da empresa" type="text" />
            <InputGroup label="CNPJ / CPF" placeholder="00.000.000/0000-00" type="text" />

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
              />
            </div>

            <InputGroup label="Telefone Comercial" placeholder="(00) 00000-0000" type="tel" />
            <InputGroup label="E-mail Comercial" placeholder="contato@empresa.com" type="email" />

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Endereço Completo</label>
              <textarea
                className="w-full rounded-lg border-gray-200 bg-gray-50 text-[#111418] text-base p-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none placeholder:text-gray-400"
                placeholder="Rua, Número, Bairro, Cidade - UF"
                rows={2}
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
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-4 mt-4 mb-6">
          <button
            onClick={onBack}
            className="w-full bg-primary hover:bg-[#0d346b] text-white font-semibold rounded-xl py-4 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
          >
            <span className="material-symbols-outlined text-[20px]">check</span>
            <span>Salvar Alterações</span>
          </button>
        </div>
      </main>
    </div>
  );
};

const InputGroup: React.FC<{ label: string; placeholder: string; type: string }> = ({ label, placeholder, type }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <input
      className="w-full rounded-lg border-gray-200 bg-gray-50 text-[#111418] text-base p-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-gray-400"
      placeholder={placeholder}
      type={type}
    />
  </div>
);