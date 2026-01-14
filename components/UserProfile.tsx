import React from 'react';

interface UserProfileProps {
    onBack: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {
    return (
        <div className="bg-background-light text-[#111418] h-screen flex flex-col overflow-hidden font-display">
            <header className="flex items-center bg-primary p-4 pb-4 justify-between sticky top-0 z-10 shadow-md text-white">
                <button
                    onClick={onBack}
                    className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors -ml-2"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-8">
                    Perfil do usuário
                </h2>
            </header>

            <main className="flex-1 overflow-y-auto pb-8">
                <div className="flex flex-col items-center mt-8 mb-6">
                    <div className="relative group cursor-pointer">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 ring-4 ring-white shadow-md"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCyV7Zj8tifxtx0xl51l9npr1RVVLjB53h9j1tykXyly7xc76klWSlDZq-jz8wdFjq639GfTg-GW9kykTrE7CUlfkpzs2bRyb9qaxNg9geALMPvuN8nlLVXTn3p1r_d6cN87cBRrRcMMaCwN5T2KvvHR2BnmdRSyPfYmM-0vOlTIfVyaoSVWxNNBK2hhA_Jqdn8a112iOORgC4t-QuUA295BEBJFri1ljqA1FUdWqOlkClrRuAzJ-z3mpTp70onX8hHaIplkmL9zTPX")' }}
                        ></div>
                        <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </div>
                    </div>
                    <p className="mt-3 text-primary font-semibold text-sm cursor-pointer hover:underline">Alterar foto</p>
                </div>

                <div className="px-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nome Completo</label>
                            <input className="w-full text-[#111418] font-medium text-base border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400" type="text" defaultValue="Carlos Silva" />
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">E-mail</label>
                            <input className="w-full text-[#111418] font-medium text-base border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400" type="email" defaultValue="carlos.silva@freelancer.com" />
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Telefone</label>
                            <input className="w-full text-[#111418] font-medium text-base border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400" type="tel" defaultValue="(11) 98765-4321" />
                        </div>
                        <div className="p-4">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">CPF</label>
                            <input className="w-full text-[#111418] font-medium text-base border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400" type="text" defaultValue="123.456.789-00" />
                        </div>
                    </div>

                    <div className="mt-8 mb-6">
                        <button
                            onClick={onBack}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#0d346b] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span>Salvar Alterações</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};