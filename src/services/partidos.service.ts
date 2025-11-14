import axios from 'axios';
import type {
  Partido,
  CrearPartidoDTO,
  ActualizarPartidoDTO,
  PartidoCardStyle,
  ResultadoPartido
} from '../types/partido.types';
import { handleApiError } from '../utils/errorHandler';

const API_URL = 'http://localhost:8080/api/partidos';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class PartidosService {
  // Obtener todos los partidos
  async obtenerPartidos(): Promise<Partido[]> {
    console.log('📋 Obteniendo todos los partidos');
    
    try {
      const response = await api.get<any>('');
      console.log('✅ Respuesta completa:', response.data);
      
      // Manejar diferentes formatos de respuesta
      let partidos: Partido[];
      if (Array.isArray(response.data)) {
        partidos = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        partidos = response.data.data;
      } else {
        console.warn('⚠️ Formato de respuesta inesperado:', response.data);
        partidos = [];
      }
      
      console.log('✅ Partidos procesados:', partidos);
      return partidos;
    } catch (error: any) {
      console.error('❌ Error obteniendo partidos:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener partido por ID
  async obtenerPartidoPorId(id: number): Promise<Partido> {
    console.log('🔍 Obteniendo partido por ID:', id);
    
    try {
      const response = await api.get<any>(`/${id}`);
      console.log('✅ Partido obtenido:', response.data);
      
      // Manejar diferentes formatos de respuesta
      const partido = response.data?.data || response.data;
      return partido;
    } catch (error: any) {
      console.error('❌ Error obteniendo partido:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Crear partido
  async crearPartido(data: CrearPartidoDTO): Promise<Partido> {
    console.log('📝 Creando partido:', data);
    
    try {
      const response = await api.post<any>('', data);
      console.log('✅ Partido creado:', response.data);
      
      // Manejar diferentes formatos de respuesta
      const partido = response.data?.data || response.data;
      return partido;
    } catch (error: any) {
      console.error('❌ Error creando partido:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Actualizar partido
  async actualizarPartido(id: number, data: ActualizarPartidoDTO): Promise<Partido> {
    console.log('✏️ Actualizando partido:', id, data);
    
    try {
      const response = await api.put<any>(`/${id}`, data);
      console.log('✅ Partido actualizado:', response.data);
      
      // Manejar diferentes formatos de respuesta
      const partido = response.data?.data || response.data;
      return partido;
    } catch (error: any) {
      console.error('❌ Error actualizando partido:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Eliminar partido
  async eliminarPartido(id: number): Promise<void> {
    console.log('🗑️ Eliminando partido:', id);
    
    try {
      await api.delete(`/${id}`);
      console.log('✅ Partido eliminado');
    } catch (error: any) {
      console.error('❌ Error eliminando partido:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Cambiar resultado del partido
  async cambiarResultado(id: number, resultado: ResultadoPartido): Promise<Partido> {
    console.log('🔄 Cambiando resultado del partido:', id, resultado);
    
    try {
      const response = await api.put<any>(`/${id}/resultado`, { resultado });
      console.log('✅ Resultado actualizado:', response.data);
      
      // Manejar diferentes formatos de respuesta
      const partido = response.data?.data || response.data;
      return partido;
    } catch (error: any) {
      console.error('❌ Error cambiando resultado:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Helper para obtener estilos según resultado
  obtenerEstilosPorResultado(resultado: ResultadoPartido): PartidoCardStyle {
    switch (resultado) {
      case 'Ganado':
        return {
          borderColor: 'border-green-500',
          shadowColor: 'shadow-green-200',
          bgColor: 'bg-white'
        };
      case 'Perdido':
        return {
          borderColor: 'border-red-500',
          shadowColor: 'shadow-red-200',
          bgColor: 'bg-white'
        };
      case 'Walkover':
        return {
          borderColor: 'border-green-700',
          shadowColor: 'shadow-green-300',
          bgColor: 'bg-white'
        };
      case 'WalkoverContra':
        return {
          borderColor: 'border-orange-500',
          shadowColor: 'shadow-orange-200',
          bgColor: 'bg-white'
        };
      case 'Pendiente':
      default:
        return {
          borderColor: 'border-gray-300',
          shadowColor: 'shadow-gray-100',
          bgColor: 'bg-white'
        };
    }
  }
}

export default new PartidosService();
