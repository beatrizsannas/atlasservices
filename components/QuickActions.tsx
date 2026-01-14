import React from 'react';
import { Screen } from '../App';

interface QuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: Screen) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0B2A5B]/20 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full bg-white rounded-t-[32px] shadow-2xl overflow-hidden pb-safe animate-slide-up">
        <div className="flex flex-col p-6 pt-4">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 cursor-grab" onClick={onClose}></div>

          <div className="flex flex-col gap-4">
            <ActionItem
              icon="calendar_add_on"
              title="Agendar"
              subtitle="Novo serviço na agenda"
              onClick={() => {
                if (onNavigate) onNavigate('new-appointment');
              }}
            />
            <ActionItem
              icon="person_add"
              title="Cadastrar Cliente"
              subtitle="Adicionar novo contato"
              onClick={() => {
                if (onNavigate) onNavigate('new-client');
              }}
            />
            <ActionItem
              icon="request_quote"
              title="Fazer Orçamento"
              subtitle="Criar proposta comercial"
              onClick={() => {
                if (onNavigate) onNavigate('new-quote');
              }}
            />
          </div>

          <button
            onClick={onClose}
            className="mt-6 mb-2 w-full py-4 flex flex-col items-center justify-center text-gray-400 hover:text-primary transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mb-1 group-active:bg-gray-100">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
            </div>
            <span className="text-xs font-medium">Cancelar</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

interface ActionItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon, title, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 w-full p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-primary/20 active:scale-[0.98] active:bg-gray-50 transition-all group"
  >
    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{icon}</span>
    </div>
    <div className="flex flex-col items-start">
      <span className="text-lg font-bold text-primary group-hover:text-primary transition-colors">{title}</span>
      <span className="text-xs font-medium text-gray-400">{subtitle}</span>
    </div>
    <span className="material-symbols-outlined text-gray-300 ml-auto group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>chevron_right</span>
  </button>
);