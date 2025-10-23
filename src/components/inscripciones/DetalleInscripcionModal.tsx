import React, { useState } from 'react';
import { X, Edit2, Save } from 'lucide-react';
import inscripcionesService from '../../services/inscripciones.service';
import type { Inscripcion, EstadoInscripcion } from '../../types';

interface DetalleInscripcionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscripcion: Inscripcion;
  onInscripcionActualizada: () => void;
}

const DetalleInscripcionModal: React.FC<DetalleInscripcionModalProps> = ({
  isOpen,
  onClose,
  inscripcion,
  onInscripcionActualizada
}) => {
  const [editando, setEditando] = useState(false);
  const [estado, setEstado] = useState<EstadoInscripcion>(inscripcion.estado);
  const [observaciones, setObservaciones] = useState(inscripcion.observaciones || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActualizar = async () => {
    try {
      setLoading(true);
      setError(null);
      await inscripcionesService.actualizar(inscripcion.idInscripcion!, {
        estado,
        observaciones
      });
      setEditando(false);
      onInscripcionActualizada();
    } catch (error: any) {
      console.error('Error al actualizar:', error);
      setError(error.response?.data?.message || 'Error al actualizar inscripción');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    setEstado(inscripcion.estado);
    setObservaciones(inscripcion.observaciones || '');
    setError(null);
  };

  const getEstadoBadge = (estado: EstadoInscripcion) => {
    const badges = {
      inscrito: 'bg-green-100 text-green-800',
      retirado: 'bg-yellow-100 text-yellow-800',
      descalificado: 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Detalle de Inscripción</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Información de solo lectura */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ID</label>
              <p className="text-lg text-gray-900">{inscripcion.idInscripcion}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Inscripción</label>
              <p className="text-lg text-gray-900">
                {inscripcion.fechaInscripcion
                  ? new Date(inscripcion.fechaInscripcion).toLocaleString()
                  : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Torneo</label>
              <p className="text-lg text-gray-900">{inscripcion.nombreTorneo}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
              <p className="text-lg text-gray-900">{inscripcion.nombreCategoria}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Equipo</label>
              <p className="text-lg text-gray-900">{inscripcion.nombreEquipo}</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Campos editables */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              {editando ? (
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as EstadoInscripcion)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="inscrito">Inscrito</option>
                  <option value="retirado">Retirado</option>
                  <option value="descalificado">Descalificado</option>
                </select>
              ) : (
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getEstadoBadge(inscripcion.estado)}`}>
                  {inscripcion.estado.toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
              {editando ? (
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  placeholder="Observaciones..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {inscripcion.observaciones || 'Sin observaciones'}
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {editando ? (
              <>
                <button
                  onClick={handleCancelar}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleActualizar}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setEditando(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Editar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleInscripcionModal;
