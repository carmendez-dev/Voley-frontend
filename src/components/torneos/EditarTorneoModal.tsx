import React, { useState } from 'react';
import { X, Edit3, Calendar, FileText } from 'lucide-react';
import { torneoService } from '../../services/api';
import type { Torneo, TorneoUpdateRequest } from '../../types';

interface EditarTorneoModalProps {
  torneo: Torneo;
  onClose: () => void;
  onSuccess: () => void;
}

const EditarTorneoModal: React.FC<EditarTorneoModalProps> = ({ torneo, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TorneoUpdateRequest>({
    nombre: torneo.nombre,
    descripcion: torneo.descripcion || '',
    fechaInicio: torneo.fechaInicio || '',
    fechaFin: torneo.fechaFin || ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.nombre?.trim()) {
      return 'El nombre del torneo es obligatorio';
    }

    if (formData.nombre.trim().length > 100) {
      return 'El nombre no puede exceder los 100 caracteres';
    }

    if (formData.fechaInicio && formData.fechaFin) {
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);
      
      if (fechaInicio > fechaFin) {
        return 'La fecha de inicio no puede ser posterior a la fecha de fin';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar datos para enviar
      const dataToSend: TorneoUpdateRequest = {};

      // Solo incluir campos que han cambiado
      if (formData.nombre?.trim() !== torneo.nombre) {
        dataToSend.nombre = formData.nombre?.trim();
      }

      if (formData.descripcion?.trim() !== (torneo.descripcion || '')) {
        dataToSend.descripcion = formData.descripcion?.trim() || undefined;
      }

      if (formData.fechaInicio !== (torneo.fechaInicio || '')) {
        dataToSend.fechaInicio = formData.fechaInicio || undefined;
      }

      if (formData.fechaFin !== (torneo.fechaFin || '')) {
        dataToSend.fechaFin = formData.fechaFin || undefined;
      }

      // Si no hay cambios, mostrar mensaje
      if (Object.keys(dataToSend).length === 0) {
        setError('No se detectaron cambios para actualizar');
        return;
      }

      await torneoService.actualizar(torneo.idTorneo, dataToSend);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error && err.message.includes('409')) {
        setError('No se puede actualizar un torneo finalizado o conflicto de fechas/nombres');
      } else {
        setError(err instanceof Error ? err.message : 'Error al actualizar el torneo');
      }
    } finally {
      setLoading(false);
    }
  };

  const esTorneoFinalizado = torneo.estado === 'Finalizado';

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
            <div className="p-2 bg-blue-100 rounded-full">
              <Edit3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Editar Torneo</h3>
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

          {/* Advertencia para torneos finalizados */}
          {esTorneoFinalizado && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-700">
                <strong>Advertencia:</strong> No se puede actualizar un torneo finalizado.
              </p>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Torneo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Ej: Torneo de Verano 2025"
              maxLength={100}
              required
              disabled={esTorneoFinalizado}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.nombre?.length || 0}/100 caracteres
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="input-field w-full pl-10 resize-none"
                placeholder="Descripción del torneo (opcional)"
                disabled={esTorneoFinalizado}
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  className="input-field w-full pl-10"
                  disabled={esTorneoFinalizado}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  className="input-field w-full pl-10"
                  min={formData.fechaInicio || undefined}
                  disabled={esTorneoFinalizado}
                />
              </div>
            </div>
          </div>

          {/* Info del estado actual */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Estado actual:</strong> {torneo.estado}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Para cambiar el estado, usa la opción "Estado" en la tabla.
            </p>
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
              disabled={loading || !formData.nombre?.trim() || esTorneoFinalizado}
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarTorneoModal;