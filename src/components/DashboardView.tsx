import React, { useState, useEffect } from 'react';
import { UserRole } from '../types/scada';

interface DashboardViewProps {
  onNavigateAlerts: () => void;
  onNavigateDispatches: () => void;
  onNavigateHistory: () => void;
  userRole?: UserRole;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateAlerts,
  onNavigateDispatches,
  onNavigateHistory,
  userRole = 'OPERADOR',
}) => {
  const [selectedWell, setSelectedWell] = useState('RB-402');
  const [selectedCategory, setSelectedCategory] = useState<'TODOS' | 'VFD' | 'CABEZA' | 'SEPARADORES' | 'TANQUES'>('TODOS');
  const [viewStyle, setViewStyle] = useState<'CARDS' | 'PID'>('CARDS');
  const [isStreaming, setIsStreaming] = useState(true);
  const [latency, setLatency] = useState('1.2s');

  // Real-time jitter for living SCADA telemetry feel
  const [vfdHz, setVfdHz] = useState(58.4);
  const [vfdAmps, setVfdAmps] = useState(84.2);
  const [thpPsi, setThpPsi] = useState(840);
  const [flowBfpd, setFlowBfpd] = useState(1420);
  const [tkVolume, setTkVolume] = useState(9450);
  const [valveOpen, setValveOpen] = useState(false);

  // Modals & Drawers
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [operatorNote, setOperatorNote] = useState('');
  const [showChokeModal, setShowChokeModal] = useState(false);
  const [chokePercent, setChokePercent] = useState(38);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      // Micro variations within realistic bounds
      setVfdHz(Number((58.4 + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setVfdAmps(Number((84.2 + (Math.random() * 0.8 - 0.4)).toFixed(1)));
      setThpPsi(Number((840 + Math.floor(Math.random() * 5 - 2))));
      setFlowBfpd(Number((1420 + Math.floor(Math.random() * 20 - 10))));
      setLatency(`${(1.1 + Math.random() * 0.3).toFixed(1)}s`);
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const toggleStream = () => {
    setIsStreaming(!isStreaming);
    triggerToast(!isStreaming ? 'Telemetría streaming reanudada' : 'Streaming pausado por el operador');
  };

  const handleResolveAlarm = () => {
    if (operatorNote.trim().length < 10) {
      alert('Por favor ingrese una justificación técnica de al menos 10 caracteres para la bitácora.');
      return;
    }
    setValveOpen(true);
    setTkVolume(8920); // Normalized
    setShowAlarmModal(false);
    setOperatorNote('');
    triggerToast('Intervención registrada. Válvula de derivación hacia TK-502 aperturada.');
  };

  const handleForcePoll = () => {
    triggerToast('Enviando trama ping Modbus/MQTT a Gateway LoRa Batería 4...');
    setTimeout(() => {
      triggerToast('Acuse de recibo de Bomba P-201A recibido. Telemetría restablecida.');
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full text-[#dfe2ee] gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-3.5 rounded-xl bg-[#1E293B]/95 backdrop-blur-xl shadow-2xl border border-[#00B042]/30 text-white animate-fade-in">
          <span className="material-symbols-outlined text-[#00B042] text-[22px]">
            check_circle
          </span>
          <div className="flex flex-col pr-3">
            <span className="font-mono text-[10px] text-[#00B042] font-bold tracking-wider">
              SCADA NOTIFICACIÓN
            </span>
            <span className="text-xs font-medium text-[#dfe2ee]">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#869583] hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* TOP CONTEXT BAR & SCADA CONTROLS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-xl bg-[#111827]/90 backdrop-blur-md shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#00B042]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left: Well Selector & Equipment Category Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Active Well Selector */}
          <div className="relative flex items-center bg-[#0B0F17] px-4 py-1.5 rounded-lg border border-white/5 shadow-inner">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#00B042] tracking-widest flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00B042] animate-pulse"></span>
                POZO PRODUCTOR BES
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedWell}
                  onChange={(e) => setSelectedWell(e.target.value)}
                  className="bg-transparent text-[#dfe2ee] text-[16px] font-semibold focus:outline-none cursor-pointer pr-6 py-0.5 appearance-none font-sans"
                >
                  <option className="bg-[#111827] text-white" value="RB-402">
                    Pozo RB-402 (BES - Campo Rubiales)
                  </option>
                  <option className="bg-[#111827] text-white" value="RB-405">
                    Pozo RB-405 (BES Inyector/Productor)
                  </option>
                  <option className="bg-[#111827] text-white" value="CSB-112">
                    Pozo CSB-112 (Gas Lift Activo)
                  </option>
                  <option className="bg-[#111827] text-white" value="LL-88">
                    Pozo LL-88 (Bombeo Mecánico BM)
                  </option>
                </select>
                <span className="material-symbols-outlined text-[18px] text-[#869583] pointer-events-none -ml-5">
                  unfold_more
                </span>
              </div>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#1c2028] rounded-lg border border-white/5">
            {(['TODOS', 'VFD', 'CABEZA', 'SEPARADORES', 'TANQUES'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded font-mono text-[11px] font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#00B042] text-[#0B0F17] shadow-sm'
                    : 'text-[#bccbb8] hover:text-[#dfe2ee] hover:bg-[#262a33]'
                }`}
              >
                {cat === 'VFD' ? 'VFD / BES' : cat === 'CABEZA' ? 'CABEZA POZO' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Streaming Link, Status Semaphore, View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Latency & Stream Toggle */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#0a0e16] border border-white/5">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#bccbb8]">
                <span className={isStreaming ? 'text-[#10B981] font-semibold' : 'text-[#F59E0B] font-semibold'}>
                  {isStreaming ? 'REFRESCO CONTINUO:' : 'STREAMING:'}
                </span>
                <span className="text-[#06B6D4] font-semibold">{isStreaming ? latency : 'PAUSADO'}</span>
                <span>• Link: 100% OK</span>
              </div>
              <span className="font-mono text-[10px] text-[#869583]">
                FREQ: 1000ms • TLS SCADA v3
              </span>
            </div>
            <button
              onClick={toggleStream}
              className="p-1 rounded bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] transition-colors ml-1 cursor-pointer"
              title={isStreaming ? 'Pausar Telemetría' : 'Reanudar Telemetría'}
            >
              <span className={`material-symbols-outlined text-[18px] ${isStreaming ? 'text-[#06B6D4]' : 'text-[#F59E0B]'}`}>
                {isStreaming ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>

          {/* Semaphore Summary */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1c2028] border border-white/5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-mono text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> 12 NORM
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-mono text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span> 2 ADV
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] font-mono text-[10px] font-bold shadow-[0_0_8px_rgba(239,68,68,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping"></span> 1 CRÍT
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#64748B]/20 text-[#64748B] font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]"></span> 1 OFF
            </div>
          </div>

          {/* View Switch: CARDS vs P&ID */}
          <div className="flex items-center bg-[#0a0e16] p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => setViewStyle('CARDS')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-mono text-[11px] font-semibold transition-all ${
                viewStyle === 'CARDS'
                  ? 'bg-[#00B042] text-[#0B0F17] shadow-sm'
                  : 'text-[#bccbb8] hover:text-[#dfe2ee]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">space_dashboard</span>
              CARDS
            </button>
            <button
              onClick={() => setViewStyle('PID')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-mono text-[11px] font-semibold transition-all ${
                viewStyle === 'PID'
                  ? 'bg-[#00B042] text-[#0B0F17] shadow-sm'
                  : 'text-[#bccbb8] hover:text-[#dfe2ee]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              P&ID
            </button>
          </div>
        </div>
      </div>

      {/* CRITICAL TACTICAL BANNER */}
      {!valveOpen ? (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#dfe2ee] shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#EF4444]/30 text-[#EF4444] shrink-0 shadow-[0_0_14px_rgba(239,68,68,0.7)]">
              <span className="material-symbols-outlined text-[22px] animate-pulse">crisis_alert</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EF4444] text-[#0B0F17] font-bold">
                  ALARMA LAHH ACTIVA
                </span>
                <span className="text-[15px] font-semibold text-[#EF4444]">
                  Batería TK-501: Sobrellenado Crítico Inminente
                </span>
              </div>
              <p className="text-xs text-[#bccbb8] mt-0.5">
                Nivel actual 94.5% ({tkVolume.toLocaleString()} BBL). Excede el umbral seguro de 9,000 BBL. Se sugiere conmutación hacia cisterna o recirculación urgente.
              </p>
            </div>
          </div>
          <div className="mt-3 md:mt-0 flex items-center gap-2">
            <button
              onClick={() => setShowAlarmModal(true)}
              className="px-4 py-2 rounded-lg bg-[#EF4444] hover:bg-[#93000a] text-white font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.5)] cursor-pointer"
            >
              GESTIONAR PROTOCOLO
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#dfe2ee]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#10B981] text-[22px]">verified</span>
            <div>
              <span className="font-mono text-[10px] text-[#10B981] font-bold uppercase">SOP-TK-01 EJECUTADO</span>
              <p className="text-xs text-[#dfe2ee]">Derivación hacia TK-502 activa. Nivel TK-501 normalizado en 8,920 BBL.</p>
            </div>
          </div>
          <button
            onClick={() => setValveOpen(false)}
            className="text-xs font-mono text-[#869583] hover:text-white underline"
          >
            Reactivar Simulación
          </button>
        </div>
      )}

      {/* P&ID SCHEMATIC VIEW (Interactive diagram) */}
      {viewStyle === 'PID' && (
        <div className="p-6 rounded-xl bg-[#111827] border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00B042]">account_tree</span>
              <h3 className="text-lg font-bold text-white">Diagrama Esquemático P&ID — Batería 4 Rubiales</h3>
            </div>
            <span className="font-mono text-xs text-[#06B6D4]">NORMA ISA-5.1 • TIEMPO REAL</span>
          </div>

          <div className="w-full h-80 bg-[#0B0F17] rounded-lg border border-white/5 relative p-4 flex items-center justify-between overflow-x-auto">
            {/* Stage 1: Pozo RB-402 */}
            <div className="flex flex-col items-center bg-[#1c2028] p-3 rounded border border-[#F59E0B]/40 min-w-[140px]">
              <span className="font-mono text-[9px] text-[#F59E0B] font-bold">WH-04 PROD</span>
              <div className="w-12 h-12 my-2 rounded-full border-2 border-[#F59E0B] flex items-center justify-center bg-[#F59E0B]/10">
                <span className="material-symbols-outlined text-[#F59E0B] text-[24px]">oil_barrel</span>
              </div>
              <span className="font-bold text-xs text-white">Pozo RB-402</span>
              <span className="font-mono text-[11px] text-[#F59E0B]">{thpPsi} PSI</span>
            </div>

            {/* Pipe 1 */}
            <div className="flex-1 h-1 bg-[#00B042]/50 relative mx-2 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#00B042] text-[16px] animate-pulse">arrow_forward</span>
            </div>

            {/* Stage 2: Choke Valve */}
            <div className="flex flex-col items-center bg-[#1c2028] p-2.5 rounded border border-white/10 min-w-[110px]">
              <span className="font-mono text-[9px] text-[#06B6D4]">FCV-402</span>
              <div className="w-9 h-9 my-1.5 flex items-center justify-center text-[#06B6D4]">
                <span className="material-symbols-outlined text-[26px]">valve</span>
              </div>
              <span className="text-xs text-white">Choke</span>
              <span className="font-mono text-[11px] text-[#06B6D4]">{chokePercent}%</span>
            </div>

            {/* Pipe 2 */}
            <div className="flex-1 h-1 bg-[#00B042]/50 relative mx-2 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#00B042] text-[16px] animate-pulse">arrow_forward</span>
            </div>

            {/* Stage 3: Separador Trifásico */}
            <div className="flex flex-col items-center bg-[#1c2028] p-3 rounded border border-[#10B981]/40 min-w-[150px]">
              <span className="font-mono text-[9px] text-[#10B981] font-bold">TRIPHASIC VESSEL</span>
              <div className="w-20 h-10 my-2 rounded-lg border-2 border-[#10B981] flex items-center justify-center bg-[#10B981]/10">
                <span className="font-mono text-xs font-bold text-[#10B981]">SEP-04</span>
              </div>
              <span className="text-xs text-white">Separador Sur</span>
              <span className="font-mono text-[10px] text-[#06B6D4]">BS&W 42.1%</span>
            </div>

            {/* Pipe 3 */}
            <div className="flex-1 h-1 bg-[#00B042]/50 relative mx-2 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#00B042] text-[16px] animate-pulse">arrow_forward</span>
            </div>

            {/* Stage 4: Tanque TK-501 */}
            <div className={`flex flex-col items-center bg-[#1c2028] p-3 rounded border min-w-[150px] ${valveOpen ? 'border-[#10B981]' : 'border-[#EF4444] animate-pulse'}`}>
              <span className="font-mono text-[9px] text-[#EF4444] font-bold">{valveOpen ? 'EN LÍMITE' : 'LAHH VIOLADO'}</span>
              <div className="w-14 h-14 my-1.5 rounded-t-lg border-2 border-[#EF4444] bg-[#EF4444]/20 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-white">TK-501</span>
              </div>
              <span className="text-xs text-white">Tanque Fiscal</span>
              <span className="font-mono text-[11px] font-bold text-[#EF4444]">{tkVolume.toLocaleString()} BBL</span>
            </div>

            {/* Pipe 4 */}
            <div className="flex-1 h-1 bg-[#64748B]/50 relative mx-2 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#64748B] text-[16px]">arrow_forward</span>
            </div>

            {/* Stage 5: Bomba Despacho */}
            <div className="flex flex-col items-center bg-[#1c2028] p-3 rounded border border-[#64748B] min-w-[130px]">
              <span className="font-mono text-[9px] text-[#64748B]">BOMBA TRANSFER</span>
              <div className="w-10 h-10 my-2 rounded-full border-2 border-[#64748B] flex items-center justify-center text-[#64748B]">
                <span className="material-symbols-outlined text-[22px]">cyclone</span>
              </div>
              <span className="text-xs text-white">P-201A Duplex</span>
              <span className="font-mono text-[10px] text-[#64748B]">STANDBY</span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CARDS GRID (12 Cols / 3 on desktop) */}
      {viewStyle === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* CARD 1: VFD / MOTOR BES (NORMAL) */}
          {(selectedCategory === 'TODOS' || selectedCategory === 'VFD') && (
            <div className="flex flex-col justify-between p-6 rounded-xl bg-[#111827]/85 shadow-md border border-white/5 relative overflow-hidden group hover:shadow-xl hover:border-[#00B042]/30 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981] shadow-[0_0_10px_#10B981]"></div>

              <div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#06B6D4] tracking-wider">
                      <span>MODBUS ID: 0x2A</span>
                      <span className="text-[#869583]">•</span>
                      <span className="text-[#bccbb8]">SUB-SISTEMA BES</span>
                    </div>
                    <h3 className="text-[17px] text-[#dfe2ee] font-semibold flex items-center gap-2 mt-0.5">
                      VFD Motor BES-402
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981] shadow-[0_0_8px_#10B981]"></span>
                      </span>
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] tracking-wider">
                    RUNNING NORM
                  </span>
                </div>

                {/* Primary Dual Values */}
                <div className="grid grid-cols-2 gap-4 my-4 py-3 bg-[#0B0F17]/60 rounded-lg px-4 border border-white/5">
                  <div>
                    <span className="font-mono text-[10px] text-[#869583] uppercase block">
                      Frecuencia Drive
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono text-[26px] font-bold text-[#10B981]">
                        {vfdHz}
                      </span>
                      <span className="font-mono text-[11px] text-[#bccbb8]">Hz</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#869583]">Rango: 45.0 - 60.0 Hz</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#869583] uppercase block">
                      Corriente BES
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono text-[26px] font-bold text-[#dfe2ee]">
                        {vfdAmps}
                      </span>
                      <span className="font-mono text-[11px] text-[#bccbb8]">A</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#10B981]">Carga Balanceada</span>
                  </div>
                </div>

                {/* Secondary 3-metric strip */}
                <div className="grid grid-cols-3 gap-2 text-center py-2 bg-[#181c24] rounded-lg border border-white/5">
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">VOLTAJE</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      4,160 <span className="text-[10px] text-[#869583]">V</span>
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">VELOCIDAD</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      3,480 <span className="text-[10px] text-[#869583]">RPM</span>
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">POTENCIA</span>
                    <span className="font-mono text-[13px] font-semibold text-[#52e16c]">
                      485 <span className="text-[10px] text-[#869583]">kW</span>
                    </span>
                  </div>
                </div>

                {/* Motor Winding Temp & Progress */}
                <div className="mt-4 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#bccbb8] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#00B042]">
                        thermostat
                      </span>
                      Temp. Devanado Motor
                    </span>
                    <span className="text-[#10B981] font-semibold">
                      82°C <span className="text-[#869583]">/ MAX 110°C</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#1c2028] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full rounded-full transition-all" style={{ width: '74.5%' }}></div>
                  </div>
                </div>
              </div>

              {/* Sparkline Drive Stability */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#869583]">ESTABILIDAD DRIVE (10m)</span>
                <svg className="w-28 h-6 text-[#10B981]" fill="none" viewBox="0 0 100 24">
                  <path d="M0,14 L12,13 L24,15 L36,12 L48,13 L60,11 L72,13 L84,12 L100,12" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                  <path d="M0,14 L12,13 L24,15 L36,12 L48,13 L60,11 L72,13 L84,12 L100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.1"></path>
                </svg>
              </div>
            </div>
          )}

          {/* CARD 2: CABEZA DE POZO RB-402 (ADVERTENCIA) */}
          {(selectedCategory === 'TODOS' || selectedCategory === 'CABEZA') && (
            <div className="flex flex-col justify-between p-6 rounded-xl bg-[#111827]/85 shadow-md border border-white/5 relative overflow-hidden group hover:shadow-xl hover:border-[#F59E0B]/30 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]"></div>

              <div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#F59E0B] tracking-wider">
                      <span>WH-SENSOR #04</span>
                      <span className="text-[#869583]">•</span>
                      <span className="text-[#bccbb8]">SUPERFICIE COLECTOR</span>
                    </div>
                    <h3 className="text-[17px] text-[#dfe2ee] font-semibold flex items-center gap-2 mt-0.5">
                      Cabeza de Pozo RB-402
                      <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B] animate-pulse shadow-[0_0_8px_#F59E0B]"></span>
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    ADVERTENCIA
                  </span>
                </div>

                {/* THP Alert Metric */}
                <div className="my-4 p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#F59E0B] uppercase font-semibold">
                      Presión en Cabeza (THP)
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#F59E0B]/30 text-[#F59E0B] font-bold">
                      HIPER-PRESIÓN
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-[28px] font-bold text-[#F59E0B]">{thpPsi}</span>
                      <span className="font-mono text-[11px] text-[#bccbb8]">PSI</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#bccbb8]">
                      Umbral: &lt; 800 PSI (+5.0%)
                    </span>
                  </div>
                  {/* SVG Pressure Climb Line */}
                  <div className="mt-2 w-full h-8 flex items-center">
                    <svg className="w-full h-full text-[#F59E0B]" fill="none" viewBox="0 0 200 32">
                      <path d="M0,24 L30,22 L60,23 L90,19 L120,16 L150,11 L180,6 L200,4" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                      <path d="M0,24 L30,22 L60,23 L90,19 L120,16 L150,11 L180,6 L200,4 L200,32 L0,32 Z" fill="currentColor" fillOpacity="0.15"></path>
                    </svg>
                  </div>
                </div>

                {/* Hydraulic Strip */}
                <div className="grid grid-cols-3 gap-2 text-center py-2 bg-[#181c24] rounded-lg border border-white/5">
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">TEMP. LÍNEA</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      68.5 <span className="text-[10px] text-[#869583]">°C</span>
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">CAUDAL FLUÍDO</span>
                    <span className="font-mono text-[13px] font-semibold text-[#06B6D4]">
                      {flowBfpd.toLocaleString()} <span className="text-[10px] text-[#869583]">BFPD</span>
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">ANULAR (CHP)</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      180 <span className="text-[10px] text-[#869583]">PSI</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Choke Calibration Action */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#869583]">
                  ESTRANGULADOR: CHOKE {chokePercent}%
                </span>
                <button
                  onClick={() => setShowChokeModal(true)}
                  className="px-2.5 py-1 rounded bg-[#262a33] hover:bg-[#353942] text-[#F59E0B] font-mono text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">tune</span> CALIBRAR CHOKE
                </button>
              </div>
            </div>
          )}

          {/* CARD 3: SEPARADOR SEP-04 (NORMAL) */}
          {(selectedCategory === 'TODOS' || selectedCategory === 'SEPARADORES') && (
            <div className="flex flex-col justify-between p-6 rounded-xl bg-[#111827]/85 shadow-md border border-white/5 relative overflow-hidden group hover:shadow-xl hover:border-[#10B981]/30 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981] shadow-[0_0_10px_#10B981]"></div>

              <div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#06B6D4] tracking-wider">
                      <span>TRIPHASIC VESSEL</span>
                      <span className="text-[#869583]">•</span>
                      <span className="text-[#bccbb8]">BATERÍA 4 SUR</span>
                    </div>
                    <h3 className="text-[17px] text-[#dfe2ee] font-semibold flex items-center gap-2 mt-0.5">
                      Separador SEP-04
                      <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></span>
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] tracking-wider">
                    EN ESPECIFICACIÓN
                  </span>
                </div>

                {/* BS&W Visual Ratio */}
                <div className="my-4 bg-[#0B0F17]/60 rounded-lg p-3.5 border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-[#869583]">CORTE DE AGUA (BS&W)</span>
                    <span className="font-mono text-[10px] text-[#52e16c] font-semibold">CRUDO NETO: 57.9%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[26px] font-bold text-[#06B6D4]">42.1%</span>
                    <span className="font-mono text-[11px] text-[#bccbb8]">BS&W Óptimo</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#1c2028] flex overflow-hidden mt-2 border border-white/5">
                    <div className="bg-[#00B042] h-full" style={{ width: '57.9%' }} title="Crudo Neto: 57.9%"></div>
                    <div className="bg-[#06B6D4] h-full" style={{ width: '42.1%' }} title="Agua Formación: 42.1%"></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-[#869583] mt-1.5">
                    <span>CRUDO NETO (57.9%)</span>
                    <span>AGUA FORMACIÓN (42.1%)</span>
                  </div>
                </div>

                {/* Vessel Parameters */}
                <div className="grid grid-cols-3 gap-2 text-center py-2 bg-[#181c24] rounded-lg border border-white/5">
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">INTERFAZ LÍQ.</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      64 <span className="text-[10px] text-[#869583]">%</span>
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">GAS ASOC.</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      2.1 <span className="text-[10px] text-[#869583]">MMSCFD</span>
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">PRESIÓN VASIJA</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      125 <span className="text-[10px] text-[#869583]">PSI</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* DP Valve Status */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-[#bccbb8] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#00B042]">
                    valve
                  </span>
                  Válvula Control DP (FCV-102)
                </span>
                <span className="text-[#52e16c] font-bold">68% Apertura</span>
              </div>
            </div>
          )}

          {/* CARD 4: TANQUES DE ALMACENAMIENTO (ESTADO CRÍTICO) */}
          {(selectedCategory === 'TODOS' || selectedCategory === 'TANQUES') && (
            <div className={`flex flex-col justify-between p-6 rounded-xl bg-[#111827]/95 shadow-2xl border relative overflow-hidden group ${
              valveOpen ? 'border-[#10B981]/30' : 'border-[#EF4444]/40'
            }`}>
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                valveOpen ? 'bg-[#10B981]' : 'bg-[#EF4444] shadow-[0_0_16px_#EF4444] animate-pulse'
              }`}></div>

              <div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-[#EF4444]">
                      <span>PATIO DE TANQUES 500</span>
                      <span className="text-[#869583]">•</span>
                      <span className="text-[#bccbb8]">CAP: 10,000 BBL</span>
                    </div>
                    <h3 className="text-[17px] text-[#dfe2ee] font-semibold flex items-center gap-2 mt-0.5">
                      Tanque Fiscal TK-501
                      <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-90 ${valveOpen ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 shadow-[0_0_12px_#EF4444] ${valveOpen ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></span>
                      </span>
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider ${
                    valveOpen ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444] text-white animate-bounce'
                  }`}>
                    {valveOpen ? 'DERIVADO OK' : 'LAHH ALARMA'}
                  </span>
                </div>

                {/* Schematic Tank Graphic */}
                <div className={`my-4 grid grid-cols-12 gap-4 items-center p-4 rounded-lg border ${
                  valveOpen ? 'bg-[#10B981]/10 border-[#10B981]/20' : 'bg-[#EF4444]/10 border-[#EF4444]/30'
                }`}>
                  {/* Vertical Cylinder */}
                  <div className="col-span-4 flex flex-col items-center">
                    <div className="w-16 h-28 bg-[#1c2028] rounded-t-lg border-2 border-[#EF4444]/50 relative overflow-hidden flex flex-col justify-end p-0.5 shadow-inner">
                      <div className="absolute top-2 left-0 right-0 h-0.5 bg-[#EF4444]/70 z-10"></div>
                      <div className="absolute top-6 left-0 right-0 h-0.5 bg-[#F59E0B]/50 z-10"></div>
                      <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-[#10B981]/30 z-10"></div>
                      <div
                        className={`w-full rounded-t transition-all duration-700 relative overflow-hidden ${
                          valveOpen ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                        }`}
                        style={{ height: valveOpen ? '89.2%' : '94.5%' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#EF4444] mt-1">
                      {valveOpen ? '89.2% NORMAL' : '94.5% LLENO'}
                    </span>
                  </div>

                  {/* Volume Metrics */}
                  <div className="col-span-8 flex flex-col justify-center">
                    <span className="font-mono text-[10px] text-[#869583]">VOLUMEN FISCAL ACTUAL</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-[28px] font-extrabold text-[#EF4444]">
                        {tkVolume.toLocaleString()}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-white">BBL</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#EF4444] font-bold mt-0.5">
                      {valveOpen ? 'OPERANDO BAJO LÍMITE SEGURO' : 'REBASADO LÍMITE SEGURO (90% = 9,000 BBL)'}
                    </span>
                    <div className="mt-2 flex items-center gap-2 text-xs font-mono text-[#bccbb8]">
                      <span>TEMP: 54°C</span>
                      <span className="text-[#869583]">•</span>
                      <span className="text-[#F59E0B]">ESPUMA: DETECTADA</span>
                    </div>
                  </div>
                </div>

                {/* Warning note */}
                <div className="p-2.5 bg-[#181c24] rounded-lg text-xs text-[#EF4444] flex items-start gap-2 border border-white/5">
                  <span className="material-symbols-outlined text-[18px] shrink-0">report_problem</span>
                  <span className="text-[#dfe2ee] leading-tight">
                    {valveOpen
                      ? 'Flujo transferido hacia tanque auxiliar. Monitorear aforo en 15 minutos.'
                      : 'Riesgo inminente de sobreflujo. Recircular hacia TK-502 o activar isla de cargadero.'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#869583]">TK-502 DISP: 4,200 BBL</span>
                <button
                  onClick={() => {
                    if (valveOpen) {
                      setValveOpen(false);
                      setTkVolume(9450);
                    } else {
                      setShowAlarmModal(true);
                    }
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-[10px] font-bold transition-all cursor-pointer ${
                    valveOpen
                      ? 'bg-[#262a33] text-[#bccbb8] hover:text-white'
                      : 'bg-[#EF4444] hover:bg-[#93000a] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  }`}
                >
                  {valveOpen ? 'REINICIAR VÁLVULA' : 'APERTURA VÁLVULA DERIVACIÓN'}
                </button>
              </div>
            </div>
          )}

          {/* CARD 5: BOMBA P-201A DUPLEX (SIN SEÑAL) */}
          {(selectedCategory === 'TODOS' || selectedCategory === 'SEPARADORES') && (
            <div className="flex flex-col justify-between p-6 rounded-xl bg-[#111827]/75 shadow-md border border-white/5 relative overflow-hidden group hover:border-[#64748B]/40 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#64748B]"></div>

              <div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#64748B] tracking-wider">
                      <span>MQTT TOPIC: /P201/TELEMETRY</span>
                      <span className="text-[#869583]">•</span>
                      <span className="text-[#bccbb8]">TRANSFERENCIA CRUDO</span>
                    </div>
                    <h3 className="text-[17px] text-[#bccbb8] font-semibold flex items-center gap-2 mt-0.5">
                      Bomba P-201A Duplex
                      <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]"></span>
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#64748B]/20 text-[#64748B] tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">cloud_off</span>
                    SIN SEÑAL
                  </span>
                </div>

                {/* Offline Diagnostic */}
                <div className="my-4 p-3.5 bg-[#0B0F17]/80 rounded-lg flex flex-col gap-1.5 border border-white/5">
                  <div className="flex items-center justify-between text-[#64748B] font-mono text-[10px]">
                    <span className="uppercase font-bold">DESCONEXIÓN DETECTADA</span>
                    <span>HACE 14 MIN</span>
                  </div>
                  <p className="text-xs text-[#bccbb8]">
                    Pérdida de tramas MQTT desde las 14:18:02 UTC-5. No hay acuse de recibo en Broker Mosquitto Cluster 02.
                  </p>
                  <div className="p-2 rounded bg-[#1c2028] text-[10px] font-mono text-[#869583] flex items-center gap-1.5 mt-1 border border-white/5">
                    <span className="material-symbols-outlined text-[14px] text-[#F59E0B]">contact_support</span>
                    Check gateway LoRaWAN o nodo celular de campo Batería 4.
                  </div>
                </div>

                {/* Last known reading */}
                <div className="grid grid-cols-2 gap-2 text-center py-2 bg-[#0a0e16]/80 rounded-lg opacity-60 border border-white/5">
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">ÚLTIMO CAUDAL</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      650 <span className="text-[10px] text-[#869583]">GPM</span>
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#869583] block">ÚLTIMA VIBRACIÓN</span>
                    <span className="font-mono text-[13px] font-semibold text-[#dfe2ee]">
                      2.1 <span className="text-[10px] text-[#869583]">mm/s</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Polling Action */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#869583]">REINTENTOS: 12 FALLIDOS</span>
                <button
                  onClick={handleForcePoll}
                  className="px-2.5 py-1 rounded bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-mono text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span> FORZAR POLLING
                </button>
              </div>
            </div>
          )}

          {/* CARD 6: SKELETON LOADER (SINCRONIZANDO BUS SEP-01) */}
          {selectedCategory === 'TODOS' && (
            <div className="flex flex-col justify-between p-6 rounded-xl bg-[#111827]/50 shadow-md border border-white/5 relative overflow-hidden animate-pulse">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#353942]"></div>

              <div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-28 bg-[#31353e] rounded"></div>
                    <div className="h-4 w-44 bg-[#31353e] rounded"></div>
                  </div>
                  <div className="h-5 w-20 bg-[#31353e] rounded"></div>
                </div>

                <div className="my-4 p-4 bg-[#0B0F17]/40 rounded-lg flex flex-col items-center justify-center gap-2 py-7 border border-white/5">
                  <span className="material-symbols-outlined text-[28px] text-[#06B6D4] animate-spin">
                    sync
                  </span>
                  <span className="font-mono text-[10px] text-[#06B6D4] tracking-wider font-semibold">
                    SINCRONIZANDO BUS DE CAMPO...
                  </span>
                  <span className="text-xs text-[#869583] text-center">
                    Handshake PROFIBUS DP en Separador General SEP-01
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="h-9 bg-[#262a33] rounded"></div>
                  <div className="h-9 bg-[#262a33] rounded"></div>
                  <div className="h-9 bg-[#262a33] rounded"></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="h-3 w-28 bg-[#31353e] rounded"></div>
                <div className="h-5 w-16 bg-[#31353e] rounded"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECONDARY SECTION: INFRASTRUCTURE & EVENT LOG */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Field Photo & Geospatial Monitoring */}
        <div className="xl:col-span-8 p-6 rounded-xl bg-[#111827]/85 border border-white/5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#00B042]">satellite_alt</span>
              <div>
                <h4 className="text-[17px] font-semibold text-[#dfe2ee]">
                  Batería de Recolección y Deshidratación 4
                </h4>
                <span className="font-mono text-[10px] text-[#869583]">
                  GEOLOCALIZACIÓN: 3°55'42.1"N 71°28'10.4"W • CAMPO RUBIALES, META
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#00B042]/10 text-[#00B042] font-mono text-[10px] font-bold border border-[#00B042]/20">
              CIRCULARES 14/14 OPERATIVAS
            </span>
          </div>

          {/* Aerial Industrial Photo Container */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden group shadow-inner border border-white/5 bg-[#0B0F17]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIDsWz8UCF1QrL5esB0CN2BoIaIkYlMe1qIUk0Ss97uI_rpjgS0RXlz4FS_gWpMprnoes2m3zUD3Qcnh-Tzxq-Us0PUAktUPy2LdLRsfJjNSwudm-gcglSWQw2qcNqPsFQ5MZAl5nRklBIKX8GNV-yfTIfUn7rLwSAI6oJJ6VrnqkZB4q1ogV4oCKr-PXWlei3HuTZFMNjyrJQ-i6RhcFIfdpLdURrxLPreqnTcUaLqnwhNPvGeAUA"
              alt="Campo Rubiales Batería 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fb = e.currentTarget.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
            {/* Fallback industrial gradient container */}
            <div style={{ display: 'none' }} className="w-full h-full bg-gradient-to-br from-[#111827] via-[#0B0F17] to-[#1c2028] items-center justify-center p-6 text-center flex-col">
              <span className="material-symbols-outlined text-[48px] text-[#00B042]/40 mb-2">oil_barrel</span>
              <p className="font-mono text-sm text-[#00B042]">Cámaras Térmicas Batería 4 Rubiales</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent"></div>

            {/* Tactical Overlays */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-col bg-[#0B0F17]/85 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <span className="font-mono text-[10px] text-[#00B042] font-semibold">
                  VOLUMEN TOTAL PROCESADO HOY
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-[24px] font-bold text-white">48,290</span>
                  <span className="font-mono text-xs text-[#bccbb8]">BFPD</span>
                </div>
                <span className="font-mono text-[9px] text-[#869583]">Cumplimiento Meta Diaria: 98.4%</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#0B0F17]/85 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#06B6D4] text-[18px]">air</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-[#869583]">VENTEO SEGURO</span>
                    <span className="font-mono text-xs font-bold text-[#06B6D4]">0.02%</span>
                  </div>
                </div>

                <div className="bg-[#0B0F17]/85 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00B042] text-[18px]">local_fire_department</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-[#869583]">GAS QUEMADOR</span>
                    <span className="font-mono text-xs font-bold text-[#00B042]">NORMAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RTOC Live Event Stream Log */}
        <div className="xl:col-span-4 p-6 rounded-xl bg-[#111827]/85 border border-white/5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#06B6D4] text-[20px]">reorder</span>
                <h4 className="text-[17px] font-semibold text-[#dfe2ee]">Trama de Eventos RTOC</h4>
              </div>
              <span className="font-mono text-[10px] text-[#06B6D4] animate-pulse">STREAM LIVE</span>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#EF4444] text-[16px] shrink-0 mt-0.5">error</span>
                  <div>
                    <span className="text-[#EF4444] font-bold text-[11px]">[14:31:55] ALARMA LAHH TK-501</span>
                    <p className="text-[#bccbb8] text-[10px] font-sans">Nivel llegó a 9,450 BBL. Disparador de seguridad 94.5%.</p>
                  </div>
                </div>
                <span className="text-[#869583] text-[9px] shrink-0">1m atrás</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#F59E0B] text-[16px] shrink-0 mt-0.5">warning</span>
                  <div>
                    <span className="text-[#F59E0B] font-bold text-[11px]">[14:28:10] ALTA PRESIÓN THP POZO RB-402</span>
                    <p className="text-[#bccbb8] text-[10px] font-sans">Presión superó los 820 PSI recomendados.</p>
                  </div>
                </div>
                <span className="text-[#869583] text-[9px] shrink-0">4m atrás</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#181c24] border border-white/5 flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#64748B] text-[16px] shrink-0 mt-0.5">wifi_off</span>
                  <div>
                    <span className="text-[#64748B] font-bold text-[11px]">[14:18:02] MQTT TIMEOUT P-201A</span>
                    <p className="text-[#bccbb8] text-[10px] font-sans">Sensor de vibración perdió enlace de red LoRa.</p>
                  </div>
                </div>
                <span className="text-[#869583] text-[9px] shrink-0">14m atrás</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#181c24] border border-white/5 flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#10B981] text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <div>
                    <span className="text-[#10B981] font-bold text-[11px]">[14:10:00] BATCH EXPORT TIMESCALEDB</span>
                    <p className="text-[#bccbb8] text-[10px] font-sans">64,800 puntos de telemetría persistidos exitosamente.</p>
                  </div>
                </div>
                <span className="text-[#869583] text-[9px] shrink-0">22m atrás</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#869583]">BUFFER: 1024 KB/s</span>
            <button
              onClick={() => triggerToast('Descargando volcado binario SCADA de las últimas 4 horas...')}
              className="px-3 py-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-[#06B6D4] font-mono text-[10px] font-semibold transition-colors border border-white/5 cursor-pointer"
            >
              DESCARGAR LOG CRÍTICO
            </button>
          </div>
        </div>
      </div>

      {/* PERMANENT BOTTOM SCADA PIPELINE BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#111827]/95 border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981] shrink-0"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#00B042] font-bold">PIPELINE SCADA ACTIVO</span>
            <span className="text-xs text-[#dfe2ee]">
              Telemetría sincronizada con TimescaleDB • 0 paquetes descartados en los últimos 60 minutos (QoS Nivel 2).
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <button
            onClick={() => onNavigateAlerts()}
            className="px-3.5 py-1.5 rounded-lg bg-[#262a33] hover:bg-[#353942] text-[#06B6D4] font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 border border-white/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            SOP-TK-01 PROTOCOLO DE EMERGENCIA
          </button>
          <button
            onClick={() => triggerToast('Refresco de sincronización de bus forzado satisfactoriamente.')}
            className="px-3.5 py-1.5 rounded-lg bg-[#00B042] hover:bg-[#52e16c] text-[#0B0F17] font-mono text-[11px] font-bold transition-all shadow-md cursor-pointer"
          >
            FORZAR REFRESH TOTAL
          </button>
        </div>
      </div>

      {/* MODAL: GESTIÓN DE ALARMA CRÍTICA LAHH */}
      {showAlarmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-[#111827] border border-[#EF4444]/40 rounded-xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#EF4444] text-[24px]">shield</span>
                <h3 className="text-lg font-bold text-white">Gestión de Alarma Crítica LAHH</h3>
              </div>
              <button
                onClick={() => setShowAlarmModal(false)}
                className="text-[#869583] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#181c24] font-mono text-xs flex flex-col gap-1.5 border border-white/5">
              <div className="flex justify-between">
                <span className="text-[#869583]">EQUIPO AFECTADO:</span>
                <span className="text-white font-bold">Tanque Fiscal TK-501 (Batería 4)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#869583]">MÉTRICA EN INFRACCIÓN:</span>
                <span className="text-[#EF4444] font-bold">9,450 BBL (94.5% Capacidad)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#869583]">LÍMITE MÁXIMO PERMISIBLE:</span>
                <span className="text-white font-bold">9,000 BBL (90.0%)</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-[#bccbb8] font-bold uppercase">
                Observación del Operador RTOC Obligatoria *
              </label>
              <textarea
                value={operatorNote}
                onChange={(e) => setOperatorNote(e.target.value)}
                rows={3}
                placeholder="Escriba la acción de mitigación ejecutada (ej. Apertura de derivación hacia TK-502 iniciada vía SCADA por Ing. Carlos Mendoza)..."
                className="w-full bg-[#0B0F17] rounded-lg p-3 text-xs text-white border border-white/10 focus:outline-none focus:border-[#00B042] font-sans resize-none"
              ></textarea>
              <span className="font-mono text-[10px] text-[#869583]">
                {operatorNote.length} caracteres (mínimo 10 requeridos por norma)
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => setShowAlarmModal(false)}
                className="px-4 py-2 rounded-lg bg-[#262a33] text-[#bccbb8] font-mono text-xs font-semibold hover:bg-[#353942]"
              >
                CANCELAR
              </button>
              <button
                onClick={handleResolveAlarm}
                className="px-5 py-2 rounded-lg bg-[#00B042] text-[#0B0F17] font-mono text-xs font-bold hover:bg-[#52e16c] transition-all shadow-[0_0_12px_rgba(0,176,66,0.4)]"
              >
                REGISTRAR INTERVENCIÓN Y MITIGAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CALIBRAR CHOKE */}
      {showChokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F59E0B]">tune</span>
                <h3 className="text-base font-bold text-white">Calibrar Choke Valve (Pozo RB-402)</h3>
              </div>
              <button onClick={() => setShowChokeModal(false)} className="text-[#869583] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[#869583]">APERTURA ACTUAL:</span>
                <span className="text-[#06B6D4] font-bold text-base">{chokePercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={chokePercent}
                onChange={(e) => setChokePercent(Number(e.target.value))}
                className="w-full accent-[#00B042] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#869583]">
                <span>10% (Alta restricción)</span>
                <span>80% (Flujo libre)</span>
              </div>
              <p className="text-xs text-[#bccbb8]">
                Ajustar el estrangulador en pasos de 5% según procedimiento SOP-02 para regular sobrepresión en cabeza de pozo.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowChokeModal(false)}
                className="px-4 py-2 rounded-lg bg-[#262a33] text-xs font-mono text-white"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowChokeModal(false);
                  triggerToast(`Choke calibrado al ${chokePercent}%. Enviando comando a actuador hidráulico.`);
                }}
                className="px-4 py-2 rounded-lg bg-[#00B042] text-[#0B0F17] text-xs font-mono font-bold"
              >
                Aplicar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
