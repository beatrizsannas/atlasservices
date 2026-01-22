import React, { useEffect, useState } from 'react';

export type AlertType = 'success' | 'error' | 'info' | 'warning' | 'confirm';

interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
    onConfirm: () => void;
    onCancel: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, title, message, type, onConfirm, onCancel }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !show) return null;

    const isConfirm = type === 'confirm';
    const isError = type === 'error';
    const isSuccess = type === 'success';

    let iconName = 'info';
    let iconColor = 'text-blue-500';
    let bgColor = 'bg-blue-50';
    let btnColor = 'bg-blue-600 hover:bg-blue-700';

    if (isSuccess) {
        iconName = 'check_circle';
        iconColor = 'text-emerald-500';
        bgColor = 'bg-emerald-50';
        btnColor = 'bg-emerald-600 hover:bg-emerald-700';
    } else if (isError) {
        iconName = 'error';
        iconColor = 'text-red-500';
        bgColor = 'bg-red-50';
        btnColor = 'bg-red-600 hover:bg-red-700';
    } else if (isConfirm) {
        iconName = 'help';
        iconColor = 'text-[#0B2A5B]';
        bgColor = 'bg-[#0B2A5B]/10';
        btnColor = 'bg-[#0B2A5B] hover:bg-[#09224a]';
    }

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}></div>
            <div
                className={`bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 relative z-10 transform transition-all duration-200 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                <div className="flex flex-col items-center text-center">
                    <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
                        <span className={`material-symbols-outlined ${iconColor} text-[28px]`}>{iconName}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#111418] mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">{message}</p>

                    <div className="flex gap-3 w-full">
                        {isConfirm && (
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 text-gray-700 font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] ${btnColor}`}
                        >
                            {isConfirm ? 'Confirmar' : 'OK'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
