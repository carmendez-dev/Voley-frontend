// ==================== ROSTER JUGADOR ====================

export interface RosterJugador {
  idRoster: number;
  idInscripcion: number;
  idUsuario: number;
  fechaRegistro: string;
  // Información adicional (solo lectura)
  nombreJugador?: string;
  emailJugador?: string;
  nombreEquipo?: string;
  nombreTorneo?: string;
  nombreCategoria?: string;
}

export interface CrearRosterDTO {
  idInscripcion: number;
  idUsuario: number;
}

export interface RosterResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data?: RosterJugador | RosterJugador[];
  total?: number;
}
