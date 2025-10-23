import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import inscripcionesService from '../../services/inscripciones.service';
import type { Inscripcion } from '../../types';

interface EliminarInscripcionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscripcion: Inscripcion;
  onInscripcionEliminada: () => void;
}

const EliminarInscripcionModal: React.FC<EliminarInscripcionModalProps> = ({
  isOpen,
  onClose,
  inscripcion,
  onInscripcionEliminada
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEliminar = async () => {
    try {
      setLoading(true);
      setError(null);
      await inscripcionesService.eliminar(inscripcion.idInscripcion!);
      onInscripcionEliminada();
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      setError(error.response?.data?.message || 'Error al eliminar inscripción');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Eliminar Inscripción</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-gray-900 font-medium mb-2">
                ¿Está seguro de eliminar esta inscripción?
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Torneo:</strong> {inscripcion.nombreTorneo}</p>
                <p><strong>Categoría:</strong> {inscripcion.nombreCategoria}</p>
                <p><strong>Equipo:</strong> {inscripcion.nombreEquipo}</p>
              </div>
              <p className="text-red-600 text-sm mt-3">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleEliminar}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarInscripcionModal;
