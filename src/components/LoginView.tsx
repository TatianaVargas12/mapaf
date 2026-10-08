import React, { useState } from 'react';
import { EcopetrolLogo } from './EcopetrolLogo';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [operatorEmail, setOperatorEmail] = useState('carlos.mendoza@ecopetrol.com.co');
  const [industrialToken, setIndustrialToken] = useState('••••••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState('rubiales-b4');
  const [keepShiftActive, setKeepShiftActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 700);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#0B0F17]">
      <div className="relative w-full max-w-5xl mx-auto my-4 md:my-8 px-2 sm:px-4">
        {/* Ambient Telemetry Glow Effects */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00B042]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute -bottom-16 right-10 w-80 h-80 bg-[#7bd0ff]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Main Card Container */}
        <div className="relative bg-[#111827]/85 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-10 border border-white/5">
          {/* Top Tactical Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 bg-[#0a0e16]/60 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 px-6 sm:px-10 py-3.5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span className="font-mono text-[10px] text-[#bccbb8] uppercase tracking-widest">
                RED OPERACIONAL ACTIVA • SECTOR HIDROCARBUROS
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] text-[#bccbb8]">
              <span className="flex items-center gap-1.5 text-[#7bd0ff]">
                <span className="material-symbols-outlined text-[14px]">router</span>
                NODO BOGOTÁ: <span className="text-white font-semibold">18ms</span>
              </span>
              <span className="hidden sm:inline text-[#31353e]">•</span>
              <span className="hidden sm:flex items-center gap-1.5 text-[#52e16c]">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                SISTEMA INTEGRADO SCADA 99.98%
              </span>
            </div>
          </div>

          {/* Institutional Header & Identity */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1c2028] rounded-2xl p-3 shadow-lg border border-white/5 flex items-center justify-center">
                <EcopetrolLogo size="lg" />
              </div>
              <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-[#00B042] text-[#003910] font-mono text-[9px] uppercase tracking-wider font-bold shadow-sm">
                RTOC TIER IV
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#00B042] uppercase tracking-widest mb-1 font-semibold">
              ECOPETROL S.A. • OPERACIONES EN TIEMPO REAL
            </p>
            <h1 className="text-2xl sm:text-[34px] text-white font-bold tracking-tight max-w-3xl leading-tight">
              SISTEMA DE MONITOREO AVANZADO DE PRODUCCIÓN Y ALMACENAMIENTO DE FLUIDOS
            </h1>
            <p className="text-sm text-[#bccbb8] mt-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#00B042]">speed</span>
              Control Operacional en Tiempo Real • Baterías, Líneas de Transferencia y Pozos Estratégicos
            </p>
          </div>

          {/* Security Flash Alert Banner */}
          <div className="mb-8 rounded-xl bg-[#181c24] p-4 shadow-sm border border-white/5">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">security_update_warning</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap font-mono text-[10px]">
                  <span className="text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded uppercase font-semibold">
                    Registro de Seguridad
                  </span>
                  <span className="text-[#bccbb8]">SCADA-EVENT: SEC-LOG-4091A</span>
                </div>
                <p className="text-xs text-[#dfe2ee]">
                  Alerta de Autenticación: Intento fallido previo registrado desde IP{' '}
                  <span className="font-mono text-[#7bd0ff]">10.14.88.12</span>. Verifique su token criptográfico institucional antes de confirmar ingreso.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
              {/* Operator ID */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Correo Corporativo o ID de Operador
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#869583] text-[20px] pointer-events-none">
                    badge
                  </span>
                  <input
                    type="email"
                    required
                    value={operatorEmail}
                    onChange={(e) => setOperatorEmail(e.target.value)}
                    placeholder="carlos.mendoza@ecopetrol.com.co"
                    className="w-full bg-[#0a0e16] text-[#dfe2ee] font-sans text-sm pl-11 pr-4 py-3 rounded-xl placeholder-[#869583] focus:outline-none focus:border-[#00B042] border border-white/5 shadow-inner transition-all"
                  />
                </div>
                <p className="font-mono text-[9px] text-[#869583] pl-1 uppercase">
                  ACCESO CONTROLADO MEDIANTE ACTIVE DIRECTORY EMPRESARIAL
                </p>
              </div>

              {/* Password / Industrial Token */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Contraseña / Token Industrial
                  </label>
                  <a href="#help" onClick={(e) => { e.preventDefault(); alert('Comuníquese con Soporte SCADA Helpdesk extensión 4900.'); }} className="font-mono text-[10px] text-[#7bd0ff] hover:underline">
                    ¿Problemas con el token?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#869583] text-[20px] pointer-events-none">
                    key
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={industrialToken}
                    onChange={(e) => setIndustrialToken(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#0a0e16] text-[#dfe2ee] font-mono text-sm pl-11 pr-11 py-3 rounded-xl placeholder-[#869583] focus:outline-none focus:border-[#00B042] border border-white/5 shadow-inner transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#869583] hover:text-white p-1 rounded cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="font-mono text-[9px] text-[#869583] pl-1 uppercase">
                  TOKEN DINÁMICO RSA / HARDWARE TOKEN IEC 62443 COMPATIBLE
                </p>
              </div>

              {/* Field / Terminal Selector */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Terminal Operativa Asignada / Campo de Extracción
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#869583] text-[20px] pointer-events-none">
                    oil_barrel
                  </span>
                  <select
                    value={selectedTerminal}
                    onChange={(e) => setSelectedTerminal(e.target.value)}
                    className="w-full appearance-none bg-[#0a0e16] text-[#dfe2ee] font-sans text-sm pl-11 pr-10 py-3 rounded-xl focus:outline-none border border-white/5 shadow-inner cursor-pointer"
                  >
                    <option value="rubiales-b4">Campo Rubiales — Batería 4 (Monitoreo Multifásico & Deshidratación)</option>
                    <option value="casabe">Campo Casabe — Estación Central de Recolección & Inyección</option>
                    <option value="llanos34">Campo Llanos 34 — Unidad de Almacenamiento Estratégico (Tanques T-101 a T-108)</option>
                    <option value="barranca">Refinería Barrancabermeja — Terminal de Despacho Mayorista</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3.5 text-[#869583] text-[20px] pointer-events-none">
                    unfold_more
                  </span>
                </div>
              </div>
            </div>

            {/* Checkbox & Security Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepShiftActive}
                  onChange={(e) => setKeepShiftActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0a0e16] accent-[#00B042] cursor-pointer"
                />
                <span className="text-xs text-[#dfe2ee]">
                  Mantener sesión activa por turno reglamentario{' '}
                  <span className="font-mono text-[#7bd0ff] font-semibold">(12 Horas RTOC)</span>
                </span>
              </label>

              <div className="flex items-center gap-2 font-mono text-[10px] text-[#bccbb8]">
                <span className="material-symbols-outlined text-[15px] text-[#00B042]">verified_user</span>
                <span>AUTENTICACIÓN MULTIFACTOR REQUERIDA</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-[#009639] hover:bg-[#00B042] text-[#003910] text-[16px] font-bold transition-all duration-200 shadow-lg hover:shadow-[#00B042]/20 active:scale-[0.99] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px] group-hover:translate-x-0.5 transition-transform">
                  {isLoading ? 'sync' : 'login'}
                </span>
                <span>{isLoading ? 'Autenticando en Directorio RTOC...' : 'Iniciar Sesión en Sala de Control'}</span>
              </button>
            </div>
          </form>

          {/* Industrial Operations Status Strip */}
          <div className="mt-8 pt-6 bg-[#0a0e16]/50 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-2xl border-t border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left mb-6 font-mono text-xs">
              <div className="p-3 bg-[#181c24]/70 rounded-xl border border-white/5">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#869583] text-[10px] mb-1">
                  <span className="material-symbols-outlined text-[14px] text-[#10B981]">lock</span>
                  PROTOCOLO CRIPTOGRÁFICO
                </div>
                <div className="text-white font-semibold">TLS 1.3 • AES-256-GCM</div>
              </div>

              <div className="p-3 bg-[#181c24]/70 rounded-xl border border-white/5">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#869583] text-[10px] mb-1">
                  <span className="material-symbols-outlined text-[14px] text-[#7bd0ff]">verified</span>
                  ESTÁNDAR INDUSTRIAL
                </div>
                <div className="text-white font-semibold">IEC 62443 TIER 3 READY</div>
              </div>

              <div className="p-3 bg-[#181c24]/70 rounded-xl border border-white/5">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#869583] text-[10px] mb-1">
                  <span className="material-symbols-outlined text-[14px] text-[#06B6D4]">sync_saved_locally</span>
                  SINCRONIZACIÓN SCADA
                </div>
                <div className="text-white font-semibold">RTOC CONECTADO (LOCAL)</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[#869583] text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#00B042]">security</span>
                <span>Uso exclusivo para personal autorizado de Ecopetrol S.A. y filiales operativas.</span>
              </div>
              <div className="font-mono text-[10px] text-[#869583]">
                COPYRIGHT © 2025 ECOPETROL S.A. TODOS LOS DERECHOS RESERVADOS.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
