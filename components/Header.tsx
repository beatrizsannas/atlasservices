import React from 'react';

interface HeaderProps {
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
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
          className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAV-TgHwClQjQE4-PusmBFfOT0WrXzYMhQ3WVNOlkvadY8aclH8kiSiUz1NNuvjiTv9HwWSWx0YMGeFH8uBHKjbWUxlzaBdkjyb2FBP3MZdd45YOrByKxpvK_BLWO11Z8GnmzId8ZkkL5sv9OlAHuGALUg_eKAe3xgip20rZKbqNvSsp5Xfdwgdvibj7tM1gNFrH4suuu9bayiIhYNHG-FXC5XsWQzX5zi7v0aJ7KRY_ETz8rvp4oMngkO_dzyvfhqrvIp_ccevOoQU")' }}
          aria-label="Open sidebar"
        />
        <div onClick={onProfileClick} className="cursor-pointer">
          <h1 className="text-sm font-medium text-gray-500">Atlas Services</h1>
          <h2 className="text-primary font-bold text-lg leading-none">Olá, João</h2>
        </div>
      </div>
      <button className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition-colors">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>notifications</span>
      </button>
    </div>
  );
};