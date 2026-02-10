import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import { CacheProvider } from './contexts/CacheContext';
import { LoadingFallback } from './components/ui/LoadingFallback';

// Lazy load all components for better performance
const Sidebar = React.lazy(() => import('./components/Sidebar').then(m => ({ default: m.Sidebar })));
const Header = React.lazy(() => import('./components/Header').then(m => ({ default: m.Header })));
const BottomNav = React.lazy(() => import('./components/BottomNav').then(m => ({ default: m.BottomNav })));
const Dashboard = React.lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Clients = React.lazy(() => import('./components/Clients').then(m => ({ default: m.Clients })));
const ClientDetails = React.lazy(() => import('./components/ClientDetails').then(m => ({ default: m.ClientDetails })));
const Inventory = React.lazy(() => import('./components/Inventory').then(m => ({ default: m.Inventory })));
const Quotes = React.lazy(() => import('./components/Quotes').then(m => ({ default: m.Quotes })));
const NewQuote = React.lazy(() => import('./components/NewQuote').then(m => ({ default: m.NewQuote })));
const ViewQuote = React.lazy(() => import('./components/ViewQuote').then(m => ({ default: m.ViewQuote })));
const QuoteAddItem = React.lazy(() => import('./components/QuoteAddItem').then(m => ({ default: m.QuoteAddItem })));
const QuoteItemAvulso = React.lazy(() => import('./components/QuoteItemAvulso').then(m => ({ default: m.QuoteItemAvulso })));
const QuoteSelectService = React.lazy(() => import('./components/QuoteSelectService').then(m => ({ default: m.QuoteSelectService })));
const QuoteSelectEquipment = React.lazy(() => import('./components/QuoteSelectEquipment').then(m => ({ default: m.QuoteSelectEquipment })));
const Schedule = React.lazy(() => import('./components/Schedule').then(m => ({ default: m.Schedule })));
const QuickActions = React.lazy(() => import('./components/QuickActions').then(m => ({ default: m.QuickActions })));
const Settings = React.lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const Premium = React.lazy(() => import('./components/Premium').then(m => ({ default: m.Premium })));
const NewPart = React.lazy(() => import('./components/NewPart').then(m => ({ default: m.NewPart })));
const NewCategory = React.lazy(() => import('./components/NewCategory').then(m => ({ default: m.NewCategory })));
const CompanyDetails = React.lazy(() => import('./components/CompanyDetails').then(m => ({ default: m.CompanyDetails })));
const UserProfile = React.lazy(() => import('./components/UserProfile').then(m => ({ default: m.UserProfile })));
const NewAppointment = React.lazy(() => import('./components/NewAppointment').then(m => ({ default: m.NewAppointment })));
const NewClient = React.lazy(() => import('./components/NewClient').then(m => ({ default: m.NewClient })));
const Services = React.lazy(() => import('./components/Services').then(m => ({ default: m.Services })));
const NewService = React.lazy(() => import('./components/NewService').then(m => ({ default: m.NewService })));
const EditService = React.lazy(() => import('./components/EditService').then(m => ({ default: m.EditService })));
const AppointmentDetails = React.lazy(() => import('./components/AppointmentDetails').then(m => ({ default: m.AppointmentDetails })));
const Finance = React.lazy(() => import('./components/Finance').then(m => ({ default: m.Finance })));
const NewTransaction = React.lazy(() => import('./components/NewTransaction').then(m => ({ default: m.NewTransaction })));
const TransactionDetails = React.lazy(() => import('./components/TransactionDetails').then(m => ({ default: m.TransactionDetails })));
const AdvancedFilter = React.lazy(() => import('./components/AdvancedFilter').then(m => ({ default: m.AdvancedFilter })));
const Login = React.lazy(() => import('./components/Login').then(m => ({ default: m.Login })));
const SignUp = React.lazy(() => import('./components/SignUp').then(m => ({ default: m.SignUp })));
const ForgotPassword = React.lazy(() => import('./components/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const EmailSentSuccess = React.lazy(() => import('./components/EmailSentSuccess').then(m => ({ default: m.EmailSentSuccess })));
const EmailSentError = React.lazy(() => import('./components/EmailSentError').then(m => ({ default: m.EmailSentError })));
const NewPassword = React.lazy(() => import('./components/NewPassword').then(m => ({ default: m.NewPassword })));
const Welcome = React.lazy(() => import('./components/Welcome').then(m => ({ default: m.Welcome })));
const SignUpSuccess = React.lazy(() => import('./components/SignUpSuccess').then(m => ({ default: m.SignUpSuccess })));
const Reschedule = React.lazy(() => import('./components/Reschedule').then(m => ({ default: m.Reschedule })));
const MonthlyProgressScreen = React.lazy(() => import('./components/MonthlyProgressScreen').then(m => ({ default: m.MonthlyProgressScreen })));
const CompletedServicesScreen = React.lazy(() => import('./components/CompletedServicesScreen').then(m => ({ default: m.CompletedServicesScreen })));

export type Screen = 'dashboard' | 'clients' | 'client-details' | 'inventory' | 'quotes' | 'new-quote' | 'quote-add-item' | 'quote-item-avulso' | 'quote-select-service' | 'quote-select-equipment' | 'view-quote' | 'schedule' | 'settings' | 'premium' | 'new-part' | 'new-category' | 'company-details' | 'user-profile' | 'new-appointment' | 'new-client' | 'services' | 'new-service' | 'edit-service' | 'appointment-details' | 'finance' | 'new-transaction' | 'transaction-details' | 'advanced-filter' | 'login' | 'signup' | 'forgot-password' | 'email-sent-success' | 'email-sent-error' | 'new-password' | 'welcome' | 'signup-success' | 'reschedule' | 'monthly-progress' | 'completed-services';

// Type for Service from Services component
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
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

  // Dashboard State (Lifted to preserve filter state)
  const [dashboardDate, setDashboardDate] = useState(new Date());

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
      <Suspense fallback={<LoadingFallback variant="fullscreen" />}>
        <div className="min-h-screen bg-background-light relative">
          {/* Show loading screen while checking authentication */}
          {isLoadingSession && (
            <div className="fixed inset-0 bg-[#0B2A5B] flex items-center justify-center z-50">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-white text-6xl animate-spin">progress_activity</span>
                <p className="text-white text-lg font-medium">Carregando...</p>
              </div>
            </div>
          )}

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
                <Dashboard
                  onNavigate={handleNavigate}
                  selectedDate={dashboardDate}
                  onDateChange={setDashboardDate}
                />
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
              selectedDate={dashboardDate}
              onDateChange={setDashboardDate}
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
      </Suspense>
    </CacheProvider>
  );
}
export default App;