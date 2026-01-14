import React, { useState } from 'react';
import { Screen } from '../App';

interface NewPasswordProps {
  onNavigate: (screen: Screen) => void;
}

export const NewPassword: React.FC<NewPasswordProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <div className="bg-[#F2F3F5] dark:bg-background-dark text-[#111418] dark:text-white font-display flex flex-col min-h-screen relative">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
          <div className="bg-white dark:bg-[#1e2736] rounded-[20px] shadow-2xl w-full max-w-[320px] p-6 flex flex-col items-center text-center transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
            <span 
              className="material-symbols-outlined text-[#8FD9F6] text-[64px] mb-3" 
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}
            >
              check_circle
            </span>
            <h3 className="text-[#0B2A5B] dark:text-white text-[22px] font-bold mb-2">
              Sucesso!
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Sua senha foi atualizada. Agora você pode entrar na sua conta.
            </p>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full h-12 bg-[#0B2A5B] hover:bg-[#082046] active:bg-[#051530] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center text-sm tracking-wide"
            >
              Ir para o Login
            </button>
          </div>
        </div>
      )}

      <header className="bg-[#0B2A5B] text-white pt-safe pb-4 px-4 shadow-lg z-10 sticky top-0 h-24 flex flex-col justify-end">
        <div className="flex items-center justify-between relative max-w-md mx-auto w-full">
          <button 
            onClick={() => onNavigate('login')}
            aria-label="Voltar" 
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:bg-white/20"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">Nova Senha</h1>
          <div className="w-10"></div> 
        </div>
      </header>

      <main className={`flex-1 flex flex-col items-center justify-start p-4 pt-6 sm:pt-10 w-full transition-all duration-300 ${showSuccess ? 'blur-[2px]' : ''}`}>
        <div className="w-full max-w-md bg-white dark:bg-[#1e2736] rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#111418] dark:text-white tracking-tight">Crie sua nova senha</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Sua senha deve ter pelo menos 8 caracteres</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#111418] dark:text-gray-200" htmlFor="new-password">
                Nova Senha
              </label>
              <div className="relative group">
                <input 
                  className="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:border-[#0B2A5B] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#0B2A5B] dark:focus:ring-blue-400 outline-none transition-all text-base placeholder-gray-400 text-slate-900 dark:text-white" 
                  id="new-password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                />
                <button 
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-[#0B2A5B] dark:hover:text-blue-400 transition-colors focus:outline-none" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#111418] dark:text-gray-200" htmlFor="confirm-password">
                Confirmar Nova Senha
              </label>
              <div className="relative group">
                <input 
                  className="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:border-[#0B2A5B] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#0B2A5B] dark:focus:ring-blue-400 outline-none transition-all text-base placeholder-gray-400 text-slate-900 dark:text-white" 
                  id="confirm-password" 
                  placeholder="••••••••" 
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                />
                <button 
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-[#0B2A5B] dark:hover:text-blue-400 transition-colors focus:outline-none" 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button 
                className="w-full h-14 bg-[#0B2A5B] hover:bg-[#082046] active:bg-[#051530] text-white font-bold rounded-xl shadow-lg shadow-blue-900/10 transition-transform active:scale-[0.98] flex items-center justify-center text-base tracking-wide"
                type="submit"
              >
                Atualizar Senha
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};