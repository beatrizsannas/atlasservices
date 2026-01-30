import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our Dashboard Cache
interface DashboardData {
    scheduled: number;
    completed: number;
    monthlyStats: { label: string; count: number; revenue: number; fullDate: string }[];
    agendaItems: any[];
    lastUpdated: number; // to allow forceful refresh if needed
}

// Define the shape of our Quotes Cache
interface QuoteData {
    id: string;
    client: string;
    date: string;
    value: string;
    status: string;
    statusColor: string;
    rawStatus: string;
}

interface QuotesCache {
    data: QuoteData[];
    lastUpdated: number;
}

interface CacheContextType {
    dashboardData: DashboardData | null;
    setDashboardData: (data: DashboardData) => void;

    quotesCache: QuotesCache | null;
    setQuotesCache: (data: QuoteData[]) => void;

    // Helpers
    isStale: (lastUpdated: number, durationMinutes?: number) => boolean;
    invalidateCache: (key: 'dashboard' | 'quotes' | 'all') => void;
    clearCache: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dashboardData, setDashboardDataState] = useState<DashboardData | null>(null);
    const [quotesCache, setQuotesCacheState] = useState<QuotesCache | null>(null);

    const setDashboardData = (data: DashboardData) => {
        setDashboardDataState(data);
    };

    const setQuotesCache = (data: QuoteData[]) => {
        setQuotesCacheState({
            data,
            lastUpdated: Date.now()
        });
    };

    const isStale = (lastUpdated: number, durationMinutes: number = 5) => {
        const now = Date.now();
        const diff = now - lastUpdated;
        return diff > durationMinutes * 60 * 1000;
    };

    const invalidateCache = (key: 'dashboard' | 'quotes' | 'all') => {
        if (key === 'dashboard' || key === 'all') setDashboardDataState(null);
        if (key === 'quotes' || key === 'all') setQuotesCacheState(null);
    };

    const clearCache = () => {
        setDashboardDataState(null);
        setQuotesCacheState(null);
    };

    return (
        <CacheContext.Provider value={{
            dashboardData,
            setDashboardData,
            quotesCache,
            setQuotesCache,
            isStale,
            invalidateCache,
            clearCache
        }}>
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
