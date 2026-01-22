import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { supabase } from './supabaseClient';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { ClientDetails } from './components/ClientDetails';
import { Inventory } from './components/Inventory';
import { Quotes } from './components/Quotes';
import { NewQuote } from './components/NewQuote';
import { ViewQuote } from './components/ViewQuote';
import { QuoteAddItem } from './components/QuoteAddItem';
import { QuoteItemAvulso } from './components/QuoteItemAvulso';
import { QuoteSelectService } from './components/QuoteSelectService';
import { QuoteSelectEquipment } from './components/QuoteSelectEquipment';
import { Schedule } from './components/Schedule';
import { QuickActions } from './components/QuickActions';
import { Settings } from './components/Settings';
import { Premium } from './components/Premium';
import { NewPart } from './components/NewPart';
import { NewCategory } from './components/NewCategory';
import { CompanyDetails } from './components/CompanyDetails';
import { UserProfile } from './components/UserProfile';
import { NewAppointment } from './components/NewAppointment';
import { NewClient } from './components/NewClient';
import { Services, Service } from './components/Services';
import { NewService } from './components/NewService';
import { EditService } from './components/EditService';
import { AppointmentDetails } from './components/AppointmentDetails';
import { Finance } from './components/Finance';
import { NewTransaction } from './components/NewTransaction';
import { AdvancedFilter } from './components/AdvancedFilter';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { ForgotPassword } from './components/ForgotPassword';
import { EmailSentSuccess } from './components/EmailSentSuccess';
import { EmailSentError } from './components/EmailSentError';
import { NewPassword } from './components/NewPassword';
import { Welcome } from './components/Welcome';
import { SignUpSuccess } from './components/SignUpSuccess';
import { Reschedule } from './components/Reschedule';
import { MonthlyProgressScreen } from './components/MonthlyProgressScreen';

export type Screen = 'dashboard' | 'clients' | 'client-details' | 'inventory' | 'quotes' | 'new-quote' | 'quote-add-item' | 'quote-item-avulso' | 'quote-select-service' | 'quote-select-equipment' | 'view-quote' | 'schedule' | 'settings' | 'premium' | 'new-part' | 'new-category' | 'company-details' | 'user-profile' | 'new-appointment' | 'new-client' | 'services' | 'new-service' | 'edit-service' | 'appointment-details' | 'finance' | 'new-transaction' | 'advanced-filter' | 'login' | 'signup' | 'forgot-password' | 'email-sent-success' | 'email-sent-error' | 'new-password' | 'welcome' | 'signup-success' | 'reschedule' | 'monthly-progress';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [quoteValidityDate, setQuoteValidityDate] = useState('2023-11-24');
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

  const isAuthScreen = currentScreen === 'login' || currentScreen === 'signup' || currentScreen === 'forgot-password' || currentScreen === 'email-sent-success' || currentScreen === 'email-sent-error' || currentScreen === 'new-password' || currentScreen === 'welcome' || currentScreen === 'signup-success' || currentScreen === 'reschedule';

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentScreen('dashboard');
      }
      setIsLoadingSession(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session);
      if (session) {
        // If we have a session, ensuring we are on dashboard (or let specific logic handle deep links later)
        // For now, if we just logged in (SIGNED_IN), go to dashboard.
        if (event === 'SIGNED_IN') {
          setCurrentScreen('dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        // Only redirect to welcome if explicitly signed out
        setCurrentScreen('welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    closeSidebar();
    setIsQuickActionsOpen(false); // Close quick actions if navigating
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background-light relative">
      {!isAuthScreen && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'welcome' && (
        <Welcome onNavigate={handleNavigate} />
      )}

      {currentScreen === 'login' && (
        <Login onNavigate={handleNavigate} />
      )}

      {currentScreen === 'signup' && (
        <SignUp onNavigate={handleNavigate} />
      )}

      {currentScreen === 'signup-success' && (
        <SignUpSuccess onNavigate={handleNavigate} />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPassword onNavigate={handleNavigate} />
      )}

      {currentScreen === 'email-sent-success' && (
        <EmailSentSuccess onNavigate={handleNavigate} />
      )}

      {currentScreen === 'email-sent-error' && (
        <EmailSentError onNavigate={handleNavigate} />
      )}

      {currentScreen === 'new-password' && (
        <NewPassword onNavigate={handleNavigate} />
      )}

      {currentScreen === 'reschedule' && (
        <Reschedule onBack={() => handleNavigate('schedule')} />
      )}

      {currentScreen === 'dashboard' && (
        <>
          <Header onProfileClick={toggleSidebar} />
          <main className="flex flex-col gap-6 px-4 pt-6 pb-32">
            <Dashboard onNavigate={handleNavigate} />
          </main>
        </>
      )}

      {currentScreen === 'monthly-progress' && (
        <MonthlyProgressScreen
          onBack={() => handleNavigate('dashboard')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'schedule' && (
        <Schedule
          onNewAppointment={() => handleNavigate('new-appointment')}
          onAppointmentClick={() => handleNavigate('appointment-details')}
          onReschedule={() => handleNavigate('reschedule')}
          onBack={() => handleNavigate('dashboard')}
        />
      )}

      {currentScreen === 'new-appointment' && (
        <NewAppointment onBack={() => handleNavigate('schedule')} />
      )}

      {currentScreen === 'appointment-details' && (
        <AppointmentDetails
          onBack={() => handleNavigate('schedule')}
          onReschedule={() => handleNavigate('reschedule')}
        />
      )}

      {currentScreen === 'clients' && (
        <Clients
          onClientClick={() => handleNavigate('client-details')}
          onBack={() => handleNavigate('dashboard')}
          onNewClient={() => handleNavigate('new-client')}
        />
      )}

      {currentScreen === 'new-client' && (
        <NewClient onBack={() => handleNavigate('clients')} />
      )}

      {currentScreen === 'client-details' && (
        <ClientDetails onBack={() => handleNavigate('clients')} />
      )}

      {currentScreen === 'inventory' && (
        <Inventory
          onBack={() => handleNavigate('dashboard')}
          onNewPart={() => handleNavigate('new-part')}
        />
      )}

      {currentScreen === 'new-part' && (
        <NewPart
          onBack={() => handleNavigate('inventory')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'new-category' && (
        <NewCategory onBack={() => handleNavigate('new-part')} />
      )}

      {currentScreen === 'quotes' && (
        <Quotes
          onBack={() => handleNavigate('dashboard')}
          onNewQuote={() => handleNavigate('new-quote')}
          onFilter={() => handleNavigate('advanced-filter')}
        />
      )}

      {currentScreen === 'new-quote' && (
        <NewQuote
          onBack={() => handleNavigate('quotes')}
          onGenerate={(date: string, quoteId?: string) => {
            setQuoteValidityDate(date);
            if (quoteId) setCurrentQuoteId(quoteId);
            handleNavigate('view-quote');
          }}
          onAdd={() => handleNavigate('quote-add-item')}
        />
      )}

      {currentScreen === 'quote-add-item' && (
        <QuoteAddItem
          onBack={() => handleNavigate('new-quote')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'quote-item-avulso' && (
        <QuoteItemAvulso onBack={() => handleNavigate('quote-add-item')} />
      )}

      {currentScreen === 'quote-select-service' && (
        <QuoteSelectService onBack={() => handleNavigate('quote-add-item')} />
      )}

      {currentScreen === 'quote-select-equipment' && (
        <QuoteSelectEquipment onBack={() => handleNavigate('quote-add-item')} />
      )}

      {currentScreen === 'view-quote' && (
        <ViewQuote
          onBack={() => handleNavigate('new-quote')}
          validityDate={quoteValidityDate}
          quoteId={currentQuoteId || undefined}
        />
      )}

      {currentScreen === 'advanced-filter' && (
        <AdvancedFilter
          onBack={() => handleNavigate('quotes')}
          onApply={() => handleNavigate('quotes')}
        />
      )}

      {currentScreen === 'services' && (
        <Services
          onBack={() => handleNavigate('dashboard')}
          onNewService={() => handleNavigate('new-service')}
          onEditService={(service) => {
            setServiceToEdit(service);
            handleNavigate('edit-service');
          }}
        />
      )}

      {currentScreen === 'new-service' && (
        <NewService onBack={() => handleNavigate('services')} />
      )}

      {currentScreen === 'edit-service' && (
        <EditService
          onBack={() => {
            setServiceToEdit(null);
            handleNavigate('services');
          }}
          service={serviceToEdit}
        />
      )}

      {currentScreen === 'finance' && (
        <Finance
          onBack={() => handleNavigate('dashboard')}
          onNewTransaction={() => handleNavigate('new-transaction')}
        />
      )}

      {currentScreen === 'new-transaction' && (
        <NewTransaction onBack={() => handleNavigate('finance')} />
      )}

      {currentScreen === 'settings' && (
        <Settings
          onBack={() => handleNavigate('dashboard')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'premium' && (
        <Premium onBack={() => handleNavigate('settings')} />
      )}

      {currentScreen === 'company-details' && (
        <CompanyDetails onBack={() => handleNavigate('settings')} />
      )}

      {currentScreen === 'user-profile' && (
        <UserProfile onBack={() => handleNavigate('settings')} />
      )}

      {!isAuthScreen && (
        <QuickActions
          isOpen={isQuickActionsOpen}
          onClose={() => setIsQuickActionsOpen(false)}
          onNavigate={handleNavigate}
        />
      )}

      {!isAuthScreen && currentScreen !== 'view-quote' && currentScreen !== 'new-quote' && currentScreen !== 'premium' && currentScreen !== 'new-part' && currentScreen !== 'new-category' && currentScreen !== 'company-details' && currentScreen !== 'user-profile' && currentScreen !== 'new-appointment' && currentScreen !== 'new-client' && currentScreen !== 'services' && currentScreen !== 'new-service' && currentScreen !== 'edit-service' && currentScreen !== 'appointment-details' && currentScreen !== 'new-transaction' && currentScreen !== 'schedule' && currentScreen !== 'clients' && currentScreen !== 'settings' && currentScreen !== 'quote-add-item' && currentScreen !== 'quote-item-avulso' && currentScreen !== 'quote-select-service' && currentScreen !== 'quote-select-equipment' && currentScreen !== 'advanced-filter' && currentScreen !== 'monthly-progress' && currentScreen !== 'quotes' && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onOpenQuickActions={() => setIsQuickActionsOpen(true)}
        />
      )}
    </div>
  );
}