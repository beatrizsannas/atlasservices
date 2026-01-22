import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface ClientsProps {
  onClientClick: () => void;
  onBack: () => void;
  onNewClient?: () => void;
  onEditClient?: (id: string) => void;
}

// ...

export const Clients: React.FC<ClientsProps> = ({ onClientClick, onBack, onNewClient, onEditClient }) => {
  // ...
  <div className="text-center py-10 text-gray-500">Nenhum cliente encontrado.</div>
        ) : (
  filteredClients.map(client => (
    <ClientCard
      key={client.id}
      name={client.name}
      phone={client.phone}
      onClick={onClientClick}
      onDelete={(e) => handleDelete(e, client.id)}
      onEdit={(e) => {
        e.stopPropagation();
        if (onEditClient) onEditClient(client.id);
      }}
    />
  ))
)}
// ...
interface ClientCardProps {
  name: string;
  phone: string;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ name, phone, onClick, onDelete, onEdit }) => (
// ...
        <button
          className="text-[#0B2A5B] hover:opacity-80 transition-opacity p-1"
          onClick={onEdit}
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button
          className="text-[#8A8F98] hover:opacity-80 transition-opacity p-1"
          onClick={onDelete}
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div >
    </div >
  </div >
);