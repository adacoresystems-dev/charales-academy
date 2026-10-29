import { DemoNotice } from '../layout/DemoNotice';
import React, { useState } from 'react';
import { 
  mockCoaches, 
  mockPlayers, 
  mockTrainingSessions, 
  mockMatches, 
  mockStandingsSub11, 
  mockNotifications 
} from './mockData';
import { 
  Coach, 
  Player, 
  TrainingSession, 
  MatchFixture, 
  TournamentStanding, 
  NotificationItem, 
  AttendanceStatus, 
  TechnicalSkills 
} from './types';
import { Sidebar, NavigationTab } from './Sidebar';
import { Header } from './Header';
import { DashboardView } from './DashboardView';
import { AttendanceView } from './AttendanceView';
import { PlayerTechnicalView } from './PlayerTechnicalView';
import { MonthlyStatsView } from './MonthlyStatsView';
import { ComparativeChartsView } from './ComparativeChartsView';
import { SessionsAndDrillsView } from './SessionsAndDrillsView';
import { MatchesAndTournamentsView } from './MatchesAndTournamentsView';
import { NotificationsView } from './NotificationsView';
import { PdfReportModal } from './PdfReportModal';
import { Role } from '../../types';

interface CoachPortalViewProps {
  onLogout?: () => void;
  closing?: boolean;
  currentRole?: Role;
  onSwitchRole?: (role: Role) => void;
  initialTab?: NavigationTab;
}

export const CoachPortalView: React.FC<CoachPortalViewProps> = ({
  currentRole = 'ENTRENADOR',
  onLogout,
  closing,
  onSwitchRole,
  initialTab = 'inicio',
}) => {
  // Application State
  const [activeCoach, setActiveCoach] = useState<Coach>(mockCoaches[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCoach.assignedCategories[0]);
  const [currentTab, setCurrentTab] = useState<NavigationTab>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopVisible, setDesktopVisible] = useState(() => {
    try { return localStorage.getItem('charales-coach-sidebar') !== 'hidden'; } catch { return true; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('charales-coach-sidebar', desktopVisible ? 'expanded' : 'hidden'); } catch { /* Optional preference. */ }
  }, [desktopVisible]);

  // Core Data State
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [sessions, setSessions] = useState<TrainingSession[]>(mockTrainingSessions);
  const [matches, setMatches] = useState<MatchFixture[]>(mockMatches);
  const [standings, setStandings] = useState<TournamentStanding[]>(mockStandingsSub11);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // PDF Export Modal State
  const [pdfPlayer, setPdfPlayer] = useState<Player | null>(null);

  // Coach switch handler: update available category as well
  const handleSelectCoach = (coach: Coach) => {
    setActiveCoach(coach);
    if (!coach.assignedCategories.includes(selectedCategory)) {
      setSelectedCategory(coach.assignedCategories[0]);
    }
  };

  // HU-030 & HU-031: Update Attendance & Session observations
  const handleUpdateSessionAttendance = (
    sessionId: string,
    attendanceList: { playerId: string; status: AttendanceStatus; note?: string }[],
    observations?: string
  ) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          completed: true,
          observations: observations !== undefined ? observations : s.observations,
          attendance: attendanceList
        };
      }
      return s;
    }));

    // Recalculate player overall attendance rate dynamically
    setPlayers(prev => prev.map(p => {
      const recorded = attendanceList.find(a => a.playerId === p.id);
      if (recorded) {
        const isPresent = recorded.status === 'presente' || recorded.status === 'retardo';
        const adjustment = isPresent ? 1 : -2;
        const newRate = Math.min(100, Math.max(50, p.overallAttendanceRate + adjustment));
        return { ...p, overallAttendanceRate: newRate };
      }
      return p;
    }));
  };

  // HU-024: Update Player Technical Skills & Coach notes
  const handleUpdatePlayerSkills = (
    playerId: string,
    updatedSkills: TechnicalSkills,
    observations: string
  ) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        const avg = Object.values(updatedSkills).reduce((a, b) => a + b, 0) / 6;
        const updatedHistory = [...p.monthlyHistory];
        if (updatedHistory.length > 0) {
          const lastIdx = updatedHistory.length - 1;
          updatedHistory[lastIdx] = {
            ...updatedHistory[lastIdx],
            technicalAverage: Number(avg.toFixed(2))
          };
        }

        return {
          ...p,
          currentSkills: updatedSkills,
          coachObservations: observations,
          monthlyHistory: updatedHistory
        };
      }
      return p;
    }));
  };

  // Add new session
  const handleAddNewSession = (newSession: TrainingSession) => {
    setSessions(prev => [newSession, ...prev]);
  };

  // Toggle Convocatoria
  const handleTogglePlayerConvocatoria = (matchId: string, playerId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const exists = m.convokedPlayerIds.includes(playerId);
        const updated = exists 
          ? m.convokedPlayerIds.filter(id => id !== playerId)
          : [...m.convokedPlayerIds, playerId];
        return { ...m, convokedPlayerIds: updated };
      }
      return m;
    }));
  };

  // Notifications handlers
  const handleMarkNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleSendNotification = (newNotif: NotificationItem) => {
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const todaySession = sessions.find(s => s.category === selectedCategory && s.date === '2026-10-21') || sessions.find(s => s.category === selectedCategory);
  const nextMatch = matches.find(m => m.category === selectedCategory && m.status === 'Programado');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeCoach={activeCoach}
        allCoaches={mockCoaches}
        onSelectCoach={handleSelectCoach}
        unreadNotifsCount={unreadNotifsCount}
        isOpen={sidebarOpen}
        desktopVisible={desktopVisible}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (offset by 72 = 18rem on md screens) */}
      <div className={`flex flex-col flex-1 min-w-0 ${desktopVisible ? 'md:pl-72' : ''}`}>
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          desktopVisible={desktopVisible}
          onToggleDesktop={() => setDesktopVisible(value => !value)}
          onLogout={onLogout}
          closing={closing}
          activeCoach={activeCoach}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={activeCoach.assignedCategories}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotifAsRead}
          onOpenNotificationsTab={() => setCurrentTab('avisos')}
          onSwitchRole={onSwitchRole}
        />

        {/* View Content Port */}
        <main id="main-content" className="flex-1 p-4 md:p-8 max-w-[1500px] w-full mx-auto space-y-5">
          <DemoNotice />
          {currentTab === 'inicio' && (
            <DashboardView
              coach={activeCoach}
              selectedCategory={selectedCategory}
              players={players}
              sessions={sessions}
              matches={matches}
              standings={standings}
              notifications={notifications}
              todaySession={todaySession}
              nextMatch={nextMatch}
              onNavigateTab={setCurrentTab}
              onSelectPlayerForPdf={setPdfPlayer}
            />
          )}

          {currentTab === 'asistencia' && (
            <AttendanceView
              category={selectedCategory}
              players={players}
              sessions={sessions}
              onUpdateSessionAttendance={handleUpdateSessionAttendance}
            />
          )}

          {currentTab === 'rendimiento' && (
            <PlayerTechnicalView
              category={selectedCategory}
              players={players}
              onUpdatePlayerSkills={handleUpdatePlayerSkills}
              onOpenPdfModal={setPdfPlayer}
            />
          )}

          {currentTab === 'estadisticas' && (
            <MonthlyStatsView
              category={selectedCategory}
              players={players}
              onOpenPdfModal={setPdfPlayer}
            />
          )}

          {currentTab === 'comparativas' && (
            <ComparativeChartsView
              category={selectedCategory}
              players={players}
            />
          )}

          {currentTab === 'sesiones' && (
            <SessionsAndDrillsView
              category={selectedCategory}
              sessions={sessions}
              onAddNewSession={handleAddNewSession}
              onNavigateToAttendance={() => setCurrentTab('asistencia')}
            />
          )}

          {currentTab === 'partidos' && (
            <MatchesAndTournamentsView
              category={selectedCategory}
              matches={matches}
              standings={standings}
              players={players}
              onTogglePlayerConvocatoria={handleTogglePlayerConvocatoria}
            />
          )}

          {currentTab === 'avisos' && (
            <NotificationsView
              notifications={notifications}
              coach={activeCoach}
              selectedCategory={selectedCategory}
              onMarkAsRead={handleMarkNotifAsRead}
              onSendNotification={handleSendNotification}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="no-print mt-auto border-t border-neutral-200 bg-white py-4 px-6 text-center text-xs text-neutral-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              © 2026 Club de Fútbol Charales de Chapala · Escuela Infantil Formativa
            </span>
            <div className="flex items-center gap-4 text-[11px] text-neutral-400">
              <span className="text-[#3B59A8] font-semibold">Azul Chapala #3B59A8</span>
              <span>·</span>
              <span className="text-[#E31B23] font-semibold">Rojo Deportivo #E31B23</span>
              <span>·</span>
              <span>Unidad Deportiva Usuario Rayo, Jalisco</span>
            </div>
          </div>
        </footer>
      </div>

      {/* PDF Official Report Modal */}
      {pdfPlayer && (
        <PdfReportModal
          player={pdfPlayer}
          coach={activeCoach}
          onClose={() => setPdfPlayer(null)}
        />
      )}
    </div>
  );
};

export default CoachPortalView;
