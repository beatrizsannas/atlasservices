import React from 'react';

interface EditServiceProps {
    onBack: () => void;
}

export const EditService: React.FC<EditServiceProps> = ({ onBack }) => {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value) {
            e.target.value = parseFloat(e.target.value).toFixed(2);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] overflow-hidden">
            <div className="relative flex flex-col h-screen w-full max-w-md mx-auto bg-background-light shadow-2xl overflow-hidden">
                <header className="flex items-center bg-[#0B2A5B] p-4 pb-4 justify-between shrink-0 z-10 shadow-md">
                    <button
                        onClick={onBack}
                        className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:bg-white/10 rounded-full pl-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Editar Serviço</h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex items-center justify-center rounded-xl size-12 text-white bg-transparent hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-[24px]">delete</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar p-6">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#111418]">Nome do serviço</label>
                            <div className="relative">
                                <input className="w-full h-12 rounded-lg border-gray-200 bg-white px-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 shadow-sm outline-none focus:ring-1" placeholder="Ex: Limpeza de Hardware" type="text" defaultValue="Formatação de Disco" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#111418]">Valor (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                                    <input
                                        className="w-full h-12 rounded-lg border-gray-200 bg-white pl-10 pr-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 shadow-sm outline-none focus:ring-1"
                                        placeholder="0.00"
                                        type="number"
                                        step="0.01"
                                        defaultValue="100.00"
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#111418]">Tempo médio</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">schedule</span>
                                    <input className="w-full h-12 rounded-lg border-gray-200 bg-white pl-10 pr-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 shadow-sm outline-none focus:ring-1" placeholder="Ex: 1h 30m" type="text" defaultValue="1h 30m" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#111418]">Descrição</label>
                            <textarea className="w-full rounded-lg border-gray-200 bg-white p-4 text-base text-[#111418] focus:border-primary focus:ring-primary resize-none placeholder-gray-400 shadow-sm outline-none focus:ring-1" placeholder="Detalhes do que será realizado neste serviço..." rows={5} defaultValue="Formatação completa do sistema, instalação limpa do Windows 11, drivers essenciais e pacote Office básico."></textarea>
                        </div>
                        <div className="pt-6 pb-4">
                            <button onClick={onBack} className="w-full h-12 rounded-xl bg-primary hover:bg-[#092249] text-white text-base font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors" type="button">
                                <span className="material-symbols-outlined">update</span>
                                Atualizar Serviço
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};