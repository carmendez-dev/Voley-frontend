// ==================== TORNEOS ====================

export type EstadoTorneo = 'Pendiente' | 'Activo' | 'Finalizado';

export interface Torneo {
  idTorneo: number;
  nombre: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
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
