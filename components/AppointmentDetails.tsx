import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface AppointmentDetailsProps {
    appointmentId?: string | null;
    onBack: () => void;
    onReschedule?: () => void;
}

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointmentId, onBack, onReschedule }) => {
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState<any>(null);
    const [client, setClient] = useState<any>(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (appointmentId) {
            fetchDetails();
        }
    }, [appointmentId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            // Fetch appointment
            const { data: appData, error: appError } = await supabase
                .from('appointments')
                .select('*')
                .eq('id', appointmentId)
                .single();

            if (appError) throw appError;
            setAppointment(appData);

            // Fetch client
            if (appData.client_id) {
                const { data: clientData, error: clientError } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('id', appData.client_id)
                    .single();

                if (clientError) {
                    console.error('Error fetching client:', clientError);
                } else {
                    setClient(clientData);
                }
            }

        } catch (error: any) {
            console.error('Error fetching appointment details:', error);
            showAlert('Erro', 'Não foi possível carregar os detalhes do agendamento.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!appointmentId) return;

        // Custom confirmation dialog could be added here
        if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;

        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', appointmentId);

            if (error) throw error;

            showAlert('Sucesso', 'Agendamento cancelado com sucesso!', 'success');
            fetchDetails(); // Refresh
        } catch (error: any) {
            console.error('Error cancelling appointment:', error);
            showAlert('Erro', 'Erro ao cancelar agendamento.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-screen bg-background-light flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500">Agendamento não encontrado.</p>
                <button onClick={onBack} className="text-primary font-bold">Voltar</button>
            </div>
        );
    }

    // Format Data
    const dateObj = new Date(`${appointment.date}T12:00:00`); // Use T12:00:00 to avoid timezone shift on date display
    const day = dateObj.getDate();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const month = monthNames[dateObj.getMonth()];
    const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

    // Time formatting
    const formatTime = (timeStr: string) => {
        if (!timeStr) return '--:--';
        return timeStr.substring(0, 5);
    };

    const timeString = `${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}`;

    const statusLabel = appointment.status === 'scheduled' ? 'Agendado' : (appointment.status === 'completed' ? 'Concluído' : 'Cancelado');
    const statusColor = appointment.status === 'scheduled' ? 'bg-blue-50 text-primary ring-blue-700/10' : (appointment.status === 'completed' ? 'bg-teal-50 text-teal-700 ring-teal-700/10' : 'bg-gray-100 text-gray-600 ring-gray-500/10');
    const dotColor = appointment.status === 'scheduled' ? 'bg-primary' : (appointment.status === 'completed' ? 'bg-teal-700' : 'bg-gray-500');

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-[#111418] font-display antialiased">
            <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light shadow-xl">
                {/* Header */}
                <header className="sticky top-0 z-20 flex items-center justify-between bg-white p-4 border-b border-gray-100">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center p-2 -ml-2 rounded-full text-[#637188] hover:bg-gray-100 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Detalhes do Agendamento</h2>
                    <button className="flex items-center justify-center p-2 -mr-2 rounded-full text-[#637188] hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </header>

                <main className="flex-1 flex flex-col gap-4 px-4 py-6 pb-24">
                    {/* Status Card */}
                    <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${statusColor}`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${dotColor}`}></span>
                                {statusLabel}
                            </span>
                        </div>
                        <span className="material-symbols-outlined text-primary/40 text-[80px] opacity-10 absolute -right-4 -bottom-4 z-0 pointer-events-none select-none">event_available</span>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-[#111418] tracking-tight">{day} {month}</h3>
                            <p className="text-[#637188] font-medium mt-1 text-lg capitalize">{weekday}, {timeString}</p>
                        </div>
                    </div>

                    {/* Client Card */}
                    {client && (
                        <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent">
                            <h4 className="text-[#637188] text-xs font-bold uppercase tracking-wider mb-4">Cliente</h4>
                            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                                {client.avatar_url ? (
                                    <div className="size-14 rounded-full bg-gray-200 bg-center bg-cover shadow-sm ring-2 ring-white" style={{ backgroundImage: `url("${client.avatar_url}")` }}></div>
                                ) : (
                                    <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shadow-sm ring-2 ring-white">
                                        {client.name.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-[#111418] text-lg font-bold">{client.name}</h3>
                                    <p className="text-[#637188] text-sm">{client.email || 'Email não informado'}</p>
                                </div>
                                <button className="p-2 rounded-full bg-[#f0f2f5] text-primary hover:bg-primary/10 transition-colors">
                                    <span className="material-symbols-outlined block">chat</span>
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#637188] mt-0.5">call</span>
                                    <div>
                                        <p className="text-[#111418] font-medium">{client.phone || '(00) 00000-0000'}</p>
                                        <p className="text-xs text-[#637188]">Celular</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#637188] mt-0.5">location_on</span>
                                    <div>
                                        <p className="text-[#111418] font-medium">
                                            {client.address}{client.number ? `, ${client.number}` : ''}
                                            {client.neighborhood ? ` - ${client.neighborhood}` : ''}
                                            {!client.address && !client.number && !client.neighborhood && 'Endereço não informado'}
                                        </p>
                                        <p className="text-xs text-[#637188]">
                                            {client.city && client.state ? `${client.city}/${client.state}` : (client.city || client.state || 'Cidade/UF não informados')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Service Card */}
                    <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent">
                        <h4 className="text-[#637188] text-xs font-bold uppercase tracking-wider mb-3">Serviço / Orçamento</h4>
                        <div className="mb-5">
                            <h3 className="text-[#111418] text-xl font-bold mb-2">{appointment.title || 'Agendamento'}</h3>
                            <div className="flex gap-3">
                                <span className="inline-flex items-center gap-1 rounded bg-[#f0f2f5] px-2.5 py-1 text-sm font-medium text-[#111418]">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    {appointment.start_time ?
                                        ((new Date(`2000-01-01T${appointment.end_time}`).getTime() - new Date(`2000-01-01T${appointment.start_time}`).getTime()) / 60000) + ' min'
                                        : '--'}
                                </span>
                            </div>
                        </div>
                        {appointment.notes && (
                            <div className="bg-[#f8f9fa] rounded-lg p-4">
                                <h5 className="text-[#111418] text-sm font-bold mb-2">Notas do Agendamento</h5>
                                <p className="text-[#637188] text-sm leading-relaxed">
                                    {appointment.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-col gap-3">
                        <button
                            onClick={onReschedule}
                            className="w-full rounded-xl bg-white border border-gray-200 py-3.5 text-sm font-bold text-[#637188] shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
                            Remarcar
                        </button>
                        {appointment.status !== 'cancelled' && (
                            <button
                                onClick={handleCancel}
                                className="w-full rounded-xl py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">cancel</span>
                                Cancelar Agendamento
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};