// Tipos para el módulo de estadísticas

/**
 * Estadísticas por tipo de acción
 */
export interface EstadisticaPorTipo {
  tipoAccion: string;
  cantidad: number;
}

/**
 * Estadísticas generales del dashboard
 */
export interface EstadisticasGenerales {
  totalPartidos: number;
  partidosGanados: number;
  partidosPerdidos: number;
  partidosWalkover: number;
  partidosWalkoverContra: number;
  partidosPendientes: number;
  totalSetsJugados: number;
  setsGanados: number;
  setsPerdidos: number;
  totalPuntos: number;
  totalErrores: number;
}

/**
 * Estadísticas de un partido
 */
export interface EstadisticasPartido {
  idPartido: number;
  equipoLocal: string;
  equipoVisitante: string;
  resultado: string;
  setsGanadosLocal: number;
  setsGanadosVisitante: number;
  puntosLocal: number;
  erroresLocal: number;
  puntosPorTipoLocal: EstadisticaPorTipo[];
  erroresPorTipoLocal: EstadisticaPorTipo[];
  puntosVisitante: number;
  erroresVisitante: number;
  puntosPorTipoVisitante: EstadisticaPorTipo[];
  erroresPorTipoVisitante: EstadisticaPorTipo[];
}

/**
 * Estadísticas de un jugador en un partido
 */
export interface EstadisticasJugadorPartido {
  idRoster: number;
  nombreJugador: string;
  idPartido: number;
  equipoLocal: string;
  equipoVisitante: string;
  totalPuntos: number;
  totalErrores: number;
  puntosPorTipo: EstadisticaPorTipo[];
  erroresPorTipo: EstadisticaPorTipo[];
}
