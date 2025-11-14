// Tipos para el módulo de gestión de partidos

/**
 * Resultados válidos para un partido
 */
export type ResultadoPartido =
  | 'Pendiente'
  | 'Ganado'
  | 'Perdido'
  | 'Walkover'
  | 'WalkoverContra';

/**
 * Interfaz principal de un partido
 */
export interface Partido {
  idPartido: number;
  idInscripcionLocal: number;
  nombreEquipoLocal: string;
  idEquipoVisitante: number;
  nombreEquipoVisitante: string;
  fecha: string; // ISO 8601 datetime
  ubicacion: string;
  resultado: ResultadoPartido;
}

/**
 * DTO para crear un nuevo partido
 */
export interface CrearPartidoDTO {
  idInscripcionLocal: number;
  idEquipoVisitante: number;
  fecha: string; // ISO 8601 datetime
  ubicacion: string;
}

/**
 * DTO para actualizar un partido existente
 * Todos los campos son opcionales
 */
export interface ActualizarPartidoDTO {
  idInscripcionLocal?: number;
  idEquipoVisitante?: number;
  fecha?: string;
  ubicacion?: string;
  resultado?: ResultadoPartido;
}

/**
 * Estilos visuales para las cards de partido según resultado
 */
export interface PartidoCardStyle {
  borderColor: string;
  shadowColor: string;
  bgColor: string;
}

/**
 * Constantes de resultados válidos para uso en selectores
 */
export const ResultadosPartido: ResultadoPartido[] = [
  'Pendiente',
  'Ganado',
  'Perdido',
  'Walkover',
  'WalkoverContra',
];
