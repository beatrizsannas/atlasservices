import React from 'react';

interface InventoryProps {
  onBack: () => void;
  onNewPart?: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({ onBack, onNewPart }) => {
  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background-light">
      {/* Header - Blue background as per design */}
      <header className="bg-primary pt-safe sticky top-0 z-50 shadow-md transition-colors duration-200">
        <div className="px-4 h-[60px] flex items-center justify-between text-white">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Estoque de Peças</h1>
          <button
            onClick={onNewPart}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col px-4 pt-4 gap-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
          </span>
          <input
            className="w-full bg-white text-sm text-gray-700 placeholder-gray-400 rounded-xl border-none shadow-sm py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Buscar peças, categorias..."
            type="text"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterButton label="Tudo" active />
          <FilterButton label="Em Estoque" />
          <FilterButton label="Abaixo do Mínimo" />
          <FilterButton label="Crítico" />
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          <InventoryCard
            icon="cable"
            name="Cabo HDMI 2m"
            category="Acessórios"
            quantity={15}
            status="Bom"
            statusColor="text-green-600"
            dotColor="bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
            qtyBg="bg-gray-100 text-gray-600"
          />
          <InventoryCard
            icon="power"
            name="Fonte ATX 500W"
            category="Componentes"
            quantity={3}
            status="Baixo"
            statusColor="text-red-600"
            dotColor="bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            qtyBg="bg-red-50 text-red-600 border border-red-100"
          />
          <InventoryCard
            icon="hard_drive"
            name="SSD 240GB Kingston"
            category="Armazenamento"
            quantity={8}
            status="Médio"
            statusColor="text-orange-600"
            dotColor="bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            qtyBg="bg-orange-50 text-orange-600 border border-orange-100"
          />
          <InventoryCard
            icon="memory"
            name="Memória RAM 8GB"
            category="Componentes"
            quantity={12}
            status="Bom"
            statusColor="text-green-600"
            dotColor="bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
            qtyBg="bg-gray-100 text-gray-600"
          />
          <InventoryCard
            icon="format_paint"
            name="Pasta Térmica"
            category="Insumos"
            quantity={5}
            status="Médio"
            statusColor="text-orange-600"
            dotColor="bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            qtyBg="bg-orange-50 text-orange-600 border border-orange-100"
          />
        </div>
      </main>
    </div>
  );
};

const FilterButton: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button
    className={`flex-none px-4 py-2 rounded-full text-xs font-medium shadow-sm whitespace-nowrap transition-all active:scale-95 ${active
        ? 'bg-primary text-white font-semibold'
        : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
      }`}
  >
    {label}
  </button>
);

interface InventoryCardProps {
  icon: string;
  name: string;
  category: string;
  quantity: number;
  status: string;
  statusColor: string;
  dotColor: string;
  qtyBg: string;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  icon, name, category, quantity, status, statusColor, dotColor, qtyBg
}) => (
  <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between hover:border-primary/5 transition-all cursor-pointer">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '20px' }}>{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#111418] leading-tight">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{category}</p>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${qtyBg}`}>
        Qtd: {quantity}
      </span>
      <div className="flex items-center gap-1">
        <span className={`text-[10px] font-medium ${statusColor}`}>{status}</span>
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
      </div>
    </div>
  </div>
);