import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our Dashboard Cache
interface DashboardData {
    scheduled: number;
    completed: number;
    monthlyStats: { label: string; count: number; revenue: number; fullDate: string }[];
    agendaItems: any[];
    lastUpdated: number;
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

// Define the shape of our Schedules Cache
interface SchedulesCache {
    data: any[];
    lastUpdated: number;
    activeTab?: string;
}

// Define the shape of our Clients Cache
interface ClientsCache {
    data: any[];
    lastUpdated: number;
}

// Define the shape of our Inventory Cache
interface InventoryCache {
    data: any[];
    lastUpdated: number;
}

// Define the shape of our Finance Cache
interface FinanceCache {
    data: any[];
    lastUpdated: number;
}

type CacheKey = 'dashboard' | 'quotes' | 'schedules' | 'clients' | 'inventory' | 'finance' | 'all';

interface CacheContextType {
    dashboardData: DashboardData | null;
    setDashboardData: (data: DashboardData) => void;

    quotesCache: QuotesCache | null;
    setQuotesCache: (data: QuoteData[]) => void;

    schedulesCache: SchedulesCache | null;
    setSchedulesCache: (data: any[], activeTab?: string) => void;

    clientsCache: ClientsCache | null;
    setClientsCache: (data: any[]) => void;

    inventoryCache: InventoryCache | null;
    setInventoryCache: (data: any[]) => void;

    financeCache: FinanceCache | null;
    setFinanceCache: (data: any[]) => void;

    // Helpers
    isStale: (lastUpdated: number, durationMinutes?: number) => boolean;
    invalidateCache: (key: CacheKey) => void;
    clearCache: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dashboardData, setDashboardDataState] = useState<DashboardData | null>(null);
    const [quotesCache, setQuotesCacheState] = useState<QuotesCache | null>(null);
    const [schedulesCache, setSchedulesCacheState] = useState<SchedulesCache | null>(null);
    const [clientsCache, setClientsCacheState] = useState<ClientsCache | null>(null);
    const [inventoryCache, setInventoryCacheState] = useState<InventoryCache | null>(null);
    const [financeCache, setFinanceCacheState] = useState<FinanceCache | null>(null);

    const setDashboardData = (data: DashboardData) => {
        setDashboardDataState(data);
    };

    const setQuotesCache = (data: QuoteData[]) => {
        setQuotesCacheState({
            data,
            lastUpdated: Date.now()
        });
    };

    const setSchedulesCache = (data: any[], activeTab?: string) => {
        setSchedulesCacheState({
            data,
            lastUpdated: Date.now(),
            activeTab
        });
    };

    const setClientsCache = (data: any[]) => {
        setClientsCacheState({
            data,
            lastUpdated: Date.now()
        });
    };

    const setInventoryCache = (data: any[]) => {
        setInventoryCacheState({
            data,
            lastUpdated: Date.now()
        });
    };

    const setFinanceCache = (data: any[]) => {
        setFinanceCacheState({
            data,
            lastUpdated: Date.now()
        });
    };

    const isStale = (lastUpdated: number, durationMinutes: number = 5) => {
        const now = Date.now();
        const diff = now - lastUpdated;
        return diff > durationMinutes * 60 * 1000;
    };

    const invalidateCache = (key: CacheKey) => {
        if (key === 'dashboard' || key === 'all') setDashboardDataState(null);
        if (key === 'quotes' || key === 'all') setQuotesCacheState(null);
        if (key === 'schedules' || key === 'all') setSchedulesCacheState(null);
        if (key === 'clients' || key === 'all') setClientsCacheState(null);
        if (key === 'inventory' || key === 'all') setInventoryCacheState(null);
        if (key === 'finance' || key === 'all') setFinanceCacheState(null);
    };

    const clearCache = () => {
        setDashboardDataState(null);
        setQuotesCacheState(null);
        setSchedulesCacheState(null);
        setClientsCacheState(null);
        setInventoryCacheState(null);
        setFinanceCacheState(null);
    };

    return (
        <CacheContext.Provider value={{
            dashboardData,
            setDashboardData,
            quotesCache,
            setQuotesCache,
            schedulesCache,
            setSchedulesCache,
            clientsCache,
            setClientsCache,
            inventoryCache,
            setInventoryCache,
            financeCache,
            setFinanceCache,
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
