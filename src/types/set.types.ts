// Tipos para el módulo de sets de partidos

/**
 * Interfaz principal de un set
 */
export interface SetPartido {
  idSetPartido: number;
  idPartido: number;
  numeroSet: number;
  puntosLocal: number;
  puntosVisitante: number;
  nombreEquipoLocal?: string;
  nombreEquipoVisitante?: string;
  ganador: 'Local' | 'Visitante' | 'Empate';
  finalizado: boolean;
}

/**
 * DTO para crear un nuevo set
 */
export interface CrearSetDTO {
  idPartido: number;
  numeroSet: number;
  puntosLocal: number;
  puntosVisitante: number;
}

/**
 * DTO para actualizar un set existente
 */
export interface ActualizarSetDTO {
  puntosLocal: number;
  puntosVisitante: number;
}

/**
 * Respuesta del API para un set
 */
export interface SetResponse {
  mensaje?: string;
  set?: SetPartido;
  sets?: SetPartido[];
  total?: number;
  idPartido?: number;
  timestamp: string;
}
