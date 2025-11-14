// Tipos para el módulo de gestión de profesores

/**
 * Estado del profesor
 */
export type EstadoProfesor = 'Activo' | 'Inactivo';

/**
 * Género del profesor
 */
export type GeneroProfesor = 'Masculino' | 'Femenino';

/**
 * Interfaz principal de un profesor
 */
export interface Profesor {
  idProfesor: number;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  email?: string;
  celular?: string;
  contactoEmergencia?: string;
  genero: GeneroProfesor;
  estado: EstadoProfesor;
  cedula?: string;
  fechaRegistro: string;
  updateAt: string;
  nombreCompleto: string;
}

/**
 * DTO para crear un nuevo profesor
 */
export interface CrearProfesorDTO {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  email?: string;
  celular?: string;
  contactoEmergencia?: string;
  genero: GeneroProfesor;
  cedula?: string;
  password: string;
}

/**
 * DTO para actualizar un profesor existente
 */
export interface ActualizarProfesorDTO {
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  email?: string;
  celular?: string;
  contactoEmergencia?: string;
  genero?: GeneroProfesor;
  estado?: EstadoProfesor;
  cedula?: string;
}

/**
 * DTO para cambiar contraseña
 */
export interface CambiarPasswordDTO {
  password: string;
}

/**
 * Respuesta del API para profesores
 */
export interface ProfesorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data?: Profesor | Profesor[];
  total?: number;
}
