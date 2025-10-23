import axios from 'axios';
import type { 
  Inscripcion, 
  CrearInscripcionDTO, 
  ActualizarInscripcionDTO,
  InscripcionResponse,
  EstadoInscripcion 
} from '../types';

const API_URL = 'http://localhost:8080/api/inscripciones';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class InscripcionesService {
  // Crear inscripción
  async crear(dto: CrearInscripcionDTO): Promise<Inscripcion> {
    console.log('📝 Creando inscripción:', dto);
    
    try {
      const response = await api.post<InscripcionResponse>('', dto);
      console.log('✅ Inscripción creada:', response.data);
      return response.data.data as Inscripcion;
    } catch (error: any) {
      console.error('❌ Error creando inscripción:', error);
      throw error;
    }
  }

  // Obtener todas las inscripciones
  async obtenerTodas(): Promise<Inscripcion[]> {
    console.log('📋 Obteniendo todas las inscripciones');
    
    try {
      const response = await api.get<InscripcionResponse>('');
      console.log('✅ Inscripciones obtenidas:', response.data);
      return response.data.data as Inscripcion[];
    } catch (error: any) {
      console.error('❌ Error obteniendo inscripciones:', error);
      throw error;
    }
  }

  // Obtener por ID
  async obtenerPorId(id: number): Promise<Inscripcion> {
    console.log('🔍 Obteniendo inscripción por ID:', id);
    
    try {
      const response = await api.get<InscripcionResponse>(`/${id}`);
      console.log('✅ Inscripción obtenida:', response.data);
      return response.data.data as Inscripcion;
    } catch (error: any) {
      console.error('❌ Error obteniendo inscripción:', error);
      throw error;
    }
  }

  // Obtener por estado
  async obtenerPorEstado(estado: EstadoInscripcion): Promise<Inscripcion[]> {
    console.log('🔍 Obteniendo inscripciones por estado:', estado);
    
    try {
      const response = await api.get<InscripcionResponse>(`?estado=${estado}`);
      console.log('✅ Inscripciones obtenidas:', response.data);
      return response.data.data as Inscripcion[];
    } catch (error: any) {
      console.error('❌ Error obteniendo inscripciones por estado:', error);
      throw error;
    }
  }

  // Obtener por torneo y categoría
  async obtenerPorTorneoYCategoria(idTorneo: number, idCategoria: number): Promise<Inscripcion[]> {
    console.log('🔍 Obteniendo inscripciones por torneo y categoría:', { idTorneo, idCategoria });
    
    try {
      const response = await api.get<InscripcionResponse>(`/torneos/${idTorneo}/categorias/${idCategoria}/equipos`);
      console.log('✅ Inscripciones obtenidas:', response.data);
      return response.data.data as Inscripcion[];
    } catch (error: any) {
      console.error('❌ Error obteniendo inscripciones:', error);
      throw error;
    }
  }

  // Obtener por equipo
  async obtenerPorEquipo(idEquipo: number): Promise<Inscripcion[]> {
    console.log('🔍 Obteniendo inscripciones por equipo:', idEquipo);
    
    try {
      const response = await api.get<InscripcionResponse>(`/equipos/${idEquipo}`);
      console.log('✅ Inscripciones obtenidas:', response.data);
      return response.data.data as Inscripcion[];
    } catch (error: any) {
      console.error('❌ Error obteniendo inscripciones por equipo:', error);
      throw error;
    }
  }

  // Actualizar inscripción (estado y observaciones)
  async actualizar(id: number, dto: ActualizarInscripcionDTO): Promise<Inscripcion> {
    console.log('✏️ Actualizando inscripción:', id, dto);
    
    try {
      const response = await api.put<InscripcionResponse>(`/${id}`, dto);
      console.log('✅ Inscripción actualizada:', response.data);
      return response.data.data as Inscripcion;
    } catch (error: any) {
      console.error('❌ Error actualizando inscripción:', error);
      throw error;
    }
  }

  // Cambiar estado (alternativa)
  async cambiarEstado(id: number, estado: EstadoInscripcion, observaciones?: string): Promise<Inscripcion> {
    console.log('🔄 Cambiando estado de inscripción:', id, estado);
    
    try {
      const response = await api.put<InscripcionResponse>(`/${id}/estado`, { estado, observaciones });
      console.log('✅ Estado cambiado:', response.data);
      return response.data.data as Inscripcion;
    } catch (error: any) {
      console.error('❌ Error cambiando estado:', error);
      throw error;
    }
  }

  // Eliminar inscripción
  async eliminar(id: number): Promise<void> {
    console.log('🗑️ Eliminando inscripción:', id);
    
    try {
      await api.delete(`/${id}`);
      console.log('✅ Inscripción eliminada');
    } catch (error: any) {
      console.error('❌ Error eliminando inscripción:', error);
      throw error;
    }
  }
}

export default new InscripcionesService();
