import axios from 'axios';
import type {
  TipoAccion,
  ResultadoAccion,
  AccionJuego,
  CrearAccionJuegoDTO,
  ActualizarAccionJuegoDTO
} from '../types/accion-juego.types';
import { handleApiError } from '../utils/errorHandler';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class AccionesJuegoService {
  // ==================== TIPOS DE ACCIÓN ====================
  
  async obtenerTiposAccion(): Promise<TipoAccion[]> {
    console.log('📋 Obteniendo tipos de acción');
    
    try {
      const response = await api.get<TipoAccion[]>('/tipos-accion');
      console.log('✅ Tipos de acción obtenidos:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('❌ Error obteniendo tipos de acción:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  async obtenerTipoAccionPorId(id: number): Promise<TipoAccion> {
    console.log('🔍 Obteniendo tipo de acción por ID:', id);
    
    try {
      const response = await api.get<TipoAccion>(`/tipos-accion/${id}`);
      console.log('✅ Tipo de acción obtenido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo tipo de acción:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // ==================== RESULTADOS DE ACCIÓN ====================
  
  async obtenerResultadosAccion(): Promise<ResultadoAccion[]> {
    console.log('📋 Obteniendo resultados de acción');
    
    try {
      const response = await api.get<ResultadoAccion[]>('/resultados-accion');
      console.log('✅ Resultados de acción obtenidos:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('❌ Error obteniendo resultados de acción:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  async obtenerResultadoAccionPorId(id: number): Promise<ResultadoAccion> {
    console.log('🔍 Obteniendo resultado de acción por ID:', id);
    
    try {
      const response = await api.get<ResultadoAccion>(`/resultados-accion/${id}`);
      console.log('✅ Resultado de acción obtenido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo resultado de acción:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // ==================== ACCIONES DE JUEGO ====================
  
  async obtenerTodasLasAcciones(): Promise<AccionJuego[]> {
    console.log('📋 Obteniendo todas las acciones de juego');
    
    try {
      const response = await api.get<AccionJuego[]>('/acciones-juego');
      console.log('✅ Acciones de juego obtenidas:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('❌ Error obteniendo acciones de juego:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  async obtenerAccionPorId(id: number): Promise<AccionJuego> {
    console.log('🔍 Obteniendo acción de juego por ID:', id);
    
    try {
      const response = await api.get<AccionJuego>(`/acciones-juego/${id}`);
      console.log('✅ Acción de juego obtenida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo acción de juego:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  async obtenerAccionesPorSet(idSet: number): Promise<AccionJuego[]> {
    console.log('🎯 Obteniendo acciones del set:', idSet);
    
    try {
      const response = await api.get<AccionJuego[]>(`/acciones-juego/set/${idSet}`);
      console.log('✅ Acciones del set obtenidas:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('❌ Error obteniendo acciones del set:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  async crearAccion(data: CrearAccionJuegoDTO): Promise<AccionJuego> {
    console.log('📝 Creando acción de juego:', data);
    
    try {
      const response = await api.post<AccionJuego>('/acciones-juego', data);
      console.log('✅ Acción de juego creada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando acción de juego:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  async actualizarAccion(id: number, data: ActualizarAccionJuegoDTO): Promise<AccionJuego> {
    console.log('✏️ Actualizando acción de juego:', id, data);
    
    try {
      const response = await api.put<AccionJuego>(`/acciones-juego/${id}`, data);
      console.log('✅ Acción de juego actualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error actualizando acción de juego:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  async eliminarAccion(id: number): Promise<void> {
    console.log('🗑️ Eliminando acción de juego:', id);
    
    try {
      await api.delete(`/acciones-juego/${id}`);
      console.log('✅ Acción de juego eliminada');
    } catch (error: any) {
      console.error('❌ Error eliminando acción de juego:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }
}

export default new AccionesJuegoService();
