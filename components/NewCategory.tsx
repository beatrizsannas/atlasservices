import React, { useState } from 'react';

interface NewCategoryProps {
    onBack: () => void;
    onSave: () => void;
}

export const NewCategory: React.FC<NewCategoryProps> = ({ onBack, onSave }) => {
    const [selectedColor, setSelectedColor] = useState('blue');
    const [selectedIcon, setSelectedIcon] = useState('category');

    const colors = [
        { name: 'blue', class: 'bg-blue-500' },
        { name: 'green', class: 'bg-green-500' },
        { name: 'purple', class: 'bg-purple-500' },
        { name: 'orange', class: 'bg-orange-500' },
        { name: 'red', class: 'bg-red-500' },
        { name: 'teal', class: 'bg-teal-500' },
        { name: 'pink', class: 'bg-pink-500' },
        { name: 'indigo', class: 'bg-indigo-500' }
    ];

    const icons = [
        'category', 'build', 'shopping_cart', 'local_shipping',
        'inventory_2', 'sell', 'paid', 'receipt_long',
        'work', 'handyman', 'cleaning_services', 'format_paint'
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] overflow-x-hidden">
            <header className="bg-primary pt-safe sticky top-0 z-50 shadow-md">
                <div className="px-4 h-[60px] flex items-center justify-between text-white">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold">Nova Categoria</h1>
                    <div className="w-10"></div>
                </div>
            </header>
            <main className="flex flex-col px-4 pt-6 pb-12 max-w-lg mx-auto w-full">
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700" htmlFor="category-name">Nome da Categoria</label>
                            <input className="w-full bg-gray-50 text-gray-900 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/50 py-3 px-4 text-base placeholder-gray-400 shadow-sm transition-colors outline-none focus:ring-2" id="category-name" placeholder="Ex: Ferramentas Elétricas" type="text" />
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-gray-700">Personalizar Visual</label>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cor da Tag</span>
                                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                                        {colors.map((color) => (
                                            <button
                                                key={color.name}
                                                type="button"
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`w-10 h-10 rounded-full ${color.class} hover:opacity-80 transition-all flex-shrink-0 ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mt-1">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Ícone</span>
                                    <div className="grid grid-cols-5 gap-3">
                                        {icons.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setSelectedIcon(icon)}
                                                className={`aspect-square rounded-xl flex items-center justify-center transition-all ${selectedIcon === icon ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                                            >
                                                <span className="material-symbols-outlined">{icon}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-semibold text-gray-700" htmlFor="description">Descrição</label>
                                <span className="text-xs text-gray-400 font-medium">Opcional</span>
                            </div>
                            <textarea className="w-full bg-gray-50 text-gray-900 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/50 py-3 px-4 text-base placeholder-gray-400 shadow-sm transition-colors resize-none outline-none focus:ring-2" id="description" placeholder="Adicione detalhes sobre esta categoria..." rows={3}></textarea>
                        </div>
                        <div className="pt-4 mt-auto">
                            <button
                                onClick={onSave}
                                className="w-full bg-primary hover:bg-[#0d346b] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">check_circle</span>
                                <span>Criar Categoria</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};