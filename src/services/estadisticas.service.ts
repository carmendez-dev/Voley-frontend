import axios from 'axios';
import type {
  EstadisticasGenerales,
  EstadisticasPartido,
  EstadisticasJugadorPartido
} from '../types/estadisticas.types';
import { handleApiError } from '../utils/errorHandler';

const API_URL = 'http://localhost:8080/api/estadisticas';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class EstadisticasService {
  // Obtener estadísticas generales
  async obtenerEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    console.log('📊 Obteniendo estadísticas generales');
    
    try {
      const response = await api.get<EstadisticasGenerales>('/generales');
      console.log('✅ Estadísticas generales obtenidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo estadísticas generales:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener estadísticas de un partido
  async obtenerEstadisticasPartido(idPartido: number): Promise<EstadisticasPartido> {
    console.log('📊 Obteniendo estadísticas del partido:', idPartido);
    
    try {
      const response = await api.get<EstadisticasPartido>(`/partido/${idPartido}`);
      console.log('✅ Estadísticas del partido obtenidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo estadísticas del partido:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener estadísticas de un jugador en un partido
  async obtenerEstadisticasJugadorPartido(
    idPartido: number,
    idRoster: number
  ): Promise<EstadisticasJugadorPartido> {
    console.log('📊 Obteniendo estadísticas del jugador:', { idPartido, idRoster });
    
    try {
      const response = await api.get<EstadisticasJugadorPartido>(
        `/partido/${idPartido}/jugador/${idRoster}`
      );
      console.log('✅ Estadísticas del jugador obtenidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo estadísticas del jugador:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }
}

export default new EstadisticasService();
