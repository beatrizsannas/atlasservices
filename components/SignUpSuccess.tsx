import React, { useEffect } from 'react';

interface SignUpSuccessProps {
    onContinue: () => void;
}

export const SignUpSuccess: React.FC<SignUpSuccessProps> = ({ onContinue }) => {
    // Auto-redirect after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onContinue();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onContinue]);

    return (
        <div className="bg-background-light font-display text-[#111418] flex flex-col min-h-screen items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-md bg-white h-[100dvh] sm:h-auto sm:min-h-[600px] sm:rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center px-8 sm:px-12 w-full text-center">
                    {/* Animated Icon */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20 duration-1000"></div>
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center relative z-10 shadow-sm border border-green-100">
                            <span className="material-symbols-outlined text-5xl text-green-500 animate-[bounce_1s_infinite]">check_circle</span>
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4 tracking-tight">
                        Tudo Pronto!
                    </h1>

                    <p className="text-slate-500 text-base leading-relaxed mb-10">
                        Sua conta foi criada com sucesso.<br />
                        Você será redirecionado em instantes para configurar seu perfil.
                    </p>

                    <button
                        onClick={onContinue}
                        className="mt-12 text-primary font-bold hover:underline"
                    >
                        Pular introdução
                    </button>
                </div>

                {/* Loading Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100">
                    <div className="h-full bg-primary animate-[loading_5s_linear_forwards]"></div>
                </div>
            </div>
        </div>
    );
};