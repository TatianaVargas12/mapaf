import React, { useState } from 'react';
import { AlertEvent, UserRole } from '../types/scada';

interface AlertsViewProps {
  onAlertStatusChange?: () => void;
  userRole?: UserRole;
}

const initialAlerts: AlertEvent[] = [
  {
    id: 'AL-8839',
    severity: 'CRITICA',
    timestamp: '14:22:05',
    dateStr: 'Hoy (UTC-5)',
    tag: 'TK-501',
    equipmentName: 'Tanque Almacenamiento - Bat 4',
    subSystem: 'Tanque Batería 4',
    variable: 'Nivel de Líquido LAHH',
    condition: 'Límite Alto-Alto Violado',
    value: '9,450',
    unit: 'BBL',
    threshold: 'Umbral: > 9,000 BBL (+5.0%)',
    status: 'active',
    statusLabel: 'ACTIVA',
    assignedTo: undefined,
    sopCode: 'SOP-01',
    sopTitle: 'Sobrellenado Tanques LAHH',
  },
  {
    id: 'AL-8837',
    severity: 'ALTA',
    timestamp: '14:18:30',
    dateStr: 'Hoy (UTC-5)',
    tag: 'RB-402',
    equipmentName: 'Cabeza de Pozo Productor',
    subSystem: 'Superficie Colector',
    variable: 'Presión en Cabeza (THP)',
    condition: 'Sobrepresión Hidráulica',
    value: '840',
    unit: 'PSI',
    threshold: 'Umbral: 800 PSI (+5.0%)',
    status: 'active',
    statusLabel: 'ACTIVA',
    assignedTo: 'Ing. C. Mendoza',
    sopCode: 'SOP-02',
    sopTitle: 'Presión Excesiva en Pozo',
  },
  {
    id: 'AL-8820',
    severity: 'MEDIA',
    timestamp: '13:50:11',
    dateStr: 'Hoy (UTC-5)',
    tag: 'VFD-01',
    equipmentName: 'Variador Motor BES M-1',
    subSystem: 'Sub-sistema BES',
    variable: 'Temperatura Devanado',
    condition: 'Límite Térmico Operativo',
    value: '92',
    unit: '°C',
    threshold: 'Umbral: 90°C',
    status: 'attended',
    statusLabel: 'ATENDIDA',
    assignedTo: 'Operador J. Silva',
    sopCode: 'SOP-03',
    sopTitle: 'Temperatura Crítica VFD',
  },
  {
    id: 'AL-8812',
    severity: 'BAJA',
    timestamp: '12:30:00',
    dateStr: 'Hoy (UTC-5)',
    tag: 'GW-03',
    equipmentName: 'Gateway Satelital Batería',
    subSystem: 'Comunicaciones SCADA',
    variable: 'Heartbeat Retrasado',
    condition: 'Latencia 4.5s',
    value: '4.5',
    unit: 'seg',
    threshold: 'Recuperado',
    status: 'closed',
    statusLabel: 'RESUELTA',
    assignedTo: 'Sistema Auto-Check',
  },
];

export const AlertsView: React.FC<AlertsViewProps> = ({ userRole = 'OPERADOR' }) => {
  const [alerts, setAlerts] = useState<AlertEvent[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'attended' | 'closed'>('all');
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Drawer state
  const [selectedAlertForDrawer, setSelectedAlertForDrawer] = useState<AlertEvent | null>(null);
  const [fieldConfirmed, setFieldConfirmed] = useState(false);
  const [sopExecuted, setSopExecuted] = useState(false);
  const [justificationText, setJustificationText] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const handleMuteToggle = () => {
    setIsAudioMuted(!isAudioMuted);
    triggerToast(
      !isAudioMuted
        ? 'Alertas sonoras silenciadas por 10 minutos en la consola.'
        : 'Sirena sonora reactivada para eventos Críticos y Altos.'
    );
  };

  const handleAttend = (alertId: string) => {
    if (userRole === 'AUDITOR') {
      triggerToast('Acceso denegado: El rol AUDITOR tiene permisos exclusivos de solo lectura (PRD Sección 2).');
      return;
    }
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, status: 'attended', statusLabel: 'ATENDIDA', assignedTo: 'Ing. Carlos Mendoza' }
          : a
      )
    );
    triggerToast(`Alerta ${alertId} asignada exitosamente al Operador Carlos Mendoza.`);
  };

  const openDrawer = (alert: AlertEvent) => {
    if (userRole === 'AUDITOR') {
      triggerToast('Aviso: Perfil AUDITOR en modo solo lectura de registro SOP.');
    }
    setSelectedAlertForDrawer(alert);
    setFieldConfirmed(false);
    setSopExecuted(false);
    setJustificationText('');
  };

  const closeDrawer = () => {
    setSelectedAlertForDrawer(null);
  };

  const handleConfirmCloseAlert = () => {
    if (userRole === 'AUDITOR') {
      triggerToast('Acceso denegado: Solo usuarios con rol OPERADOR o ADMIN pueden cerrar alertas con justificación (PRD 3.2).');
      return;
    }
    if (!selectedAlertForDrawer) return;
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlertForDrawer.id
          ? {
              ...a,
              status: 'closed',
              statusLabel: 'RESUELTA',
              mitigationNotes: justificationText,
              confirmedBy: 'Ing. Carlos Mendoza',
            }
          : a
      )
    );
    closeDrawer();
    triggerToast(`Alerta ${selectedAlertForDrawer.id} cerrada y documentada en el libro digital.`);
  };

  // Filter calculation
  const filteredAlerts = alerts.filter((a) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && a.status === 'active') ||
      (activeTab === 'attended' && a.status === 'attended') ||
      (activeTab === 'closed' && a.status === 'closed');

    const matchesSeverity = !severityFilter || a.severity === severityFilter;

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      a.tag.toLowerCase().includes(query) ||
      a.equipmentName.toLowerCase().includes(query) ||
      a.variable.toLowerCase().includes(query) ||
      a.id.toLowerCase().includes(query);

    return matchesTab && matchesSeverity && matchesQuery;
  });

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const attendedCount = alerts.filter((a) => a.status === 'attended').length;
  const closedCount = alerts.filter((a) => a.status === 'closed').length;

  return (
    <div className="flex flex-col w-full pb-12 space-y-6 text-[#dfe2ee]">
      {/* Toast Notification */}
      {toastMsg && (
        <aside className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl bg-[#1E293B]/95 backdrop-blur-xl shadow-2xl border border-[#00B042]/30 animate-fade-in">
          <div className="w-9 h-9 rounded-full bg-[#00B042]/20 flex items-center justify-center text-[#00B042]">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div className="flex flex-col pr-3">
            <span className="font-mono text-[10px] text-[#00B042] font-bold tracking-wider">
              NOTIFICACIÓN SCADA RTOC
            </span>
            <span className="text-xs font-medium text-[#dfe2ee]">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-[#869583] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </aside>
      )}

      {/* DYNAMIC OPERATIONAL HUD HEADER */}
      <section className="relative w-full rounded-xl bg-[#111827]/85 backdrop-blur-xl p-6 shadow-xl border border-white/5 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#EF4444]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 bg-[#00B042]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 relative z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] font-bold tracking-wider animate-pulse">
                RTOC CRITICAL GATEWAY
              </span>
              <span className="font-mono text-[10px] text-[#bccbb8]">SOP-ECO-2025-v4.1</span>
            </div>
            <h1 className="text-[26px] font-bold text-white tracking-tight">
              Centro de Gestión de Alertas y Novedades
            </h1>
            <p className="text-sm text-[#bccbb8] mt-0.5">
              Control de desviaciones dinámicas, sobrepresiones y límites de diseño en pozos y baterías activas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleMuteToggle}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-[#bccbb8] hover:text-white transition-all border border-white/5 cursor-pointer shadow-sm"
            >
              <span className={`material-symbols-outlined text-[18px] ${isAudioMuted ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                {isAudioMuted ? 'volume_off' : 'volume_up'}
              </span>
              <span className="font-mono text-xs">
                {isAudioMuted ? 'Audio Silenciado (Reanudar)' : 'Silenciar Auditivo (10 min)'}
              </span>
            </button>

            <div className="relative inline-block text-left">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#262a33] hover:bg-[#353942] text-white transition-all border border-white/5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px] text-[#06B6D4]">download</span>
                <span className="font-mono text-xs">Exportar Registro</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl bg-[#1E293B] border border-white/10 shadow-2xl py-1.5 z-50">
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      triggerToast('Generando reporte CSV con firma criptográfica de auditoría...');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#dfe2ee] hover:bg-[#1c2028] text-left transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#00B042] text-[18px]">table_view</span>
                    <span>Descargar CSV Auditoría</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      triggerToast('Generando reporte legal de turno en formato PDF...');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#dfe2ee] hover:bg-[#1c2028] text-left transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#EF4444] text-[18px]">picture_as_pdf</span>
                    <span>Reporte Legal Turno (PDF)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10">
          {/* KPI 1: Alertas Activas */}
          <div className="rounded-xl bg-[#1c2028] p-4 border border-white/5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#bccbb8] uppercase tracking-wider">
                Alertas Activas
              </span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EF4444]"></span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-1.5">
              <span className="font-mono text-[30px] font-bold text-[#EF4444]">
                {String(activeCount).padStart(2, '0')}
              </span>
              <span className="font-mono text-[11px] text-[#bccbb8]">EVENTOS VIGENTES</span>
            </div>
            <div className="flex items-center gap-2 text-xs pt-1 border-t border-white/5">
              <span className="px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] font-mono text-[10px] font-semibold">
                1 Crítica
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-[10px] font-semibold">
                2 Advertencia
              </span>
            </div>
          </div>

          {/* KPI 2: TTR */}
          <div className="rounded-xl bg-[#1c2028] p-4 border border-white/5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#bccbb8] uppercase tracking-wider">
                T. Promedio Respuesta
              </span>
              <span className="material-symbols-outlined text-[#06B6D4] text-[18px]">timer</span>
            </div>
            <div className="flex items-baseline gap-2 my-1.5">
              <span className="font-mono text-[30px] font-bold text-[#06B6D4]">4.2</span>
              <span className="font-mono text-[11px] text-[#dfe2ee]">minutos</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="font-mono text-[10px] text-[#10B981] font-semibold">Meta PRD ≤ 10 min</span>
              <span className="font-mono text-[10px] text-[#bccbb8]">-58% vs umbral</span>
            </div>
          </div>

          {/* KPI 3: Atendidas en turno */}
          <div className="rounded-xl bg-[#1c2028] p-4 border border-white/5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#bccbb8] uppercase tracking-wider">
                Atendidas en Turno
              </span>
              <span className="material-symbols-outlined text-[#00B042] text-[18px]">fact_check</span>
            </div>
            <div className="flex items-baseline gap-2 my-1.5">
              <span className="font-mono text-[30px] font-bold text-[#00B042]">18</span>
              <span className="font-mono text-[11px] text-[#bccbb8]">INTERVENCIONES</span>
            </div>
            <div className="flex items-center text-xs pt-1 border-t border-white/5">
              <span className="font-mono text-[10px] text-[#bccbb8]">Turno A (06:00 - 18:00)</span>
            </div>
          </div>

          {/* KPI 4: Tasa Cierre */}
          <div className="rounded-xl bg-[#1c2028] p-4 border border-white/5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#bccbb8] uppercase tracking-wider">
                Tasa Cierre Justificado
              </span>
              <span className="material-symbols-outlined text-[#10B981] text-[18px]">verified_user</span>
            </div>
            <div className="flex items-baseline gap-2 my-1.5">
              <span className="font-mono text-[30px] font-bold text-white">96%</span>
              <span className="font-mono text-[11px] text-[#10B981] font-semibold">+2.1% sem</span>
            </div>
            <div className="w-full bg-[#31353e] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#00B042] h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROL & FILTER CONSOLE */}
      <section className="flex flex-col gap-4 bg-[#181c24]/90 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-lg">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0a0e16] rounded-lg border border-white/5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#262a33] text-white shadow-sm'
                  : 'text-[#bccbb8] hover:text-white'
              }`}
            >
              <span>Todas</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#31353e] text-xs font-mono">
                {alerts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-[#262a33] text-white shadow-sm'
                  : 'text-[#bccbb8] hover:text-white'
              }`}
            >
              <span>Activas</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#EF4444]/20 text-[#EF4444] text-xs font-mono font-bold">
                {activeCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('attended')}
              className={`px-3.5 py-1.5 rounded font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'attended'
                  ? 'bg-[#262a33] text-white shadow-sm'
                  : 'text-[#bccbb8] hover:text-white'
              }`}
            >
              <span>Atendidas</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] text-xs font-mono">
                {attendedCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-3.5 py-1.5 rounded font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'closed'
                  ? 'bg-[#262a33] text-white shadow-sm'
                  : 'text-[#bccbb8] hover:text-white'
              }`}
            >
              <span>Cerradas / Silenciadas</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#64748B]/20 text-[#64748B] text-xs font-mono">
                {closedCount}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#869583] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pozo, equipo o tag instrumentado ('TK-501', 'RB-402', 'VFD-01')..."
              className="w-full bg-[#0a0e16] text-[#dfe2ee] placeholder-[#869583] text-xs pl-10 pr-9 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-[#00B042] font-sans shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#869583] hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Severity Sub-Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-[#869583] uppercase mr-1">Filtrar Severidad:</span>
            {(['CRITICA', 'ALTA', 'MEDIA', 'BAJA'] as const).map((sev) => {
              const isActive = severityFilter === sev;
              const colorMap = {
                CRITICA: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
                ALTA: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
                MEDIA: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
                BAJA: 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30',
              }[sev];

              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(isActive ? null : sev)}
                  className={`px-2.5 py-1 rounded font-mono text-[10px] font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isActive ? `${colorMap} ring-1 ring-white/20` : 'bg-[#1c2028] text-[#bccbb8] border-white/5 hover:text-white'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    sev === 'CRITICA' ? 'bg-[#EF4444]' : sev === 'ALTA' ? 'bg-[#F59E0B]' : sev === 'MEDIA' ? 'bg-yellow-400' : 'bg-[#06B6D4]'
                  }`}></span>
                  <span>{sev}</span>
                </button>
              );
            })}
            {(severityFilter || searchQuery) && (
              <button
                onClick={() => {
                  setSeverityFilter(null);
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="text-[#bccbb8] hover:text-white font-mono text-[10px] underline ml-2 cursor-pointer"
              >
                Limpiar Filtros
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-[#869583]">
            <span>MOSTRANDO:</span>
            <span className="text-white font-bold">{filteredAlerts.length}</span>
            <span>REGISTROS EN TIEMPO REAL</span>
          </div>
        </div>
      </section>

      {/* MASTER TELEMETRY TABLE */}
      <section className="w-full bg-[#111827]/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/5 overflow-hidden">
        {filteredAlerts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0e16]/90 text-[#869583] font-mono text-[10px] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-5">Severidad</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Equipo / Tag SCADA</th>
                  <th className="py-3 px-4">Variable Afectada</th>
                  <th className="py-3 px-4">Valor Medido vs Umbral</th>
                  <th className="py-3 px-4">Estado Actual</th>
                  <th className="py-3 px-4">Asignado A</th>
                  <th className="py-3 px-5 text-right">Acciones Inmediatas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredAlerts.map((alert) => {
                  const isCrit = alert.severity === 'CRITICA';
                  const isHigh = alert.severity === 'ALTA';
                  const isMed = alert.severity === 'MEDIA';

                  return (
                    <tr
                      key={alert.id}
                      className={`hover:bg-[#1c2028]/60 transition-all ${
                        isCrit ? 'bg-[#EF4444]/5' : ''
                      }`}
                    >
                      {/* Severidad */}
                      <td className="py-4 px-5">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            isCrit
                              ? 'bg-[#EF4444]/20 text-[#EF4444] animate-pulse border border-[#EF4444]/30'
                              : isHigh
                              ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                              : isMed
                              ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                              : 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isCrit
                                ? 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]'
                                : isHigh
                                ? 'bg-[#F59E0B]'
                                : isMed
                                ? 'bg-yellow-400'
                                : 'bg-[#06B6D4]'
                            }`}
                          ></span>
                          <span>{alert.severity}</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-4 px-4 font-mono">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-white">
                            {alert.timestamp}
                          </span>
                          <span className="text-[10px] text-[#869583]">{alert.dateStr}</span>
                        </div>
                      </td>

                      {/* Tag */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-bold text-[#06B6D4]">
                            {alert.tag}
                          </span>
                          <span className="text-xs text-[#bccbb8]">{alert.equipmentName}</span>
                        </div>
                      </td>

                      {/* Variable */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white">{alert.variable}</span>
                          <span
                            className={`font-mono text-[10px] ${
                              isCrit ? 'text-[#EF4444]' : isHigh ? 'text-[#F59E0B]' : 'text-yellow-400'
                            }`}
                          >
                            {alert.condition}
                          </span>
                        </div>
                      </td>

                      {/* Value vs Threshold */}
                      <td className="py-4 px-4 font-mono">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`text-base font-bold ${
                                isCrit ? 'text-[#EF4444]' : isHigh ? 'text-[#F59E0B]' : isMed ? 'text-yellow-400' : 'text-[#bccbb8]'
                              }`}
                            >
                              {alert.value}
                            </span>
                            <span className="text-xs text-[#869583]">{alert.unit}</span>
                          </div>
                          <span className="text-[10px] text-[#869583]">{alert.threshold}</span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                            alert.status === 'active'
                              ? 'bg-[#EF4444]/15 text-[#EF4444]'
                              : alert.status === 'attended'
                              ? 'bg-[#06B6D4]/15 text-[#06B6D4]'
                              : 'bg-[#10B981]/15 text-[#10B981]'
                          }`}
                        >
                          {alert.statusLabel}
                        </span>
                      </td>

                      {/* Asignado A */}
                      <td className="py-4 px-4 text-xs">
                        {alert.assignedTo ? (
                          <div className="flex items-center gap-1.5 text-[#dfe2ee]">
                            <span className="material-symbols-outlined text-[16px] text-[#00B042]">
                              engineering
                            </span>
                            <span>{alert.assignedTo}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#F59E0B]">
                            <span className="material-symbols-outlined text-[16px]">person_off</span>
                            <span className="font-mono text-[11px]">Sin atender</span>
                          </div>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {alert.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleAttend(alert.id)}
                                className="px-3 py-1 rounded bg-[#00B042] hover:bg-[#52e16c] text-[#0B0F17] font-mono text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                              >
                                Marcar Atendida
                              </button>
                              <button
                                onClick={() => openDrawer(alert)}
                                className="px-2.5 py-1 rounded bg-[#262a33] hover:bg-[#353942] text-white font-mono text-[10px] transition-all cursor-pointer border border-white/5"
                              >
                                Registrar SOP
                              </button>
                            </>
                          )}
                          {alert.status === 'attended' && (
                            <button
                              onClick={() => openDrawer(alert)}
                              className="px-3 py-1 rounded bg-[#262a33] hover:bg-[#353942] text-white font-mono text-[10px] font-semibold transition-all border border-white/5 cursor-pointer"
                            >
                              Ver Justificación y Cerrar
                            </button>
                          )}
                          {alert.status === 'closed' && (
                            <span className="px-2.5 py-1 rounded bg-[#1c2028] text-[#869583] font-mono text-[10px]">
                              CERRADA
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State Component */
          <div className="p-12 text-center flex flex-col items-center justify-center bg-[#181c24]/30">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4 text-[#10B981]">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="text-lg font-bold text-white">No hay alertas críticas pendientes en este sector</h3>
            <p className="text-xs text-[#bccbb8] max-w-lg mt-1">
              Todos los parámetros de Batería 4 operan dentro de los umbrales normales de diseño e instrumentación API / AGA.
            </p>
            <button
              onClick={() => {
                setSeverityFilter(null);
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#353942] text-white font-mono text-xs transition-all cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </section>

      {/* SPLIT TACTICAL INSIGHT: MAP TOPOLOGY & ESCALATION PROTOCOLS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Map */}
        <div className="lg:col-span-2 rounded-xl bg-[#111827]/85 backdrop-blur-xl p-6 shadow-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00B042]">map</span>
              <h2 className="text-base font-bold text-white">Topología Satelital de Batería 4 - Rubiales</h2>
            </div>
            <span className="font-mono text-[10px] text-[#869583]">GEO-SCADA SYNC: OK</span>
          </div>

          <div
            className="w-full h-72 bg-cover bg-center rounded-xl relative overflow-hidden shadow-inner flex items-end p-4 border border-white/5 bg-[#0B0F17]"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJT6NNysEQNApnVJR5IhJx3VU-49z2exbZKdwc1fcAWpLZEG4lHDp1nasjiBwPyKe3yppvymklGTiTLu6J-5ZL17hPTlzyRC4ko4IReLhhc-682qhcBhqH6y1BWZ-0RaSOn-a0G5DOSauLpWcWk7XxiNAWS-5hEzQp9necJuDZZsBl6Pz6gXKYs0yXc_7BYNk8tdyZNLA4CafviTZvsF0xeAu-ulz-By7BUent5v4MCLs5UVcFAMcW')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/30 to-transparent"></div>
            <div className="relative z-10 flex flex-wrap items-center justify-between w-full bg-[#1E293B]/90 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#EF4444] animate-ping"></span>
                <div>
                  <p className="text-xs font-semibold text-white">Sector Crítico Detectado: Manifold de Entrada TK-501</p>
                  <p className="font-mono text-[10px] text-[#bccbb8]">
                    Coordenadas: 3°59'12.4"N 71°28'45.1"W • Altitud 154 MSNM
                  </p>
                </div>
              </div>
              <button
                onClick={() => triggerToast('Cargando gemelo digital 3D de Batería 4...')}
                className="font-mono text-[10px] text-[#06B6D4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Telemetría 3D</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Protocol SOP Quick Reference */}
        <div className="rounded-xl bg-[#111827]/85 backdrop-blur-xl p-6 shadow-xl border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Protocolo de Escalación</h3>
              <span className="material-symbols-outlined text-[#F59E0B] text-[20px]">policy</span>
            </div>

            <ul className="space-y-3">
              <li className="p-3 rounded-lg bg-[#1c2028] border border-white/5 flex items-start gap-3">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] font-bold mt-0.5">
                  SOP-01
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Sobrellenado Tanques LAHH</p>
                  <p className="text-[11px] text-[#bccbb8] mt-0.5">
                    Apertura automática de bypass a TK-502 y notificación a despachador.
                  </p>
                </div>
              </li>

              <li className="p-3 rounded-lg bg-[#1c2028] border border-white/5 flex items-start gap-3">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-bold mt-0.5">
                  SOP-02
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Presión Excesiva en Pozo</p>
                  <p className="text-[11px] text-[#bccbb8] mt-0.5">
                    Ajustar estrangulador (choke valve) en pasos del 5% hasta normalizar.
                  </p>
                </div>
              </li>

              <li className="p-3 rounded-lg bg-[#1c2028] border border-white/5 flex items-start gap-3">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold mt-0.5">
                  SOP-03
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Temperatura Crítica VFD</p>
                  <p className="text-[11px] text-[#bccbb8] mt-0.5">
                    Verificar sistema de enfriamiento forzado y flujo de ventilación exterior.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/5 text-center">
            <span className="font-mono text-[10px] text-[#869583]">
              SUPERVISIÓN CENTRAL: BOGOTÁ RTOC HUB 1
            </span>
          </div>
        </div>
      </section>

      {/* SIDE DRAWER: RESOLUCIÓN Y CIERRE DE ALERTA */}
      {selectedAlertForDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl h-full bg-[#1E293B] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="p-6 bg-[#0a0e16] flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00B042] text-[26px]">
                  assignment_turned_in
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">Atención & Cierre de Alerta</h2>
                  <span className="font-mono text-[11px] text-[#06B6D4]">
                    REGISTRO AUDITABLE {selectedAlertForDrawer.id}
                  </span>
                </div>
              </div>
              <button onClick={closeDrawer} className="text-[#869583] hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Immutable Data */}
              <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="font-mono text-[10px] text-[#869583]">DATOS INMUTABLES DEL EVENTO</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                      selectedAlertForDrawer.severity === 'CRITICA'
                        ? 'bg-[#EF4444]/20 text-[#EF4444]'
                        : selectedAlertForDrawer.severity === 'ALTA'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {selectedAlertForDrawer.severity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#869583] block">Equipo / Tag:</span>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedAlertForDrawer.tag}</p>
                  </div>
                  <div>
                    <span className="text-[#869583] block">Hora del Evento:</span>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedAlertForDrawer.timestamp}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#869583] block">Variable & Desviación:</span>
                    <p className="text-sm text-white font-sans font-medium mt-0.5">
                      {selectedAlertForDrawer.variable}
                    </p>
                    <p className="text-xs text-[#EF4444] font-bold mt-0.5">
                      {selectedAlertForDrawer.value} {selectedAlertForDrawer.unit} ({selectedAlertForDrawer.threshold})
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-[#869583] uppercase tracking-wider block">
                  Verificación de Campo Requerida
                </span>
                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#111827] border border-white/5 cursor-pointer hover:bg-[#181c24] transition-all">
                  <input
                    type="checkbox"
                    checked={fieldConfirmed}
                    onChange={(e) => setFieldConfirmed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#00B042] rounded cursor-pointer"
                  />
                  <span className="text-xs text-[#dfe2ee]">
                    Confirmación telefónica o radial con operador de patio en Campo Rubiales
                  </span>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#111827] border border-white/5 cursor-pointer hover:bg-[#181c24] transition-all">
                  <input
                    type="checkbox"
                    checked={sopExecuted}
                    onChange={(e) => setSopExecuted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#00B042] rounded cursor-pointer"
                  />
                  <span className="text-xs text-[#dfe2ee]">
                    Protocolo SOP ejecutado satisfactoriamente (válvulas e instrumentación verificadas)
                  </span>
                </label>
              </div>

              {/* Justification Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-[#bccbb8] uppercase tracking-wider">
                    Observaciones y Justificación del Operador <span className="text-[#EF4444]">*</span>
                  </label>
                  <span
                    className={`font-mono text-[11px] ${
                      justificationText.trim().length >= 20 ? 'text-[#10B981] font-bold' : 'text-[#F59E0B]'
                    }`}
                  >
                    {justificationText.trim().length} / 20 mín
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={justificationText}
                  onChange={(e) => setJustificationText(e.target.value)}
                  placeholder="Describa de forma precisa la causa raíz y las medidas de mitigación adoptadas en la planta antes de proceder al cierre oficial..."
                  className="w-full bg-[#0a0e16] text-[#dfe2ee] placeholder-[#869583] text-xs p-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00B042] resize-none font-sans"
                ></textarea>
                <p className="font-mono text-[10px] text-[#869583]">
                  Obligatorio por normativa de Auditoría RTOC Ecopetrol (mínimo 20 caracteres).
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-[#0a0e16] border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={closeDrawer}
                className="px-4 py-2 rounded-lg bg-[#262a33] text-xs font-mono text-[#bccbb8] hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCloseAlert}
                disabled={justificationText.trim().length < 20 || !fieldConfirmed || !sopExecuted}
                className="px-6 py-2.5 rounded-lg bg-[#00B042] text-[#0B0F17] font-mono text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                Confirmar Cierre de Alerta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
