import React, { useState } from 'react';
import { TelemetryPoint } from '../types/scada';

const telemetryRecords: TelemetryPoint[] = [
  {
    timeStr: '2025-10-24 14:20:00',
    timestamp: '14:20:00',
    thpPressure: 842.1,
    vfdFrequency: 58.4,
    temperature: 68.9,
    flowRate: 3240,
    voltage: 462.4,
    current: 74.2,
    transmissionStatus: 'CRÍTICO',
  },
  {
    timeStr: '2025-10-24 14:15:00',
    timestamp: '14:15:00',
    thpPressure: 795.8,
    vfdFrequency: 58.4,
    temperature: 68.7,
    flowRate: 3210,
    voltage: 461.8,
    current: 73.9,
    transmissionStatus: 'ADVERTENCIA',
  },
  {
    timeStr: '2025-10-24 14:10:00',
    timestamp: '14:10:00',
    thpPressure: 742.3,
    vfdFrequency: 58.0,
    temperature: 67.9,
    flowRate: 3180,
    voltage: 460.0,
    current: 72.8,
    transmissionStatus: 'NORMAL',
  },
  {
    timeStr: '2025-10-24 14:05:00',
    timestamp: '14:05:00',
    thpPressure: 718.5,
    vfdFrequency: 57.8,
    temperature: 67.5,
    flowRate: 3140,
    voltage: 459.2,
    current: 72.1,
    transmissionStatus: 'NORMAL',
  },
  {
    timeStr: '2025-10-24 14:00:00',
    timestamp: '14:00:00',
    thpPressure: 692.1,
    vfdFrequency: 57.5,
    temperature: 67.2,
    flowRate: 3120,
    voltage: 458.0,
    current: 71.8,
    transmissionStatus: 'NORMAL',
  },
  {
    timeStr: '2025-10-24 13:55:00',
    timestamp: '13:55:00',
    thpPressure: 680.4,
    vfdFrequency: 57.5,
    temperature: 66.8,
    flowRate: 3110,
    voltage: 457.8,
    current: 71.5,
    transmissionStatus: 'NORMAL',
  },
  {
    timeStr: '2025-10-24 13:50:00',
    timestamp: '13:50:00',
    thpPressure: 675.2,
    vfdFrequency: 57.2,
    temperature: 66.5,
    flowRate: 3090,
    voltage: 457.0,
    current: 71.2,
    transmissionStatus: 'NORMAL',
  },
  {
    timeStr: '2025-10-24 13:45:00',
    timestamp: '13:45:00',
    thpPressure: 670.0,
    vfdFrequency: 57.0,
    temperature: 66.1,
    flowRate: 3080,
    voltage: 456.5,
    current: 70.9,
    transmissionStatus: 'NORMAL',
  },
];

export const HistoryView: React.FC = () => {
  const [selectedWell, setSelectedWell] = useState('Pozo RB-402');
  const [isWellDropdownOpen, setIsWellDropdownOpen] = useState(false);
  const [timePreset, setTimePreset] = useState<'1H' | '6H' | '24H' | '7D' | '30D'>('24H');
  const [aggregation, setAggregation] = useState('5m');
  const [zoomLevel, setZoomLevel] = useState('1X');

  // Tag visibility
  const [showThp, setShowThp] = useState(true);
  const [showVfd, setShowVfd] = useState(true);
  const [showTemp, setShowTemp] = useState(true);
  const [showFlow, setShowFlow] = useState(false);

  // Secondary Tab
  const [activeTab, setActiveTab] = useState<'neighbors' | 'degradation'>('neighbors');

  // Hover crosshair state on the SVG chart
  const [activeTooltip, setActiveTooltip] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="flex flex-col w-full pb-12 space-y-6 text-[#dfe2ee]">
      {toastMsg && (
        <aside className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl bg-[#1E293B]/95 backdrop-blur-xl shadow-2xl border border-[#00B042]/30 animate-fade-in">
          <span className="material-symbols-outlined text-[#00B042]">check_circle</span>
          <span className="text-xs text-white">{toastMsg}</span>
        </aside>
      )}

      {/* TOP CONTEXT RIBBON & WELL SELECTOR */}
      <div className="relative w-full rounded-xl bg-[#111827]/90 shadow-xl p-4 backdrop-blur-xl border border-white/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Well / Asset Selector */}
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1c2028] text-[#00B042] border border-white/5 shadow-md">
              <span className="material-symbols-outlined text-[26px]">oil_barrel</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#06B6D4] tracking-widest uppercase">
                  ECOPETROL RTOC · CAMPO RUBIALES
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-mono text-[10px] border border-[#10B981]/20">
                  TELEMETRÍA CONTINUA
                </span>
              </div>

              <div className="relative inline-block mt-0.5">
                <button
                  onClick={() => setIsWellDropdownOpen(!isWellDropdownOpen)}
                  className="flex items-center gap-2 text-[17px] font-semibold text-[#dfe2ee] hover:text-[#00B042] transition-colors cursor-pointer"
                >
                  <span>{selectedWell} — Cabeza & VFD ESP-75</span>
                  <span className="material-symbols-outlined text-[20px] text-[#869583]">
                    expand_more
                  </span>
                </button>

                {isWellDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 rounded-xl bg-[#1c2028] border border-white/10 shadow-2xl p-1.5 z-30 space-y-1">
                    <div className="px-3 py-1 font-mono text-[10px] text-[#869583] uppercase">
                      Pozos Batería 4
                    </div>
                    {[
                      { name: 'Pozo RB-402 (Activo)', status: '#10B981' },
                      { name: 'Pozo RB-403 (ESP Batería)', status: '#10B981' },
                      { name: 'Pozo RB-318 (VFD Parado)', status: '#EF4444' },
                      { name: 'Pozo RB-501 (Prueba de Inyección)', status: '#F59E0B' },
                    ].map((w) => (
                      <button
                        key={w.name}
                        onClick={() => {
                          setSelectedWell(w.name.split(' (')[0]);
                          setIsWellDropdownOpen(false);
                          triggerToast(`Cargando serie temporal para ${w.name}...`);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded hover:bg-[#262a33] text-xs font-mono flex items-center justify-between text-[#dfe2ee] transition-colors cursor-pointer"
                      >
                        <span>{w.name}</span>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: w.status }}></span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#869583]">PRESIÓN THP ACTUAL</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[20px] font-bold text-[#06B6D4]">842.1</span>
                <span className="font-mono text-xs text-[#869583]">PSI</span>
                <span className="font-mono text-[10px] text-[#EF4444] font-bold ml-1">▲ ALTA</span>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10"></div>

            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#869583]">FRECUENCIA VFD</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[20px] font-bold text-[#00B042]">58.4</span>
                <span className="font-mono text-xs text-[#869583]">Hz</span>
                <span className="font-mono text-[10px] text-[#10B981] font-bold ml-1">● ESTABLE</span>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10"></div>

            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#869583]">TEMPERATURA CABEZA</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[20px] font-bold text-[#F59E0B]">68.9</span>
                <span className="font-mono text-xs text-[#869583]">°C</span>
                <span className="font-mono text-[10px] text-[#869583] ml-1">+0.4/h</span>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerToast('Generando dataset TimescaleDB en formato CSV/Excel...')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] transition-all border border-white/5 shadow-sm text-xs font-mono cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#06B6D4]">download</span>
              <span>CSV / Excel</span>
            </button>
            <button
              onClick={() => triggerToast('Generando Informe Oficial de Jefatura en PDF...')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00B042] text-[#0B0F17] hover:bg-[#52e16c] font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,176,66,0.35)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>Reporte Jefatura</span>
            </button>
          </div>
        </div>
      </div>

      {/* ANALYTICAL PARAMETERS & FILTER BAR */}
      <div className="w-full rounded-xl bg-[#111827]/85 shadow-md p-4 backdrop-blur-md border border-white/5">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
          {/* Tags Selector */}
          <div className="xl:col-span-4 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-[#869583] uppercase tracking-wider">
              Variables Telemetría (Tags SCADA)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#06B6D4]/15 text-[#06B6D4] cursor-pointer hover:bg-[#06B6D4]/25 transition-all text-xs font-mono">
                <input
                  type="checkbox"
                  checked={showThp}
                  onChange={(e) => setShowThp(e.target.checked)}
                  className="accent-[#06B6D4] h-3.5 w-3.5 rounded"
                />
                <span>Presión THP (PSI)</span>
              </label>

              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00B042]/15 text-[#00B042] cursor-pointer hover:bg-[#00B042]/25 transition-all text-xs font-mono">
                <input
                  type="checkbox"
                  checked={showVfd}
                  onChange={(e) => setShowVfd(e.target.checked)}
                  className="accent-[#00B042] h-3.5 w-3.5 rounded"
                />
                <span>Freq VFD (Hz)</span>
              </label>

              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F59E0B]/15 text-[#F59E0B] cursor-pointer hover:bg-[#F59E0B]/25 transition-all text-xs font-mono">
                <input
                  type="checkbox"
                  checked={showTemp}
                  onChange={(e) => setShowTemp(e.target.checked)}
                  className="accent-[#F59E0B] h-3.5 w-3.5 rounded"
                />
                <span>Temp Fluido (°C)</span>
              </label>

              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c2028] text-[#bccbb8] cursor-pointer hover:text-white transition-all text-xs font-mono">
                <input
                  type="checkbox"
                  checked={showFlow}
                  onChange={(e) => setShowFlow(e.target.checked)}
                  className="accent-[#00B042] h-3.5 w-3.5 rounded"
                />
                <span>Caudal (BFPD)</span>
              </label>
            </div>
          </div>

          {/* Time Presets */}
          <div className="xl:col-span-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#869583] uppercase tracking-wider">
                Ventana de Análisis Temporal
              </span>
              <span className="font-mono text-[10px] text-[#7bd0ff] font-semibold">
                24 Oct 2025 00:00 — 24 Oct 2025 23:59 UTC-5
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex rounded-lg bg-[#1c2028] p-0.5 border border-white/5">
                {(['1H', '6H', '24H', '7D', '30D'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setTimePreset(p);
                      triggerToast(`Ventana temporal ajustada a ${p}`);
                    }}
                    className={`px-3 py-1 rounded font-mono text-[11px] transition-all cursor-pointer ${
                      timePreset === p
                        ? 'bg-[#00B042] text-[#0B0F17] font-bold shadow-sm'
                        : 'text-[#bccbb8] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => triggerToast('Seleccione fecha inicio y fin en el selector modal...')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1c2028] text-xs font-mono text-[#dfe2ee] hover:bg-[#262a33] transition-colors border border-white/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#06B6D4]">calendar_month</span>
                <span>Rango Personalizado</span>
              </button>
            </div>
          </div>

          {/* TimescaleDB Downsampling */}
          <div className="xl:col-span-3 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-[#869583] uppercase tracking-wider">
              Agregación TimescaleDB
            </span>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={aggregation}
                  onChange={(e) => {
                    setAggregation(e.target.value);
                    triggerToast(`Bucket de agregación: ${e.target.value}`);
                  }}
                  className="w-full appearance-none rounded-lg bg-[#1c2028] px-3 py-1.5 font-mono text-xs text-white cursor-pointer focus:outline-none border border-white/5 pr-8"
                >
                  <option value="raw">Lecturas Crudas (1 seg / SCADA)</option>
                  <option value="1m">Promedio 1 min (Alta Res)</option>
                  <option value="5m">Promedio 5 min (Recomendado)</option>
                  <option value="15m">Promedio 15 min</option>
                  <option value="1h">Promedio 1 Hora (Largo Plazo)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-[#869583] pointer-events-none">
                  expand_more
                </span>
              </div>
              <button
                onClick={() => triggerToast('Re-consultando hypertable en TimescaleDB...')}
                className="p-1.5 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-[#00B042] transition-colors border border-white/5 cursor-pointer"
                title="Refrescar consulta"
              >
                <span className="material-symbols-outlined text-[18px]">sync</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY HISTORICAL TRENDS CHART */}
      <div className="relative w-full rounded-xl bg-[#111827] shadow-xl overflow-hidden border border-white/5">
        {/* Top Graph Command Bar */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-[#181c24]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00B042] text-[22px]">show_chart</span>
              <span className="text-base font-semibold text-white">Serie Temporal Multiparámetro</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10 font-mono text-[10px]">
              {showThp && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#06B6D4] rounded-full"></span>
                  <span className="text-[#06B6D4]">THP (0 - 1,000 PSI)</span>
                </div>
              )}
              {showVfd && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#00B042] rounded-full"></span>
                  <span className="text-[#00B042]">VFD (50 - 65 Hz)</span>
                </div>
              )}
              {showTemp && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#F59E0B] rounded-full"></span>
                  <span className="text-[#F59E0B]">Temp (40 - 90 °C)</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#EF4444] border-b border-dashed border-[#EF4444]"></span>
                <span className="text-[#EF4444]">Umbral Crítico (800 PSI)</span>
              </div>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-[#869583]">ZOOM:</span>
            <div className="inline-flex rounded-lg bg-[#1c2028] p-0.5 border border-white/5">
              {(['1X', '2X', '5X', 'Reset'] as const).map((z) => (
                <button
                  key={z}
                  onClick={() => {
                    setZoomLevel(z);
                    triggerToast(`Nivel de zoom: ${z}`);
                  }}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    zoomLevel === z
                      ? 'bg-[#31353e] text-white font-bold'
                      : 'text-[#bccbb8] hover:text-white'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveTooltip(!activeTooltip)}
              className="p-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-[#bccbb8] hover:text-white border border-white/5 cursor-pointer"
              title="Mostrar/ocultar tooltip de pico"
            >
              <span className="material-symbols-outlined text-[18px]">fit_screen</span>
            </button>
            <button
              onClick={() => triggerToast('Modo pantalla completa activado')}
              className="p-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-[#bccbb8] hover:text-white border border-white/5 cursor-pointer"
              title="Pantalla completa"
            >
              <span className="material-symbols-outlined text-[18px]">fullscreen</span>
            </button>
          </div>
        </div>

        {/* MAIN HIGH FIDELITY SVG CHART */}
        <div className="relative w-full h-[440px] px-4 pt-2 pb-4 bg-[#111827] select-none overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
              </linearGradient>

              <pattern id="hudGrid" width="100" height="40" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid */}
            <rect width="1000" height="400" fill="url(#hudGrid)" />

            {/* Horizontal Dashed Reference Lines */}
            <g stroke="rgba(255, 255, 255, 0.07)" strokeDasharray="2 4" strokeWidth="1">
              <line x1="40" y1="50" x2="980" y2="50" />
              <line x1="40" y1="110" x2="980" y2="110" />
              <line x1="40" y1="170" x2="980" y2="170" />
              <line x1="40" y1="230" x2="980" y2="230" />
              <line x1="40" y1="290" x2="980" y2="290" />
              <line x1="40" y1="350" x2="980" y2="350" />
            </g>

            {/* Critical Threshold 800 PSI at y=110 */}
            <line
              x1="40"
              y1="110"
              x2="980"
              y2="110"
              stroke="#EF4444"
              strokeWidth="1.8"
              strokeDasharray="6 4"
              opacity="0.9"
            />
            <rect x="850" y="96" width="130" height="20" rx="3" fill="#93000A" opacity="0.95" />
            <text x="856" y="110" fill="#FFDAD6" fontFamily="JetBrains Mono" fontSize="9.5" fontWeight="700">
              UMBRAL CRÍTICO: 800 PSI
            </text>

            {/* Vertical Time Marker Lines */}
            <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
              <line x1="160" y1="20" x2="160" y2="350" />
              <line x1="280" y1="20" x2="280" y2="350" />
              <line x1="480" y1="20" x2="480" y2="350" />
              <line x1="640" y1="20" x2="640" y2="350" />
              <line x1="800" y1="20" x2="800" y2="350" />
            </g>

            {/* Maintenance Event (06:00 UTC at x=280) */}
            <rect x="235" y="22" width="170" height="26" rx="4" fill="#1E293B" opacity="0.95" />
            <line x1="280" y1="50" x2="280" y2="350" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
            <circle cx="280" cy="50" r="3.5" fill="#F59E0B" />
            <text x="250" y="39" fill="#F59E0B" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700">
              06:00 PARADA MTTO VFD
            </text>

            {/* Curve 1: Temperature Fluid (Amber) */}
            {showTemp && (
              <path
                d="M 40,240 Q 120,235 200,245 T 280,290 T 360,250 T 480,230 T 600,210 T 680,185 T 800,195 T 900,205 T 980,200"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.85"
              />
            )}

            {/* Curve 2: VFD Frequency (Green) */}
            {showVfd && (
              <path
                d="M 40,190 Q 120,188 200,192 L 270,195 L 280,350 L 320,350 L 330,192 Q 440,185 540,180 T 680,140 T 780,175 T 900,180 L 980,180"
                fill="none"
                stroke="#00B042"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            )}

            {/* Curve 3: Wellhead Pressure THP (Cyan) */}
            {showThp && (
              <>
                <path
                  d="M 40,195 Q 120,185 200,175 T 280,230 T 360,185 T 480,165 T 580,130 T 640,115 T 690,88 T 730,120 T 820,135 T 920,140 T 980,145 L 980,350 L 40,350 Z"
                  fill="url(#cyanGradient)"
                />
                <path
                  d="M 40,195 Q 120,185 200,175 T 280,230 T 360,185 T 480,165 T 580,130 T 640,115 T 690,88 T 730,120 T 820,135 T 920,140 T 980,145"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* Active Peak Crosshair Indicator (Time = 14:20:00 at x=690, y=88) */}
            <line x1="690" y1="20" x2="690" y2="350" stroke="#06B6D4" strokeWidth="1.2" strokeDasharray="4 2" opacity="0.8" />
            <circle cx="690" cy="88" r="6" fill="#06B6D4" stroke="#0B0F17" strokeWidth="2" />
            <circle cx="690" cy="88" r="13" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.9" />
            <circle cx="690" cy="140" r="4.5" fill="#00B042" stroke="#0B0F17" strokeWidth="2" />
            <circle cx="690" cy="185" r="4.5" fill="#F59E0B" stroke="#0B0F17" strokeWidth="2" />

            {/* X-Axis Ticks */}
            <text x="40" y="375" fill="#869583" fontFamily="JetBrains Mono" fontSize="11">00:00</text>
            <text x="160" y="375" fill="#869583" fontFamily="JetBrains Mono" fontSize="11">04:00</text>
            <text x="280" y="375" fill="#869583" fontFamily="JetBrains Mono" fontSize="11">08:00</text>
            <text x="480" y="375" fill="#869583" fontFamily="JetBrains Mono" fontSize="11">12:00</text>
            <text x="690" y="375" fill="#06B6D4" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">14:20</text>
            <text x="800" y="375" fill="#869583" fontFamily="JetBrains Mono" fontSize="11">18:00</text>
            <text x="940" y="375" fill="#869583" fontFamily="JetBrains Mono" fontSize="11">23:59</text>

            {/* Y-Axis Ticks */}
            <text x="4" y="54" fill="#06B6D4" fontFamily="JetBrains Mono" fontSize="10">1000</text>
            <text x="4" y="114" fill="#EF4444" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">800</text>
            <text x="4" y="174" fill="#869583" fontFamily="JetBrains Mono" fontSize="10">600</text>
            <text x="4" y="234" fill="#869583" fontFamily="JetBrains Mono" fontSize="10">400</text>
            <text x="4" y="294" fill="#869583" fontFamily="JetBrains Mono" fontSize="10">200</text>
            <text x="4" y="354" fill="#869583" fontFamily="JetBrains Mono" fontSize="10">0 PSI</text>
          </svg>

          {/* Floating High-Precision HUD Tooltip */}
          {activeTooltip && (
            <div className="absolute left-[54%] top-[18%] -translate-x-1/2 w-80 rounded-xl bg-[#1E293B]/95 p-4 shadow-2xl backdrop-blur-xl border border-white/10 z-20">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-ping"></span>
                  <span className="font-mono text-[10px] text-[#EF4444] font-bold">ALERTA DE PICOS RTOC</span>
                </div>
                <span className="font-mono text-[10px] text-[#869583]">14:20:00 UTC-5</span>
              </div>

              <div className="w-full h-px bg-white/10 my-2"></div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#bccbb8] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-[#06B6D4]"></span>
                    Presión THP:
                  </span>
                  <span className="text-[#06B6D4] font-bold">
                    842.0 <span className="text-[#EF4444]">[CRÍTICO]</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#bccbb8] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-[#00B042]"></span>
                    Frecuencia VFD:
                  </span>
                  <span className="text-[#00B042] font-bold">58.4 Hz</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#bccbb8] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-[#F59E0B]"></span>
                    Temperatura Fluido:
                  </span>
                  <span className="text-[#F59E0B] font-bold">68.9 °C</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#bccbb8]">Caudal Calculado:</span>
                  <span className="text-white font-bold">3,240 BFPD</span>
                </div>
              </div>

              <div className="mt-3 pt-2 rounded bg-[#1c2028] p-1.5 text-center font-mono text-[10px] text-[#869583] border border-white/5">
                TimescaleDB Bucket ID: #TB-94182 · SCADA Node Rubiales-04
              </div>
            </div>
          )}
        </div>

        {/* Chart Bottom Status Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#181c24] font-mono text-[10px] text-[#869583] border-t border-white/5">
          <div className="flex items-center gap-4">
            <span>SENSOR: Honeywell ST3000 (THP)</span>
            <span>DRIVE: ABB ACS880 VFD ESP</span>
            <span className="text-[#10B981] font-semibold">RATE COMPUTE: REALTIME-OK</span>
          </div>
          <div className="flex items-center gap-2 text-[#06B6D4] font-semibold">
            <span>1,440 MUESTRAS CARGADAS (100% INTEGRIDAD)</span>
          </div>
        </div>
      </div>

      {/* DETAILED HISTORICAL TELEMETRY LOG (TimescaleDB) */}
      <div className="w-full rounded-xl bg-[#111827] shadow-xl overflow-hidden border border-white/5">
        <div className="flex flex-wrap items-center justify-between p-4 bg-[#181c24] border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#06B6D4] text-[20px]">dataset</span>
              <span className="text-base font-semibold text-white">Registro Histórico TimescaleDB</span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-[#31353e] font-mono text-[10px] text-[#7bd0ff]">
              Hypertable: telemetry_wellhead_rb402
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#869583]">
              <span>Filas por página:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value)}
                className="rounded bg-[#1c2028] px-2 py-1 text-white border border-white/10"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <button
              onClick={() => triggerToast('Abriendo panel de filtrado avanzado de hiper-tablas...')}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-xs font-mono text-[#bccbb8] hover:text-white border border-white/5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>Filtros Avanzados</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0e16] text-[#869583] font-mono text-[10px] uppercase tracking-wider border-b border-white/5">
                <th className="py-3 px-4">Timestamp UTC-5</th>
                <th className="py-3 px-4">Presión THP</th>
                <th className="py-3 px-4">Frecuencia</th>
                <th className="py-3 px-4">Temperatura</th>
                <th className="py-3 px-4">Caudal Est.</th>
                <th className="py-3 px-4">Voltaje</th>
                <th className="py-3 px-4">Corriente</th>
                <th className="py-3 px-4 text-right">Transmisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {telemetryRecords.map((r, idx) => {
                const isCrit = r.transmissionStatus === 'CRÍTICO';
                const isAdv = r.transmissionStatus === 'ADVERTENCIA';

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-[#1c2028]/60 transition-colors ${
                      isCrit ? 'bg-[#EF4444]/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-[#dfe2ee]">{r.timeStr}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${isCrit ? 'text-[#EF4444]' : isAdv ? 'text-[#06B6D4]' : 'text-[#06B6D4]'}`}>
                        {r.thpPressure}
                      </span>
                      <span className="text-[10px] text-[#869583] ml-1">PSI</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[#00B042] font-semibold">{r.vfdFrequency}</span>
                      <span className="text-[10px] text-[#869583] ml-1">Hz</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`${isCrit || isAdv ? 'text-[#F59E0B]' : 'text-white'}`}>
                        {r.temperature}
                      </span>
                      <span className="text-[10px] text-[#869583] ml-1">°C</span>
                    </td>
                    <td className="py-3.5 px-4 text-white">
                      {r.flowRate.toLocaleString()} <span className="text-[10px] text-[#869583]">BFPD</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#bccbb8]">{r.voltage} V</td>
                    <td className="py-3.5 px-4 text-[#bccbb8]">{r.current} A</td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCrit
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : isAdv
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : 'bg-[#10B981]/20 text-[#10B981]'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: isCrit ? '#EF4444' : isAdv ? '#F59E0B' : '#10B981' }}></span>
                        {r.transmissionStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-[#181c24] font-mono text-xs text-[#869583] border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <span>Mostrando registros</span>
            <span className="text-white font-bold">1 - 8</span>
            <span>de</span>
            <span className="text-white font-bold">1,440</span>
            <span className="hidden sm:inline">muestras agregadas a {aggregation}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-white disabled:opacity-30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">first_page</span>
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-white disabled:opacity-30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-2.5 py-0.5 rounded bg-[#00B042] text-[#0B0F17] font-bold">1</span>
            <button onClick={() => setCurrentPage(2)} className="px-2.5 py-0.5 rounded bg-[#1c2028] text-white hover:bg-[#262a33] cursor-pointer">2</button>
            <button onClick={() => setCurrentPage(3)} className="px-2.5 py-0.5 rounded bg-[#1c2028] text-white hover:bg-[#262a33] cursor-pointer">3</button>
            <span>...</span>
            <button onClick={() => setCurrentPage(144)} className="px-2 py-0.5 rounded bg-[#1c2028] text-white hover:bg-[#262a33] cursor-pointer">144</button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
            <button
              onClick={() => setCurrentPage(144)}
              className="p-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECONDARY TAB SECTION: NEIGHBORING WELLS & VFD DEGRADATION */}
      <div className="w-full rounded-xl bg-[#111827] shadow-md overflow-hidden border border-white/5">
        <div className="flex items-center gap-2 px-4 pt-3 bg-[#181c24] border-b border-white/5">
          <button
            onClick={() => setActiveTab('neighbors')}
            className={`px-4 py-2 font-mono text-xs rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'neighbors'
                ? 'text-[#00B042] bg-[#111827] border-t-2 border-[#00B042] font-semibold'
                : 'text-[#869583] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
            <span>Comparativa de Pozos Vecinos (Pad Rubiales 4)</span>
          </button>
          <button
            onClick={() => setActiveTab('degradation')}
            className={`px-4 py-2 font-mono text-xs rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'degradation'
                ? 'text-[#00B042] bg-[#111827] border-t-2 border-[#00B042] font-semibold'
                : 'text-[#869583] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span>Análisis de Degradación VFD</span>
          </button>
        </div>

        {activeTab === 'neighbors' ? (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Empty State Component (Col-7) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-xl bg-[#0a0e16] text-center border border-white/5">
              <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-[#1c2028] shadow-inner mb-4">
                <svg className="h-12 w-12 text-[#869583]" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                  <circle cx="24" cy="24" r="13" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="24" cy="24" r="6" strokeWidth="2" />
                  <line x1="24" y1="24" x2="38" y2="10" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="38" cy="10" r="2" fill="currentColor" />
                </svg>
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#F59E0B]"></span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Sin registros de pozos vecinos</h3>
              <p className="text-xs text-[#bccbb8] max-w-md mb-4">
                No se encontraron registros para el rango seleccionado o el pozo no tiene sensores activos en el pad circundante para este período de 24 horas.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerToast('Filtros espaciales restablecidos')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B042] text-[#0B0F17] font-mono text-xs font-bold hover:bg-[#52e16c] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  <span>Restablecer filtros</span>
                </button>
                <button
                  onClick={() => triggerToast('Consultando telemetría de RB-401 y RB-404...')}
                  className="px-4 py-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-white font-mono text-xs transition-colors border border-white/5 cursor-pointer"
                >
                  Consultar Pozos RB-401 & RB-404
                </button>
              </div>
            </div>

            {/* Skeleton feed (Col-5) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-[#181c24] border border-white/5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#06B6D4] animate-ping"></span>
                    <span className="font-mono text-[10px] text-[#06B6D4] font-bold">
                      SINCRONIZACIÓN EN SEGUNDO PLANO
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#869583]">CARGANDO 2 POZOS...</span>
                </div>

                <div className="p-3 rounded-lg bg-[#1c2028] mb-3 animate-pulse border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-3 w-28 bg-[#31353e] rounded"></div>
                    <div className="h-3 w-16 bg-[#31353e] rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-6 bg-[#31353e]/60 rounded"></div>
                    <div className="h-6 bg-[#31353e]/60 rounded"></div>
                    <div className="h-6 bg-[#31353e]/60 rounded"></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#1c2028] animate-pulse border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-3 w-36 bg-[#31353e] rounded"></div>
                    <div className="h-3 w-12 bg-[#31353e] rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-6 bg-[#31353e]/60 rounded"></div>
                    <div className="h-6 bg-[#31353e]/60 rounded"></div>
                    <div className="h-6 bg-[#31353e]/60 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-[#869583]">
                <span>PIPELINE: Kafka / Timescale Continuous Aggregate</span>
                <span className="text-[#10B981] font-semibold">ACTIVO</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono">Curvas de Degradación del Aislamiento Motor y Rodamientos VFD</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-[#1c2028] border border-white/5">
                <span className="text-[#869583] block">ÍNDICE DE POLARIZACIÓN (PI):</span>
                <span className="text-xl font-bold text-[#10B981] mt-1 block">3.4 (Excelente)</span>
                <p className="text-[10px] text-[#bccbb8] mt-1">Medición megóhmetro a 5000V DC.</p>
              </div>
              <div className="p-4 rounded-lg bg-[#1c2028] border border-white/5">
                <span className="text-[#869583] block">FACTOR DE POTENCIA (COS Φ):</span>
                <span className="text-xl font-bold text-[#06B6D4] mt-1 block">0.89</span>
                <p className="text-[10px] text-[#bccbb8] mt-1">Eficiencia electromecánica normal.</p>
              </div>
              <div className="p-4 rounded-lg bg-[#1c2028] border border-white/5">
                <span className="text-[#869583] block">HORAS OPERATIVAS ACUMULADAS:</span>
                <span className="text-xl font-bold text-white mt-1 block">14,280 Horas</span>
                <p className="text-[10px] text-[#bccbb8] mt-1">Próximo mantenimiento en 2,720 horas.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
