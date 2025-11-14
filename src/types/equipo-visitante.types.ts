// ==================== EQUIPOS VISITANTES ====================

export interface EquipoVisitante {
  idEquipoVisitante: number;
  nombre: string;
}

export interface EquipoVisitanteCreateRequest {
  nombre: string;
}

export interface EquipoVisitanteUpdateRequest {
  nombre: string;
}

export interface EquipoVisitanteResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data?: EquipoVisitante | EquipoVisitante[];
  total?: number;
}
