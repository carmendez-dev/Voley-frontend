import axios from 'axios';
import type { 
  Torneo, 
  TorneoCreateRequest, 
  TorneoUpdateRequest, 
  CambiarEstadoTorneoRequest,
  TorneoEstadisticas,
  TorneoFiltros,
  EstadoTorneo
} from '../types';

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

export const torneoService = {
  // Obtener todos los torneos
  async obtenerTodos(filtros?: TorneoFiltros): Promise<Torneo[]> {
    let url = '/torneos';
    const params = new URLSearchParams();
    
    if (filtros?.estado) {
      params.append('estado', filtros.estado);
    }
    
    if (filtros?.nombre) {
      params.append('nombre', filtros.nombre);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log('🏆 Obteniendo torneos:', url);
    
    try {
      const response = await api.get(url);
      console.log('📋 Respuesta torneos:', response.data);
      
      const torneos = response.data || [];
      
      return torneos.map((torneo: any) => ({
        idTorneo: torneo.id,
        nombre: torneo.nombre,
        descripcion: torneo.descripcion,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        estado: torneo.estado
      }));
    } catch (error) {
      console.error('❌ Error obteniendo torneos:', error);
      throw error;
    }
  },

  // Obtener torneo por ID
  async obtenerPorId(id: number): Promise<Torneo> {
    console.log('🏆 Obteniendo torneo por ID:', id);
    
    try {
      const response = await api.get(`/torneos/${id}`);
      console.log('📋 Respuesta torneo por ID:', response.data);
      
      const torneo = response.data;
      
      if (!torneo) {
        throw new Error('Torneo no encontrado');
      }
      
      return {
        idTorneo: torneo.id,
        nombre: torneo.nombre,
        descripcion: torneo.descripcion,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        estado: torneo.estado
      };
    } catch (error) {
      console.error('❌ Error obteniendo torneo por ID:', error);
      throw new Error('Torneo no encontrado');
    }
  },

  // Crear nuevo torneo
  async crear(torneoData: TorneoCreateRequest): Promise<Torneo> {
    console.log('🏆 Creando torneo:', torneoData);
    
    if (!torneoData.nombre?.trim()) {
      throw new Error('El nombre del torneo es obligatorio');
    }
    
    if (torneoData.fechaInicio && torneoData.fechaFin) {
      const fechaInicio = new Date(torneoData.fechaInicio);
      const fechaFin = new Date(torneoData.fechaFin);
      
      if (fechaInicio > fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
      }
    }
    
    try {
      const response = await api.post('/torneos', torneoData);
      console.log('✅ Torneo creado:', response.data);
      
      const torneo = response.data;
      
      return {
        idTorneo: torneo.id,
        nombre: torneo.nombre,
        descripcion: torneo.descripcion,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        estado: torneo.estado
      };
    } catch (error) {
      console.error('❌ Error creando torneo:', error);
      throw new Error('Error al crear el torneo');
    }
  },

  // Actualizar torneo
  async actualizar(id: number, torneoData: TorneoUpdateRequest): Promise<Torneo> {
    console.log('🏆 Actualizando torneo:', id, torneoData);
    
    if (torneoData.nombre !== undefined && !torneoData.nombre?.trim()) {
      throw new Error('El nombre del torneo no puede estar vacío');
    }
    
    if (torneoData.fechaInicio && torneoData.fechaFin) {
      const fechaInicio = new Date(torneoData.fechaInicio);
      const fechaFin = new Date(torneoData.fechaFin);
      
      if (fechaInicio > fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
      }
    }
    
    try {
      const response = await api.put(`/torneos/${id}`, torneoData);
      console.log('✅ Torneo actualizado:', response.data);
      
      const torneo = response.data;
      
      return {
        idTorneo: torneo.id,
        nombre: torneo.nombre,
        descripcion: torneo.descripcion,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        estado: torneo.estado
      };
    } catch (error: any) {
      console.error('❌ Error actualizando torneo:', error);
      if (error.response?.status === 409) {
        throw new Error('No se puede actualizar un torneo finalizado o conflicto de fechas/nombres');
      }
      throw new Error('Error al actualizar el torneo');
    }
  },

  // Eliminar torneo
  async eliminar(id: number): Promise<void> {
    console.log('🏆 Eliminando torneo:', id);
    
    try {
      await api.delete(`/torneos/${id}`);
      console.log('✅ Torneo eliminado');
    } catch (error: any) {
      console.error('❌ Error eliminando torneo:', error);
      if (error.response?.status === 409) {
        throw new Error('No se puede eliminar el torneo. Puede tener dependencias o estar activo.');
      }
      throw new Error('Error al eliminar el torneo');
    }
  },

  // Cambiar estado del torneo
  async cambiarEstado(id: number, nuevoEstado: EstadoTorneo): Promise<Torneo> {
    console.log('🏆 Cambiando estado del torneo:', id, 'a', nuevoEstado);
    
    try {
      const request: CambiarEstadoTorneoRequest = { estado: nuevoEstado };
      const response = await api.put(`/torneos/${id}/estado`, request);
      console.log('✅ Estado cambiado:', response.data);
      
      const torneo = response.data;
      
      return {
        idTorneo: torneo.id,
        nombre: torneo.nombre,
        descripcion: torneo.descripcion,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        estado: torneo.estado
      };
    } catch (error: any) {
      console.error('❌ Error cambiando estado:', error);
      if (error.response?.status === 409) {
        throw new Error('Transición de estado no válida o torneo finalizado');
      }
      throw new Error('Error al cambiar el estado del torneo');
    }
  },

  // Obtener torneos activos
  async obtenerActivos(): Promise<Torneo[]> {
    console.log('🏆 Obteniendo torneos activos');
    
    try {
      const response = await api.get('/torneos/activos');
      console.log('📋 Torneos activos:', response.data);
      
      const torneos = response.data || [];
      
      return torneos.map((torneo: any) => ({
        idTorneo: torneo.id,
        nombre: torneo.nombre,
        descripcion: torneo.descripcion,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        estado: torneo.estado
      }));
    } catch (error) {
      console.error('❌ Error obteniendo torneos activos:', error);
      return [];
    }
  },

  // Obtener torneos disponibles (pendientes)
  async obtenerDisponibles(): Promise<Torneo[]> {
    console.log('🏆 Obteniendo torneos disponibles');
    
    try {
      const response = await api.get('/torneos/disponibles');
      console.log('📋 Torneos disponibles:', response.data);
      
      const torneos = response.data || [];
      
      return torneos.map((torneo: any) => ({
        idTorneo: torneo.id,
        nombre: torneo.nombre,
        descripcion: torneo.descripcion,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        estado: torneo.estado
      }));
    } catch (error) {
      console.error('❌ Error obteniendo torneos disponibles:', error);
      return [];
    }
  },

  // Obtener estadísticas de torneos
  async obtenerEstadisticas(): Promise<TorneoEstadisticas> {
    console.log('🏆 Obteniendo estadísticas de torneos');
    
    try {
      const response = await api.get('/torneos/estadisticas');
      console.log('📊 Respuesta estadísticas:', response.data);
      
      const data = response.data;
      
      const estadisticas: TorneoEstadisticas = {
        totalTorneos: data.total || 0,
        torneosPendientes: data.pendientes || 0,
        torneosActivos: data.activos || 0,
        torneosFinalizados: data.finalizados || 0
      };
      
      return estadisticas;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw new Error('Error al obtener estadísticas');
    }
  }
};

export default torneoService;
