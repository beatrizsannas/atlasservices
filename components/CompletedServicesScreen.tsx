import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Screen } from '../App';

interface CompletedServicesScreenProps {
    onBack: () => void;
    onNavigate: (screen: Screen, appointmentId?: string) => void;
}

interface CompletedService {
    id: string;
    date: string;
    client_name: string;
    service_name: string;
    price: number;
    status: string;
}

export const CompletedServicesScreen: React.FC<CompletedServicesScreenProps> = ({ onBack, onNavigate }) => {
    console.log('CompletedServicesScreen mounted');
    const [services, setServices] = useState<CompletedService[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalServices, setTotalServices] = useState(0);
    const [growth, setGrowth] = useState(0);

    useEffect(() => {
        console.log('useEffect triggered');
        fetchCompletedServices();
    }, []);

    const fetchCompletedServices = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const startDateStr = startOfMonth.toISOString().split('T')[0];
            const endDateStr = endOfMonth.toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'completed')
                .gte('date', startDateStr)
                .lte('date', endDateStr)
                .order('date', { ascending: false });

            if (error) {
                console.error('Error fetching services:', error);
                setLoading(false);
                return;
            }

            const currentCount = data?.length || 0;
            setServices(data || []);
            setTotalServices(currentCount);

            // Calculate growth
            const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            const prevStartDateStr = startOfPrevMonth.toISOString().split('T')[0];
            const prevEndDateStr = endOfPrevMonth.toISOString().split('T')[0];

            const { data: prevData } = await supabase
                .from('appointments')
                .select('id')
                .eq('user_id', user.id)
                .eq('status', 'completed')
                .gte('date', prevStartDateStr)
                .lte('date', prevEndDateStr);

            const prevCount = prevData?.length || 0;
            if (prevCount > 0) {
                const growthPercent = Math.round(((currentCount - prevCount) / prevCount) * 100);
                setGrowth(growthPercent);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error in fetchCompletedServices:', error);
            setLoading(false);
        }
    };

    const getCurrentMonthYear = () => {
        const now = new Date();
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return months[now.getMonth()];
    };

    const getPreviousMonthName = () => {
        const now = new Date();
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        return months[prevMonth];
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr + 'T00:00:00');
            const day = date.getDate();
            const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
            return { day, month };
        } catch {
            return { day: 1, month: 'JAN' };
        }
    };

    const formatCurrency = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display text-[#111418] pb-32">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-primary px-4 py-4 shadow-md flex items-center justify-between text-white pb-safe pt-safe border-b border-primary/20">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/10 transition-colors -ml-2"
                >
                    <span className="material-symbols-outlined text-white">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-center flex-1">Serviços Realizados</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <main className="flex flex-col gap-6 px-4 pt-6">
                {/* Summary Card */}
                <section>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-blue/10 rounded-bl-full -mr-4 -mt-4"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Total acumulado ({getCurrentMonthYear()})</h2>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-4xl font-bold text-primary">{totalServices}</span>
                                    <span className="text-base font-medium text-gray-500">serviços</span>
                                </div>
                                {growth !== 0 && (
                                    <p className={`text-xs font-medium mt-2 inline-block px-2 py-1 rounded-full border ${growth > 0
                                        ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                        : 'text-red-600 bg-red-50 border-red-100'
                                        }`}>
                                        {growth > 0 ? '+' : ''}{growth}% que {getPreviousMonthName()}
                                    </p>
                                )}
                            </div>
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>verified</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services List */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Histórico Recente</h3>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-gray-400">Carregando...</div>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <span className="material-symbols-outlined text-gray-300 mb-4" style={{ fontSize: '64px' }}>check_circle</span>
                            <p className="text-gray-400 text-center">Nenhum serviço realizado este mês</p>
                        </div>
                    ) : (
                        services.map((service) => {
                            const { day, month } = formatDate(service.date);
                            return (
                                <div
                                    key={service.id}
                                    onClick={() => onNavigate('appointment-details', service.id)}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 group hover:border-sky-blue/30 transition-colors cursor-pointer"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg h-14 w-14 min-w-[3.5rem] border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{month}</span>
                                            <span className="text-xl font-bold text-primary leading-none">{day}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-[#111418] truncate pr-2">{service.client_name}</h4>
                                                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    Concluído
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">{service.service_name}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <span className="text-sm font-bold text-primary">{formatCurrency(service.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>
            </main>
        </div>
    );
};
