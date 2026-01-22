import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface HeaderProps {
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const [userName, setUserName] = useState('Usuário');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data, error } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();

      if (data) {
        const firstName = data.full_name ? data.full_name.split(' ')[0] : 'Usuário';
        setUserName(firstName);
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
      } else if (error && error.code !== 'PGRST116') { // Allow 406 (none found)
        console.error('Error fetching header profile', error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md px-4 py-3 border-b border-gray-200 flex justify-between items-center transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onProfileClick}
          className="flex items-center justify-center p-1 rounded-full hover:bg-gray-200 text-gray-700 transition-colors mr-1"
          aria-label="Abrir menu"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>menu</span>
        </button>

        <div
          onClick={onProfileClick}
          className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity bg-gray-200"
          style={{ backgroundImage: avatarUrl ? `url("${avatarUrl}")` : undefined }}
          aria-label="Open sidebar"
        >
          {!avatarUrl && <span className="flex w-full h-full items-center justify-center text-gray-400 material-symbols-outlined text-sm">person</span>}
        </div>
        <div onClick={onProfileClick} className="cursor-pointer">
          <h1 className="text-sm font-medium text-gray-500">Atlas Services</h1>
          <h2 className="text-primary font-bold text-lg leading-none">Olá, {userName}</h2>
        </div>
      </div>
      <button className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>notifications</span>
      </button>
    </div>
  );
};