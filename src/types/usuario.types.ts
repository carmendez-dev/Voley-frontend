// ==================== USUARIOS ====================

export interface Usuario {
  id: number;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  cedula: string;
  genero: 'Masculino' | 'Femenino';
  email: string;
  celular: string;
  direccion?: string;
  contactoEmergencia?: string;
  estado: 'Activo' | 'Inactivo';
  peso?: number;
  altura?: number;
  imc?: number;
  edad?: number;
  fechaRegistro: string;
  updatedAt?: string;
  // Campos de compatibilidad (deprecated)
  nombres?: string;
  apellidos?: string;
  tipo?: 'JUGADOR' | 'ENTRENADOR' | 'ADMINISTRADOR';
}

export interface UsuarioCreateRequest {
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento: string;
  cedula: string;
  genero: 'Masculino' | 'Femenino';
  email: string;
  celular: string;
  direccion?: string;
  contactoEmergencia?: string;
  peso?: number;
  altura?: number;
}

export interface UsuarioEstadisticas {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  porcentajeActivos: number;
  distribucioGenero: {
    Masculino: number;
    Femenino: number;
  };
  edadPromedio: number;
  imcPromedio: number;
  registrosUltimoMes: number;
}
