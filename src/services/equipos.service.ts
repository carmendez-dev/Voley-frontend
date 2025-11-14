import axios from 'axios';
import type { Equipo, EquipoCreateRequest, EquipoUpdateRequest, EquipoFiltros } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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

export const equipoService = {
  // Obtener todos los equipos
  async obtenerTodos(filtros?: EquipoFiltros): Promise<Equipo[]> {
    console.log('🏐 Obteniendo todos los equipos:', filtros);
    
    try {
      let url = '/equipos';
      const params = new URLSearchParams();
      
      if (filtros?.nombre) {
        url = '/equipos/buscar';
        params.append('nombre', filtros.nombre);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      console.log('📋 Respuesta equipos:', response.data);
      
      const equipos = Array.isArray(response.data) ? response.data : [];
      
      return equipos.map((equipo: any) => ({
        idEquipo: equipo.idEquipo || equipo.id,
        nombre: equipo.nombre,
        descripcion: equipo.descripcion
      }));
    } catch (error) {
      console.error('❌ Error obteniendo equipos:', error);
      throw new Error('Error al obtener equipos');
    }
  },

  // Obtener equipo por ID
  async obtenerPorId(id: number): Promise<Equipo> {
    console.log('🏐 Obteniendo equipo por ID:', id);
    
    try {
      const response = await api.get(`/equipos/${id}`);
      console.log('📋 Respuesta equipo:', response.data);
      
      const equipo = response.data;
      return {
        idEquipo: equipo.idEquipo || equipo.id,
        nombre: equipo.nombre,
        descripcion: equipo.descripcion
      };
    } catch (error) {
      console.error('❌ Error obteniendo equipo:', error);
      throw new Error('Error al obtener equipo');
    }
  },

  // Crear nuevo equipo
  async crear(data: EquipoCreateRequest): Promise<Equipo> {
    console.log('➕ Creando nuevo equipo:', data);
    
    try {
      const response = await api.post('/equipos', data);
      console.log('✅ Equipo creado:', response.data);
      
      const equipo = response.data;
      return {
        idEquipo: equipo.idEquipo || equipo.id,
        nombre: equipo.nombre,
        descripcion: equipo.descripcion
      };
    } catch (error) {
      console.error('❌ Error creando equipo:', error);
      if ((error as any).response?.status === 400) {
        throw new Error((error as any).response?.data?.message || 'Datos de equipo inválidos');
      }
      throw new Error('Error al crear equipo');
    }
  },

  // Actualizar equipo
  async actualizar(id: number, data: EquipoUpdateRequest): Promise<Equipo> {
    console.log('✏️ Actualizando equipo:', id, data);
    
    try {
      const response = await api.put(`/equipos/${id}`, data);
      console.log('✅ Equipo actualizado:', response.data);
      
      const equipo = response.data;
      return {
        idEquipo: equipo.idEquipo || equipo.id,
        nombre: equipo.nombre,
        descripcion: equipo.descripcion
      };
    } catch (error) {
      console.error('❌ Error actualizando equipo:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Equipo no encontrado');
      }
      if ((error as any).response?.status === 400) {
        throw new Error((error as any).response?.data?.message || 'Datos de equipo inválidos');
      }
      throw new Error('Error al actualizar equipo');
    }
  },

  // Eliminar equipo
  async eliminar(id: number): Promise<void> {
    console.log('🗑️ Eliminando equipo:', id);
    
    try {
      await api.delete(`/equipos/${id}`);
      console.log('✅ Equipo eliminado');
    } catch (error) {
      console.error('❌ Error eliminando equipo:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Equipo no encontrado');
      }
      if ((error as any).response?.status === 409) {
        throw new Error('No se puede eliminar el equipo porque tiene relaciones activas');
      }
      throw new Error('Error al eliminar equipo');
    }
  }
};

export default equipoService;
