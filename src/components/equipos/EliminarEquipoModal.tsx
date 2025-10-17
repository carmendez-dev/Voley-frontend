import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { equipoService } from '../../services/api';
import type { Equipo } from '../../types';

interface EliminarEquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipo: Equipo;
  onEquipoEliminado: () => void;
}

const EliminarEquipoModal: React.FC<EliminarEquipoModalProps> = ({
  isOpen,
  onClose,
  equipo,
  onEquipoEliminado
}) => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState('');

  const manejarEliminar = async () => {
    if (confirmacion !== equipo.nombre) {
      setError('El nombre del equipo no coincide');
      return;
    }

    try {
      setCargando(true);
      setError(null);

      await equipoService.eliminar(equipo.idEquipo);
      onEquipoEliminado();
      onClose();
    } catch (error) {
      console.error('Error eliminando equipo:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar el equipo');
    } finally {
      setCargando(false);
    }
  };

  const manejarCerrar = () => {
    if (!cargando) {
      setConfirmacion('');
      setError(null);
      onClose();
    }
  };

  const puedeEliminar = confirmacion === equipo.nombre;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <AlertTriangle size={24} className="text-red-500" />
              <span>Eliminar Equipo</span>
            </h3>
            <button
              onClick={manejarCerrar}
              disabled={cargando}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenido */}
          <div className="space-y-4">
            {/* Advertencia */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    ¡Atención! Esta acción es irreversible
                  </h3>
                  <p className="mt-2 text-sm text-red-700">
                    Estás a punto de eliminar el equipo permanentemente. Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>

            {/* Información del equipo */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Equipo a eliminar:</h4>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Nombre:</span> {equipo.nombre}
                </p>
                {equipo.descripcion && (
                  <p className="text-sm">
                    <span className="font-medium">Descripción:</span> {equipo.descripcion}
                  </p>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Confirmación */}
            <div>
              <label htmlFor="confirmacion" className="block text-sm font-medium text-gray-700 mb-2">
                Para confirmar, escribe el nombre del equipo: <span className="font-bold text-red-600">{equipo.nombre}</span>
              </label>
              <input
                type="text"
                id="confirmacion"
                value={confirmacion}
                onChange={(e) => {
                  setConfirmacion(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="Escribe el nombre del equipo"
                disabled={cargando}
              />
              {error && confirmacion !== equipo.nombre && (
                <p className="mt-1 text-sm text-red-600">El nombre debe coincidir exactamente</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={manejarCerrar}
                disabled={cargando}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={manejarEliminar}
                disabled={cargando || !puedeEliminar}
                className="flex-1 px-4 py-2 text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {cargando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={20} />
                    <span>Eliminar Equipo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarEquipoModal;