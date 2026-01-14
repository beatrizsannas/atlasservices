import React from 'react';

interface AppointmentDetailsProps {
    onBack: () => void;
    onReschedule?: () => void;
}

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ onBack, onReschedule }) => {
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
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-blue-700/10">
                                <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                                Agendado
                            </span>
                        </div>
                        <span className="material-symbols-outlined text-primary/40 text-[80px] opacity-10 absolute -right-4 -bottom-4 z-0 pointer-events-none select-none">event_available</span>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-[#111418] tracking-tight">12 Outubro</h3>
                            <p className="text-[#637188] font-medium mt-1 text-lg">Quinta-feira, 09:00 - 10:00</p>
                        </div>
                    </div>

                    {/* Client Card */}
                    <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent">
                        <h4 className="text-[#637188] text-xs font-bold uppercase tracking-wider mb-4">Cliente</h4>
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                            <div className="size-14 rounded-full bg-gray-200 bg-center bg-cover shadow-sm ring-2 ring-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAXaNc2ARxJ6KvD7LGucVUekfTg9nWW4BrQXNKYa318d9QFeZ9xr2bg6qf1S7mkUn5b-8Ii5JWUJ1NKXnVvpwPYpPgpL9Mw8FGQ6i_61hAV_W4e7bsu6vxbEEy6naFbgvdZDz1SA7J0cQlIc9K92_AdifW0A5IrUtnz-hQ6WV9LEC9Fk6fbpo2s_wmONDOQKTkYxIZVpow9hinJ8hO-RXoQBsK7G4vIMxw6pvcG8_Wh1GzCDx0PaQFhDWxObFIgaIF87iz8mdDR4wwG")' }}></div>
                            <div className="flex-1">
                                <h3 className="text-[#111418] text-lg font-bold">Ana Silva</h3>
                                <p className="text-[#637188] text-sm">Cliente desde 2021</p>
                            </div>
                            <button className="p-2 rounded-full bg-[#f0f2f5] text-primary hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined block">chat</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[#637188] mt-0.5">call</span>
                                <div>
                                    <p className="text-[#111418] font-medium">(11) 98765-4321</p>
                                    <p className="text-xs text-[#637188]">Celular</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[#637188] mt-0.5">location_on</span>
                                <div>
                                    <p className="text-[#111418] font-medium">Av. Paulista, 1000, Sala 42</p>
                                    <p className="text-xs text-[#637188]">São Paulo, SP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Card */}
                    <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent">
                        <h4 className="text-[#637188] text-xs font-bold uppercase tracking-wider mb-3">Serviço</h4>
                        <div className="mb-5">
                            <h3 className="text-[#111418] text-xl font-bold mb-2">Consultoria de Marketing</h3>
                            <div className="flex gap-3">
                                <span className="inline-flex items-center gap-1 rounded bg-[#f0f2f5] px-2.5 py-1 text-sm font-medium text-[#111418]">
                                    <span className="material-symbols-outlined text-[16px]">payments</span>
                                    R$ 350,00
                                </span>
                                <span className="inline-flex items-center gap-1 rounded bg-[#f0f2f5] px-2.5 py-1 text-sm font-medium text-[#111418]">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    1h 00min
                                </span>
                            </div>
                        </div>
                        <div className="bg-[#f8f9fa] rounded-lg p-4">
                            <h5 className="text-[#111418] text-sm font-bold mb-2">Notas do Agendamento</h5>
                            <p className="text-[#637188] text-sm leading-relaxed">
                                Sessão focada na revisão da estratégia de Q4. O cliente solicitou ênfase na análise de métricas das campanhas recentes no Instagram e LinkedIn. Trazer o relatório comparativo do mês anterior.
                            </p>
                        </div>
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
                        <button className="w-full rounded-xl py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">cancel</span>
                            Cancelar Agendamento
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};