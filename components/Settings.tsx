import React, { useEffect, useState } from 'react';
import { Screen } from '../App';
import { supabase } from '../supabaseClient';

interface SettingsProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onNavigate }) => {
  const [profile, setProfile] = useState({ name: 'Usuário', email: 'email@exemplo.com', avatar_url: '' });

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();

      if (data) {
        setProfile({
          name: data.full_name || 'Usuário',
          email: user.email || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Listen for custom update event
    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background-light">
      <header className="flex items-center bg-white px-4 py-3 justify-between sticky top-0 z-10 border-b border-gray-100">
        <button
          onClick={onBack}
          className="text-primary flex h-10 w-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-[#111418] text-base font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10 font-display">
          Ajustes e Perfil
        </h2>
      </header>

      <main className="flex-1">
        <div className="px-4 mt-4 mb-4">
          <div className="flex px-5 py-6 flex-col items-center bg-white shadow-sm rounded-xl border border-gray-100">
            <div className="relative mb-3 group cursor-pointer" onClick={() => onNavigate('user-profile')}>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 ring-4 ring-primary/10 bg-gray-200"
                style={{ backgroundImage: profile.avatar_url ? `url("${profile.avatar_url}")` : undefined }}
              >
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
                <span className="material-symbols-outlined text-xs">edit</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5">
              <p className="text-[#111418] text-lg font-bold leading-tight font-display">{profile.name}</p>
              <p className="text-[#637188] text-xs font-normal leading-normal text-center">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="px-4 mb-2">
          <h3 className="text-[#637188] text-[10px] font-bold uppercase tracking-wider px-2 pb-2">Conta e Negócio</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <SettingsItem
              icon="person"
              label="Perfil do usuário"
              onClick={() => onNavigate('user-profile')}
            />
            <div className="h-px bg-gray-100 mx-12"></div>
            <SettingsItem
              icon="business_center"
              label="Dados da empresa"
              onClick={() => onNavigate('company-details')}
            />
            <div className="h-px bg-gray-100 mx-12"></div>
            <SettingsItem
              icon="diamond"
              label="Assinatura"
              onClick={() => onNavigate('premium')}
            />
          </div>
        </div>

        <div className="px-4 mt-4 mb-2">
          <h3 className="text-[#637188] text-[10px] font-bold uppercase tracking-wider px-2 pb-2">Aplicativo</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <SettingsItem icon="tune" label="Preferências do app" />
            <div className="h-px bg-gray-100 mx-12"></div>
            <SettingsItem icon="notifications" label="Notificações" />
            <div className="h-px bg-gray-100 mx-12"></div>
            <SettingsItem icon="security" label="Segurança" />
          </div>
        </div>

        <div className="px-4 mt-6">
          <button
            onClick={() => onNavigate('login')}
            className="w-full bg-white hover:bg-red-50 border border-transparent active:scale-[0.98] transition-all rounded-xl py-3 flex items-center justify-center gap-2 group shadow-sm"
          >
            <span className="material-symbols-outlined text-red-500 group-hover:text-red-600 text-[20px]">logout</span>
            <span className="text-red-500 group-hover:text-red-600 font-semibold text-sm font-display">Sair da conta</span>
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4 font-display">Versão 2.4.0</p>
        </div>
      </main>
    </div>
  );
};

const SettingsItem: React.FC<{ icon: string; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group"
  >
    <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 h-8 w-8 group-hover:bg-primary group-hover:text-white transition-colors">
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[#111418] text-sm font-medium leading-normal truncate font-display">{label}</p>
    </div>
    <div className="text-[#9ca3af] flex h-6 w-6 items-center justify-center">
      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
    </div>
  </div>
);