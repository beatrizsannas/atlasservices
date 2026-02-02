import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
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
import { TransactionDetails } from './components/TransactionDetails';
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
import { CompletedServicesScreen } from './components/CompletedServicesScreen';
import { CacheProvider } from './contexts/CacheContext';

export type Screen = 'dashboard' | 'clients' | 'client-details' | 'inventory' | 'quotes' | 'new-quote' | 'quote-add-item' | 'quote-item-avulso' | 'quote-select-service' | 'quote-select-equipment' | 'view-quote' | 'schedule' | 'settings' | 'premium' | 'new-part' | 'new-category' | 'company-details' | 'user-profile' | 'new-appointment' | 'new-client' | 'services' | 'new-service' | 'edit-service' | 'appointment-details' | 'finance' | 'new-transaction' | 'transaction-details' | 'advanced-filter' | 'login' | 'signup' | 'forgot-password' | 'email-sent-success' | 'email-sent-error' | 'new-password' | 'welcome' | 'signup-success' | 'reschedule' | 'monthly-progress' | 'completed-services';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [quoteValidityDate, setQuoteValidityDate] = useState('2023-11-24');
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [currentAppointmentId, setCurrentAppointmentId] = useState<string | null>(null);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [quoteSource, setQuoteSource] = useState<'dashboard' | 'quotes'>('quotes');
  const [currentPartId, setCurrentPartId] = useState<string | null>(null);

  // Schedule State (Lifted to preserve navigation state)
  const [scheduleActiveTab, setScheduleActiveTab] = useState('Hoje');
  const [scheduleStartDate, setScheduleStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleEndDate, setScheduleEndDate] = useState(new Date().toISOString().split('T')[0]);

  const isAuthScreen = currentScreen === 'login' || currentScreen === 'signup' || currentScreen === 'forgot-password' || currentScreen === 'email-sent-success' || currentScreen === 'email-sent-error' || currentScreen === 'new-password' || currentScreen === 'welcome' || currentScreen === 'signup-success' || currentScreen === 'reschedule';

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setCurrentScreen('dashboard');
      }
      setIsLoadingSession(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        if (event === 'SIGNED_IN') {
          setCurrentScreen('dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentScreen('welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNavigate = (screen: Screen, appointmentId?: string) => {
    setCurrentScreen(screen);
    if (appointmentId) {
      setCurrentAppointmentId(appointmentId);
    }
    closeSidebar();
    setIsQuickActionsOpen(false); // Close quick actions if navigating
    window.scrollTo(0, 0);
  };

  const handleEditQuote = (quoteId: string) => {
    setCurrentQuoteId(quoteId);
    setQuoteSource('quotes');
    handleNavigate('new-quote');
  };

  const handleViewQuote = (quoteId: string) => {
    setCurrentQuoteId(quoteId);
    handleNavigate('view-quote');
  };

  const handleNewQuote = () => {
    setCurrentQuoteId(null);
    setQuoteSource('quotes');
    handleNavigate('new-quote');
  };

  const handleEditClient = (clientId: string) => {
    setCurrentClientId(clientId);
    handleNavigate('new-client');
  };

  const handleNewClient = () => {
    setCurrentClientId(null);
    handleNavigate('new-client');
  };

  const handleViewAppointment = (appointmentId: string) => {
    setCurrentAppointmentId(appointmentId);
    handleNavigate('appointment-details');
  };

  const handleEditPart = (partId: string) => {
    setCurrentPartId(partId);
    handleNavigate('new-part');
  };

  const handleNewPart = () => {
    setCurrentPartId(null);
    handleNavigate('new-part');
  };

  return (
    <CacheProvider>
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
          <Reschedule
            onBack={() => handleNavigate('schedule')}
            appointmentId={currentAppointmentId}
          />
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

        {currentScreen === 'completed-services' && (
          <CompletedServicesScreen
            onBack={() => handleNavigate('dashboard')}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'schedule' && (
          <Schedule
            activeTab={scheduleActiveTab}
            setActiveTab={setScheduleActiveTab}
            startDate={scheduleStartDate}
            setStartDate={setScheduleStartDate}
            endDate={scheduleEndDate}
            setEndDate={setScheduleEndDate}
            onNewAppointment={() => handleNavigate('new-appointment')}
            onAppointmentClick={(id) => handleViewAppointment(id)}
            onReschedule={(appointmentId) => {
              setCurrentAppointmentId(appointmentId);
              handleNavigate('reschedule');
            }}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'new-appointment' && (
          <NewAppointment
            onBack={() => {
              if (currentQuoteId) {
                // If we started from a quote, go back to quotes list
                setCurrentQuoteId(null);
                handleNavigate('quotes');
              } else {
                // Otherwise go back to schedule
                handleNavigate('schedule');
              }
            }}
            initialQuoteId={currentQuoteId}
          />
        )}

        {currentScreen === 'appointment-details' && (
          <AppointmentDetails
            appointmentId={currentAppointmentId}
            onBack={() => handleNavigate('schedule')}
            onReschedule={() => handleNavigate('reschedule')}
          />
        )}

        {currentScreen === 'clients' && (
          <Clients
            onClientClick={(id) => {
              setCurrentClientId(id);
              handleNavigate('client-details');
            }}
            onBack={() => handleNavigate('dashboard')}
            onNewClient={handleNewClient}
            onEditClient={handleEditClient}
          />
        )}

        {currentScreen === 'new-client' && (
          <NewClient
            onBack={() => handleNavigate('clients')}
            clientId={currentClientId}
          />
        )}

        {currentScreen === 'client-details' && (
          <ClientDetails
            onBack={() => handleNavigate('clients')}
            clientId={currentClientId}
          />
        )}

        {currentScreen === 'inventory' && (
          <Inventory
            onBack={() => handleNavigate('dashboard')}
            onNewPart={handleNewPart}
            onEditPart={handleEditPart}
          />
        )}

        {currentScreen === 'new-part' && (
          <NewPart
            onBack={() => {
              setCurrentPartId(null);
              handleNavigate('inventory');
            }}
            onNavigate={handleNavigate}
            partId={currentPartId}
          />
        )}

        {currentScreen === 'new-category' && (
          <NewCategory onBack={() => handleNavigate('new-part')} />
        )}

        {currentScreen === 'quotes' && (
          <Quotes
            onBack={() => handleNavigate('dashboard')}
            onNewQuote={handleNewQuote}
            onFilter={() => handleNavigate('advanced-filter')}
            onEditQuote={handleEditQuote}
            onViewQuote={handleViewQuote}
            onScheduleQuote={(quoteId) => {
              setCurrentQuoteId(quoteId);
              handleNavigate('new-appointment');
            }}
          />
        )}

        {currentScreen === 'new-quote' && (
          <NewQuote
            quoteId={currentQuoteId}
            onBack={() => handleNavigate(quoteSource === 'dashboard' ? 'dashboard' : 'quotes')}
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
            onBack={() => handleNavigate('quotes')}
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
            onBack={() => handleNavigate('quotes')}
            validityDate={quoteValidityDate}
            quoteId={currentQuoteId || undefined}
            onEdit={handleEditQuote}
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
            onTransactionClick={(transactionId) => {
              setCurrentTransactionId(transactionId);
              handleNavigate('transaction-details');
            }}
          />
        )}

        {currentScreen === 'new-transaction' && (
          <NewTransaction onBack={() => handleNavigate('finance')} />
        )}

        {currentScreen === 'transaction-details' && currentTransactionId && (
          <TransactionDetails
            transactionId={currentTransactionId}
            onBack={() => handleNavigate('finance')}
            onUpdate={() => {/* refresh finance data if needed */ }}
          />
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
            onNavigate={(screen) => {
              if (screen === 'new-quote') {
                setCurrentQuoteId(null);
                setQuoteSource('dashboard');
              }
              handleNavigate(screen);
            }}
          />
        )}

        {!isAuthScreen && ['dashboard', 'schedule', 'clients', 'settings'].includes(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onOpenQuickActions={() => setIsQuickActionsOpen(true)}
          />
        )}
      </div>
    </CacheProvider>
  );
}
export default App;