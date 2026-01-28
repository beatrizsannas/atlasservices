import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface UserProfileProps {
    onBack: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {

    const getInitials = (name: string) => {
        if (!name) return '';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    }

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        cpf: '',
        avatar_url: ''
    });
    const { showAlert } = useAlert();

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // handle not logged in
                setLoading(false);
                return;
            }

            setEmail(user.email || '');

            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, phone, cpf, avatar_url')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setFormData({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    cpf: data.cpf || '',
                    avatar_url: data.avatar_url || ''
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                showAlert('Erro', 'Usuário não autenticado.', 'error');
                return;
            }

            const updates = {
                id: user.id,
                full_name: formData.full_name,
                phone: formData.phone,
                cpf: formData.cpf,
                avatar_url: formData.avatar_url,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;

            showAlert('Sucesso', 'Perfil atualizado com sucesso!', 'success');

            // Dispatch custom event to notify Sidebar/Header to refresh
            window.dispatchEvent(new Event('profile-updated'));

        } catch (error: any) {
            console.error('Error saving profile:', error);
            showAlert('Erro', 'Erro ao atualizar perfil: ' + error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-[#111418]">Carregando perfil...</div>;
    }

    return (
        <div className="bg-background-light text-[#111418] h-screen flex flex-col overflow-hidden font-display">
            <header className="flex items-center bg-primary p-4 pb-4 justify-between sticky top-0 z-10 shadow-md text-white">
                <button
                    onClick={onBack}
                    className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors -ml-2"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-8">
                    Perfil do usuário
                </h2>
            </header>

            <main className="flex-1 overflow-y-auto pb-8">
                <div className="flex flex-col items-center mt-8 mb-6">
                    <div className="relative group cursor-pointer">
                        {/* Avatar display - placeholder if empty */}
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 ring-4 ring-white shadow-md bg-white flex items-center justify-center text-[#111418] font-bold text-3xl"
                            style={formData.avatar_url ? { backgroundImage: `url("${formData.avatar_url}")` } : {}}
                        >
                            {!formData.avatar_url && (formData.full_name ? getInitials(formData.full_name) : <span className="material-symbols-outlined text-4xl text-gray-400">person</span>)}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </div>
                    </div>
                    {/* Image upload not fully implemented yet, just a button for now */}
                    <p className="mt-3 text-primary font-semibold text-sm cursor-pointer hover:underline" onClick={() => showAlert('Em breve', 'Funcionalidade de upload de imagem em breve!', 'info')}>Alterar foto</p>
                </div>

                <div className="px-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nome Completo</label>
                            <input
                                className="w-full text-[#111418] font-medium text-base border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400"
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Seu nome completo"
                            />
                        </div>
                        <div className="p-4 border-b border-gray-100 opacity-60 bg-gray-50">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">E-mail (não editável)</label>
                            <input
                                className="w-full text-[#111418] font-medium text-base border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400 cursor-not-allowed"
                                type="email"
                                value={email}
                                disabled
                            />
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Telefone</label>
                            <input
                                className="w-full text-[#111418] font-medium text-base border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        <div className="p-4">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">CPF</label>
                            <input
                                className="w-full text-[#111418] font-medium text-base border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400"
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                            />
                        </div>
                    </div>

                    <div className="mt-8 mb-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#0d346b] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                            ) : (
                                <span className="material-symbols-outlined">save</span>
                            )}
                            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};