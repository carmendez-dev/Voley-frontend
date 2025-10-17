import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { torneoService } from '../../services/api';
import type { Torneo, EstadoTorneo } from '../../types';
import EstadoBadgeTorneo from '../shared/EstadoBadgeTorneo';

interface CambiarEstadoTorneoModalProps {
  torneo: Torneo;
  onClose: () => void;
  onSuccess: () => void;
}

const CambiarEstadoTorneoModal: React.FC<CambiarEstadoTorneoModalProps> = ({ 
  torneo, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoTorneo>(torneo.estado);

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

  const estadosPermitidos: EstadoTorneo[] = (() => {
    switch (torneo.estado) {
      case 'Pendiente':
        return ['Activo', 'Finalizado']; // No puede volver a Pendiente
      case 'Activo':
        return ['Finalizado']; // Solo puede finalizar
      case 'Finalizado':
        return []; // No puede cambiar de estado
      default:
        return [];
    }
  })();

  const getEstadoDescripcion = (estado: EstadoTorneo): string => {
    switch (estado) {
      case 'Pendiente':
        return 'Torneo programado, en preparación';
      case 'Activo':
        return 'Torneo en curso';
      case 'Finalizado':
        return 'Torneo terminado';
      default:
        return '';
    }
  };

  const getTransicionDescripcion = (desde: EstadoTorneo, hacia: EstadoTorneo): string => {
    if (desde === 'Pendiente' && hacia === 'Activo') {
      return 'El torneo comenzará y estará activo';
    }
    if ((desde === 'Pendiente' || desde === 'Activo') && hacia === 'Finalizado') {
      return 'El torneo será marcado como terminado';
    }
    return `Cambiar de ${desde} a ${hacia}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nuevoEstado === torneo.estado) {
      setError('Debe seleccionar un estado diferente al actual');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await torneoService.cambiarEstado(torneo.idTorneo, nuevoEstado);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error && err.message.includes('409')) {
        setError('Transición de estado no válida o torneo finalizado');
      } else {
        setError(err instanceof Error ? err.message : 'Error al cambiar el estado del torneo');
      }
    } finally {
      setLoading(false);
    }
  };

  const puedecambiarEstado = estadosPermitidos.length > 0;

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
            <div className="p-2 bg-green-100 rounded-full">
              <RefreshCw className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cambiar Estado del Torneo</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Información del torneo */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{torneo.nombre}</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estado actual:</span>
              <EstadoBadgeTorneo estado={torneo.estado} />
            </div>
          </div>

          {/* Selector de nuevo estado */}
          {puedecambiarEstado ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo Estado
              </label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value as EstadoTorneo)}
                className="input-field w-full"
                required
              >
                <option value={torneo.estado}>Seleccionar nuevo estado</option>
                {estadosPermitidos.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              
              {nuevoEstado !== torneo.estado && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Vista previa:</span>
                    <EstadoBadgeTorneo estado={nuevoEstado} />
                  </div>
                  <p className="text-sm text-blue-700">
                    {getEstadoDescripcion(nuevoEstado)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {getTransicionDescripcion(torneo.estado, nuevoEstado)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700">
                <strong>No se puede cambiar el estado:</strong>
              </p>
              <ul className="text-sm text-amber-600 mt-2 list-disc list-inside">
                {torneo.estado === 'Finalizado' && (
                  <li>Los torneos finalizados no pueden cambiar de estado</li>
                )}
              </ul>
            </div>
          )}

          {/* Información sobre transiciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Reglas de transición:</strong>
            </p>
            <ul className="text-xs text-blue-600 mt-2 list-disc list-inside space-y-1">
              <li>Pendiente → Activo/Finalizado</li>
              <li>Activo → Finalizado</li>
              <li>Finalizado → Sin cambios permitidos</li>
              <li>No se puede volver al estado Pendiente</li>
            </ul>
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
              type="submit"
              className="btn-primary"
              disabled={
                loading || 
                !puedecambiarEstado || 
                nuevoEstado === torneo.estado
              }
            >
              {loading ? 'Cambiando...' : 'Cambiar Estado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarEstadoTorneoModal;