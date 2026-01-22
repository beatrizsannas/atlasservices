import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Service } from './Services';

interface EditServiceProps {
    onBack: () => void;
    service: Service | null;
}

export const EditService: React.FC<EditServiceProps> = ({ onBack, service }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        timeRaw: '', // User input string like "1h 30m"
        description: ''
    });

    useEffect(() => {
        if (service) {
            setFormData({
                title: service.title,
                price: service.price.toFixed(2),
                timeRaw: formatDuration(service.duration_minutes),
                description: service.description || ''
            });
        }
    }, [service]);

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    };

    const parseDuration = (str: string): number => {
        // Simple parser for "Xh Ym" or "Xh" or "Ym" or just number (minutes)
        let totalMinutes = 0;
        const normalized = str.toLowerCase().replace(/\s/g, '');

        const hoursMatch = normalized.match(/(\d+)h/);
        const minsMatch = normalized.match(/(\d+)m/);

        if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
        if (minsMatch) totalMinutes += parseInt(minsMatch[1]);

        if (!hoursMatch && !minsMatch) {
            const val = parseInt(normalized);
            if (!isNaN(val)) totalMinutes = val;
        }

        return totalMinutes;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'price' && value) {
            const num = parseFloat(value);
            if (!isNaN(num)) {
                setFormData(prev => ({ ...prev, price: num.toFixed(2) }));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!service) return;
        if (!formData.title || !formData.price) {
            alert('Por favor, preencha nome e valor.');
            return;
        }

        setLoading(true);
        try {
            const duration = parseDuration(formData.timeRaw);
            const price = parseFloat(formData.price);

            const { error } = await supabase
                .from('services')
                .update({
                    title: formData.title,
                    price: price,
                    duration_minutes: duration,
                    description: formData.description
                })
                .eq('id', service.id);

            if (error) throw error;
            onBack();
        } catch (error: any) {
            console.error('Error updating service:', error);
            alert('Erro ao atualizar serviço.');
        } finally {
            setLoading(false);
        }
    };

    if (!service) {
        return <div className="p-10 text-center">Nenhum serviço selecionado. <button onClick={onBack} className="text-primary underline">Voltar</button></div>;
    }

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
                        {/* Delete button could go here, but handled in list view mostly */}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar p-6">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#111418]">Nome do serviço</label>
                            <div className="relative">
                                <input
                                    className="w-full h-12 rounded-lg border-gray-200 bg-white px-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 shadow-sm outline-none focus:ring-1"
                                    placeholder="Ex: Limpeza de Hardware"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
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
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#111418]">Tempo médio</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">schedule</span>
                                    <input
                                        className="w-full h-12 rounded-lg border-gray-200 bg-white pl-10 pr-4 text-base text-[#111418] focus:border-primary focus:ring-primary placeholder-gray-400 shadow-sm outline-none focus:ring-1"
                                        placeholder="Ex: 1h 30m"
                                        type="text"
                                        name="timeRaw"
                                        value={formData.timeRaw}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#111418]">Descrição</label>
                            <textarea
                                className="w-full rounded-lg border-gray-200 bg-white p-4 text-base text-[#111418] focus:border-primary focus:ring-primary resize-none placeholder-gray-400 shadow-sm outline-none focus:ring-1"
                                placeholder="Detalhes do que será realizado neste serviço..."
                                rows={5}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="pt-6 pb-4">
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-[#092249] text-white text-base font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                type="button"
                            >
                                {loading ? (
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                ) : (
                                    <span className="material-symbols-outlined">update</span>
                                )}
                                <span>{loading ? 'Atualizando...' : 'Atualizar Serviço'}</span>
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};