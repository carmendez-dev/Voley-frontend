// ==================== INSCRIPCIONES ====================

export type EstadoInscripcion = 'inscrito' | 'retirado' | 'descalificado';

export const EstadosInscripcion = {
  INSCRITO: 'inscrito' as EstadoInscripcion,
  RETIRADO: 'retirado' as EstadoInscripcion,
  DESCALIFICADO: 'descalificado' as EstadoInscripcion
};

export interface Inscripcion {
  idInscripcion?: number;
  idTorneoCategoria: number;
  idEquipo: number;
  estado: EstadoInscripcion;
  observaciones?: string;
  fechaInscripcion?: string;
  // Información adicional (solo lectura)
  nombreTorneo?: string;
  nombreCategoria?: string;
  nombreEquipo?: string;
}

export interface CrearInscripcionDTO {
  idTorneoCategoria: number;
  idEquipo: number;
  observaciones?: string;
}

export interface ActualizarInscripcionDTO {
  estado: EstadoInscripcion;
  observaciones?: string;
}

export interface InscripcionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data?: Inscripcion | Inscripcion[];
  total?: number;
}
