import axios from 'axios';
import type { 
  Pago, 
  Usuario, 
  PagoCreateRequest,
  PagoProcesarRequest,
  UsuarioCreateRequest,
  ApiResponse,
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

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);


export const pagoService = {
  // Crear un nuevo pago (sin comprobante)
  async crearPago(pagoData: PagoCreateRequest): Promise<Pago> {
    // Validar que usuarioId existe
    if (!pagoData.usuarioId || pagoData.usuarioId === 0) {
      throw new Error('Debe seleccionar un usuario');
    }

    const dataToSend: any = {
      usuario: {
        id: pagoData.usuarioId
      },
      periodoMes: pagoData.periodoMes,
      periodoAnio: pagoData.periodoAnio,
      monto: pagoData.monto,
      estado: pagoData.estado
    };

    // Agregar campos opcionales solo si tienen valor
    if (pagoData.metodoPago && pagoData.metodoPago.trim() !== '') {
      dataToSend.metodoPago = pagoData.metodoPago;
    }
    
    if (pagoData.observaciones && pagoData.observaciones.trim() !== '') {
      dataToSend.observaciones = pagoData.observaciones;
    }

    console.log('📤 Creando pago (sin comprobante):', dataToSend);
    
    const response = await api.post<ApiResponse<Pago>>('/pagos', dataToSend);
    const pagoCreado = response.data.data!;
    
    console.log('✅ Pago creado con ID:', pagoCreado.id);
    
    return pagoCreado;
  },

  // ✅ NUEVO: Crear pago con comprobante (multipart/form-data)
  async crearPagoConComprobante(pagoData: PagoCreateRequest, archivo: File | null): Promise<Pago> {
    console.log('📤 Creando pago con comprobante multipart');
    console.log('   - Datos:', pagoData);
    console.log('   - Archivo:', archivo?.name);

    const formData = new FormData();
    
    // Agregar campos obligatorios
    formData.append('usuarioId', pagoData.usuarioId?.toString() || '');
    formData.append('periodoMes', pagoData.periodoMes.toString());
    formData.append('periodoAnio', pagoData.periodoAnio.toString());
    formData.append('monto', pagoData.monto.toString());
    formData.append('metodoPago', pagoData.metodoPago || '');
    
    // Agregar campos opcionales
    if (pagoData.estado) {
      formData.append('estado', pagoData.estado);
    }
    
    if (pagoData.observaciones) {
      formData.append('observaciones', pagoData.observaciones);
    }
    
    // Agregar archivo si existe
    if (archivo) {
      formData.append('comprobante', archivo);
      console.log('📎 Comprobante adjuntado:', archivo.name, archivo.type, archivo.size, 'bytes');
    }

    console.log('📦 Enviando FormData al backend...');

    const response = await api.post<ApiResponse<Pago>>('/pagos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const pagoCreado = response.data.data!;
    console.log('✅ Pago creado exitosamente:', pagoCreado);
    
    return pagoCreado;
  },

  // Obtener un pago por ID
  async obtenerPagoPorId(id: number): Promise<Pago> {
    const response = await api.get<ApiResponse<Pago>>(`/pagos/${id}`);
    return response.data.data!;
  },

  // Obtener todos los pagos
  async obtenerTodosLosPagos(): Promise<Pago[]> {
    const response = await api.get<ApiResponse<Pago[]>>('/pagos');
    return response.data.data || [];
  },

  // Obtener pagos por usuario
  async obtenerPagosPorUsuario(usuarioId: number): Promise<Pago[]> {
    const response = await api.get<ApiResponse<Pago[]>>(`/pagos/usuario/${usuarioId}`);
    return response.data.data || [];
  },

  // Obtener pagos por estado
  async obtenerPagosPorEstado(estado: string): Promise<Pago[]> {
    const response = await api.get<ApiResponse<Pago[]>>(`/pagos/estado/${estado}`);
    return response.data.data || [];
  },

  // Obtener pagos por período
  async obtenerPagosPorPeriodo(anio: number, mes: number): Promise<Pago[]> {
    const response = await api.get<ApiResponse<Pago[]>>(`/pagos/periodo/${anio}/${mes}`);
    return response.data.data || [];
  },

  // Actualizar un pago
  async actualizarPago(id: number, pagoData: Partial<PagoCreateRequest>): Promise<Pago> {
    const response = await api.put<ApiResponse<Pago>>(`/pagos/${id}`, pagoData);
    return response.data.data!;
  },

  // Procesar pago (marcar como pagado)
  async procesarPago(id: number, datosPago: PagoProcesarRequest): Promise<Pago> {
    // Construir query params en lugar de body JSON
    const params = new URLSearchParams();
    params.append('monto', datosPago.monto.toString());
    params.append('metodoPago', datosPago.metodoPago);
    if (datosPago.comprobante) {
      params.append('comprobante', datosPago.comprobante);
    }
    if (datosPago.observaciones) {
      params.append('observaciones', datosPago.observaciones);
    }
    
    const response = await api.post<ApiResponse<Pago>>(`/pagos/${id}/procesar?${params.toString()}`);
    return response.data.data!;
  },

  // Eliminar un pago
  async eliminarPago(id: number): Promise<void> {
    await api.delete<ApiResponse<void>>(`/pagos/${id}`);
  }
};


export const usuarioService = {
  // Obtener todos los usuarios
  async obtenerTodosLosUsuarios(): Promise<Usuario[]> {
    const response = await api.get<ApiResponse<Usuario[]>>('/usuarios');
    return response.data.data || [];
  },

  // Obtener usuario por ID
  async obtenerUsuarioPorId(id: number): Promise<Usuario> {
    const response = await api.get<ApiResponse<Usuario>>(`/usuarios/${id}`);
    return response.data.data!;
  },

  // Crear usuario
  async crearUsuario(usuario: UsuarioCreateRequest): Promise<Usuario> {
    const response = await api.post<ApiResponse<Usuario>>('/usuarios', usuario);
    return response.data.data!;
  },

  // Actualizar usuario
  async actualizarUsuario(id: number, usuario: Partial<UsuarioCreateRequest>): Promise<Usuario> {
    const response = await api.put<ApiResponse<Usuario>>(`/usuarios/${id}`, usuario);
    return response.data.data!;
  },

  // Eliminar usuario
  async eliminarUsuario(id: number): Promise<void> {
    await api.delete<ApiResponse<void>>(`/usuarios/${id}`);
  }
};


export const uploadService = {
  // Subir comprobante de pago usando el endpoint procesar
  async subirComprobante(archivo: File, pagoId: number, datosPago: any): Promise<string> {
    console.log('📤 uploadService.subirComprobante called');
    console.log('   - pagoId:', pagoId);
    console.log('   - archivo:', archivo.name, archivo.type, archivo.size, 'bytes');
    console.log('   - datosPago:', datosPago);
    
    // ✅ SOLUCIÓN: Archivo en FormData, parámetros en query string
    const formData = new FormData();
    formData.append('comprobante', archivo);

    // Construir query params para @RequestParam en el backend
    const params = new URLSearchParams({
      usuarioId: datosPago.usuarioId?.toString() || '',
      monto: datosPago.monto?.toString() || '0',
      periodoMes: datosPago.periodoMes?.toString() || '',
      periodoAnio: datosPago.periodoAnio?.toString() || '',
      estado: datosPago.estado || 'pagado',
      metodoPago: datosPago.metodoPago || '',
    });

    // Agregar observaciones solo si existe
    if (datosPago.observaciones) {
      params.append('observaciones', datosPago.observaciones);
    }

    const url = `/pagos/${pagoId}/procesar?${params.toString()}`;

    console.log('📦 Request preparado:');
    console.log('   - URL:', url);
    console.log('   - FormData: comprobante =', archivo.name);
    console.log('   - Query params:', params.toString());

    const response = await api.post<ApiResponse<{ ruta: string; pagoId?: number }>>(
      url, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('✅ Respuesta del servidor:', response.data);
    
    return response.data.data?.ruta || '';
  }
};

// ==================== TORNEOS SERVICE ====================

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
      
      // El backend devuelve directamente el array, no en formato ApiResponse
      const torneos = response.data || [];
      
      // Mapear los datos del backend al formato esperado en el frontend
      return torneos.map((torneo: any) => ({
        idTorneo: torneo.id, // Backend usa 'id', frontend espera 'idTorneo'
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
      
      // Mapear los datos del backend al formato esperado en el frontend
      return {
        idTorneo: torneo.id, // Backend usa 'id', frontend espera 'idTorneo'
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
    
    // Validaciones básicas
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
      
      // Mapear los datos del backend al formato esperado en el frontend
      return {
        idTorneo: torneo.id, // Backend usa 'id', frontend espera 'idTorneo'
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
    
    // Validaciones básicas
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
      
      // Mapear los datos del backend al formato esperado en el frontend
      return {
        idTorneo: torneo.id, // Backend usa 'id', frontend espera 'idTorneo'
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
      
      // Mapear los datos del backend al formato esperado en el frontend
      return {
        idTorneo: torneo.id, // Backend usa 'id', frontend espera 'idTorneo'
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
      
      // Mapear los datos del backend al formato esperado en el frontend
      return torneos.map((torneo: any) => ({
        idTorneo: torneo.id, // Backend usa 'id', frontend espera 'idTorneo'
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
      
      // Mapear los datos del backend al formato esperado en el frontend
      return torneos.map((torneo: any) => ({
        idTorneo: torneo.id, // Backend usa 'id', frontend espera 'idTorneo'
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
      
      // El backend devuelve directamente el objeto, no en formato ApiResponse
      const data = response.data;
      
      // Mapear los nombres del backend a los esperados en el frontend
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

export default api;