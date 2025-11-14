// ==================== API - ARCHIVO DE COMPATIBILIDAD ====================
// Este archivo mantiene la compatibilidad con el código existente
// Re-exporta todos los servicios desde sus archivos individuales

import axios from 'axios';

// Configuración base de axios
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

// Re-exportar todos los servicios
export { pagoService } from './pagos.service';
export { usuarioService } from './usuarios.service';
export { torneoService } from './torneos.service';
export { categoriaService } from './categorias.service';
export { equipoService } from './equipos.service';
export { uploadService } from './uploads.service';
export { torneoCategoriaService, categoriaEquipoService } from './relaciones.service';
export { default as inscripcionesService } from './inscripciones.service';

export default api;
