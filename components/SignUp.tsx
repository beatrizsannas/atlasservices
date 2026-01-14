import React, { useState } from 'react';
import { Screen } from '../App';
import { supabase } from '../supabaseClient';

interface SignUpProps {
  onNavigate: (screen: Screen) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        onNavigate('signup-success');
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar a conta. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light font-display text-[#111418] flex flex-col min-h-screen items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white h-[100dvh] sm:h-auto sm:min-h-[800px] sm:rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="pt-12 pb-2 px-6 flex items-center relative z-20">
          <button
            onClick={() => onNavigate('welcome')}
            className="w-10 h-10 -ml-2 rounded-full hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center transition-colors text-slate-700"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-primary ml-2 tracking-tight">Criar Conta</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 relative z-10 flex flex-col">
          <div className="mb-6">
            <p className="text-slate-500 text-sm leading-relaxed">
              Preencha os dados abaixo para começar a gerenciar seus serviços com Atlas Services.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSignUp}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">person</span>
                </div>
                <input
                  name="fullName"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-[15px]"
                  placeholder="Ex: Maria Silva"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                </div>
                <input
                  name="email"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-[15px]"
                  placeholder="seu@email.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                </div>
                <input
                  name="password"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-[15px]"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Confirmar Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">lock_reset</span>
                </div>
                <input
                  name="confirmPassword"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-[15px]"
                  placeholder="••••••••"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2 px-1">
              <div className="flex items-center h-5">
                <input className="custom-checkbox w-5 h-5 border-slate-300 rounded focus:ring-primary text-primary transition-colors cursor-pointer" id="terms" type="checkbox" required />
              </div>
              <label className="text-sm text-slate-600 leading-tight cursor-pointer" htmlFor="terms">
                Aceito os <a className="font-bold text-primary hover:underline" href="#">Termos e Condições</a> e a Política de Privacidade.
              </label>
            </div>

            <div className="mt-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-[#082046] active:bg-[#051530] text-white font-bold text-lg h-14 rounded-full shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Criar Minha Conta'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 mb-4 text-center">
            <p className="text-slate-500 text-sm">
              Já tem uma conta?
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-primary hover:underline ml-1"
                disabled={loading}
              >
                Entrar
              </button>
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .custom-checkbox:checked {
          background-color: #0b2a5b;
          border-color: #0b2a5b;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};