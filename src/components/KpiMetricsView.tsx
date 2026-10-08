import React from 'react';
import { BusinessKpi } from '../types/scada';

const kpisList: BusinessKpi[] = [
  {
    id: 'kpi-1',
    title: 'Tiempo de Detección de Fallas',
    currentValue: '3.8',
    targetValue: '≤ 5.0 min',
    unit: 'minutos',
    status: 'CUMPLIDO',
    description: 'Reducción drástica desde los 60 min del monitoreo manual tradicional.',
    trend: '-93.6% vs inspección manual',
  },
  {
    id: 'kpi-2',
    title: 'Disponibilidad Operacional Global',
    currentValue: '96.8',
    targetValue: '≥ 95.0%',
    unit: '%',
    status: 'CUMPLIDO',
    description: 'Uptime efectivo de pozos productores y plantas de deshidratación.',
    trend: '+1.8% sobre meta PRD',
  },
  {
    id: 'kpi-3',
    title: 'Cobertura de Monitoreo Continuo',
    currentValue: '97.2',
    targetValue: '≥ 95.0%',
    unit: '% de activos',
    status: 'CUMPLIDO',
    description: 'Supervisión 24/7 sobre VFDs, cabezas de pozo, separadores y tanques.',
    trend: '48 de 49 equipos telemedidos',
  },
  {
    id: 'kpi-4',
    title: 'Tiempo de Respuesta a Alertas (TTR)',
    currentValue: '4.2',
    targetValue: '≤ 10.0 min',
    unit: 'minutos',
    status: 'CUMPLIDO',
    description: 'Despacho y atención inicial registrada en sala de control.',
    trend: '-58% vs SLA máximo',
  },
  {
    id: 'kpi-5',
    title: 'Reducción de Pérdidas de Producción',
    currentValue: '14.2',
    targetValue: '≥ 10.0%',
    unit: '% reducción',
    status: 'CUMPLIDO',
    description: 'Menor volumen diferido por detección temprana de fallas en bombas BES.',
    trend: '+4.2% sobre meta mínima',
  },
  {
    id: 'kpi-6',
    title: 'Reducción de Rondas Presenciales',
    currentValue: '34.5',
    targetValue: '≥ 30.0%',
    unit: '% ahorro',
    status: 'CUMPLIDO',
    description: 'Disminución de inspecciones manuales innecesarias en pad de pozos.',
    trend: '180 horas/hombre ahorradas/mes',
  },
  {
    id: 'kpi-7',
    title: 'Atención y Cierre Explícito de Alertas',
    currentValue: '96.0',
    targetValue: '≥ 90.0%',
    unit: '% cerradas',
    status: 'CUMPLIDO',
    description: 'Novedades documentadas con causa raíz y medidas de mitigación.',
    trend: '+6.0% sobre meta PRD',
  },
  {
    id: 'kpi-8',
    title: 'Reducción de Fallas No Detectadas',
    currentValue: '58.0',
    targetValue: '≥ 50.0%',
    unit: '% prevención',
    status: 'CUMPLIDO',
    description: 'Mitigación de eventos anómalos antes de paradas no programadas.',
    trend: 'Cero paradas imprevistas en 30 días',
  },
];

export const KpiMetricsView: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-12 space-y-6 text-[#dfe2ee]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl bg-[#111827]/90 shadow-xl border border-white/5">
        <div>
          <div className="flex items-center gap-1.5 text-[#00B042] font-mono text-[10px] tracking-widest font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            <span>TABLERO EJECUTIVO DE IMPACTO OPERACIONAL • PRD 1.3</span>
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mt-0.5">
            Métricas de Negocio & Cumplimiento de KPIs
          </h1>
          <p className="text-xs text-[#bccbb8]">
            Evaluación empírica de los objetivos de éxito definidos en el Product Requirements Document (PRD).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#10B981]/15 text-[#10B981] font-mono text-xs font-bold border border-[#10B981]/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>8 / 8 METAS CUMPLIDAS</span>
          </div>
        </div>
      </div>

      {/* 8 KPIS GRID (PRD 1.3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpisList.map((kpi) => (
          <div
            key={kpi.id}
            className="p-5 rounded-xl bg-[#111827] border border-white/5 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-[#00B042]/30 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono text-[10px] text-[#bccbb8] uppercase tracking-wider leading-tight">
                {kpi.title}
              </span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold shrink-0">
                {kpi.status}
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[32px] font-bold text-white">
                  {kpi.currentValue}
                </span>
                <span className="font-mono text-xs text-[#06B6D4] font-semibold">{kpi.unit}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-[#869583] mt-1">
                <span>Meta PRD: <strong className="text-[#dfe2ee]">{kpi.targetValue}</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[11px]">
              <span className="text-[#10B981] font-mono text-[10px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                {kpi.trend}
              </span>
              <p className="text-[#869583] text-[10px] leading-tight mt-0.5">{kpi.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PLAN ROADMAP & QUALITY GATES STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sequential Milestones */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00B042]">timeline</span>
                <h3 className="text-base font-bold text-white">Roadmap de Entrega Incremental (PLAN)</h3>
              </div>
              <span className="font-mono text-xs text-[#06B6D4]">ESTADO: FASE 1 MVP COMPLETADA</span>
            </div>

            <div className="space-y-4 font-sans text-xs">
              {/* Milestone 1 */}
              <div className="p-3.5 rounded-lg bg-[#1c2028] border border-[#10B981]/30 relative pl-10">
                <div className="absolute left-3 top-3.5 w-5 h-5 rounded-full bg-[#10B981] text-[#0B0F17] flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Hito 1: Ingesta y Telemetría en Vivo</h4>
                  <span className="font-mono text-[10px] text-[#10B981]">DESPLEGADO</span>
                </div>
                <p className="text-[#bccbb8] mt-1">
                  Ingesta continua de VFDs y cabezas de pozo. Modelado en Supabase / TimescaleDB (<code className="font-mono text-[#7bd0ff]">lecturas_telemetria</code>) y streaming WebSockets &lt; 2s.
                </p>
              </div>

              {/* Milestone 2 */}
              <div className="p-3.5 rounded-lg bg-[#1c2028] border border-[#10B981]/30 relative pl-10">
                <div className="absolute left-3 top-3.5 w-5 h-5 rounded-full bg-[#10B981] text-[#0B0F17] flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Hito 2: Módulo de Alertas y Novedades</h4>
                  <span className="font-mono text-[10px] text-[#10B981]">DESPLEGADO</span>
                </div>
                <p className="text-[#bccbb8] mt-1">
                  Engine de detección automática &lt; 3s ante umbrales rebasados. Panel de gestión con justificación obligatoria del operador para cierre y bitácora inmutable.
                </p>
              </div>

              {/* Milestone 3 */}
              <div className="p-3.5 rounded-lg bg-[#1c2028] border border-[#10B981]/30 relative pl-10">
                <div className="absolute left-3 top-3.5 w-5 h-5 rounded-full bg-[#10B981] text-[#0B0F17] flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Hito 3: Administración RBAC y Cierre MVP</h4>
                  <span className="font-mono text-[10px] text-[#10B981]">DESPLEGADO</span>
                </div>
                <p className="text-[#bccbb8] mt-1">
                  Control de roles (ADMIN, OPERADOR, AUDITOR), tokens JWT criptográficos, validación de endpoints y bloqueo instantáneo de accesos.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-[#869583] flex items-center justify-between">
            <span>SIGUIENTE ITERACIÓN: Notificaciones SMS/Twilio & Reportes automáticos</span>
            <span className="text-[#7bd0ff]">FASE 2</span>
          </div>
        </div>

        {/* Quality Gates */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#111827] border border-white/5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F59E0B]">fact_check</span>
                <h3 className="text-base font-bold text-white">Puertas de Calidad (Validation Gates)</h3>
              </div>
              <span className="font-mono text-xs text-[#10B981]">APROBADO</span>
            </div>

            <ul className="space-y-3 font-mono text-xs">
              <li className="p-3 rounded-lg bg-[#181c24] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="font-bold text-white block">Cobertura Pruebas Unitarias</span>
                  <span className="text-[10px] text-[#869583]">JUnit 5 / Vitest ≥ 80%</span>
                </div>
                <span className="text-[#10B981] font-bold">88.4% OK</span>
              </li>

              <li className="p-3 rounded-lg bg-[#181c24] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="font-bold text-white block">Compilación & Linter</span>
                  <span className="text-[10px] text-[#869583]">TypeScript / ESLint sin errores</span>
                </div>
                <span className="text-[#10B981] font-bold">0 Errores</span>
              </li>

              <li className="p-3 rounded-lg bg-[#181c24] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="font-bold text-white block">Prueba de Carga k6</span>
                  <span className="text-[10px] text-[#869583]">1,000 métricas/s con latencia &lt; 500ms</span>
                </div>
                <span className="text-[#10B981] font-bold">124ms OK</span>
              </li>

              <li className="p-3 rounded-lg bg-[#181c24] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="font-bold text-white block">Revisión Humana (Human-in-the-Loop)</span>
                  <span className="text-[10px] text-[#869583]">Aprobación Líder Operaciones</span>
                </div>
                <span className="text-[#10B981] font-bold">FIRMADO</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/5 text-center font-mono text-[10px] text-[#869583]">
            CRITERIO DE CIERRE TÉCNICO APROBADO CONFORME AL PRD & TRD
          </div>
        </div>
      </div>
    </div>
  );
};
