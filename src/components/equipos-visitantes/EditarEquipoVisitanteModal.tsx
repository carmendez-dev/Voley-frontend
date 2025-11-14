import React, { useState } from 'react';
import { X } from 'lucide-react';
import equiposVisitantesService from '../../services/equipos-visitantes.service';
import type { EquipoVisitante, EquipoVisitanteUpdateRequest } from '../../types/equipo-visitante.types';

interface EditarEquipoVisitanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipo: EquipoVisitante;
  onEquipoActualizado: () => void;
}

const EditarEquipoVisitanteModal: React.FC<EditarEquipoVisitanteModalProps> = ({
  isOpen,
  onClose,
  equipo,
  onEquipoActualizado
}) => {
  const [formData, setFormData] = useState<EquipoVisitanteUpdateRequest>({
    nombre: equipo.nombre
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (formData.nombre.length > 100) {
      setError('El nombre no puede exceder 100 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await equiposVisitantesService.actualizar(equipo.idEquipoVisitante, formData);
      onEquipoActualizado();
    } catch (error: any) {
      console.error('Error al actualizar equipo visitante:', error);
      setError(error.response?.data?.message || 'Error al actualizar equipo visitante');
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
          <h2 className="text-xl font-bold text-gray-900">Editar Equipo Visitante</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* ID (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID
            </label>
            <input
              type="text"
              value={`#${equipo.idEquipoVisitante}`}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ nombre: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Club Deportivo Visitante"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.nombre.length}/100 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarEquipoVisitanteModal;
