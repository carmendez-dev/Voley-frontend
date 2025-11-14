import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import partidosService from '../../services/partidos.service';
import type { Partido } from '../../types/partido.types';
import { handleApiError } from '../../utils/errorHandler';

interface EliminarPartidoModalProps {
  partido: Partido | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EliminarPartidoModal: React.FC<EliminarPartidoModalProps> = ({
  partido,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manejar ESC y prevenir scroll del body
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Resetear error cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEliminar = async () => {
    if (!partido) return;

    setLoading(true);
    setError(null);

    try {
      await partidosService.eliminarPartido(partido.idPartido);
      onSuccess();
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !partido) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Mensaje de confirmación */}
          <div className="space-y-3">
            <p className="text-gray-700">
              ¿Está seguro que desea eliminar el siguiente partido?
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-center text-lg font-semibold text-gray-900">
                {partido.nombreEquipoLocal}
                <span className="text-gray-500 mx-2">vs</span>
                {partido.nombreEquipoVisitante}
              </p>
              <div className="mt-2 text-sm text-gray-600 text-center">
                <p>{new Date(partido.fecha).toLocaleString('es-ES', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                })}</p>
                <p className="mt-1">{partido.ubicacion}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                <strong>Advertencia:</strong> Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEliminar}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarPartidoModal;
