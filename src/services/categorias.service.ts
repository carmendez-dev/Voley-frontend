import axios from 'axios';
import type { 
  Categoria, 
  CategoriaCreateRequest, 
  CategoriaUpdateRequest,
  CategoriaEstadisticas,
  CategoriaFiltros
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

export const categoriaService = {
  // Obtener todas las categorías
  async obtenerTodas(filtros?: CategoriaFiltros): Promise<Categoria[]> {
    console.log('🏅 Obteniendo todas las categorías', filtros);
    
    try {
      let url = '/categorias';
      const params: string[] = [];
      
      if (filtros?.genero) {
        url = `/categorias/genero/${filtros.genero}`;
      } else if (filtros?.nombre) {
        url = `/categorias/buscar`;
        params.push(`nombre=${encodeURIComponent(filtros.nombre)}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await api.get(url);
      console.log('📋 Respuesta categorías:', response.data);
      
      const categorias = Array.isArray(response.data) ? response.data : [];
      
      return categorias.map((categoria: any) => ({
        idCategoria: categoria.idCategoria || categoria.id,
        nombre: categoria.nombre,
        genero: categoria.genero
      }));
    } catch (error) {
      console.error('❌ Error obteniendo categorías:', error);
      throw new Error('Error al obtener categorías');
    }
  },

  // Obtener categoría por ID
  async obtenerPorId(id: number): Promise<Categoria> {
    console.log('🏅 Obteniendo categoría por ID:', id);
    
    try {
      const response = await api.get(`/categorias/${id}`);
      console.log('📋 Respuesta categoría:', response.data);
      
      const categoria = response.data;
      return {
        idCategoria: categoria.idCategoria || categoria.id,
        nombre: categoria.nombre,
        genero: categoria.genero
      };
    } catch (error) {
      console.error('❌ Error obteniendo categoría:', error);
      throw new Error('Error al obtener categoría');
    }
  },

  // Crear nueva categoría
  async crear(data: CategoriaCreateRequest): Promise<Categoria> {
    console.log('➕ Creando nueva categoría:', data);
    
    try {
      const response = await api.post('/categorias', data);
      console.log('✅ Categoría creada:', response.data);
      
      const categoria = response.data;
      return {
        idCategoria: categoria.idCategoria || categoria.id,
        nombre: categoria.nombre,
        genero: categoria.genero
      };
    } catch (error) {
      console.error('❌ Error creando categoría:', error);
      if ((error as any).response?.status === 400) {
        throw new Error((error as any).response?.data?.message || 'Datos de categoría inválidos');
      }
      throw new Error('Error al crear categoría');
    }
  },

  // Actualizar categoría
  async actualizar(id: number, data: CategoriaUpdateRequest): Promise<Categoria> {
    console.log('✏️ Actualizando categoría:', id, data);
    
    try {
      const response = await api.put(`/categorias/${id}`, data);
      console.log('✅ Categoría actualizada:', response.data);
      
      const categoria = response.data;
      return {
        idCategoria: categoria.idCategoria || categoria.id,
        nombre: categoria.nombre,
        genero: categoria.genero
      };
    } catch (error) {
      console.error('❌ Error actualizando categoría:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Categoría no encontrada');
      }
      if ((error as any).response?.status === 400) {
        throw new Error((error as any).response?.data?.message || 'Datos de categoría inválidos');
      }
      throw new Error('Error al actualizar categoría');
    }
  },

  // Eliminar categoría
  async eliminar(id: number): Promise<void> {
    console.log('🗑️ Eliminando categoría:', id);
    
    try {
      await api.delete(`/categorias/${id}`);
      console.log('✅ Categoría eliminada');
    } catch (error) {
      console.error('❌ Error eliminando categoría:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Categoría no encontrada');
      }
      if ((error as any).response?.status === 409) {
        throw new Error('No se puede eliminar la categoría. Puede tener dependencias.');
      }
      throw new Error('Error al eliminar categoría');
    }
  },

  // Obtener estadísticas de categorías
  async obtenerEstadisticas(): Promise<CategoriaEstadisticas> {
    console.log('📊 Obteniendo estadísticas de categorías');
    
    try {
      const response = await api.get('/categorias/estadisticas');
      console.log('📊 Respuesta estadísticas categorías:', response.data);
      
      const data = response.data;
      
      const estadisticas: CategoriaEstadisticas = {
        totalCategorias: data.total || 0,
        categoriasMasculinas: data.masculinas || 0,
        categoriasFemeninas: data.femeninas || 0,
        categoriasMixtas: data.mixtas || 0
      };
      
      return estadisticas;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de categorías:', error);
      try {
        const categorias = await this.obtenerTodas();
        return {
          totalCategorias: categorias.length,
          categoriasMasculinas: categorias.filter(c => c.genero === 'MASCULINO').length,
          categoriasFemeninas: categorias.filter(c => c.genero === 'FEMENINO').length,
          categoriasMixtas: categorias.filter(c => c.genero === 'MIXTO').length
        };
      } catch {
        return {
          totalCategorias: 0,
          categoriasMasculinas: 0,
          categoriasFemeninas: 0,
          categoriasMixtas: 0
        };
      }
    }
  }
};

export default categoriaService;
