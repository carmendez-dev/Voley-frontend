import axios from 'axios';
import type {
  SetPartido,
  CrearSetDTO,
  ActualizarSetDTO,
  SetResponse
} from '../types/set.types';
import { handleApiError } from '../utils/errorHandler';

const API_URL = 'http://localhost:8080/api/sets';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class SetsService {
  // Crear set
  async crearSet(data: CrearSetDTO): Promise<SetPartido> {
    console.log('📝 Creando set:', data);
    
    try {
      const response = await api.post<SetResponse>('', data);
      console.log('✅ Set creado:', response.data);
      
      const set = response.data.set;
      if (!set) {
        throw new Error('No se recibió el set creado');
      }
      return set;
    } catch (error: any) {
      console.error('❌ Error creando set:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener todos los sets
  async obtenerTodos(): Promise<SetPartido[]> {
    console.log('📋 Obteniendo todos los sets');
    
    try {
      const response = await api.get<SetResponse>('');
      console.log('✅ Sets obtenidos:', response.data);
      
      return response.data.sets || [];
    } catch (error: any) {
      console.error('❌ Error obteniendo sets:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener set por ID
  async obtenerPorId(id: number): Promise<SetPartido> {
    console.log('🔍 Obteniendo set por ID:', id);
    
    try {
      const response = await api.get<SetResponse>(`/${id}`);
      console.log('✅ Set obtenido:', response.data);
      
      const set = response.data.set;
      if (!set) {
        throw new Error('Set no encontrado');
      }
      return set;
    } catch (error: any) {
      console.error('❌ Error obteniendo set:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener sets por partido
  async obtenerPorPartido(idPartido: number): Promise<SetPartido[]> {
    console.log('🎯 Obteniendo sets del partido:', idPartido);
    
    try {
      const response = await api.get<SetResponse>(`/partido/${idPartido}`);
      console.log('✅ Sets del partido obtenidos:', response.data);
      
      return response.data.sets || [];
    } catch (error: any) {
      console.error('❌ Error obteniendo sets del partido:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Actualizar set
  async actualizarSet(id: number, data: ActualizarSetDTO): Promise<SetPartido> {
    console.log('✏️ Actualizando set:', id, data);
    
    try {
      const response = await api.put<SetResponse>(`/${id}`, data);
      console.log('✅ Set actualizado:', response.data);
      
      const set = response.data.set;
      if (!set) {
        throw new Error('No se recibió el set actualizado');
      }
      return set;
    } catch (error: any) {
      console.error('❌ Error actualizando set:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Eliminar set
  async eliminarSet(id: number): Promise<void> {
    console.log('🗑️ Eliminando set:', id);
    
    try {
      await api.delete(`/${id}`);
      console.log('✅ Set eliminado');
    } catch (error: any) {
      console.error('❌ Error eliminando set:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }
}

export default new SetsService();
