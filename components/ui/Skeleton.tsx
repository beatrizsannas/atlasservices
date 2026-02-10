import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height,
    animation = 'pulse'
}) => {
    const baseClasses = 'bg-gray-200';

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: ''
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '1em' : undefined)
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
        />
    );
};

// Card Skeleton - for list items  
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-white p-4 rounded-xl border border-gray-100 ${className}`}>
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
                <Skeleton variant="rectangular" width={64} height={64} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                    <div className="flex gap-2 mt-3">
                        <Skeleton variant="rectangular" width={60} height={24} />
                        <Skeleton variant="rectangular" width={80} height={24} />
                    </div>
                </div>
            </div>
            <Skeleton variant="circular" width={24} height={24} />
        </div>
    </div>
);

// List Skeleton - for multiple cards
export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({
    count = 3,
    className = ''
}) => (
    <div className={`flex flex-col gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} />
        ))}
    </div>
);

// Dashboard Summary Skeleton
export const SkeletonDashboardSummary: React.FC = () => (
    <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100">
            <Skeleton variant="circular" width={32} height={32} className="mb-3" />
            <Skeleton variant="text" width={50} height={32} className="mb-2" />
            <Skeleton variant="text" width="80%" height={16} />
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100">
            <Skeleton variant="circular" width={32} height={32} className="mb-3" />
            <Skeleton variant="text" width={50} height={32} className="mb-2" />
            <Skeleton variant="text" width="80%" height={16} />
        </div>
    </div>
);

// Appointment Card Skeleton
export const SkeletonAppointment: React.FC = () => (
    <div className="bg-white p-5 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
            <Skeleton variant="rectangular" width={80} height={24} />
            <Skeleton variant="text" width={60} height={14} />
        </div>
        <div className="flex items-center gap-3 mb-3">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={120} height={14} />
        </div>
        <Skeleton variant="text" width="90%" height={20} />
        <div className="mt-4 pt-4 border-t border-gray-100">
            <Skeleton variant="rectangular" width="100%" height={40} />
        </div>
    </div>
);

// Table Row Skeleton
export const SkeletonTableRow: React.FC = () => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100">
        <div className="flex items-center gap-4 flex-1">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="30%" height={12} />
            </div>
        </div>
        <Skeleton variant="text" width={80} height={20} />
    </div>
);
