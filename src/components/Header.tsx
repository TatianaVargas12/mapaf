import React, { useState, useEffect } from 'react';
import { EcopetrolLogo } from './EcopetrolLogo';
import { AppUser, UserRole } from '../types/scada';

interface HeaderProps {
  currentUser: AppUser;
  onLogout: () => void;
  onNavigateAlerts?: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenSimulation: () => void;
  normalCount?: number;
  warningCount?: number;
  criticalCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onNavigateAlerts,
  onSwitchRole,
  onOpenSimulation,
  normalCount = 24,
  warningCount = 2,
  criticalCount = 1,
}) => {
  const [timeString, setTimeString] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} UTC-5`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleColors = {
    ADMIN: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30',
    OPERADOR: 'bg-[#00B042]/20 text-[#00B042] border-[#00B042]/30',
    AUDITOR: 'bg-[#7bd0ff]/20 text-[#7bd0ff] border-[#7bd0ff]/30',
  }[currentUser.rol];

  return (
    <>
      <header className="fixed top-0 left-72 right-0 h-16 bg-[#111827]/90 backdrop-blur-xl z-40 flex items-center justify-between px-6 shadow-[0_1px_8px_rgba(0,0,0,0.5)] border-b border-white/5 select-none">
        {/* Left Operation Context */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <EcopetrolLogo size="sm" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#bccbb8] tracking-wider leading-tight">
                OPERACIÓN ACTIVA
              </span>
              <span className="text-[17px] font-semibold text-[#dfe2ee] leading-none">
                Campo Rubiales - Batería 4
              </span>
            </div>
          </div>

          {/* Live UTC-5 Real Time Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c2028] border border-white/5">
            <span className="material-symbols-outlined text-[#06B6D4] text-[18px]">
              schedule
            </span>
            <span className="font-mono text-[10px] text-[#bccbb8]">TIEMPO REAL:</span>
            <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
              {timeString || '2025-05-18 14:32:08 UTC-5'}
            </span>
          </div>

          {/* Auditor Mode Read-Only Banner */}
          {currentUser.rol === 'AUDITOR' && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#7bd0ff]/10 border border-[#7bd0ff]/30 text-[#7bd0ff] font-mono text-[10px] font-bold">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              <span>MODO AUDITORÍA (SOLO LECTURA)</span>
            </div>
          )}
        </div>

        {/* Right Status Semaphore, Quick Role Switcher, Operator Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Simulation Lab Trigger Button */}
          <button
            onClick={onOpenSimulation}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-[#06B6D4] text-xs font-mono border border-[#06B6D4]/30 cursor-pointer transition-colors"
            title="Abrir Laboratorio de Pruebas PRD 5 (Desconexión telemetría, Carga k6, JWT 401)"
          >
            <span className="material-symbols-outlined text-[16px]">science</span>
            <span className="hidden xl:inline">Pruebas PRD 5</span>
          </button>

          {/* Status Semaphore */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onNavigateAlerts}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/20 hover:bg-[#10B981]/20 transition-all cursor-pointer"
              title="Equipos normales"
            >
              <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
              <span className="font-mono text-[10px] text-[#10B981] font-semibold">
                Norm: {normalCount}
              </span>
            </button>
            <button
              onClick={onNavigateAlerts}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/20 hover:bg-[#F59E0B]/20 transition-all cursor-pointer"
              title="Equipos en advertencia"
            >
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]"></span>
              <span className="font-mono text-[10px] text-[#F59E0B] font-semibold">
                Adv: {warningCount}
              </span>
            </button>
            <button
              onClick={onNavigateAlerts}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EF4444]/15 border border-[#EF4444]/30 hover:bg-[#EF4444]/25 transition-all cursor-pointer shadow-[0_0_8px_rgba(239,68,68,0.25)]"
              title="Alarmas críticas"
            >
              <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-ping"></span>
              <span className="font-mono text-[10px] text-[#EF4444] font-bold">
                Crít: {criticalCount}
              </span>
            </button>
          </div>

          {/* Quick RBAC Role Selector Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10 font-mono text-[10px]">
            <span className="text-[#869583]">ROL:</span>
            <select
              value={currentUser.rol}
              onChange={(e) => onSwitchRole(e.target.value as UserRole)}
              className={`rounded px-2 py-0.5 font-mono font-bold cursor-pointer border ${roleColors} focus:outline-none`}
            >
              <option value="OPERADOR" className="bg-[#111827] text-[#00B042]">OPERADOR</option>
              <option value="ADMIN" className="bg-[#111827] text-[#EF4444]">ADMIN</option>
              <option value="AUDITOR" className="bg-[#111827] text-[#7bd0ff]">AUDITOR</option>
            </select>
          </div>

          {/* Operator Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2.5 text-left group hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs ${
                currentUser.rol === 'ADMIN'
                  ? 'bg-[#EF4444] text-white'
                  : currentUser.rol === 'OPERADOR'
                  ? 'bg-[#52e16c] text-[#003910]'
                  : 'bg-[#7bd0ff] text-[#001e2c]'
              }`}>
                {currentUser.nombre.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[13px] font-semibold text-[#dfe2ee] leading-tight group-hover:text-[#52e16c] transition-colors">
                  {currentUser.nombre}
                </span>
                <span className="font-mono text-[10px] text-[#52e16c] font-medium leading-tight">
                  {currentUser.cargo}
                </span>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#262a33] text-[#bccbb8] hover:bg-[#93000a] hover:text-white transition-all text-xs font-mono font-medium border border-white/5 cursor-pointer ml-1"
              title="Cerrar sesión de turno"
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
              <span className="hidden xl:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Operator Detail Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  currentUser.rol === 'ADMIN'
                    ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                    : currentUser.rol === 'OPERADOR'
                    ? 'bg-[#52e16c]/20 text-[#52e16c] border border-[#52e16c]/30'
                    : 'bg-[#7bd0ff]/20 text-[#7bd0ff] border border-[#7bd0ff]/30'
                }`}>
                  {currentUser.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white">{currentUser.nombre}</h3>
                  <p className="font-mono text-xs text-[#00B042]">Badge: {currentUser.badge}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-[#869583] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between p-2 rounded bg-[#1c2028]">
                <span className="text-[#869583]">ROL ASIGNADO (RBAC):</span>
                <span className="text-white font-bold">{currentUser.rol}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#1c2028]">
                <span className="text-[#869583]">CORREO CORPORATIVO:</span>
                <span className="text-white font-semibold">{currentUser.email}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#1c2028]">
                <span className="text-[#869583]">PERMISOS CLAVE:</span>
                <span className="text-[#06B6D4] font-semibold text-right">
                  {currentUser.rol === 'ADMIN'
                    ? 'Gestión total, umbrales y usuarios'
                    : currentUser.rol === 'OPERADOR'
                    ? 'Telemetría viva y cierre de alertas'
                    : 'Solo lectura de históricos y reportes'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#1c2028]">
                <span className="text-[#869583]">TOKEN IEC 62443 / JWT:</span>
                <span className="text-[#10B981] font-semibold">Válido (HMAC-SHA256)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 rounded bg-[#262a33] hover:bg-[#353942] text-white text-xs font-mono font-semibold transition-colors"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
