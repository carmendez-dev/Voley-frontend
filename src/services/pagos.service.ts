import axios from 'axios';
import type { Pago, PagoCreateRequest, PagoProcesarRequest, ApiResponse } from '../types';

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

  // Crear pago con comprobante (multipart/form-data)
  async crearPagoConComprobante(pagoData: PagoCreateRequest, archivo: File | null): Promise<Pago> {
    console.log('📤 Creando pago con comprobante multipart');
    console.log('   - Datos:', pagoData);
    console.log('   - Archivo:', archivo?.name);

    const formData = new FormData();
    
    formData.append('usuarioId', pagoData.usuarioId?.toString() || '');
    formData.append('periodoMes', pagoData.periodoMes.toString());
    formData.append('periodoAnio', pagoData.periodoAnio.toString());
    formData.append('monto', pagoData.monto.toString());
    formData.append('metodoPago', pagoData.metodoPago || '');
    
    if (pagoData.estado) {
      formData.append('estado', pagoData.estado);
    }
    
    if (pagoData.observaciones) {
      formData.append('observaciones', pagoData.observaciones);
    }
    
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

export default pagoService;
