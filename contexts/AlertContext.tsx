import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertDialog, AlertType } from '../components/ui/AlertDialog';

interface AlertContextType {
    showAlert: (title: string, message: string, type?: AlertType) => Promise<void>;
    showConfirm: (title: string, message: string) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: AlertType;
        resolve?: (value: boolean) => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
    });

    const showAlert = useCallback((title: string, message: string, type: AlertType = 'info') => {
        return new Promise<void>((resolve) => {
            setState({
                isOpen: true,
                title,
                message,
                type,
                resolve: () => resolve(), // Resolves immediately on close for basic alerts
            });
        });
    }, []);

    const showConfirm = useCallback((title: string, message: string) => {
        return new Promise<boolean>((resolve) => {
            setState({
                isOpen: true,
                title,
                message,
                type: 'confirm',
                resolve,
            });
        });
    }, []);

    const handleClose = (result: boolean) => {
        if (state.resolve) {
            state.resolve(result);
        }
        setState((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            <AlertDialog
                isOpen={state.isOpen}
                title={state.title}
                message={state.message}
                type={state.type}
                onConfirm={() => handleClose(true)}
                onCancel={() => handleClose(false)}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
