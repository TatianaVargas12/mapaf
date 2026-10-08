import React from 'react';
import { ViewMode, UserRole } from '../types/scada';
import { EcopetrolLogo } from './EcopetrolLogo';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  activeAlertsCount: number;
  currentRole: UserRole;
  onOpenSimulation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  activeAlertsCount,
  currentRole,
  onOpenSimulation,
}) => {
  const primaryNavItems = [
    {
      id: 'dashboard-rtoc' as ViewMode,
      label: 'Dashboard RTOC',
      icon: 'grid_view',
      badge: 'NIVEL 1',
      badgeClass: 'px-1.5 py-0.5 rounded bg-[#31353e] text-[#06B6D4] text-[10px] font-mono font-semibold',
    },
    {
      id: 'centro-de-alertas' as ViewMode,
      label: 'Centro de Alertas',
      icon: 'warning',
      badge: activeAlertsCount > 0 ? String(activeAlertsCount) : undefined,
      badgeClass: 'px-1.5 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] text-[10px] font-mono font-bold animate-pulse',
    },
    {
      id: 'historicos-y-analisis' as ViewMode,
      label: 'Históricos & Análisis',
      icon: 'timeline',
    },
    {
      id: 'despachos-de-cisternas' as ViewMode,
      label: 'Despachos de Cisternas',
      icon: 'local_shipping',
    },
    {
      id: 'configuracion-scada' as ViewMode,
      label: 'Configuración SCADA',
      icon: 'tune',
    },
  ];

  const adminNavItems = [
    {
      id: 'gestion-rbac' as ViewMode,
      label: 'Gestión RBAC & Usuarios',
      icon: 'admin_panel_settings',
      badge: currentRole,
      badgeClass: `px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
        currentRole === 'ADMIN'
          ? 'bg-[#EF4444]/20 text-[#EF4444]'
          : currentRole === 'OPERADOR'
          ? 'bg-[#00B042]/20 text-[#00B042]'
          : 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
      }`,
    },
    {
      id: 'kpis-negocio' as ViewMode,
      label: 'Métricas & KPIs PRD',
      icon: 'monitoring',
      badge: '8 METAS',
      badgeClass: 'px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] text-[9px] font-mono font-bold',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#181c24]/95 backdrop-blur-xl z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-r border-white/5 select-none overflow-y-auto">
      <div className="flex flex-col">
        {/* Brand header */}
        <div className="h-16 px-4 flex items-center justify-between bg-[#0a0e16]/80 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <EcopetrolLogo size="md" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-semibold text-[#00B042] tracking-wider leading-tight">
                ECOPETROL S.A.
              </span>
              <span className="text-[17px] font-semibold text-[#dfe2ee] tracking-tight leading-none">
                RTOC Monitoreo
              </span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Ping Box */}
        <div className="mx-4 my-3 p-2.5 rounded bg-[#111827]/90 flex flex-col gap-1 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981] shadow-[0_0_8px_#10B981]"></span>
              </span>
              <span className="font-mono text-[10px] text-[#10B981] font-semibold tracking-wider">
                TELEMETRÍA EN VIVO
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#06B6D4] font-medium">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[#bccbb8] font-mono text-[10px]">
            <span>LATENCIA SCADA</span>
            <span className="text-[11px] text-[#dfe2ee]">1.2s ping</span>
          </div>
        </div>

        {/* Section 1: Consolas Operativas */}
        <div className="px-4 pt-1 pb-1">
          <span className="font-mono text-[10px] text-[#869583] tracking-widest uppercase font-semibold">
            Consolas Operativas
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-4 mt-1">
          {primaryNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded text-[14px] transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#00b042] text-[#003910] font-semibold shadow-[0_0_12px_rgba(0,176,66,0.3)]'
                    : 'text-[#bccbb8] hover:bg-[#262a33] hover:text-[#dfe2ee]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={item.badgeClass}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Section 2: Gobierno & Métricas (PRD / TRD) */}
        <div className="px-4 pt-4 pb-1">
          <span className="font-mono text-[10px] text-[#869583] tracking-widest uppercase font-semibold">
            Gobierno & KPIs (PRD)
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-4 mt-1">
          {adminNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded text-[14px] transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#00b042] text-[#003910] font-semibold shadow-[0_0_12px_rgba(0,176,66,0.3)]'
                    : 'text-[#bccbb8] hover:bg-[#262a33] hover:text-[#dfe2ee]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={item.badgeClass}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Simulation Lab Trigger */}
        <div className="px-4 pt-4">
          <button
            onClick={onOpenSimulation}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#111827] hover:bg-[#1c2028] text-[#06B6D4] border border-[#06B6D4]/30 text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">science</span>
              <span>Laboratorio PRD 5</span>
            </div>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* System Host Node and Integrity */}
      <div className="p-4 bg-[#0a0e16]/60 flex flex-col gap-2 border-t border-white/5 mt-4">
        <div className="flex items-center justify-between text-[#bccbb8]">
          <span className="font-mono text-[10px] text-[#869583]">SISTEMA HOST RTOC</span>
          <span className="font-mono text-[10px] text-[#52e16c] font-semibold">NODE-BOG-04</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1 rounded bg-[#1c2028] border border-white/5">
          <span className="font-mono text-[10px] text-[#bccbb8]">INTEGRIDAD DE RED</span>
          <span className="font-mono text-[11px] text-[#10B981] font-semibold">99.98%</span>
        </div>
      </div>
    </aside>
  );
};
