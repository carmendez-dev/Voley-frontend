import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { equipoService } from '../../services/api';
import type { EquipoCreateRequest } from '../../types';

interface CrearEquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEquipoCreado: () => void;
}

const CrearEquipoModal: React.FC<CrearEquipoModalProps> = ({
  isOpen,
  onClose,
  onEquipoCreado
}) => {
  const [formData, setFormData] = useState<EquipoCreateRequest>({
    nombre: '',
    descripcion: ''
  });
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.trim().length > 100) {
      nuevosErrores.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    // Validar descripción (opcional)
    if (formData.descripcion && formData.descripcion.trim().length > 500) {
      nuevosErrores.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (campo: keyof EquipoCreateRequest, valor: string) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[campo]) {
      setErrores(prev => ({
        ...prev,
        [campo]: ''
      }));
    }
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setCargando(true);
      setErrores({});

      const equipoData: EquipoCreateRequest = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || ''
      };

      await equipoService.crear(equipoData);
      onEquipoCreado();
      limpiarFormulario();
    } catch (error) {
      console.error('Error creando equipo:', error);
      setErrores({
        general: error instanceof Error ? error.message : 'Error al crear el equipo'
      });
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: ''
    });
    setErrores({});
  };

  const manejarCerrar = () => {
    if (!cargando) {
      limpiarFormulario();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Equipo</h3>
            <button
              onClick={manejarCerrar}
              disabled={cargando}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Error general */}
          {errores.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{errores.general}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={manejarSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Equipo *
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => manejarCambio('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errores.nombre
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="Ingresa el nombre del equipo"
                disabled={cargando}
                maxLength={100}
              />
              {errores.nombre && (
                <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => manejarCambio('descripcion', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                  errores.descripcion
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="Descripción opcional del equipo"
                disabled={cargando}
                maxLength={500}
              />
              {errores.descripcion && (
                <p className="mt-1 text-sm text-red-600">{errores.descripcion}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {(formData.descripcion || '').length}/500 caracteres
              </p>
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
                type="submit"
                disabled={cargando}
                className="flex-1 px-4 py-2 text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {cargando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Crear Equipo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearEquipoModal;