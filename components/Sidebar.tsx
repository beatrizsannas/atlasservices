import React, { useEffect, useState } from 'react';
import { Screen } from '../App';
import { supabase } from '../supabaseClient';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const [profile, setProfile] = useState({ name: 'Usuário', role: 'Freelancer', avatar_url: '' });

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  }

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from('profiles').select('full_name, avatar_url, role').eq('id', user.id).single();

      if (data) {
        setProfile({
          name: data.full_name || 'Usuário',
          role: data.role || 'Freelancer',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching sidebar profile:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }

    // Listen for custom update event
    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-100 bg-background-light">
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-full bg-cover bg-center border-2 border-white shadow-md bg-white flex items-center justify-center text-[#111418] font-bold text-lg"
              style={profile.avatar_url ? { backgroundImage: `url("${profile.avatar_url}")` } : {}}
            >
              {!profile.avatar_url && getInitials(profile.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary leading-tight">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.role}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <MenuItem icon="calendar_month" label="Agenda" onClick={() => onNavigate('schedule')} />
          <MenuItem icon="build" label="Serviços" onClick={() => onNavigate('services')} />
          <MenuItem icon="group" label="Clientes" onClick={() => onNavigate('clients')} />
          <MenuItem icon="handyman" label="Equipamentos" onClick={() => onNavigate('inventory')} />
          <MenuItem icon="payments" label="Financeiro" onClick={() => onNavigate('finance')} />
          <MenuItem icon="request_quote" label="Orçamento" onClick={() => onNavigate('quotes')} />
          <MenuItem icon="settings" label="Ajustes" onClick={() => onNavigate('settings')} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 pb-safe">
          <button
            onClick={() => onNavigate('login')}
            className="flex w-full items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-gray-500 hover:text-red-600"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface MenuItemProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 text-left"
  >
    <span className="material-symbols-outlined text-primary">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);