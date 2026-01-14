import React from 'react';
import { Screen } from '../App';

interface EmailSentSuccessProps {
  onNavigate: (screen: Screen) => void;
}

export const EmailSentSuccess: React.FC<EmailSentSuccessProps> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111418] flex flex-col min-h-screen items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1e2736] h-[100dvh] sm:h-auto sm:min-h-[600px] sm:rounded-[20px] shadow-2xl relative overflow-hidden flex flex-col p-6 sm:p-8">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary dark:text-blue-200 text-[64px]">mail</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-[#1e2736] rounded-full p-1.5 shadow-sm">
              <span 
                className="material-symbols-outlined text-[#8FD9F6] text-5xl" 
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
              >
                check_circle
              </span>
            </div>
          </div>
          <div className="text-center mb-10 w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary dark:text-white mb-4 tracking-tight">E-mail enviado!</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed px-2">
              As instruções de recuperação foram enviadas para o seu e-mail.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('login')}
            className="w-full bg-primary hover:bg-[#082046] active:bg-[#051530] text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  );
};