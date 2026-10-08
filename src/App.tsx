/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewMode, AppUser, UserRole } from './types/scada';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AlertsView } from './components/AlertsView';
import { HistoryView } from './components/HistoryView';
import { DispatchesView } from './components/DispatchesView';
import { ScadaConfigView } from './components/ScadaConfigView';
import { UsersRbacView } from './components/UsersRbacView';
import { KpiMetricsView } from './components/KpiMetricsView';
import { SimulationDrawer } from './components/SimulationDrawer';
import { LoginView } from './components/LoginView';

const defaultUser: AppUser = {
  id: 'usr-001',
  nombre: 'Ing. Carlos Mendoza',
  email: 'carlos.mendoza@ecopetrol.com.co',
  rol: 'OPERADOR',
  cargo: 'Operador Senior RTOC',
  badge: 'ECO-RTOC-9402',
  activo: true,
  creadoEn: '2024-03-15',
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard-rtoc');
  const [currentUser, setCurrentUser] = useState<AppUser>(defaultUser);
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(3);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 4500);
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard-rtoc');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      rol: newRole,
      cargo:
        newRole === 'ADMIN'
          ? 'Jefe de Planta (Sesión Admin)'
          : newRole === 'OPERADOR'
          ? 'Operador Senior RTOC'
          : 'Auditor de Integridad (Solo Lectura)',
    }));
    triggerToast(`Rol RBAC cambiado a ${newRole}. Token JWT y permisos actualizados.`);
  };

  const handleTriggerOfflineSimulation = () => {
    setActiveAlertsCount((prev) => prev + 1);
  };

  if (currentView === 'login') {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#dfe2ee] font-sans antialiased selection:bg-[#00B042] selection:text-[#0B0F17]">
      {/* Global Toast Notification */}
      {globalToast && (
        <aside className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl bg-[#1E293B]/95 backdrop-blur-xl shadow-2xl border border-[#00B042]/30 animate-fade-in">
          <span className="material-symbols-outlined text-[#00B042]">check_circle</span>
          <span className="text-xs text-white">{globalToast}</span>
          <button onClick={() => setGlobalToast(null)} className="text-[#869583] hover:text-white ml-2">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </aside>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeAlertsCount={activeAlertsCount}
        currentRole={currentUser.rol}
        onOpenSimulation={() => setIsSimulationOpen(true)}
      />

      {/* Main Content Area */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Top Header with RBAC indicator and role switcher */}
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateAlerts={() => setCurrentView('centro-de-alertas')}
          onSwitchRole={handleSwitchRole}
          onOpenSimulation={() => setIsSimulationOpen(true)}
          normalCount={24}
          warningCount={2}
          criticalCount={1}
        />

        {/* Dynamic View Body */}
        <main className="relative w-full pt-20 px-6 flex-1 bg-[#0B0F17]">
          {currentView === 'dashboard-rtoc' && (
            <DashboardView
              onNavigateAlerts={() => setCurrentView('centro-de-alertas')}
              onNavigateDispatches={() => setCurrentView('despachos-de-cisternas')}
              onNavigateHistory={() => setCurrentView('historicos-y-analisis')}
              userRole={currentUser.rol}
            />
          )}

          {currentView === 'centro-de-alertas' && (
            <AlertsView userRole={currentUser.rol} />
          )}

          {currentView === 'historicos-y-analisis' && (
            <HistoryView />
          )}

          {currentView === 'despachos-de-cisternas' && (
            <DispatchesView />
          )}

          {currentView === 'configuracion-scada' && (
            <ScadaConfigView userRole={currentUser.rol} />
          )}

          {currentView === 'gestion-rbac' && (
            <UsersRbacView
              currentUser={currentUser}
              onSwitchUser={(user) => setCurrentUser(user)}
              triggerToast={triggerToast}
            />
          )}

          {currentView === 'kpis-negocio' && (
            <KpiMetricsView />
          )}
        </main>
      </div>

      {/* Simulation Lab Drawer (PRD Section 5 & TRD 3.2) */}
      <SimulationDrawer
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onTriggerOfflineTest={handleTriggerOfflineSimulation}
        triggerToast={triggerToast}
      />
    </div>
  );
}
