import React, { useState } from 'react';
import { TelemetryEventPayload } from '../types/scada';

interface SimulationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerOfflineTest: () => void;
  triggerToast: (msg: string) => void;
}

export const SimulationDrawer: React.FC<SimulationDrawerProps> = ({
  isOpen,
  onClose,
  onTriggerOfflineTest,
  triggerToast,
}) => {
  const [isBurstRunning, setIsBurstRunning] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const [burstLatency, setBurstLatency] = useState(124);
  const [showSecurityTestResult, setShowSecurityTestResult] = useState(false);

  // Sample live payload matching TRD 3.2
  const samplePayload: TelemetryEventPayload = {
    equipoId: 'b8a1c92d-402a-44e2-a05e-f78a01bf2804',
    timestamp: new Date().toISOString(),
    metrics: {
      presion: 842.1,
      temperatura: 68.9,
      caudal: 3240,
      frecuenciaVfd: 58.4,
    },
  };

  const startBurstTest = () => {
    setIsBurstRunning(true);
    setBurstCount(0);
    triggerToast('Iniciando prueba de carga de telemetría (Simulación k6: 1,000 métricas/s)...');

    let count = 0;
    const interval = setInterval(() => {
      count += 125;
      setBurstCount(count);
      setBurstLatency(Math.floor(110 + Math.random() * 30));

      if (count >= 1000) {
        clearInterval(interval);
        setIsBurstRunning(false);
        triggerToast('Prueba k6 completada: 1,000 métricas ingeridas en 1.0s con 0% pérdida de paquetes (PRD 5.2).');
      }
    }, 120);
  };

  const runSecurityTest = () => {
    setShowSecurityTestResult(true);
    triggerToast('Prueba de seguridad: Solicitud sin JWT rechazada con código HTTP 401 Unauthorized (PRD 5.3).');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-xl h-full bg-[#1E293B] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-[#0a0e16] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#06B6D4] text-[26px]">
              science
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Laboratorio de Pruebas & Validación</h2>
              <span className="font-mono text-[11px] text-[#06B6D4]">
                COMPORTAMIENTOS CRÍTICOS • PRD SECCIÓN 5
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#869583] hover:text-white">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Test 1: Desconexión Telemetría (PRD 5.1) */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F59E0B]">wifi_off</span>
                <h3 className="font-bold text-white text-sm">1. Desconexión de Telemetría (Heartbeat Timeout)</h3>
              </div>
              <span className="font-mono text-[10px] text-[#F59E0B] font-bold">PRD 5.1</span>
            </div>
            <p className="text-[#bccbb8]">
              Evalúa la transición automática a estado <strong className="text-white">OFFLINE</strong> y la emisión inmediata de una alarma cuando un equipo interrumpe la emisión de señales en el broker.
            </p>
            <button
              onClick={() => {
                onTriggerOfflineTest();
                triggerToast('Transición a OFFLINE simulada. Alerta generada automáticamente en el Centro de Alertas.');
              }}
              className="w-full py-2.5 rounded-lg bg-[#F59E0B]/20 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0B0F17] font-mono text-xs font-bold transition-all cursor-pointer border border-[#F59E0B]/30 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">sensors_off</span>
              Simular Pérdida de Heartbeat en Bomba P-201A
            </button>
          </div>

          {/* Test 2: Carga Simultánea (PRD 5.2 / TRD 4) */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00B042]">speed</span>
                <h3 className="font-bold text-white text-sm">2. Carga Simultánea (k6: 1,000 métricas/s)</h3>
              </div>
              <span className="font-mono text-[10px] text-[#00B042] font-bold">PRD 5.2</span>
            </div>
            <p className="text-[#bccbb8]">
              Valida que la ingesta masiva por Kafka/RabbitMQ hacia el dashboard no cause degradación en la latencia (&lt; 500ms) ni descarte paquetes.
            </p>

            {burstCount > 0 && (
              <div className="p-3 rounded-lg bg-[#1c2028] font-mono text-xs space-y-2 border border-white/5">
                <div className="flex justify-between">
                  <span className="text-[#869583]">MÉTRICAS INGERIDAS:</span>
                  <span className="text-white font-bold">{burstCount} / 1,000</span>
                </div>
                <div className="w-full bg-[#0B0F17] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#00B042] h-full transition-all" style={{ width: `${(burstCount / 1000) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#869583]">LATENCIA STREAMING:</span>
                  <span className="text-[#06B6D4] font-bold">{burstLatency} ms</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#869583]">PAQUETES DESCARTADOS:</span>
                  <span className="text-[#10B981] font-bold">0 (0.00%)</span>
                </div>
              </div>
            )}

            <button
              onClick={startBurstTest}
              disabled={isBurstRunning}
              className="w-full py-2.5 rounded-lg bg-[#00B042] hover:bg-[#52e16c] text-[#0B0F17] font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              {isBurstRunning ? 'Ejecutando Ráfaga...' : 'Disparar Ráfaga 1,000 Métricas/s'}
            </button>
          </div>

          {/* Test 3: Endpoint Security (PRD 5.3) */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#EF4444]">lock</span>
                <h3 className="font-bold text-white text-sm">3. Seguridad de Endpoint (Rechazo 401)</h3>
              </div>
              <span className="font-mono text-[10px] text-[#EF4444] font-bold">PRD 5.3</span>
            </div>
            <p className="text-[#bccbb8]">
              Comprueba el bloqueo de endpoints protegidos ante peticiones no autenticadas o con token JWT alterado.
            </p>

            {showSecurityTestResult && (
              <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 font-mono text-xs space-y-1">
                <span className="text-[#EF4444] font-bold block">HTTP/1.1 401 Unauthorized</span>
                <p className="text-[#dfe2ee] text-[11px] font-sans">
                  "Error: Token JWT ausente o firma inválida. Acceso denegado a /api/v1/telemetria."
                </p>
              </div>
            )}

            <button
              onClick={runSecurityTest}
              className="w-full py-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-white font-mono text-xs border border-white/10 cursor-pointer"
            >
              Simular Solicitud No Autenticada
            </button>
          </div>

          {/* Test 4: Inspector de Payload AsyncAPI (TRD 3.2) */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#06B6D4] font-bold">
                Esquema de Evento AsyncAPI (TRD 3.2)
              </span>
              <span className="font-mono text-[10px] text-[#869583]">JSON SCHEMA</span>
            </div>
            <pre className="p-3 rounded-lg bg-[#0a0e16] text-[#7bd0ff] font-mono text-[10px] overflow-x-auto border border-white/5">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0e16] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#262a33] hover:bg-[#353942] text-white text-xs font-mono cursor-pointer"
          >
            Cerrar Laboratorio
          </button>
        </div>
      </div>
    </div>
  );
};
