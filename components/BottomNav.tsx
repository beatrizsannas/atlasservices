import React from 'react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onOpenQuickActions: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, onOpenQuickActions }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="relative w-full h-[70px] flex items-end justify-between px-6 pb-2">
        {/* Floating Add Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button
            onClick={onOpenQuickActions}
            className="h-14 w-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all ring-4 ring-background-light"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add</span>
          </button>
        </div>

        <div className="flex gap-8">
          <NavButton
            icon="dashboard"
            label="Início"
            active={currentScreen === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
          <NavButton
            icon="calendar_month"
            label="Agenda"
            active={currentScreen === 'schedule'}
            onClick={() => onNavigate('schedule')}
          />
        </div>

        <div className="flex gap-8">
          <NavButton
            icon="group"
            label="Clientes"
            active={currentScreen === 'clients'}
            onClick={() => onNavigate('clients')}
          />
          <NavButton
            icon="settings"
            label="Ajustes"
            active={currentScreen === 'settings'}
            onClick={() => onNavigate('settings')}
          />
        </div>
      </div>
    </nav>
  );
};

const NavButton: React.FC<{ icon: string; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 w-12 group"
  >
    <span className={`material-symbols-outlined transition-colors ${active ? 'text-primary filled' : 'text-gray-400 group-hover:text-primary'}`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
      {icon}
    </span>
    <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary font-semibold' : 'text-gray-400 group-hover:text-primary'}`}>
      {label}
    </span>
  </button>
);