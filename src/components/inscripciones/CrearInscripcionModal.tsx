import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import inscripcionesService from '../../services/inscripciones.service';
import { torneoService, categoriaService, equipoService, torneoCategoriaService } from '../../services/api';
import type { CrearInscripcionDTO, Torneo, Categoria, Equipo, TorneoCategoria } from '../../types';

interface CrearInscripcionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInscripcionCreada: () => void;
}

const CrearInscripcionModal: React.FC<CrearInscripcionModalProps> = ({
  isOpen,
  onClose,
  onInscripcionCreada
}) => {
  const [formData, setFormData] = useState<CrearInscripcionDTO>({
    idTorneoCategoria: 0,
    idEquipo: 0,
    observaciones: ''
  });

  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [categorias, setCategorias] = useState<TorneoCategoria[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen]);

  useEffect(() => {
    if (torneoSeleccionado > 0) {
      cargarCategoriasPorTorneo(torneoSeleccionado);
    } else {
      setCategorias([]);
      setFormData(prev => ({ ...prev, idTorneoCategoria: 0 }));
    }
  }, [torneoSeleccionado]);

  const cargarDatos = async () => {
    try {
      const [torneosData, equiposData] = await Promise.all([
        torneoService.obtenerTodos(),
        equipoService.obtenerTodos()
      ]);
      setTorneos(torneosData);
      setEquipos(equiposData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos necesarios');
    }
  };

  const cargarCategoriasPorTorneo = async (torneoId: number) => {
    try {
      const categoriasData = await torneoCategoriaService.obtenerCategoriasPorTorneo(torneoId);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategorias([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.idTorneoCategoria === 0 || formData.idEquipo === 0) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await inscripcionesService.crear(formData);
      onInscripcionCreada();
    } catch (error: any) {
      console.error('Error al crear inscripción:', error);
      setError(error.response?.data?.message || 'Error al crear inscripción');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Inscripción</h2>
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

          {/* Torneo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Torneo *
            </label>
            <select
              value={torneoSeleccionado}
              onChange={(e) => setTorneoSeleccionado(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value={0}>Seleccione un torneo...</option>
              {torneos.map((torneo) => (
                <option key={torneo.idTorneo} value={torneo.idTorneo}>
                  {torneo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={formData.idTorneoCategoria}
              onChange={(e) => setFormData({ ...formData, idTorneoCategoria: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={torneoSeleccionado === 0}
            >
              <option value={0}>
                {torneoSeleccionado === 0 ? 'Primero seleccione un torneo' : 'Seleccione una categoría...'}
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.idTorneoCategoria} value={categoria.idTorneoCategoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {torneoSeleccionado > 0 && categorias.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">
                Este torneo no tiene categorías asociadas
              </p>
            )}
          </div>

          {/* Equipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipo *
            </label>
            <select
              value={formData.idEquipo}
              onChange={(e) => setFormData({ ...formData, idEquipo: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value={0}>Seleccione un equipo...</option>
              {equipos.map((equipo) => (
                <option key={equipo.idEquipo} value={equipo.idEquipo}>
                  {equipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Observaciones opcionales..."
            />
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
              {loading ? 'Creando...' : 'Crear Inscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearInscripcionModal;
