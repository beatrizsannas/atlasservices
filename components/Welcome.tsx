import React from 'react';
import { Screen } from '../App';

interface WelcomeProps {
  onNavigate: (screen: Screen) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light font-display text-[#111418] flex flex-col min-h-screen items-center justify-center p-0 sm:p-4">
      <style>{`
        .float-slow {
            animation: float 8s ease-in-out infinite;
        }
        .float-medium {
            animation: float 6s ease-in-out infinite;
            animation-delay: 1s;
        }
        .float-fast {
            animation: float 4s ease-in-out infinite;
            animation-delay: 2s;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }
      `}</style>
      <div className="w-full max-w-md bg-white h-[100dvh] sm:h-auto sm:min-h-[800px] sm:rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col">
        <div className="relative h-[55%] w-full overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white">
          <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-blue-100/50 rounded-full blur-3xl"></div>
          <div className="absolute top-[30%] left-[-20%] w-60 h-60 bg-indigo-50/50 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-10 right-[-10px] opacity-60 float-slow">
              <span className="material-symbols-outlined text-blue-200 text-9xl" style={{ fontSize: '140px', fontWeight: 200 }}>cloud</span>
            </div>
            <div className="absolute bottom-12 left-[-30px] opacity-40 float-medium">
              <span className="material-symbols-outlined text-blue-200 text-9xl" style={{ fontSize: '160px', fontWeight: 200 }}>cloud</span>
            </div>
            <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 float-medium">
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-blue-900/20 blur-xl rounded-full transform scale-y-50"></div>
              <span className="material-symbols-outlined text-primary text-9xl transform -rotate-12 drop-shadow-2xl" style={{ fontSize: '130px', fontVariationSettings: "'FILL' 1" }}>folder</span>
            </div>
            <div className="absolute top-[30%] left-[15%] opacity-70 float-fast">
              <span className="material-symbols-outlined text-blue-400 text-7xl transform rotate-6" style={{ fontSize: '70px', fontVariationSettings: "'FILL' 1" }}>folder_open</span>
            </div>
            <div className="absolute bottom-[30%] left-[20%] w-3 h-3 border-2 border-blue-300 rounded-full opacity-50"></div>
            <div className="absolute top-[20%] right-[30%] w-2 h-2 bg-blue-500 rounded-full opacity-40"></div>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-8 pb-10 pt-2 z-20 bg-white rounded-t-[2rem]">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">public</span>
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">Atlas Services</span>
          </div>
          <div className="mb-auto">
            <h1 className="text-4xl sm:text-[2.5rem] font-bold text-primary leading-[1.1] mb-4 tracking-tight">
              Controle tudo na palma da mão
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Gerencie serviços, clientes e equipamentos com facilidade e segurança.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-4 relative z-30">
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="w-full bg-primary hover:bg-[#082046] active:bg-[#051530] text-white font-bold text-lg h-14 rounded-full shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center"
            >
              Começar
            </button>
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-[#8A8F98] text-sm font-medium text-center hover:underline"
            >
              Esqueci minha senha
            </button>
            <div className="text-center flex items-center justify-center gap-1.5">
              <span className="text-slate-500 text-sm">Já tem uma conta?</span>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-primary font-bold text-sm hover:underline"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};