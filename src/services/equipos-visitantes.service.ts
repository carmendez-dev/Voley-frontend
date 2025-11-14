import axios from 'axios';
import type {
  EquipoVisitante,
  EquipoVisitanteCreateRequest,
  EquipoVisitanteUpdateRequest,
  EquipoVisitanteResponse
} from '../types/equipo-visitante.types';

const API_URL = 'http://localhost:8080/api/equipos-visitantes';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class EquiposVisitantesService {
  // Crear equipo visitante
  async crear(data: EquipoVisitanteCreateRequest): Promise<EquipoVisitante> {
    console.log('📝 Creando equipo visitante:', data);
    
    try {
      const response = await api.post<EquipoVisitanteResponse>('', data);
      console.log('✅ Equipo visitante creado:', response.data);
      return response.data.data as EquipoVisitante;
    } catch (error: any) {
      console.error('❌ Error creando equipo visitante:', error);
      throw error;
    }
  }

  // Obtener todos los equipos visitantes
  async obtenerTodos(): Promise<EquipoVisitante[]> {
    console.log('📋 Obteniendo todos los equipos visitantes');
    
    try {
      const response = await api.get<EquipoVisitanteResponse>('');
      console.log('✅ Equipos visitantes obtenidos:', response.data);
      return response.data.data as EquipoVisitante[];
    } catch (error: any) {
      console.error('❌ Error obteniendo equipos visitantes:', error);
      throw error;
    }
  }

  // Obtener por ID
  async obtenerPorId(id: number): Promise<EquipoVisitante> {
    console.log('🔍 Obteniendo equipo visitante por ID:', id);
    
    try {
      const response = await api.get<EquipoVisitanteResponse>(`/${id}`);
      console.log('✅ Equipo visitante obtenido:', response.data);
      return response.data.data as EquipoVisitante;
    } catch (error: any) {
      console.error('❌ Error obteniendo equipo visitante:', error);
      throw error;
    }
  }

  // Actualizar equipo visitante
  async actualizar(id: number, data: EquipoVisitanteUpdateRequest): Promise<EquipoVisitante> {
    console.log('✏️ Actualizando equipo visitante:', id, data);
    
    try {
      const response = await api.put<EquipoVisitanteResponse>(`/${id}`, data);
      console.log('✅ Equipo visitante actualizado:', response.data);
      return response.data.data as EquipoVisitante;
    } catch (error: any) {
      console.error('❌ Error actualizando equipo visitante:', error);
      throw error;
    }
  }

  // Eliminar equipo visitante
  async eliminar(id: number): Promise<void> {
    console.log('🗑️ Eliminando equipo visitante:', id);
    
    try {
      await api.delete(`/${id}`);
      console.log('✅ Equipo visitante eliminado');
    } catch (error: any) {
      console.error('❌ Error eliminando equipo visitante:', error);
      throw error;
    }
  }
}

export default new EquiposVisitantesService();
