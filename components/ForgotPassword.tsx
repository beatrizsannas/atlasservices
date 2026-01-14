import React from 'react';
import { Screen } from '../App';

interface ForgotPasswordProps {
  onNavigate: (screen: Screen) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light font-display text-[#111418] flex flex-col min-h-screen items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white h-[100dvh] sm:h-auto sm:min-h-[600px] sm:rounded-[20px] shadow-2xl relative overflow-hidden flex flex-col p-6 sm:p-8">
        <div className="flex items-center pt-2 pb-6">
          <button
            onClick={() => onNavigate('login')}
            className="group p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-primary text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-start pt-4">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 tracking-tight">Recuperar Senha</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Insira seu e-mail para receber as instruções de recuperação.
            </p>
          </div>
          <form action="#" className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary ml-1" htmlFor="email">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400">mail</span>
                </div>
                <input
                  className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                  id="email"
                  name="email"
                  placeholder="exemplo@email.com"
                  required
                  type="email"
                />
              </div>
            </div>
            <div className="pt-6">
              <button
                className="w-full bg-primary hover:bg-[#082046] active:bg-[#051530] text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                type="submit"
              >
                Enviar Link
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};