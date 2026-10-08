export type ViewMode = 
  | 'dashboard-rtoc' 
  | 'centro-de-alertas' 
  | 'historicos-y-analisis' 
  | 'despachos-de-cisternas' 
  | 'configuracion-scada' 
  | 'gestion-rbac'
  | 'kpis-negocio'
  | 'login';

export type UserRole = 'ADMIN' | 'OPERADOR' | 'AUDITOR';

export interface AppUser {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  cargo: string;
  badge: string;
  activo: boolean;
  creadoEn: string;
  ultimoAcceso?: string;
}

export interface AlertEvent {
  id: string;
  severity: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';
  timestamp: string;
  dateStr: string;
  tag: string;
  equipmentName: string;
  subSystem: string;
  variable: string;
  condition: string;
  value: string;
  unit: string;
  threshold: string;
  status: 'active' | 'attended' | 'closed';
  statusLabel: 'ACTIVA' | 'ATENDIDA' | 'RESUELTA';
  assignedTo?: string;
  sopCode?: string;
  sopTitle?: string;
  mitigationNotes?: string;
  confirmedBy?: string;
}

export interface DispatchTruck {
  id: string;
  guideNumber: string;
  plateTractor: string;
  plateTank: string;
  driverName: string;
  company: string;
  product: string;
  apiGravity: string;
  volumeBbl: number;
  bay?: string;
  entryTime: string;
  exitTimeEst: string;
  status: 'wait' | 'loading' | 'route' | 'completed' | 'cancelled';
  statusLabel: string;
  progressPercent: number;
  seals?: string[];
  scaleWeightKg?: number;
}

export interface TelemetryPoint {
  timeStr: string;
  timestamp: string;
  thpPressure: number; // PSI
  vfdFrequency: number; // Hz
  temperature: number; // °C
  flowRate: number; // BFPD
  voltage: number; // V
  current: number; // A
  transmissionStatus: 'CRÍTICO' | 'ADVERTENCIA' | 'NORMAL';
}

export interface WellInfo {
  id: string;
  name: string;
  type: string;
  field: string;
  battery: string;
  coordinates: string;
  status: 'OPERATIVO' | 'ADVERTENCIA' | 'PARADO' | 'PRUEBA';
}

// TRD 3.2 AsyncAPI Schema / Event-Driven Payload
export interface TelemetryEventPayload {
  equipoId: string;
  timestamp: string;
  metrics: {
    presion: number;
    temperatura: number;
    caudal: number;
    frecuenciaVfd: number;
  };
}

// PRD 1.3 Business KPI Metric
export interface BusinessKpi {
  id: string;
  title: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  status: 'CUMPLIDO' | 'EN_PROGRESO' | 'RIESGO';
  description: string;
  trend: string;
}
