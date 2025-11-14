// Tipos para el módulo de acciones de juego

/**
 * Tipo de acción en el juego
 */
export interface TipoAccion {
  idTipoAccion: number;
  descripcion: string;
}

/**
 * Resultado de una acción
 */
export interface ResultadoAccion {
  idResultadoAccion: number;
  descripcion: string;
}

/**
 * Acción de juego completa
 */
export interface AccionJuego {
  idAccionJuego: number;
  idSetPartido: number;
  idTipoAccion: number;
  idResultadoAccion: number;
  idRoster: number;
  posicionVisitante: number;
  timestamp: string;
  // Información adicional (solo lectura)
  tipoAccionDescripcion?: string;
  resultadoAccionDescripcion?: string;
  nombreJugador?: string;
}

/**
 * DTO para crear una acción de juego
 */
export interface CrearAccionJuegoDTO {
  idSetPartido: number;
  idTipoAccion: number;
  idResultadoAccion: number;
  idRoster: number;
  posicionVisitante: number;
}

/**
 * DTO para actualizar una acción de juego
 */
export interface ActualizarAccionJuegoDTO {
  idSetPartido: number;
  idTipoAccion: number;
  idResultadoAccion: number;
  idRoster: number;
  posicionVisitante: number;
}
