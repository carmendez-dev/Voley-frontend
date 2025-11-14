import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import profesoresService from '../../services/profesores.service';
import type { Profesor } from '../../types/profesor.types';
import { handleApiError } from '../../utils/errorHandler';

interface EliminarProfesorModalProps {
  profesor: Profesor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EliminarProfesorModal: React.FC<EliminarProfesorModalProps> = ({
  profesor,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleEliminar = async () => {
    if (!profesor) return;

    setLoading(true);
    setError(null);

    try {
      await profesoresService.eliminarProfesor(profesor.idProfesor);
      onSuccess();
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !profesor) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Eliminar Profesor</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar al profesor{' '}
            <span className="font-semibold">{profesor.nombreCompleto}</span>?
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al profesor.
            </p>
          </div>

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
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar Profesor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarProfesorModal;
