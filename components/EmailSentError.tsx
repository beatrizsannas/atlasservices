import React from 'react';
import { Screen } from '../App';

interface EmailSentErrorProps {
  onNavigate: (screen: Screen) => void;
}

export const EmailSentError: React.FC<EmailSentErrorProps> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111418] flex flex-col min-h-screen items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1e2736] h-[100dvh] sm:h-auto sm:min-h-[600px] sm:rounded-[20px] shadow-2xl relative overflow-hidden flex flex-col p-6 sm:p-8">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-[64px]">cloud_off</span>
            </div>
            <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
              <div className="bg-red-50 dark:bg-red-900/50 rounded-full p-2 border-[6px] border-white dark:border-[#1e2736] flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-2xl font-bold">priority_high</span>
              </div>
            </div>
          </div>
          <div className="mb-10 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-white tracking-tight">
              Algo deu errado
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-[300px] mx-auto">
              Não conseguimos encontrar este e-mail em nossa base de dados. Verifique e tente novamente.
            </p>
          </div>
          <div className="w-full space-y-4">
            <button 
              onClick={() => onNavigate('forgot-password')}
              className="w-full bg-primary hover:bg-[#082046] active:bg-[#051530] text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center"
            >
              Tentar Novamente
            </button>
            <a 
              href="#"
              className="block text-primary dark:text-blue-300 font-semibold hover:opacity-80 transition-opacity py-2 text-base"
            >
              Falar com Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};