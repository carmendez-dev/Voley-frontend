// ==================== PAGOS ====================

export interface PagoCreateRequest {
  usuarioId?: number;
  periodoMes: number;
  periodoAnio: number;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
  metodoPago?: string;
  comprobante?: File | null;
  observaciones?: string;
}

export interface Pago {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  periodoMes: number;
  periodoAnio: number;
  periodo?: string;
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

export interface UpdateEstadoRequest {
  estado: 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
}

export type EstadoPago = 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'deposito';
