import React, { useEffect, useState } from 'react';
import { useAcademyStore } from './services/store';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { CharalesDashboard } from './components/dashboard/CharalesDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { SecretaryDashboard } from './components/dashboard/SecretaryDashboard';
import { CoachDashboard } from './components/dashboard/CoachDashboard';
import { CoachPortalView } from './components/coach_portal/CoachPortalView';
import { ParentDashboard } from './components/dashboard/ParentDashboard';

import { PlayerList } from './components/players/PlayerList';
import { PlayerDetailModal } from './components/players/PlayerDetailModal';
import { PlayerFormModal } from './components/players/PlayerFormModal';

import { CategoriesView } from './components/categories/CategoriesView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { MatchesView } from './components/matches/MatchesView';
import { FinanceView } from './components/finance/FinanceView';
import { InventoryView } from './components/inventory/InventoryView';
import { AuditView } from './components/audit/AuditView';
import { CoachesView } from './components/coaches/CoachesView';
import { NoticesAndReportsView } from './components/communication/NoticesAndReportsView';

import { PaymentGatewayModal } from './components/finance/PaymentGatewayModal';
import { TournamentModal } from './components/matches/TournamentModal';
import { Player, Charge, Match, User } from './types';
import { LoginView } from './components/auth/LoginView';
import { clearSession, logout, onSessionExpired } from './services/api';

export default function App() {
  const [session, setSession] = useState<{ user: User; expiresIn: number } | null>(null);
  const [message, setMessage] = useState('');
  const [closing, setClosing] = useState(false);
  useEffect(() => onSessionExpired(() => {
    setSession(null);
    setMessage('Tu sesión terminó. Inicia sesión nuevamente.');
  }), []);
  useEffect(() => {
    if (!session) return;
    const timer = window.setTimeout(() => {
      clearSession();
      setSession(null);
      setMessage('Tu sesión expiró. Inicia sesión nuevamente.');
    }, session.expiresIn * 1000);
    return () => window.clearTimeout(timer);
  }, [session]);
  const closeSession = async () => {
    setClosing(true);
    try {
      await logout();
      setMessage('Sesión cerrada.');
    } catch {
      setMessage('Se cerró el acceso en este navegador. No se pudo confirmar el cierre en el servidor.');
    } finally {
      setSession(null);
      setClosing(false);
    }
  };
  if (!session) return <LoginView message={message} onLogin={value => {
    setMessage('');
    setSession(value);
  }} />;
  return <>
    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#253E7B] text-white px-4 py-2 text-sm">
      <span>{session.user.nombre} · {session.user.email}</span>
      <button type="button" onClick={closeSession} disabled={closing}
        className="rounded-lg border border-white/50 px-3 py-1 disabled:opacity-50">
        {closing ? 'Cerrando…' : 'Cerrar sesión'}
      </button>
    </div>
    <div role="status" className="bg-amber-50 text-amber-900 px-4 py-2 text-sm">
      Acceso validado. Los módulos aún muestran datos de demostración;
      los cambios en esas vistas se guardan solo en este navegador.
    </div>
    <AuthenticatedApp key={session.user.id} user={session.user} />
  </>;
}

function AuthenticatedApp({ user }: { user: User }) {
  const store = useAcademyStore(user);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardViewMode, setDashboardViewMode] = useState<'mockup' | 'metrics'>('mockup');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global modals state
  const [selectedPlayerForDetail, setSelectedPlayerForDetail] = useState<Player | null>(null);
  const [showNewPlayerModal, setShowNewPlayerModal] = useState(false);
  const [showNewTournamentModal, setShowNewTournamentModal] = useState(false);
  const [activePaymentCharge, setActivePaymentCharge] = useState<Charge | null>(null);

  // Open player detail
  const handleOpenPlayerDetail = (player: Player) => {
    setSelectedPlayerForDetail(player);
  };

  // Open payment gateway
  const handleOpenPaymentGateway = (chargeId: number) => {
    const target = store.charges.find((c) => c.id === chargeId);
    if (target) {
      setActivePaymentCharge(target);
    }
  };

  // Switch tab safely and close mobile menu
  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans">
      {store.currentUser.rol === 'ENTRENADOR' ? (
        <CoachPortalView
          currentRole={store.currentUser.rol}
        />
      ) : (
        <>
          {/* Top Navbar */}
          <Navbar
            currentUser={store.currentUser}
            notifications={store.notifications}
            onMarkNotificationRead={store.markNotificationRead}
            onMarkAllRead={store.markAllNotificationsRead}
            onNavigateTab={handleNavigateTab}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentRole={store.currentUser.rol}
            activeTab={activeTab}
            onSelectTab={handleNavigateTab}
          />
        </div>

        {/* Mobile Dropdown Drawer when hamburger opened */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex flex-col">
            <div className="bg-white text-[#111111] w-72 h-full p-4 overflow-y-auto space-y-3 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-sm text-[#3B59A8]">Menú de Navegación</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-500 hover:text-[#111111] p-1 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <Sidebar
                currentRole={store.currentUser.rol}
                activeTab={activeTab}
                onSelectTab={handleNavigateTab}
              />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* View Switcher Header: Mockup Oficial vs KPIs */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setDashboardViewMode('mockup')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      dashboardViewMode === 'mockup'
                        ? 'bg-[#3B59A8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tablero Principal
                  </button>
                  <button
                    onClick={() => setDashboardViewMode('metrics')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      dashboardViewMode === 'metrics'
                        ? 'bg-[#3B59A8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Panel por Rol
                  </button>
                </div>

                <span className="text-[11px] font-bold text-slate-500 hidden sm:inline-block">
                  Escuela de Fútbol Charales de Chapala · Temporada 2026
                </span>
              </div>

              {dashboardViewMode === 'mockup' ? (
                <CharalesDashboard
                  players={store.players}
                  charges={store.charges}
                  categories={store.categories}
                  matches={store.matches}
                  sessions={store.sessions}
                  currentRole={store.currentUser.rol}
                  onNavigateTab={handleNavigateTab}
                  onOpenPlayerModal={handleOpenPlayerDetail}
                  onOpenPaymentModal={(charge) => handleOpenPaymentGateway(charge.id)}
                  onOpenNewPlayerModal={() => setShowNewPlayerModal(true)}
                  onOpenNewTournamentModal={() => setShowNewTournamentModal(true)}
                />
              ) : (
                <>
                  {store.currentUser.rol === 'ADMINISTRADOR' && (
                    <AdminDashboard
                      players={store.players}
                      categories={store.categories}
                      matches={store.matches}
                      charges={store.charges}
                      uniformOrders={store.uniformOrders}
                      notices={store.notices}
                      onNavigateTab={handleNavigateTab}
                      onOpenNewPlayerModal={() => setShowNewPlayerModal(true)}
                      onOpenScheduleMatchModal={() => setActiveTab('partidos')}
                      onOpenNewTournamentModal={() => setShowNewTournamentModal(true)}
                    />
                  )}

                  {store.currentUser.rol === 'SECRETARIA' && (
                    <SecretaryDashboard
                      players={store.players}
                      charges={store.charges}
                      uniformOrders={store.uniformOrders}
                      matches={store.matches}
                      categories={store.categories}
                      onNavigateTab={handleNavigateTab}
                      onOpenNewPlayerModal={() => setShowNewPlayerModal(true)}
                      onGenerateMonthlyCharges={store.generateMonthlyCharges}
                    />
                  )}

                  {store.currentUser.rol === 'PADRE_TUTOR' && (
                    <ParentDashboard
                      currentUser={store.currentUser}
                      guardians={store.guardians}
                      relations={store.relations}
                      players={store.players}
                      categories={store.categories}
                      matches={store.matches}
                      charges={store.charges}
                      payments={store.payments}
                      evaluations={store.evaluations}
                      notices={store.notices}
                      uniformOrders={store.uniformOrders}
                      onNavigateTab={handleNavigateTab}
                      onOpenPaymentGateway={handleOpenPaymentGateway}
                      onOpenPlayerExpediente={handleOpenPlayerDetail}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* 1. JUGADORES Y TUTORES */}
          {(activeTab === 'jugadores' || activeTab === 'alumnos') && (
            <PlayerList
              players={store.players}
              categories={store.categories}
              guardians={store.guardians}
              relations={store.relations}
              charges={store.charges}
              currentRole={store.currentUser.rol}
              onSelectPlayer={handleOpenPlayerDetail}
              onOpenNewPlayerModal={() => setShowNewPlayerModal(true)}
              onChangePlayerStatus={store.changePlayerStatus}
            />
          )}

          {/* 2. CATEGORÍAS */}
          {activeTab === 'categorias' && (
            <CategoriesView
              categories={store.categories}
              venues={store.venues}
              seasons={store.seasons}
              players={store.players}
              coaches={store.coaches}
              currentRole={store.currentUser.rol}
              onAddCategory={store.addCategory}
            />
          )}

          {/* 3. ENTRENADORES */}
          {activeTab === 'entrenadores' && (
            <CoachesView
              coaches={store.coaches}
              categories={store.categories}
              currentRole={store.currentUser.rol}
              onAddCoach={store.addCoach}
              onUpdateCoach={store.updateCoach}
            />
          )}

          {/* 4. ENTRENAMIENTOS */}
          {(activeTab === 'entrenamientos' || activeTab === 'asistencia') && (
            <AttendanceView
              categories={store.categories}
              sessions={store.sessions}
              players={store.players}
              attendance={store.attendance}
              venues={store.venues}
              coaches={store.coaches}
              currentRole={store.currentUser.rol}
              onRegisterAttendance={store.registerSessionAttendance}
              onAddVenue={store.addVenue}
              onUpdateCategoryTraining={store.updateCategoryTraining}
              onAddTrainingSession={store.addTrainingSession}
            />
          )}

          {/* 5. TORNEOS, LIGAS Y PARTIDOS */}
          {activeTab === 'partidos' && (
            <MatchesView
              matches={store.matches}
              tournaments={store.tournaments}
              categories={store.categories}
              currentRole={store.currentUser.rol}
              onScheduleMatch={store.scheduleMatch}
              onUpdateMatchResult={store.updateMatchResult}
              onAddTournament={store.addTournament}
            />
          )}

          {/* 6. PAGOS Y COBRANZA */}
          {(activeTab === 'pagos' || activeTab === 'finanzas') && (
            <FinanceView
              charges={store.charges}
              payments={store.payments}
              chargeConcepts={store.chargeConcepts}
              currentRole={store.currentUser.rol}
              onGenerateMonthlyCharges={store.generateMonthlyCharges}
              onRegisterPayment={store.registerPayment}
              onCancelPayment={store.cancelPayment}
            />
          )}

          {/* 7. UNIFORMES */}
          {(activeTab === 'uniformes' || activeTab === 'inventario') && (
            <InventoryView
              products={store.uniformProducts}
              orders={store.uniformOrders}
              materials={store.materials}
              players={store.players}
              currentRole={store.currentUser.rol}
              onOrderUniform={store.orderUniform}
              onDeliverUniform={store.deliverUniform}
            />
          )}

          {/* 8. AVISOS Y REPORTES */}
          {(activeTab === 'avisos_reportes' || activeTab === 'comunicacion' || activeTab === 'rendimiento') && (
            <NoticesAndReportsView
              notices={store.notices}
              messages={store.messages}
              currentUser={store.currentUser}
              users={store.users}
              categories={store.categories}
              players={store.players}
              evaluations={store.evaluations}
              charges={store.charges}
              payments={store.payments}
              attendance={store.attendance}
              auditLogs={store.auditLogs}
              currentRole={store.currentUser.rol}
              onSendMessage={store.sendDirectMessage}
              onPublishNotice={store.publishNotice}
              onSaveEvaluation={store.savePerformanceEvaluation}
            />
          )}

          {/* AUDITORÍA Y SEGURIDAD */}
          {activeTab === 'auditoria' && (
            <AuditView
              auditLogs={store.auditLogs}
              currentRole={store.currentUser.rol}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentRole={store.currentUser.rol}
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
      />

      {/* Global Modals */}
      {selectedPlayerForDetail && (
        <PlayerDetailModal
          player={selectedPlayerForDetail}
          onClose={() => setSelectedPlayerForDetail(null)}
          guardians={store.guardians}
          relations={store.relations}
          categories={store.categories}
          categoryHistory={store.categoryHistory}
          attendanceRecords={store.attendance}
          charges={store.charges}
          payments={store.payments}
          uniformOrders={store.uniformOrders}
          evaluations={store.evaluations}
          currentRole={store.currentUser.rol}
          onChangeCategory={store.changePlayerCategory}
          onOpenPaymentGateway={(chargeId) => {
            setSelectedPlayerForDetail(null);
            handleOpenPaymentGateway(chargeId);
          }}
        />
      )}

      {showNewPlayerModal && (
        <PlayerFormModal
          isOpen={showNewPlayerModal}
          onClose={() => setShowNewPlayerModal(false)}
          categories={store.categories}
          onSubmit={store.addPlayer}
        />
      )}

      {activePaymentCharge && (
        <PaymentGatewayModal
          charge={activePaymentCharge}
          onClose={() => setActivePaymentCharge(null)}
          onConfirmPayment={store.registerPayment}
        />
      )}

      {showNewTournamentModal && (
        <TournamentModal
          categories={store.categories}
          isOpen={showNewTournamentModal}
          onClose={() => setShowNewTournamentModal(false)}
          onAddTournament={(tournamentData) => {
            store.addTournament(tournamentData);
            setActiveTab('partidos');
          }}
        />
      )}
        </>
      )}
    </div>
  );
}
