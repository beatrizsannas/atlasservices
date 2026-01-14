import React, { useState } from 'react';
import { Screen } from '../App';
import { supabase } from '../supabaseClient';

interface LoginProps {
  onNavigate: (screen: Screen) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        onNavigate('dashboard');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light text-[#111418] font-display flex flex-col items-center justify-center min-h-screen relative px-4 py-8">
      <button
        onClick={() => onNavigate('welcome')}
        className="absolute top-6 left-6 p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors text-slate-600"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <div className="w-full max-w-[340px] flex flex-col items-center mb-8">
        <div className="w-20 h-20 mb-5 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-blue-900/10">
          <span className="material-symbols-outlined text-white text-[40px]">business_center</span>
        </div>
        <h2 className="text-primary font-extrabold text-2xl tracking-tight text-center">
          Atlas Services
        </h2>
      </div>
      <div className="w-full max-w-[340px] bg-white rounded-[20px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#111418]" htmlFor="email">
              E-mail
            </label>
            <div className="relative">
              <input
                className="w-full h-12 pl-4 pr-4 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-base text-slate-900 placeholder-gray-400 font-display"
                id="email"
                placeholder="seu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#111418]" htmlFor="password">
              Senha
            </label>
            <div className="relative group">
              <input
                className="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-base text-slate-900 placeholder-gray-400 font-display"
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-sm text-[#8A8F98] hover:text-primary transition-colors font-medium"
              disabled={loading}
            >
              Esqueci minha senha
            </button>
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-[#082046] active:bg-[#051530] text-white font-bold rounded-xl shadow-lg shadow-blue-900/10 transition-transform active:scale-[0.98] flex items-center justify-center text-base tracking-wide mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Ainda não tem conta?
            <button
              onClick={() => onNavigate('signup')}
              className="font-bold text-primary hover:underline ml-1"
              disabled={loading}
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};