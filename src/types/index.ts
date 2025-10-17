// Tipos de datos para el sistema de pagos - Nueva API

export interface PagoCreateRequest {
  usuarioId?: number;        // ID del usuario (se convierte a objeto para el backend)
  periodoMes: number;        // Backend espera camelCase
  periodoAnio: number;       // Backend espera camelCase
  monto: number;
  estado: 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
  metodoPago?: string;       // Opcional - solo para estado 'pagado'
  comprobante?: File | null; // Opcional - Archivo de imagen
  observaciones?: string;    // Opcional
}

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto?: string; // Computed: nombres + apellidos
  fechaNacimiento?: string;
  cedula: string;
  email: string;
  celular: string;
  genero?: 'MASCULINO' | 'FEMENINO';
  tipo?: 'JUGADOR' | 'ENTRENADOR' | 'ADMINISTRADOR';
  estado?: 'ACTIVO' | 'INACTIVO' | 'Activo' | 'Inactivo'; // Backend puede enviar ambos formatos
  fechaRegistro?: string;
}

export interface UsuarioCreateRequest {
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  cedula: string;
  email: string;
  celular: string;
  genero: 'MASCULINO' | 'FEMENINO';
  tipo: 'JUGADOR' | 'ENTRENADOR' | 'ADMINISTRADOR';
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface Pago {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  periodoMes: number;
  periodoAnio: number;
  periodo?: string; // Campo opcional cuando viene del endpoint /usuario/{id} (formato "5/2025")
  monto: number;
  estado: 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
  fechaRegistro: string;
  fechaVencimiento: string | null;
  fechaPago?: string | null;
  metodoPago?: string | null;
  comprobante?: string | null;
  observaciones?: string | null;
  fechaCreacion?: string | null;
  fechaActualizacion?: string | null;
  usuario?: {
    id: number;
    nombreCompleto: string;
    email: string;
    estado: string;
    tipo: string;
  };
}

export interface PagoProcesarRequest {
  monto: number;
  metodoPago: string;
  comprobante?: string;
  observaciones?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data?: T;
  total?: number;
}

export interface PagoResponse {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  periodoMes: number;
  periodoAnio: number;
  monto: number;
  estado: string;
  fechaRegistro: string;
  fechaVencimiento: string;
  fechaPago?: string;
  metodoPago?: string;
  comprobante?: string;
  observaciones?: string;
}

export interface PagosPorUsuarioDTO {
  usuario: {
    id: number;
    nombreCompleto: string;
    email: string;
    telefono?: string;
  };
  estadisticas: {
    totalPagos: number;
    pagosPagados: number;
    pagosPendientes: number;
    pagosAtrasados: number;
    pagosRechazados: number;
    montoTotal: number;
    montoPagado: number;
    montoPendiente: number;
  };
  pagos: Array<{
    id: number;
    periodo: string;
    monto: number;
    estado: string;
    fechaRegistro: string;
    fechaVencimiento: string;
    fechaPago?: string;
    metodoPago: string;
    comprobante?: string;
    observaciones?: string;
  }>;
}

export interface ApiError {
  error: string;
}

export interface UpdateEstadoRequest {
  estado: 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
}

export type EstadoPago = 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'deposito';

// ==================== TORNEOS ====================

export type EstadoTorneo = 'Pendiente' | 'Activo' | 'Finalizado';

export interface Torneo {
  idTorneo: number;
  nombre: string;
  descripcion?: string;
  fechaInicio?: string; // ISO date string
  fechaFin?: string; // ISO date string
  estado: EstadoTorneo;
}

export interface TorneoCreateRequest {
  nombre: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface TorneoUpdateRequest {
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface CambiarEstadoTorneoRequest {
  estado: EstadoTorneo;
}

export interface TorneoEstadisticas {
  totalTorneos: number;
  torneosPendientes: number;
  torneosActivos: number;
  torneosFinalizados: number;
}

export interface TorneoFiltros {
  estado?: EstadoTorneo;
  nombre?: string;
}
