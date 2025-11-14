import axios from 'axios';
import type { TorneoCategoria, CategoriaTorneo, EquipoCategoria } from '../types';

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

// ==================== RELACIONES TORNEO-CATEGORÍA ====================

export const torneoCategoriaService = {
  // Obtener categorías de un torneo (endpoint optimizado)
  async obtenerCategoriasPorTorneo(torneoId: number): Promise<TorneoCategoria[]> {
    console.log('🔗 Obteniendo categorías del torneo:', torneoId);
    
    try {
      const response = await api.get(`/torneos/${torneoId}/categorias`);
      console.log('📋 Respuesta categorías del torneo:', response.data);
      
      const categorias = Array.isArray(response.data) ? response.data : [];
      
      return categorias.map((item: any) => ({
        idTorneoCategoria: item.idTorneoCategoria || item.id,
        idCategoria: item.idCategoria,
        nombre: item.nombre,
        idTorneo: item.idTorneo,
        nombreTorneo: item.nombreTorneo
      }));
    } catch (error) {
      console.error('❌ Error obteniendo categorías del torneo:', error);
      throw new Error('Error al obtener categorías del torneo');
    }
  },

  // Obtener torneos de una categoría
  async obtenerTorneosPorCategoria(categoriaId: number): Promise<CategoriaTorneo[]> {
    console.log('🔗 Obteniendo torneos de la categoría:', categoriaId);
    
    try {
      const response = await api.get(`/categorias/${categoriaId}/torneos`);
      console.log('🏆 Respuesta torneos de la categoría:', response.data);
      
      const torneos = Array.isArray(response.data) ? response.data : [];
      
      return torneos.map((item: any) => ({
        idTorneo: item.idTorneo,
        nombre: item.nombre,
        idCategoria: item.idCategoria,
        nombreCategoria: item.nombreCategoria
      }));
    } catch (error) {
      console.error('❌ Error obteniendo torneos de la categoría:', error);
      throw new Error('Error al obtener torneos de la categoría');
    }
  },

  // Asociar categoría a torneo
  async asociarCategoriaATorneo(torneoId: number, categoriaId: number): Promise<void> {
    console.log('➕ Asociando categoría a torneo:', { torneoId, categoriaId });
    
    try {
      await api.post(`/torneos/${torneoId}/categorias/${categoriaId}`);
      console.log('✅ Categoría asociada al torneo');
    } catch (error) {
      console.error('❌ Error asociando categoría al torneo:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Torneo o categoría no encontrada');
      }
      if ((error as any).response?.status === 409) {
        throw new Error('La categoría ya está asociada al torneo');
      }
      throw new Error('Error al asociar categoría al torneo');
    }
  },

  // Desasociar categoría de torneo
  async desasociarCategoriaDelTorneo(torneoId: number, categoriaId: number): Promise<void> {
    console.log('➖ Desasociando categoría del torneo:', { torneoId, categoriaId });
    
    try {
      await api.delete(`/torneos/${torneoId}/categorias/${categoriaId}`);
      console.log('✅ Categoría desasociada del torneo');
    } catch (error) {
      console.error('❌ Error desasociando categoría del torneo:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Relación no encontrada');
      }
      throw new Error('Error al desasociar categoría del torneo');
    }
  },

  // Verificar si categoría está asociada a torneo
  async verificarAsociacion(torneoId: number, categoriaId: number): Promise<boolean> {
    console.log('🔍 Verificando asociación:', { torneoId, categoriaId });
    
    try {
      const response = await api.get(`/torneos/${torneoId}/categorias/${categoriaId}/existe`);
      return response.data === true;
    } catch (error) {
      console.error('❌ Error verificando asociación:', error);
      return false;
    }
  }
};

// ==================== RELACIONES CATEGORIA-EQUIPO ====================

export const categoriaEquipoService = {
  // Obtener equipos de una categoría
  async obtenerEquiposPorCategoria(categoriaId: number): Promise<EquipoCategoria[]> {
    console.log('🔗 Obteniendo equipos de la categoría:', categoriaId);
    
    try {
      const response = await api.get(`/categorias/${categoriaId}/equipos`);
      console.log('📋 Respuesta equipos de la categoría:', response.data);
      
      const equipos = Array.isArray(response.data) ? response.data : [];
      return equipos.map((equipo: any) => ({
        idEquipo: equipo.idEquipo || equipo.id,
        nombreEquipo: equipo.nombre,
        descripcion: equipo.descripcion || '',
        idCategoria: categoriaId,
        nombreCategoria: ''
      }));
    } catch (error) {
      console.error('❌ Error obteniendo equipos de la categoría:', error);
      throw new Error('Error al obtener equipos de la categoría');
    }
  },

  // Asignar equipo a categoría
  async asignarEquipo(categoriaId: number, equipoId: number): Promise<void> {
    console.log('🔗 Asignando equipo a categoría:', { categoriaId, equipoId });
    
    try {
      await api.post(`/categorias/${categoriaId}/equipos/${equipoId}`);
      console.log('✅ Equipo asignado a categoría exitosamente');
    } catch (error) {
      console.error('❌ Error asignando equipo a categoría:', error);
      if ((error as any).response?.status === 409) {
        throw new Error('El equipo ya está asignado a esta categoría');
      }
      if ((error as any).response?.status === 404) {
        throw new Error('Categoría o equipo no encontrado');
      }
      throw new Error('Error al asignar equipo a categoría');
    }
  },

  // Desasignar equipo de categoría
  async desasignarEquipo(categoriaId: number, equipoId: number): Promise<void> {
    console.log('🔗 Desasignando equipo de categoría:', { categoriaId, equipoId });
    
    try {
      await api.delete(`/categorias/${categoriaId}/equipos/${equipoId}`);
      console.log('✅ Equipo desasignado de categoría exitosamente');
    } catch (error) {
      console.error('❌ Error desasignando equipo de categoría:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Relación categoría-equipo no encontrada');
      }
      throw new Error('Error al desasignar equipo de categoría');
    }
  }
};

export default {
  torneoCategoriaService,
  categoriaEquipoService
};
