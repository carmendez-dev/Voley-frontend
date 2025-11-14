import axios from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    
    switch (statusCode) {
      case 400:
        return {
          message: 'Datos inválidos. Por favor verifica la información ingresada.',
          statusCode
        };
      case 404:
        return {
          message: 'El recurso solicitado no fue encontrado.',
          statusCode
        };
      case 409:
        return {
          message: 'Ya existe un registro con estos datos.',
          statusCode
        };
      case 500:
        return {
          message: 'Error del servidor. Por favor intenta nuevamente más tarde.',
          statusCode
        };
      case 503:
        return {
          message: 'El servicio no está disponible. Por favor intenta más tarde.',
          statusCode
        };
      default:
        if (!error.response) {
          return {
            message: 'Error de conexión. Verifica tu conexión a internet.',
            statusCode: 0
          };
        }
        return {
          message: error.response?.data?.message || 'Ocurrió un error inesperado.',
          statusCode
        };
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message
    };
  }
  
  return {
    message: 'Ocurrió un error inesperado.'
  };
};
