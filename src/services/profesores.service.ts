import axios from 'axios';
import type {
  Profesor,
  CrearProfesorDTO,
  ActualizarProfesorDTO,
  CambiarPasswordDTO,
  ProfesorResponse,
  EstadoProfesor
} from '../types/profesor.types';
import { handleApiError } from '../utils/errorHandler';

const API_URL = 'http://localhost:8080/api/profesores';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ProfesoresService {
  // Crear profesor
  async crearProfesor(data: CrearProfesorDTO): Promise<Profesor> {
    console.log('📝 Creando profesor:', data);
    
    try {
      const response = await api.post<ProfesorResponse>('', data);
      console.log('✅ Profesor creado:', response.data);
      return response.data.data as Profesor;
    } catch (error: any) {
      console.error('❌ Error creando profesor:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener todos los profesores
  async obtenerTodos(): Promise<Profesor[]> {
    console.log('📋 Obteniendo todos los profesores');
    
    try {
      const response = await api.get<ProfesorResponse>('');
      console.log('✅ Profesores obtenidos:', response.data);
      return response.data.data as Profesor[];
    } catch (error: any) {
      console.error('❌ Error obteniendo profesores:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Filtrar profesores por estado
  async obtenerPorEstado(estado: EstadoProfesor): Promise<Profesor[]> {
    console.log('🔍 Obteniendo profesores por estado:', estado);
    
    try {
      const response = await api.get<ProfesorResponse>(`?estado=${estado}`);
      console.log('✅ Profesores filtrados:', response.data);
      return response.data.data as Profesor[];
    } catch (error: any) {
      console.error('❌ Error filtrando profesores:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener profesor por ID
  async obtenerPorId(id: number): Promise<Profesor> {
    console.log('🔍 Obteniendo profesor por ID:', id);
    
    try {
      const response = await api.get<ProfesorResponse>(`/${id}`);
      console.log('✅ Profesor obtenido:', response.data);
      return response.data.data as Profesor;
    } catch (error: any) {
      console.error('❌ Error obteniendo profesor:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Obtener profesor por cédula
  async obtenerPorCedula(cedula: string): Promise<Profesor> {
    console.log('🔍 Obteniendo profesor por cédula:', cedula);
    
    try {
      const response = await api.get<ProfesorResponse>(`/cedula/${cedula}`);
      console.log('✅ Profesor obtenido:', response.data);
      return response.data.data as Profesor;
    } catch (error: any) {
      console.error('❌ Error obteniendo profesor por cédula:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Actualizar profesor
  async actualizarProfesor(id: number, data: ActualizarProfesorDTO): Promise<Profesor> {
    console.log('✏️ Actualizando profesor:', id, data);
    
    try {
      const response = await api.put<ProfesorResponse>(`/${id}`, data);
      console.log('✅ Profesor actualizado:', response.data);
      return response.data.data as Profesor;
    } catch (error: any) {
      console.error('❌ Error actualizando profesor:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Cambiar contraseña por cédula
  async cambiarPasswordPorCedula(cedula: string, data: CambiarPasswordDTO): Promise<void> {
    console.log('🔐 Cambiando contraseña del profesor con cédula:', cedula);
    
    try {
      await api.put(`/cedula/${cedula}/password`, data);
      console.log('✅ Contraseña actualizada');
    } catch (error: any) {
      console.error('❌ Error cambiando contraseña:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  // Eliminar profesor
  async eliminarProfesor(id: number): Promise<void> {
    console.log('🗑️ Eliminando profesor:', id);
    
    try {
      await api.delete(`/${id}`);
      console.log('✅ Profesor eliminado');
    } catch (error: any) {
      console.error('❌ Error eliminando profesor:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }
}

export default new ProfesoresService();
