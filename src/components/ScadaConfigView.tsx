import React, { useState } from 'react';
import { UserRole } from '../types/scada';

interface ScadaConfigViewProps {
  userRole?: UserRole;
}

export const ScadaConfigView: React.FC<ScadaConfigViewProps> = ({ userRole = 'OPERADOR' }) => {
  const [thpHighThreshold, setThpHighThreshold] = useState('800');
  const [thpCriticalThreshold, setThpCriticalThreshold] = useState('840');
  const [tankLahhThreshold, setTankLahhThreshold] = useState('9000');
  const [vfdTempThreshold, setVfdTempThreshold] = useState('90');
  const [modbusPort, setModbusPort] = useState('502');
  const [mqttBroker, setMqttBroker] = useState('mqtt.ecopetrol.internal:8883');
  const [pollingFrequencyMs, setPollingFrequencyMs] = useState('1000');
  const [activeTab, setActiveTab] = useState<'thresholds' | 'networks' | 'erd' | 'audit'>('thresholds');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'ADMIN') {
      triggerToast('Acceso denegado: Solo el perfil ADMIN / Jefe de Planta puede modificar umbrales operacionales y configuración de red (PRD Sección 2 y TRD 2.2).');
      return;
    }
    triggerToast('Configuración SCADA guardada y sincronizada con NODE-BOG-04 con firma AES-256.');
  };

  return (
    <div className="flex flex-col w-full pb-12 space-y-6 text-[#dfe2ee]">
      {toastMessage && (
        <aside className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl bg-[#1E293B]/95 backdrop-blur-xl shadow-2xl border border-[#00B042]/30 animate-fade-in">
          <span className="material-symbols-outlined text-[#00B042]">check_circle</span>
          <span className="text-xs text-white">{toastMessage}</span>
        </aside>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl bg-[#111827]/90 shadow-xl border border-white/5">
        <div>
          <div className="flex items-center gap-1.5 text-[#00B042] font-mono text-[10px] tracking-widest font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>ADMINISTRACIÓN DE SISTEMA SCADA • TIER IV</span>
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mt-0.5">
            Configuración y Calibración SCADA
          </h1>
          <p className="text-xs text-[#bccbb8]">
            Ajuste de umbrales operativos de diseño, mapeo de tags Modbus/MQTT y configuración de gateways satelitales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">
            NODO SINCRONIZADO: NODE-BOG-04
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#181c24] rounded-xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab('thresholds')}
          className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer ${
            activeTab === 'thresholds'
              ? 'bg-[#00B042] text-[#0B0F17] font-bold shadow-sm'
              : 'text-[#bccbb8] hover:text-white'
          }`}
        >
          Umbrales & Límites (HH/H/L/LL)
        </button>
        <button
          onClick={() => setActiveTab('networks')}
          className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer ${
            activeTab === 'networks'
              ? 'bg-[#00B042] text-[#0B0F17] font-bold shadow-sm'
              : 'text-[#bccbb8] hover:text-white'
          }`}
        >
          Comunicaciones & Gateways
        </button>
        <button
          onClick={() => setActiveTab('erd')}
          className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer ${
            activeTab === 'erd'
              ? 'bg-[#00B042] text-[#0B0F17] font-bold shadow-sm'
              : 'text-[#bccbb8] hover:text-white'
          }`}
        >
          Esquema BD & ERD (TRD 2.1)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-[#00B042] text-[#0B0F17] font-bold shadow-sm'
              : 'text-[#bccbb8] hover:text-white'
          }`}
        >
          Auditoría de Cambios
        </button>
      </div>

      {/* Content Form */}
      {activeTab === 'thresholds' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* THP Thresholds */}
            <div className="p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#06B6D4]">speed</span>
                  <h3 className="text-sm font-bold text-white font-mono">Presión Cabeza de Pozo (THP)</h3>
                </div>
                <span className="font-mono text-[10px] text-[#869583]">TAG: RB402_THP_PRES</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[#869583] mb-1">Umbral Alto (H - Alerta Amarilla):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={thpHighThreshold}
                      onChange={(e) => setThpHighThreshold(e.target.value)}
                      className="bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white w-full font-bold"
                    />
                    <span className="text-[#869583]">PSI</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#869583] mb-1">Umbral Crítico (HH - Alarma Roja):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={thpCriticalThreshold}
                      onChange={(e) => setThpCriticalThreshold(e.target.value)}
                      className="bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-[#EF4444] w-full font-bold"
                    />
                    <span className="text-[#869583]">PSI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tank LAHH Thresholds */}
            <div className="p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#EF4444]">oil_barrel</span>
                  <h3 className="text-sm font-bold text-white font-mono">Tanque TK-501 (Nivel LAHH)</h3>
                </div>
                <span className="font-mono text-[10px] text-[#869583]">TAG: TK501_LVL_LAHH</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[#869583] mb-1">Volumen Máximo Seguro (90% Capacidad):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={tankLahhThreshold}
                      onChange={(e) => setTankLahhThreshold(e.target.value)}
                      className="bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white w-full font-bold"
                    />
                    <span className="text-[#869583]">BBL</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#869583] mb-1">Acción Automática ante Violación:</label>
                  <select className="bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white w-full font-sans">
                    <option value="bypass">Apertura bypass automático a TK-502</option>
                    <option value="shut-in">Cierre de válvula de cabeza de pozo (Shut-in)</option>
                    <option value="recirculate">Derivación hacia isla de despacho mayorista</option>
                  </select>
                </div>
              </div>
            </div>

            {/* VFD Temperature */}
            <div className="p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#F59E0B]">thermostat</span>
                  <h3 className="text-sm font-bold text-white font-mono">Temperatura Devanado Motor BES</h3>
                </div>
                <span className="font-mono text-[10px] text-[#869583]">TAG: BES402_WIND_TEMP</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[#869583] mb-1">Límite Térmico Operativo:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={vfdTempThreshold}
                      onChange={(e) => setVfdTempThreshold(e.target.value)}
                      className="bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white w-full font-bold"
                    />
                    <span className="text-[#869583]">°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Polling Rate */}
            <div className="p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10B981]">sync</span>
                  <h3 className="text-sm font-bold text-white font-mono">Frecuencia de Polling SCADA</h3>
                </div>
                <span className="font-mono text-[10px] text-[#869583]">TIMESCALEDB INGESTION</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[#869583] mb-1">Intervalo de Muestreo RTU:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={pollingFrequencyMs}
                      onChange={(e) => setPollingFrequencyMs(e.target.value)}
                      className="bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white w-full font-bold"
                    />
                    <span className="text-[#869583]">ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => triggerToast('Valores restablecidos a valores de fábrica')}
              className="px-4 py-2.5 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-xs font-mono text-[#bccbb8]"
            >
              Restablecer Valores
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#00B042] text-[#0B0F17] font-mono text-xs font-bold hover:bg-[#52e16c] shadow-[0_0_12px_rgba(0,176,66,0.3)] cursor-pointer"
            >
              Guardar y Desplegar Cambios
            </button>
          </div>
        </form>
      )}

      {activeTab === 'networks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white">Servidor Modbus TCP / RTU</h3>
            <div>
              <label className="block text-[#869583] mb-1">Puerto de Escucha:</label>
              <input
                type="text"
                value={modbusPort}
                onChange={(e) => setModbusPort(e.target.value)}
                className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[#869583] mb-1">ID Esclavo Gateway:</label>
              <input
                type="text"
                readOnly
                value="0x2A (BES M-402)"
                className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-[#7bd0ff]"
              />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white">Broker MQTT Sparkplug B</h3>
            <div>
              <label className="block text-[#869583] mb-1">Broker URI:</label>
              <input
                type="text"
                value={mqttBroker}
                onChange={(e) => setMqttBroker(e.target.value)}
                className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[#869583] mb-1">Seguridad TLS:</label>
              <span className="text-[#10B981] font-bold block mt-1">mTLS x509 Certificados Ecopetrol Activos</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'erd' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#111827] border border-white/5 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00B042]">database</span>
                <h3 className="text-sm font-bold text-white font-mono">Modelo de Datos y Persistencia Relacional (TRD 2.1)</h3>
              </div>
              <span className="font-mono text-[10px] text-[#7bd0ff]">SUPABASE / POSTGRESQL + TIMESCALEDB</span>
            </div>
            <p className="text-xs text-[#bccbb8] mb-4">
              Estructura normalizada de 4 tablas maestras implementadas para el almacenamiento de cuentas, inventario de activos, series de tiempo continuas y eventos de anomalía.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
              {/* Table 1: usuarios */}
              <div className="p-3 rounded-lg bg-[#0a0e16] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[#00B042] font-bold">
                  <span>TABLE usuarios</span>
                  <span className="text-[10px] text-[#869583]">RBAC & Auth</span>
                </div>
                <div className="text-[#dfe2ee] space-y-0.5 text-[10px]">
                  <div><span className="text-[#7bd0ff]">id</span> UUID PRIMARY KEY</div>
                  <div><span className="text-[#7bd0ff]">nombre</span> VARCHAR(100)</div>
                  <div><span className="text-[#7bd0ff]">email</span> VARCHAR(120) UNIQUE</div>
                  <div><span className="text-[#7bd0ff]">password_hash</span> VARCHAR(255)</div>
                  <div><span className="text-[#7bd0ff]">rol</span> VARCHAR(30) (ADMIN, OPERADOR, AUDITOR)</div>
                  <div><span className="text-[#7bd0ff]">activo</span> BOOLEAN DEFAULT TRUE</div>
                </div>
              </div>

              {/* Table 2: equipos */}
              <div className="p-3 rounded-lg bg-[#0a0e16] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[#06B6D4] font-bold">
                  <span>TABLE equipos</span>
                  <span className="text-[10px] text-[#869583]">Catálogo Activos</span>
                </div>
                <div className="text-[#dfe2ee] space-y-0.5 text-[10px]">
                  <div><span className="text-[#7bd0ff]">id</span> UUID PRIMARY KEY</div>
                  <div><span className="text-[#7bd0ff]">codigo_pozo</span> VARCHAR(50) UNIQUE</div>
                  <div><span className="text-[#7bd0ff]">tipo_equipo</span> VARCHAR(50) (VFD, CABEZA, ...)</div>
                  <div><span className="text-[#7bd0ff]">ubicacion_campo</span> VARCHAR(100)</div>
                  <div><span className="text-[#7bd0ff]">estado</span> VARCHAR(20)</div>
                  <div><span className="text-[#7bd0ff]">ultima_conexion</span> TIMESTAMP WITH TIME ZONE</div>
                </div>
              </div>

              {/* Table 3: lecturas_telemetria */}
              <div className="p-3 rounded-lg bg-[#0a0e16] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[#F59E0B] font-bold">
                  <span>TABLE lecturas_telemetria</span>
                  <span className="text-[10px] text-[#869583]">Timescale Hypertable</span>
                </div>
                <div className="text-[#dfe2ee] space-y-0.5 text-[10px]">
                  <div><span className="text-[#7bd0ff]">id</span> BIGSERIAL</div>
                  <div><span className="text-[#7bd0ff]">equipo_id</span> UUID REFERENCES equipos(id)</div>
                  <div><span className="text-[#7bd0ff]">timestamp</span> TIMESTAMPTZ (Particionado)</div>
                  <div><span className="text-[#7bd0ff]">presion, temperatura</span> DOUBLE PRECISION</div>
                  <div><span className="text-[#7bd0ff]">caudal, frecuencia_vfd</span> DOUBLE PRECISION</div>
                  <div><span className="text-[#7bd0ff]">voltaje</span> DOUBLE PRECISION</div>
                </div>
              </div>

              {/* Table 4: alertas */}
              <div className="p-3 rounded-lg bg-[#0a0e16] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[#EF4444] font-bold">
                  <span>TABLE alertas</span>
                  <span className="text-[10px] text-[#869583]">Registro Inmutable</span>
                </div>
                <div className="text-[#dfe2ee] space-y-0.5 text-[10px]">
                  <div><span className="text-[#7bd0ff]">id</span> UUID PRIMARY KEY</div>
                  <div><span className="text-[#7bd0ff]">equipo_id</span> UUID REFERENCES equipos</div>
                  <div><span className="text-[#7bd0ff]">nivel</span> VARCHAR(20) (ADVERTENCIA, CRITICO)</div>
                  <div><span className="text-[#7bd0ff]">variable_afectada</span> VARCHAR(50)</div>
                  <div><span className="text-[#7bd0ff]">valor_medido, umbral</span> DOUBLE PRECISION</div>
                  <div><span className="text-[#7bd0ff]">atendida_por</span> UUID REFERENCES usuarios</div>
                  <div><span className="text-[#7bd0ff]">observaciones</span> TEXT (Justificación min 20c)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-3 font-mono text-xs">
          <h3 className="text-sm font-bold text-white">Libro Digital de Auditoría SCADA</h3>
          <div className="divide-y divide-white/5">
            <div className="py-2.5 flex justify-between">
              <span className="text-[#869583]">2025-10-24 14:22:10 UTC-5</span>
              <span className="text-white">Alerta AL-8839 asignada a Ing. Carlos Mendoza</span>
              <span className="text-[#10B981]">OK</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#869583]">2025-10-24 13:40:02 UTC-5</span>
              <span className="text-white">Calibración estrangulador Choke RB-402 al 38%</span>
              <span className="text-[#10B981]">OK</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#869583]">2025-10-24 06:00:15 UTC-5</span>
              <span className="text-white">Parada programada mantenimiento VFD-01 ejecutada</span>
              <span className="text-[#F59E0B]">COMPLETA</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
