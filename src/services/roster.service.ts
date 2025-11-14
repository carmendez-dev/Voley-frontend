import axios from 'axios';
import type { RosterJugador, CrearRosterDTO, RosterResponse } from '../types';

const API_URL = 'http://localhost:8080/api/roster';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const rosterService = {
  // Agregar jugador al roster
  async agregarJugador(dto: CrearRosterDTO): Promise<RosterJugador> {
    console.log('➕ Agregando jugador al roster:', dto);
    
    try {
      const response = await api.post<RosterResponse>('', dto);
      console.log('✅ Jugador agregado:', response.data);
      return response.data.data as RosterJugador;
    } catch (error: any) {
      console.error('❌ Error agregando jugador:', error);
      throw error;
    }
  },

  // Obtener jugadores de una inscripción
  async obtenerPorInscripcion(idInscripcion: number): Promise<RosterJugador[]> {
    console.log('📋 Obteniendo roster de inscripción:', idInscripcion);
    
    try {
      const response = await api.get<RosterResponse>(`/inscripciones/${idInscripcion}`);
      console.log('✅ Roster obtenido:', response.data);
      return response.data.data as RosterJugador[];
    } catch (error: any) {
      console.error('❌ Error obteniendo roster:', error);
      throw error;
    }
  },

  // Obtener inscripciones de un jugador
  async obtenerPorUsuario(idUsuario: number): Promise<RosterJugador[]> {
    console.log('👤 Obteniendo inscripciones del jugador:', idUsuario);
    
    try {
      const response = await api.get<RosterResponse>(`/usuarios/${idUsuario}`);
      console.log('✅ Inscripciones obtenidas:', response.data);
      return response.data.data as RosterJugador[];
    } catch (error: any) {
      console.error('❌ Error obteniendo inscripciones:', error);
      throw error;
    }
  },

  // Eliminar jugador del roster
  async eliminarJugador(idRoster: number): Promise<void> {
    console.log('🗑️ Eliminando jugador del roster:', idRoster);
    
    try {
      await api.delete(`/${idRoster}`);
      console.log('✅ Jugador eliminado del roster');
    } catch (error: any) {
      console.error('❌ Error eliminando jugador:', error);
      throw error;
    }
  }
};

export default rosterService;
