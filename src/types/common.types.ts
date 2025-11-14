// ==================== TIPOS COMUNES ====================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data?: T;
  total?: number;
}

export interface ApiError {
  error: string;
}
