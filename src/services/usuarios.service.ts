import axios from 'axios';
import type { Usuario, UsuarioCreateRequest, UsuarioEstadisticas, ApiResponse } from '../types';

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

export const usuarioService = {
  // Obtener todos los usuarios
  async obtenerTodos(params?: { completo?: boolean; estado?: string }): Promise<Usuario[]> {
    console.log('👥 Obteniendo usuarios:', params);
    
    try {
      const queryParams = new URLSearchParams();
      if (params?.completo) queryParams.append('completo', 'true');
      if (params?.estado) queryParams.append('estado', params.estado);
      
      const url = queryParams.toString() ? `/usuarios?${queryParams}` : '/usuarios';
      const response = await api.get<ApiResponse<Usuario[]>>(url);
      
      console.log('✅ Usuarios obtenidos:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      throw new Error('Error al obtener usuarios');
    }
  },

  // Obtener usuario por ID
  async obtenerPorId(id: number, completo: boolean = false): Promise<Usuario> {
    console.log(`👤 Obteniendo usuario ${id}, completo: ${completo}`);
    
    try {
      const url = completo ? `/usuarios/${id}?completo=true` : `/usuarios/${id}`;
      const response = await api.get<ApiResponse<Usuario>>(url);
      
      console.log('✅ Usuario obtenido:', response.data.data?.nombreCompleto);
      return response.data.data!;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      throw new Error('Error al obtener usuario');
    }
  },

  // Crear usuario
  async crear(usuario: UsuarioCreateRequest): Promise<Usuario> {
    console.log('➕ Creando usuario:', usuario.primerNombre, usuario.primerApellido);
    
    try {
      const response = await api.post<ApiResponse<Usuario>>('/usuarios', usuario);
      
      console.log('✅ Usuario creado:', response.data.data?.nombreCompleto);
      return response.data.data!;
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      if ((error as any).response?.status === 400) {
        const errorMessage = (error as any).response?.data?.message || 'Datos inválidos';
        throw new Error(errorMessage);
      }
      throw new Error('Error al crear usuario');
    }
  },

  // Actualizar usuario
  async actualizar(id: number, usuario: Partial<UsuarioCreateRequest>): Promise<Usuario> {
    console.log(`✏️ Actualizando usuario ${id}`);
    
    try {
      const response = await api.put<ApiResponse<Usuario>>(`/usuarios/${id}`, usuario);
      
      console.log('✅ Usuario actualizado:', response.data.data?.nombreCompleto);
      return response.data.data!;
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      if ((error as any).response?.status === 400) {
        const errorMessage = (error as any).response?.data?.message || 'Datos inválidos';
        throw new Error(errorMessage);
      }
      throw new Error('Error al actualizar usuario');
    }
  },

  // Eliminar usuario
  async eliminar(id: number): Promise<void> {
    console.log(`🗑️ Eliminando usuario ${id}`);
    
    try {
      await api.delete<ApiResponse<void>>(`/usuarios/${id}`);
      
      console.log('✅ Usuario eliminado exitosamente');
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      throw new Error('Error al eliminar usuario');
    }
  },

  // Cambiar estado de usuario
  async cambiarEstado(id: number, estado: 'Activo' | 'Inactivo'): Promise<{ mensaje: string; usuario: any }> {
    console.log(`🔄 Cambiando estado usuario ${id} a: ${estado}`);
    
    try {
      const response = await api.put<ApiResponse<{ mensaje: string; usuario: any }>>(`/usuarios/${id}/estado`, { estado });
      
      console.log('✅ Estado actualizado:', response.data.data?.usuario?.nombreCompleto);
      return response.data.data!;
    } catch (error) {
      console.error('❌ Error cambiando estado:', error);
      if ((error as any).response?.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      if ((error as any).response?.status === 400) {
        throw new Error('Estado inválido');
      }
      throw new Error('Error al cambiar estado del usuario');
    }
  },

  // Obtener estadísticas de usuarios
  async obtenerEstadisticas(): Promise<UsuarioEstadisticas> {
    console.log('📊 Obteniendo estadísticas de usuarios');
    
    try {
      const response = await api.get<ApiResponse<UsuarioEstadisticas>>('/usuarios/estadisticas');
      
      console.log('✅ Estadísticas obtenidas:', response.data.data);
      return response.data.data!;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        totalUsuarios: 0,
        usuariosActivos: 0,
        usuariosInactivos: 0,
        porcentajeActivos: 0,
        distribucioGenero: { Masculino: 0, Femenino: 0 },
        edadPromedio: 0,
        imcPromedio: 0,
        registrosUltimoMes: 0
      };
    }
  },

  // Buscar usuarios
  async buscar(termino: string): Promise<Usuario[]> {
    console.log('🔍 Buscando usuarios:', termino);
    
    try {
      if (!termino.trim()) {
        throw new Error('Término de búsqueda requerido');
      }
      
      const response = await api.get<ApiResponse<Usuario[]>>(`/usuarios/buscar?termino=${encodeURIComponent(termino)}`);
      
      console.log('✅ Búsqueda completada:', response.data.data?.length || 0, 'resultados');
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error buscando usuarios:', error);
      if ((error as any).response?.status === 400) {
        throw new Error('Término de búsqueda requerido');
      }
      throw new Error('Error al buscar usuarios');
    }
  },

  // Métodos de compatibilidad
  async obtenerTodosLosUsuarios(): Promise<Usuario[]> {
    return this.obtenerTodos();
  },

  async obtenerUsuarioPorId(id: number): Promise<Usuario> {
    return this.obtenerPorId(id);
  },

  async crearUsuario(usuario: UsuarioCreateRequest): Promise<Usuario> {
    return this.crear(usuario);
  },

  async actualizarUsuario(id: number, usuario: Partial<UsuarioCreateRequest>): Promise<Usuario> {
    return this.actualizar(id, usuario);
  },

  async eliminarUsuario(id: number): Promise<void> {
    return this.eliminar(id);
  }
};

export default usuarioService;
