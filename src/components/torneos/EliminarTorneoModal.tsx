import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { torneoService } from '../../services/api';
import type { Torneo } from '../../types';
import EstadoBadgeTorneo from '../shared/EstadoBadgeTorneo';

interface EliminarTorneoModalProps {
  torneo: Torneo;
  onClose: () => void;
  onSuccess: () => void;
}

const EliminarTorneoModal: React.FC<EliminarTorneoModalProps> = ({ 
  torneo, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacionTexto, setConfirmacionTexto] = useState('');

  // Manejar ESC y prevenir scroll del body
  React.useEffect(() => {
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
  }, [onClose]);

  // Manejar click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const puedeEliminar = torneo.estado !== 'Activo';
  const textoConfirmacion = torneo.nombre.toUpperCase();

  const formatearFecha = (fecha?: string): string => {
    if (!fecha) return 'No definida';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!puedeEliminar) {
      setError('No se puede eliminar un torneo activo');
      return;
    }

    if (confirmacionTexto !== textoConfirmacion) {
      setError('El texto de confirmación no coincide');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await torneoService.eliminar(torneo.idTorneo);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error && err.message.includes('409')) {
        setError('No se puede eliminar el torneo. Puede tener dependencias o estar activo.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al eliminar el torneo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Eliminar Torneo</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Advertencia */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  ¡Acción irreversible!
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Esta acción no se puede deshacer. El torneo será eliminado permanentemente.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Información del torneo */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">{torneo.nombre}</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <EstadoBadgeTorneo estado={torneo.estado} />
              </div>
              
              {torneo.descripcion && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Descripción:</span>
                  <span className="text-gray-900 max-w-xs truncate" title={torneo.descripcion}>
                    {torneo.descripcion}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha inicio:</span>
                <span className="text-gray-900">{formatearFecha(torneo.fechaInicio)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha fin:</span>
                <span className="text-gray-900">{formatearFecha(torneo.fechaFin)}</span>
              </div>
            </div>
          </div>

          {/* Restricciones */}
          {!puedeEliminar ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700">
                <strong>No se puede eliminar:</strong>
              </p>
              <ul className="text-sm text-amber-600 mt-2 list-disc list-inside">
                {torneo.estado === 'Activo' && (
                  <li>Los torneos activos no pueden ser eliminados</li>
                )}
              </ul>
              <p className="text-xs text-amber-600 mt-2">
                Cambia el estado del torneo antes de eliminarlo.
              </p>
            </div>
          ) : (
            <div>
              {/* Confirmación por texto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para confirmar, escriba el nombre del torneo:
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {textoConfirmacion}
                  </code>
                </p>
                <input
                  type="text"
                  value={confirmacionTexto}
                  onChange={(e) => setConfirmacionTexto(e.target.value)}
                  className="input-field w-full"
                  placeholder="Escriba el nombre del torneo en mayúsculas"
                  autoComplete="off"
                />
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> Solo se pueden eliminar torneos con estado "Pendiente" o "Finalizado".
                </p>
              </div>
            </div>
          )}

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
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loading || 
                !puedeEliminar || 
                confirmacionTexto !== textoConfirmacion
              }
            >
              {loading ? 'Eliminando...' : 'Eliminar Torneo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EliminarTorneoModal;