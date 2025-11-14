// ==================== EQUIPOS ====================

export interface Equipo {
  idEquipo: number;
  nombre: string;
  descripcion?: string;
}

export interface EquipoCreateRequest {
  nombre: string;
  descripcion?: string;
}

export interface EquipoUpdateRequest {
  nombre: string;
  descripcion?: string;
}

export interface EquipoFiltros {
  nombre?: string;
}

export interface EquipoCategoria {
  idEquipo: number;
  nombreEquipo: string;
  descripcion?: string;
  idCategoria: number;
  nombreCategoria: string;
}

export interface CategoriaEquipo {
  idCategoria: number;
  nombreCategoria: string;
  descripcionCategoria?: string;
  genero: 'MASCULINO' | 'FEMENINO' | 'MIXTO';
}
