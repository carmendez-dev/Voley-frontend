// ==================== CATEGORÍAS ====================

export type GeneroCategoria = 'MASCULINO' | 'FEMENINO' | 'MIXTO';

export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
  genero: GeneroCategoria;
}

export interface CategoriaCreateRequest {
  nombre: string;
  descripcion?: string;
  genero: GeneroCategoria;
}

export interface CategoriaUpdateRequest {
  nombre: string;
  descripcion?: string;
  genero: GeneroCategoria;
}

export interface CategoriaEstadisticas {
  totalCategorias: number;
  categoriasMasculinas: number;
  categoriasFemeninas: number;
  categoriasMixtas: number;
}

export interface CategoriaFiltros {
  genero?: GeneroCategoria;
  nombre?: string;
}
