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

    // Listen for custom update event
    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
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

  /* Helper */
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
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
          className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity bg-white flex items-center justify-center text-[#111418] font-bold text-sm"
          style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : {}}
        >
          {!avatarUrl && getInitials(userName)}
        </div>

        <div onClick={onProfileClick} className="flex flex-col cursor-pointer">
          <span className="text-xs text-gray-400 font-medium">Olá,</span>
          <span className="text-[#111418] font-bold text-base leading-none">{userName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications removed as requested */}
      </div>
    </div>
  );
};