import React from 'react';

interface NewServiceProps {
    onBack: () => void;
    onSave: () => void;
}

export const NewService: React.FC<NewServiceProps> = ({ onBack, onSave }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] overflow-hidden">
            <div className="relative flex flex-col h-screen w-full max-w-md mx-auto bg-background-light shadow-2xl overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#0B2A5B] px-4 pt-safe pb-4 shadow-md transition-colors duration-200">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex size-10 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors -ml-2 text-white"
                        >
                            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-bold text-white leading-tight flex-1 text-center pr-8">
                            Novo Serviço
                        </h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-4 py-6 pb-safe">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-6">
                        {/* Service Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#111418]">Nome do serviço</label>
                            <div className="relative">
                                <input className="w-full h-12 rounded-lg border-gray-200 bg-background-light px-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 transition-colors outline-none focus:ring-1" placeholder="Ex: Limpeza de Hardware" type="text" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* Price */}
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-[#111418]">Valor (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                                    <input
                                        className="w-full h-12 rounded-lg border-gray-200 bg-background-light pl-10 pr-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 transition-colors outline-none focus:ring-1"
                                        placeholder="0,00"
                                        type="number"
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="w-32 space-y-2">
                                <label className="text-sm font-medium text-[#111418]">Tempo médio</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[20px]">schedule</span>
                                    <input className="w-full h-12 rounded-lg border-gray-200 bg-background-light pl-10 pr-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 transition-colors outline-none focus:ring-1" type="time" />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#111418]">Descrição</label>
                            <textarea
                                className="w-full rounded-lg border-gray-200 bg-background-light p-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 transition-colors outline-none focus:ring-1 resize-none h-32"
                                placeholder="Descreva os detalhes do serviço..."
                            />
                        </div>
                    </div>
                </main>

                <div className="p-4 bg-white border-t border-gray-100 pb-8 safe-area-bottom">
                    <button
                        onClick={onSave}
                        className="w-full bg-primary hover:bg-[#0d346b] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>Salvar Serviço</span>
                    </button>
                </div>
            </div>
        </div>
    );
};