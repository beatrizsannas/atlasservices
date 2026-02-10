import React, { Suspense } from 'react';

interface LoadingFallbackProps {
    variant?: 'fullscreen' | 'inline';
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ variant = 'fullscreen' }) => {
    if (variant === 'fullscreen') {
        return (
            <div className="fixed inset-0 bg-[#0B2A5B] flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-white text-6xl animate-spin">progress_activity</span>
                    <p className="text-white text-lg font-medium">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-10">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
        </div>
    );
};

// Wrapper component for easy Suspense usage
export const LazyLoadBoundary: React.FC<{
    children: React.ReactNode;
    fallback?: React.ReactNode;
    variant?: 'fullscreen' | 'inline';
}> = ({ children, fallback, variant = 'fullscreen' }) => {
    return (
        <Suspense fallback={fallback || <LoadingFallback variant={variant} />}>
            {children}
        </Suspense>
    );
};
