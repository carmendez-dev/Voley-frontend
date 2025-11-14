// ==================== RELACIONES ====================

// Relación Torneo-Categoría
export interface TorneoCategoria {
  idTorneoCategoria: number; // ID de la relación
  idCategoria: number;
  nombre: string;
  idTorneo: number;
  nombreTorneo: string;
}

export interface CategoriaTorneo {
  idTorneo: number;
  nombre: string;
  idCategoria: number;
  nombreCategoria: string;
}
