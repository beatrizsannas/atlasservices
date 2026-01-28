
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our Dashboard Cache
interface DashboardData {
    scheduled: number;
    completed: number;
    monthlyStats: { label: string; count: number; fullDate: string }[];
    agendaItems: any[];
    lastUpdated: number; // to allow forceful refresh if needed
}

interface CacheContextType {
    dashboardData: DashboardData | null;
    setDashboardData: (data: DashboardData) => void;
    // We can add schedule cache later if needed
    clearCache: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    const clearCache = () => {
        setDashboardData(null);
    };

    return (
        <CacheContext.Provider value={{ dashboardData, setDashboardData, clearCache }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => {
    const context = useContext(CacheContext);
    if (context === undefined) {
        throw new Error('useCache must be used within a CacheProvider');
    }
    return context;
};
