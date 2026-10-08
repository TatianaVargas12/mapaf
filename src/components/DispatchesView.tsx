import React, { useState } from 'react';
import { DispatchTruck } from '../types/scada';

const initialDispatches: DispatchTruck[] = [
  {
    id: 'DSP-2025-0841',
    guideNumber: '#940182',
    plateTractor: 'TLR-412',
    plateTank: 'TNQ-884',
    driverName: 'J. Salamanca',
    company: 'Transpetrol S.A.',
    product: 'Castilla Blend',
    apiGravity: '18.8° API',
    volumeBbl: 240,
    bay: 'BAHÍA 01',
    entryTime: '13:45 UTC-5',
    exitTimeEst: 'Salida: 14:40',
    status: 'loading',
    statusLabel: 'CARGANDO',
    progressPercent: 68,
    seals: ['884-A', '884-B'],
    scaleWeightKg: 42180,
  },
  {
    id: 'DSP-2025-0842',
    guideNumber: '#940183',
    plateTractor: 'WOZ-890',
    plateTank: 'TR-1092',
    driverName: 'H. Delgado',
    company: 'Transportes Montejo',
    product: 'Castilla Blend',
    apiGravity: '19.0° API',
    volumeBbl: 300,
    bay: 'BAHÍA 02',
    entryTime: '14:10 UTC-5',
    exitTimeEst: 'Salida: 15:15',
    status: 'loading',
    statusLabel: 'INSPECCIÓN',
    progressPercent: 12,
    seals: ['1092-A'],
    scaleWeightKg: 48500,
  },
  {
    id: 'DSP-2025-0843',
    guideNumber: '#940184',
    plateTractor: 'WF-304',
    plateTank: 'TQ-410',
    driverName: 'C. Quintero',
    company: 'Coltanques S.A.S.',
    product: 'Castilla Blend',
    apiGravity: '18.6° API',
    volumeBbl: 280,
    bay: 'TURNO #1',
    entryTime: '14:22 UTC-5',
    exitTimeEst: 'En espera (10m)',
    status: 'wait',
    statusLabel: 'EN PARQUEO',
    progressPercent: 0,
    scaleWeightKg: 18200, // Tare
  },
  {
    id: 'DSP-2025-0837',
    guideNumber: '#940177',
    plateTractor: 'SKZ-902',
    plateTank: 'ECP-771',
    driverName: 'A. Martínez',
    company: 'Cootranspetrol',
    product: 'Castilla Blend',
    apiGravity: '18.9° API',
    volumeBbl: 260,
    bay: 'SALIDA OK',
    entryTime: '11:15 UTC-5',
    exitTimeEst: 'ETA Barranca: 19:30',
    status: 'route',
    statusLabel: 'EN RUTA • BARRANCABERMEJA',
    progressPercent: 100,
    seals: ['771-A', '771-B', '771-C'],
    scaleWeightKg: 43200,
  },
  {
    id: 'DSP-2025-0830',
    guideNumber: '#940165',
    plateTractor: 'VZZ-551',
    plateTank: 'TNQ-110',
    driverName: 'F. Morales',
    company: 'Transoriente',
    product: 'Castilla Blend',
    apiGravity: '18.7° API',
    volumeBbl: 250,
    bay: 'DESCARGADO',
    entryTime: '08:00 UTC-5',
    exitTimeEst: 'Entrega: 13:50',
    status: 'completed',
    statusLabel: 'COMPLETADO',
    progressPercent: 100,
    seals: ['110-A', '110-B'],
    scaleWeightKg: 41800,
  },
];

export const DispatchesView: React.FC = () => {
  const [dispatches, setDispatches] = useState<DispatchTruck[]>(initialDispatches);
  const [activeTab, setActiveTab] = useState<'all' | 'wait' | 'loading' | 'route' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToastBanner, setShowToastBanner] = useState(true);

  // Modals
  const [showNewDispatchModal, setShowNewDispatchModal] = useState(false);
  const [showManifestModal, setShowManifestModal] = useState<DispatchTruck | null>(null);

  // New dispatch form
  const [newPlate, setNewPlate] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newCompany, setNewCompany] = useState('Transpetrol S.A.');
  const [newVolume, setNewVolume] = useState('260');

  // Flash message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCallNextTruck = () => {
    triggerToast('Llamando cisterna WF-304 (Coltanques) a posicionarse en Bahía 03.');
  };

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newDriver) {
      alert('Complete la placa y nombre del conductor.');
      return;
    }
    const newId = `DSP-2025-08${Math.floor(Math.random() * 50 + 45)}`;
    const newSicom = `#9401${Math.floor(Math.random() * 90 + 10)}`;
    const newRecord: DispatchTruck = {
      id: newId,
      guideNumber: newSicom,
      plateTractor: newPlate.toUpperCase(),
      plateTank: `TQ-${Math.floor(Math.random() * 800 + 100)}`,
      driverName: newDriver,
      company: newCompany,
      product: 'Castilla Blend',
      apiGravity: '18.8° API',
      volumeBbl: Number(newVolume),
      bay: 'TURNO #2',
      entryTime: 'Ahora',
      exitTimeEst: 'En espera (15m)',
      status: 'wait',
      statusLabel: 'EN PARQUEO',
      progressPercent: 0,
      scaleWeightKg: 17800,
    };
    setDispatches([newRecord, ...dispatches]);
    setShowNewDispatchModal(false);
    setNewPlate('');
    setNewDriver('');
    triggerToast(`Despacho ${newId} programado exitosamente con guía SICOM.`);
  };

  const filteredDispatches = dispatches.filter((d) => {
    const matchesTab = activeTab === 'all' || d.status === activeTab;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      d.id.toLowerCase().includes(query) ||
      d.plateTractor.toLowerCase().includes(query) ||
      d.driverName.toLowerCase().includes(query) ||
      d.guideNumber.toLowerCase().includes(query);

    return matchesTab && matchesQuery;
  });

  return (
    <div className="flex flex-col w-full pb-12 space-y-6 text-[#dfe2ee]">
      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <aside className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl bg-[#1E293B]/95 backdrop-blur-xl shadow-2xl border border-[#00B042]/30 animate-fade-in">
          <span className="material-symbols-outlined text-[#00B042]">check_circle</span>
          <span className="text-xs text-white">{toastMessage}</span>
        </aside>
      )}

      {/* TOAST NOTIFICATION: FISCAL VERIFICATION SYSTEM */}
      {showToastBanner && (
        <div className="relative z-30 w-full bg-[#1E293B]/95 rounded-xl p-4 shadow-xl border border-white/5 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] shadow-sm">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#10B981] font-bold tracking-widest uppercase">
                  Validación Fiscal Aprobada
                </span>
                <span className="font-mono text-[10px] text-[#bccbb8] bg-[#1c2028] px-2 py-0.5 rounded border border-white/5">
                  SISTEMA SCADA-SICOM
                </span>
              </div>
              <p className="text-xs text-[#dfe2ee] mt-0.5">
                <strong className="font-semibold text-[#52e16c]">Cisterna ECP-884:</strong> Medición fiscal completada. Precintos certificados{' '}
                <span className="font-mono text-[10px] text-[#c4e7ff] bg-[#111827] px-1.5 py-0.5 rounded border border-white/5">
                  884-A
                </span>{' '}
                y{' '}
                <span className="font-mono text-[10px] text-[#c4e7ff] bg-[#111827] px-1.5 py-0.5 rounded border border-white/5">
                  884-B
                </span>{' '}
                registrados en el sistema de transporte mayorista.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowToastBanner(false)}
            className="p-1.5 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-[#869583] hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* OPERATIONAL HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#00B042] font-mono text-[10px] tracking-widest font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>MÓDULO DE LOGÍSTICA & DESPACHO FISCAL • CAMPO RUBIALES</span>
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mt-0.5">
            Gestión de Despachos de Cisternas
          </h1>
          <p className="text-xs text-[#bccbb8]">
            Supervisión en tiempo real de carga en bahías, aforos de tanques y manifiestos de transporte SICOM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => triggerToast('Descargando planilla de tránsito general consolidada...')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#353942] text-white text-xs font-mono font-medium border border-white/5 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#06B6D4] text-[18px]">description</span>
            <span>Planilla de Tránsito & Guías SICOM</span>
          </button>
          <button
            onClick={() => setShowNewDispatchModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B042] hover:bg-[#52e16c] text-[#0B0F17] text-xs font-mono font-bold shadow-[0_0_16px_rgba(0,176,66,0.4)] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Programar Nuevo Despacho</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE KPI TELEMETRY DECK (4 BENTO CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#111827]/90 rounded-xl p-4 shadow-lg border border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#bccbb8] tracking-wider uppercase">
              DESPACHOS DEL DÍA
            </span>
            <span className="material-symbols-outlined text-[#00B042] text-[20px]">oil_barrel</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-mono text-[28px] font-bold text-white">18</span>
            <span className="font-mono text-[11px] text-[#869583]">CISTERNAS TOTAL</span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-1 bg-[#181c24] rounded-lg p-1.5 text-center border border-white/5">
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-[#10B981]">12</span>
              <span className="font-mono text-[8.5px] text-[#bccbb8]">DESPACHADAS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-[#F59E0B]">4</span>
              <span className="font-mono text-[8.5px] text-[#bccbb8]">EN PROCESO</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-[#7bd0ff]">2</span>
              <span className="font-mono text-[8.5px] text-[#bccbb8]">PROGRAMADAS</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#111827]/90 rounded-xl p-4 shadow-lg border border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#bccbb8] tracking-wider uppercase">
              VOLUMEN DESPACHADO HOY
            </span>
            <span className="material-symbols-outlined text-[#06B6D4] text-[20px]">water_drop</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-mono text-[28px] font-bold text-white">4,320</span>
            <span className="font-mono text-xs font-semibold text-[#06B6D4]">BBL</span>
          </div>
          <div className="flex items-center justify-between bg-[#181c24] rounded-lg p-2 mt-auto border border-white/5">
            <span className="font-mono text-[9px] text-[#bccbb8]">CALIDAD / PRODUCTO</span>
            <span className="font-mono text-[10px] text-white font-semibold">Crudo Castilla (18.8° API)</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#111827]/90 rounded-xl p-4 shadow-lg border border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#bccbb8] tracking-wider uppercase">
              DISPONIBILIDAD BATERÍA 4
            </span>
            <span className="font-mono text-[10px] text-[#00B042] font-bold">59.2% CAPACIDAD</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="font-mono text-[28px] font-bold text-white">14,800</span>
            <span className="font-mono text-[11px] text-[#869583]">/ 25,000 BBL</span>
          </div>
          <div className="w-full bg-[#1c2028] rounded-full h-2 mb-1 overflow-hidden">
            <div className="bg-[#00B042] h-full rounded-full" style={{ width: '59.2%' }}></div>
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] text-[#bccbb8]">
            <span>STOCK FISCAL DISPONIBLE</span>
            <span className="text-[#10B981]">Aforo Óptimo</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#111827]/90 rounded-xl p-4 shadow-lg border border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#bccbb8] tracking-wider uppercase">
              TIEMPO PROMEDIO BAHÍA
            </span>
            <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">timer</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-mono text-[28px] font-bold text-white">38</span>
            <span className="font-mono text-xs font-semibold text-[#7bd0ff]">MINUTOS / CIS</span>
          </div>
          <div className="flex items-center justify-between bg-[#181c24] rounded-lg p-2 mt-auto border border-white/5 font-mono text-[9px]">
            <span className="text-[#10B981] flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[13px]">trending_down</span> -4 min vs SLA
            </span>
            <span className="text-[#bccbb8]">TARGET ≤ 45 MIN</span>
          </div>
        </div>
      </div>

      {/* BAHÍAS DE LLENADO EN TIEMPO REAL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#06B6D4] text-[22px]">
              precision_manufacturing
            </span>
            <h2 className="text-lg font-bold text-white">Bahías de Llenado en Tiempo Real</h2>
            <span className="font-mono text-[10px] text-[#06B6D4] px-2 py-0.5 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20">
              TELEMETRÍA PLC ACTIVA
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#bccbb8]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span> 1 Libre</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> 1 En Espera</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#06B6D4]"></span> 1 Bombeando</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bay 1: Cargando ECP-884 */}
          <div className="bg-[#111827]/95 rounded-xl p-5 shadow-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="h-1 w-full bg-[#06B6D4] absolute top-0 left-0"></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#06B6D4]/20 text-[#06B6D4] font-mono text-[10px] font-bold">
                    BAHÍA 01
                  </span>
                  <span className="font-mono text-[10px] text-[#10B981] flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> OCUPADA
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#869583]">BRAZO AUTOMÁTICO #1</span>
              </div>

              <div className="flex items-center justify-between mb-4 bg-[#181c24] rounded-lg p-3 border border-white/5">
                <div>
                  <span className="font-mono text-[9px] text-[#869583] block">CISTERNA ACTIVA</span>
                  <h3 className="text-base font-bold text-white">ECP-884</h3>
                  <span className="text-[11px] text-[#bccbb8]">Capacidad: 240 BBL</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px] text-[#06B6D4] uppercase block">Estado de Proceso</span>
                  <div className="text-sm font-bold text-[#06B6D4]">Cargando (68%)</div>
                  <span className="font-mono text-[11px] text-white">163.2 / 240 BBL</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1c2028] rounded-full h-3 mb-4 overflow-hidden p-0.5 border border-white/5">
                <div className="bg-[#06B6D4] h-full rounded-full transition-all shadow-[0_0_8px_#06B6D4]" style={{ width: '68%' }}></div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#1c2028] p-2 rounded-lg flex flex-col border border-white/5">
                  <span className="font-mono text-[9px] text-[#869583]">CAUDAL DE CARGA</span>
                  <span className="font-mono text-sm font-bold text-white">
                    12.0 <span className="text-[10px] text-[#869583]">BBL/min</span>
                  </span>
                </div>
                <div className="bg-[#1c2028] p-2 rounded-lg flex flex-col border border-white/5">
                  <span className="font-mono text-[9px] text-[#869583]">TIEMPO ESTIMADO RESTANTE</span>
                  <span className="font-mono text-sm font-bold text-white">
                    06:24 <span className="text-[10px] text-[#869583]">min</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#10B981]/10 rounded-lg p-2.5 flex items-center justify-between border border-[#10B981]/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#10B981] text-[18px]">bolt</span>
                <span className="text-xs text-white font-medium">Sensor de Puesta a Tierra</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                CONECTADO OK
              </span>
            </div>
          </div>

          {/* Bay 2: Inspección TR-1092 */}
          <div className="bg-[#111827]/95 rounded-xl p-5 shadow-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="h-1 w-full bg-[#F59E0B] absolute top-0 left-0"></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-[10px] font-bold">
                    BAHÍA 02
                  </span>
                  <span className="font-mono text-[10px] text-[#F59E0B] flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span> INSPECCIÓN
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#869583]">BRAZO AUTOMÁTICO #2</span>
              </div>

              <div className="flex items-center justify-between mb-4 bg-[#181c24] rounded-lg p-3 border border-white/5">
                <div>
                  <span className="font-mono text-[9px] text-[#869583] block">CISTERNA ACOPLADA</span>
                  <h3 className="text-base font-bold text-white">TR-1092</h3>
                  <span className="text-[11px] text-[#bccbb8]">Capacidad: 300 BBL</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px] text-[#F59E0B] uppercase block">Fase Protocolar</span>
                  <div className="text-sm font-bold text-[#F59E0B]">Pre-Llenado</div>
                  <span className="font-mono text-[11px] text-white">0 / 300 BBL</span>
                </div>
              </div>

              <div className="w-full bg-[#1c2028] rounded-full h-3 mb-4 overflow-hidden p-0.5 border border-white/5">
                <div className="bg-[#F59E0B] h-full rounded-full transition-all shadow-[0_0_8px_#F59E0B]" style={{ width: '12%' }}></div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#1c2028] p-2 rounded-lg flex flex-col border border-white/5">
                  <span className="font-mono text-[9px] text-[#869583]">OPERADOR A CARGO</span>
                  <span className="text-xs font-semibold text-white truncate">M. Rivas (HSE-02)</span>
                </div>
                <div className="bg-[#1c2028] p-2 rounded-lg flex flex-col border border-white/5">
                  <span className="font-mono text-[9px] text-[#869583]">LISTA DE CHEQUEO</span>
                  <span className="font-mono text-sm font-bold text-[#F59E0B]">
                    7/8 <span className="text-[10px] text-[#869583]">ÍTEMS</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#1c2028] rounded-lg p-2.5 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#06B6D4] text-[18px]">verified_user</span>
                <span className="text-xs text-[#bccbb8]">Línea de Recuperación Vapores</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#31353e] text-white">ACOPLANDO</span>
            </div>
          </div>

          {/* Bay 3: Libre */}
          <div className="bg-[#111827]/95 rounded-xl p-5 shadow-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="h-1 w-full bg-[#10B981] absolute top-0 left-0"></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono text-[10px] font-bold">
                    BAHÍA 03
                  </span>
                  <span className="font-mono text-[10px] text-[#10B981] font-semibold">OPERATIVA</span>
                </div>
                <span className="font-mono text-[10px] text-[#869583]">BRAZO AUTOMÁTICO #3</span>
              </div>

              <div className="flex flex-col items-center justify-center text-center py-6 bg-[#181c24] rounded-lg mb-4 border border-white/5">
                <div className="w-11 h-11 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-2">
                  <span className="material-symbols-outlined text-[26px]">check_circle</span>
                </div>
                <h3 className="text-base font-bold text-white">Bahía Libre</h3>
                <p className="text-xs text-[#bccbb8] mt-0.5">Lista para llamado de turno y posicionamiento de cisterna.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#1c2028] p-2 rounded-lg flex flex-col border border-white/5">
                  <span className="font-mono text-[9px] text-[#869583]">PRESIÓN LÍNEA MATRIZ</span>
                  <span className="font-mono text-sm font-bold text-[#10B981]">
                    42.4 <span className="text-[10px] text-[#869583]">PSI</span>
                  </span>
                </div>
                <div className="bg-[#1c2028] p-2 rounded-lg flex flex-col border border-white/5">
                  <span className="font-mono text-[9px] text-[#869583]">TIEMPO EN ESPERA</span>
                  <span className="font-mono text-sm font-bold text-white">
                    11:15 <span className="text-[10px] text-[#869583]">min</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCallNextTruck}
              className="w-full py-2.5 rounded-lg bg-[#00B042]/20 hover:bg-[#00B042] text-[#00B042] hover:text-[#0B0F17] font-mono text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#00B042]/30"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Llamar Cisterna Siguiente (WF-304)</span>
            </button>
          </div>
        </div>
      </div>

      {/* MASTER LOGISTICS TABLE & SICOM SCHEDULE VIEW */}
      <div className="bg-[#111827]/95 rounded-xl p-5 shadow-xl border border-white/5 flex flex-col">
        {/* Tab Controls & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all' as const, label: `Todos (${dispatches.length})` },
              { id: 'wait' as const, label: `En Parqueo (${dispatches.filter((d) => d.status === 'wait').length})` },
              { id: 'loading' as const, label: `Cargando (${dispatches.filter((d) => d.status === 'loading').length})` },
              { id: 'route' as const, label: `En Ruta (${dispatches.filter((d) => d.status === 'route').length})` },
              { id: 'completed' as const, label: `Completado (${dispatches.filter((d) => d.status === 'completed').length})` },
              { id: 'cancelled' as const, label: 'Cancelados (0)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#00B042] text-[#0B0F17] font-bold shadow-sm'
                    : 'bg-[#1c2028] text-[#bccbb8] hover:bg-[#262a33]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-2 bg-[#1c2028] px-3 py-1.5 rounded-lg border border-white/5 w-full md:w-64">
            <span className="material-symbols-outlined text-[#869583] text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por placa o guía..."
              className="bg-transparent text-xs text-white placeholder-[#869583] focus:outline-none w-full font-sans"
            />
          </div>
        </div>

        {/* Table / Empty State */}
        {filteredDispatches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0e16] font-mono text-[10px] text-[#869583] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4">N° Despacho / Guía</th>
                  <th className="py-3 px-4">Placa Cabezote / Tanque</th>
                  <th className="py-3 px-4">Conductor & Empresa</th>
                  <th className="py-3 px-4">Producto / API</th>
                  <th className="py-3 px-4 text-right">Volumen (BBL)</th>
                  <th className="py-3 px-4 text-center">Bahía</th>
                  <th className="py-3 px-4">Hora Ingreso / Estimada</th>
                  <th className="py-3 px-4">Estado Operativo</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-sans">
                {filteredDispatches.map((truck) => (
                  <tr key={truck.id} className="hover:bg-[#1c2028]/60 transition-all">
                    {/* Guía */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#06B6D4] text-xs leading-tight">
                          {truck.id}
                        </span>
                        <span className="text-[10px] text-[#869583]">SICOM: {truck.guideNumber}</span>
                      </div>
                    </td>

                    {/* Placa */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{truck.plateTractor}</span>
                        <span className="font-mono text-[10px] text-[#bccbb8]">{truck.plateTank}</span>
                      </div>
                    </td>

                    {/* Conductor */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{truck.driverName}</span>
                        <span className="text-[10px] text-[#869583]">{truck.company}</span>
                      </div>
                    </td>

                    {/* Producto */}
                    <td className="py-3.5 px-4">
                      <span className="text-white block">{truck.product}</span>
                      <span className="font-mono text-[10px] text-[#869583]">{truck.apiGravity}</span>
                    </td>

                    {/* Volumen */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className="font-bold text-white text-sm">{truck.volumeBbl}</span>
                      <span className="text-[10px] text-[#869583] ml-1">BBL</span>
                    </td>

                    {/* Bahía */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#1c2028] text-[#7bd0ff] border border-white/5">
                        {truck.bay}
                      </span>
                    </td>

                    {/* Horas */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex flex-col">
                        <span className="text-white text-[11px]">{truck.entryTime}</span>
                        <span className="text-[10px] text-[#06B6D4]">{truck.exitTimeEst}</span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      {truck.status === 'loading' ? (
                        <div className="flex flex-col gap-1 w-32 font-mono">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#F59E0B] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping"></span>
                              {truck.statusLabel}
                            </span>
                            <span className="text-white font-bold">{truck.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-[#1c2028] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: `${truck.progressPercent}%` }}></div>
                          </div>
                        </div>
                      ) : truck.status === 'wait' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#c0c1ff]/15 text-[#c0c1ff] font-mono text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                          EN PARQUEO
                        </span>
                      ) : truck.status === 'route' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#009639]/20 text-[#00B042] font-mono text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[13px]">local_shipping</span>
                          EN RUTA
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981] font-mono text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          COMPLETADO
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setShowManifestModal(truck)}
                          className="p-1.5 rounded hover:bg-[#1c2028] text-[#06B6D4] cursor-pointer"
                          title="Ver Manifiesto Electrónico SICOM"
                        >
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                        <button
                          onClick={() => triggerToast(`Precintos de ${truck.plateTractor}: ${truck.seals?.join(', ') || 'Pendiente'}`)}
                          className="p-1.5 rounded hover:bg-[#1c2028] text-[#10B981] cursor-pointer"
                          title="Inspeccionar Precintos de Seguridad"
                        >
                          <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                        </button>
                        <button
                          onClick={() => triggerToast(`Báscula de patio: Pesaje de ${truck.plateTractor} = ${truck.scaleWeightKg} kg bruto`)}
                          className="p-1.5 rounded hover:bg-[#1c2028] text-[#bccbb8] hover:text-white cursor-pointer"
                          title="Historial de Pesaje"
                        >
                          <span className="material-symbols-outlined text-[18px]">scale</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-[#1c2028] flex items-center justify-center text-[#869583] mb-3">
              <span className="material-symbols-outlined text-[32px]">local_shipping</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Sin despachos cancelados en el turno actual</h3>
            <p className="text-xs text-[#bccbb8] max-w-lg">
              Todas las operaciones logísticas avanzan según la programación de Batería 4. No se registran incidentes ni contingencias que impidan el tránsito.
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-4 px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#353942] text-white text-xs font-mono cursor-pointer"
            >
              Volver a la vista general de despachos
            </button>
          </div>
        )}

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 mt-2 border-t border-white/5 font-mono text-xs text-[#869583]">
          <div className="flex items-center gap-2">
            <span>Mostrando registros operativos 1 - {filteredDispatches.length} de {dispatches.length}</span>
            <span className="text-[10px] bg-[#1c2028] px-2 py-0.5 rounded text-[#bccbb8] border border-white/5">
              BATERÍA 4 • LÍNEA 12"
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="px-2 py-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-white disabled:opacity-40 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <span className="px-3 py-1 rounded bg-[#262a33] text-white font-bold">Pág. 1 de 1</span>
            <button className="px-2 py-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-white disabled:opacity-40 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: PROGRAMAR NUEVO DESPACHO */}
      {showNewDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00B042]">local_shipping</span>
                <h3 className="text-base font-bold text-white">Programar Nuevo Despacho Cisterna</h3>
              </div>
              <button onClick={() => setShowNewDispatchModal(false)} className="text-[#869583] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[#bccbb8] mb-1 font-mono uppercase">Placa Cabezote *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: SKZ-902"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[#bccbb8] mb-1 font-mono uppercase">Conductor Asignado *</label>
                <input
                  type="text"
                  required
                  placeholder="Nombre y Apellidos"
                  value={newDriver}
                  onChange={(e) => setNewDriver(e.target.value)}
                  className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#bccbb8] mb-1 font-mono uppercase">Empresa Transportadora</label>
                  <select
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white"
                  >
                    <option value="Transpetrol S.A.">Transpetrol S.A.</option>
                    <option value="Transportes Montejo">Transportes Montejo</option>
                    <option value="Coltanques S.A.S.">Coltanques S.A.S.</option>
                    <option value="Cootranspetrol">Cootranspetrol</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#bccbb8] mb-1 font-mono uppercase">Volumen Nominado (BBL)</label>
                  <input
                    type="number"
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value)}
                    className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewDispatchModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#1c2028] text-white font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00B042] text-[#0B0F17] font-mono font-bold hover:bg-[#52e16c]"
                >
                  Registrar & Emitir SICOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER MANIFIESTO SICOM */}
      {showManifestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#06B6D4]">receipt_long</span>
                <div>
                  <h3 className="text-base font-bold text-white">Manifiesto de Carga SICOM</h3>
                  <span className="font-mono text-xs text-[#06B6D4]">{showManifestModal.id}</span>
                </div>
              </div>
              <button onClick={() => setShowManifestModal(null)} className="text-[#869583] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between p-2.5 rounded bg-[#1c2028]">
                <span className="text-[#869583]">NÚMERO DE GUÍA:</span>
                <span className="text-white font-bold">{showManifestModal.guideNumber}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-[#1c2028]">
                <span className="text-[#869583]">VEHÍCULO Y TANQUE:</span>
                <span className="text-white font-bold">{showManifestModal.plateTractor} / {showManifestModal.plateTank}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-[#1c2028]">
                <span className="text-[#869583]">CONDUCTOR:</span>
                <span className="text-white font-bold">{showManifestModal.driverName} ({showManifestModal.company})</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-[#1c2028]">
                <span className="text-[#869583]">PRODUCTO / DENSIDAD:</span>
                <span className="text-[#00B042] font-bold">{showManifestModal.product} • {showManifestModal.apiGravity}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-[#1c2028]">
                <span className="text-[#869583]">VOLUMEN FISCAL:</span>
                <span className="text-white font-bold">{showManifestModal.volumeBbl} BBL</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-[#1c2028]">
                <span className="text-[#869583]">PRECINTOS CERTIFICADOS:</span>
                <span className="text-[#7bd0ff] font-bold">{showManifestModal.seals?.join(', ') || '884-A, 884-B'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  triggerToast(`Imprimiendo copia física de manifiesto ${showManifestModal.id}...`);
                  setShowManifestModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#262a33] text-white text-xs font-mono flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Imprimir Copia
              </button>
              <button
                onClick={() => setShowManifestModal(null)}
                className="px-4 py-2 rounded-lg bg-[#00B042] text-[#0B0F17] text-xs font-mono font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
