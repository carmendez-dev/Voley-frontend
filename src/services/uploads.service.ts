import axios from 'axios';
import type { ApiResponse } from '../types';

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

export const uploadService = {
  // Subir comprobante de pago usando el endpoint procesar
  async subirComprobante(archivo: File, pagoId: number, datosPago: any): Promise<string> {
    console.log('📤 uploadService.subirComprobante called');
    console.log('   - pagoId:', pagoId);
    console.log('   - archivo:', archivo.name, archivo.type, archivo.size, 'bytes');
    console.log('   - datosPago:', datosPago);
    
    const formData = new FormData();
    formData.append('comprobante', archivo);

    const params = new URLSearchParams({
      usuarioId: datosPago.usuarioId?.toString() || '',
      monto: datosPago.monto?.toString() || '0',
      periodoMes: datosPago.periodoMes?.toString() || '',
      periodoAnio: datosPago.periodoAnio?.toString() || '',
      estado: datosPago.estado || 'pagado',
      metodoPago: datosPago.metodoPago || '',
    });

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

export default uploadService;
