import React from 'react';

interface RescheduleProps {
  onBack: () => void;
}

export const Reschedule: React.FC<RescheduleProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light text-[#111418] font-display antialiased">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light shadow-xl pb-24">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-primary p-4 shadow-md text-white">
          <button
            onClick={onBack}
            className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors -ml-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Reagendar</h1>
          <div className="size-10"></div>
        </header>

        <main className="flex-1 flex flex-col gap-6 px-4 py-6">
          {/* Current Appointment Card */}
          <div className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-gray-100 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Agendamento Atual</h3>
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  Original
                </span>
              </div>
              <div className="flex items-start gap-4 mt-1">
                <div className="size-12 rounded-full bg-gray-200 bg-center bg-cover shadow-inner shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAXaNc2ARxJ6KvD7LGucVUekfTg9nWW4BrQXNKYa318d9QFeZ9xr2bg6qf1S7mkUn5b-8Ii5JWUJ1NKXnVvpwPYpPgpL9Mw8FGQ6i_61hAV_W4e7bsu6vxbEEy6naFbgvdZDz1SA7J0cQlIc9K92_AdifW0A5IrUtnz-hQ6WV9LEC9Fk6fbpo2s_wmONDOQKTkYxIZVpow9hinJ8hO-RXoQBsK7G4vIMxw6pvcG8_Wh1GzCDx0PaQFhDWxObFIgaIF87iz8mdDR4wwG")' }}></div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-[#111418] leading-tight">Consultoria de Marketing</h2>
                  <p className="text-sm text-gray-600 mt-0.5">Ana Silva</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100 text-sm text-gray-600">
                <span className="material-symbols-outlined text-lg">event</span>
                <span className="font-medium">Hoje, 12 de Outubro</span>
                <span className="mx-1">•</span>
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="font-medium">09:00 - 10:00</span>
              </div>
            </div>
          </div>

          {/* New Date Selection */}
          <div>
            <h3 className="text-base font-bold text-[#111418] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_calendar</span>
              Nova Data e Horário
            </h3>

            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="text-sm font-bold text-[#111418]">Outubro 2023</span>
                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                  <span key={i} className="text-[10px] font-medium text-gray-400 uppercase">{day}</span>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-sm">
                {[29, 30].map(day => (
                  <span key={day} className="h-9 flex items-center justify-center rounded-full text-gray-300">{day}</span>
                ))}
                {Array.from({ length: 11 }, (_, i) => i + 1).map(day => (
                  <span key={day} className="h-9 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50 cursor-pointer">{day}</span>
                ))}
                {/* Active Day */}
                <span className="h-9 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md shadow-primary/30">12</span>
                {Array.from({ length: 18 }, (_, i) => i + 13).map(day => (
                  <span key={day} className="h-9 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50 cursor-pointer">{day}</span>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 ml-1">Horário Início</label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#111418] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm outline-none">
                    <option>09:00</option>
                    <option>09:30</option>
                    <option selected>10:00</option>
                    <option>10:30</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 ml-1">Horário Término</label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#111418] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm outline-none">
                    <option>10:00</option>
                    <option>10:30</option>
                    <option selected>11:00</option>
                    <option>11:30</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Message */}
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-primary">
              <span className="material-symbols-outlined text-sm">info</span>
              <p>O horário selecionado está disponível.</p>
            </div>
          </div>
        </main>

        {/* Footer Action */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white p-4 border-t border-gray-100 max-w-md mx-auto pb-safe">
          <button
            onClick={onBack}
            className="flex w-full items-center justify-center rounded-xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Confirmar Reagendamento
          </button>
        </div>
      </div>
    </div>
  );
};