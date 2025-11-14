import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Edit } from 'lucide-react';
import partidosService from '../../services/partidos.service';
import torneoService from '../../services/torneos.service';
import { torneoCategoriaService } from '../../services/relaciones.service';
import inscripcionesService from '../../services/inscripciones.service';
import equiposVisitantesService from '../../services/equipos-visitantes.service';
import type { Partido, ActualizarPartidoDTO, ResultadoPartido } from '../../types/partido.types';
import { ResultadosPartido } from '../../types/partido.types';
import type { Torneo } from '../../types/torneo.types';
import type { TorneoCategoria } from '../../types/relaciones.types';
import type { Inscripcion } from '../../types/inscripcion.types';
import type { EquipoVisitante } from '../../types/equipo-visitante.types';
import { handleApiError } from '../../utils/errorHandler';

interface EditarPartidoModalProps {
  partido: Partido | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditarPartidoModal: React.FC<EditarPartidoModalProps> = ({ 
  partido, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para los selectores en cascada (opcional)
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [categorias, setCategorias] = useState<TorneoCategoria[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [equiposVisitantes, setEquiposVisitantes] = useState<EquipoVisitante[]>([]);
  
  // Estados de carga para cada selector
  const [loadingTorneos, setLoadingTorneos] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingInscripciones, setLoadingInscripciones] = useState(false);
  const [loadingEquiposVisitantes, setLoadingEquiposVisitantes] = useState(false);
  
  // Valores del formulario
  const [selectedTorneoId, setSelectedTorneoId] = useState<number | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
  const [selectedInscripcionId, setSelectedInscripcionId] = useState<number | null>(null);
  const [selectedEquipoVisitanteId, setSelectedEquipoVisitanteId] = useState<number | null>(null);
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [resultado, setResultado] = useState<ResultadoPartido>('Pendiente');
  
  // Control para mostrar/ocultar sección de cambio de equipos
  const [mostrarCambioEquipos, setMostrarCambioEquipos] = useState(false);

  // Manejar ESC y prevenir scroll del body
  useEffect(() => {
    if (!isOpen) return;
    
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
  }, [isOpen, onClose]);

  // Pre-cargar datos del partido cuando se abre el modal
  useEffect(() => {
    if (isOpen && partido) {
      setFecha(partido.fecha);
      setUbicacion(partido.ubicacion);
      setResultado(partido.resultado);
      setSelectedInscripcionId(partido.idInscripcionLocal);
      setSelectedEquipoVisitanteId(partido.idEquipoVisitante);
      setError(null);
      setMostrarCambioEquipos(false);
      
      // Cargar equipos visitantes para el selector
      cargarEquiposVisitantes();
    }
  }, [isOpen, partido]);

  // Cargar torneos cuando se activa el cambio de equipos
  useEffect(() => {
    if (mostrarCambioEquipos) {
      cargarTorneos();
    }
  }, [mostrarCambioEquipos]);

  // Cargar categorías cuando se selecciona un torneo
  useEffect(() => {
    if (selectedTorneoId && mostrarCambioEquipos) {
      cargarCategorias(selectedTorneoId);
      setSelectedCategoriaId(null);
      setSelectedInscripcionId(null);
      setCategorias([]);
      setInscripciones([]);
    }
  }, [selectedTorneoId]);

  // Cargar inscripciones cuando se selecciona una categoría
  useEffect(() => {
    if (selectedTorneoId && selectedCategoriaId && mostrarCambioEquipos) {
      cargarInscripciones(selectedTorneoId, selectedCategoriaId);
      setSelectedInscripcionId(null);
      setInscripciones([]);
    }
  }, [selectedCategoriaId]);

  const cargarTorneos = async () => {
    setLoadingTorneos(true);
    try {
      const data = await torneoService.obtenerActivos();
      setTorneos(data);
    } catch (err) {
      console.error('Error cargando torneos:', err);
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoadingTorneos(false);
    }
  };

  const cargarCategorias = async (torneoId: number) => {
    setLoadingCategorias(true);
    try {
      const data = await torneoCategoriaService.obtenerCategoriasPorTorneo(torneoId);
      setCategorias(data);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const cargarInscripciones = async (torneoId: number, categoriaId: number) => {
    setLoadingInscripciones(true);
    try {
      const data = await inscripcionesService.obtenerPorTorneoYCategoria(torneoId, categoriaId);
      setInscripciones(data);
    } catch (err) {
      console.error('Error cargando inscripciones:', err);
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoadingInscripciones(false);
    }
  };

  const cargarEquiposVisitantes = async () => {
    setLoadingEquiposVisitantes(true);
    try {
      const data = await equiposVisitantesService.obtenerTodos();
      setEquiposVisitantes(data);
    } catch (err) {
      console.error('Error cargando equipos visitantes:', err);
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoadingEquiposVisitantes(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateForm = (): string | null => {
    if (!fecha) {
      return 'La fecha del partido es obligatoria';
    }

    if (!ubicacion.trim()) {
      return 'La ubicación del partido es obligatoria';
    }

    if (!resultado) {
      return 'Debe seleccionar un resultado';
    }

    // Si se está cambiando equipos, validar selecciones
    if (mostrarCambioEquipos) {
      if (!selectedInscripcionId) {
        return 'Debe seleccionar un equipo local (torneo, categoría y equipo)';
      }
      if (!selectedEquipoVisitanteId) {
        return 'Debe seleccionar un equipo visitante';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!partido) return;
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const partidoData: ActualizarPartidoDTO = {
        fecha: fecha,
        ubicacion: ubicacion.trim(),
        resultado: resultado
      };

      // Solo incluir cambios de equipos si se activó esa opción
      if (mostrarCambioEquipos && selectedInscripcionId && selectedEquipoVisitanteId) {
        partidoData.idInscripcionLocal = selectedInscripcionId;
        partidoData.idEquipoVisitante = selectedEquipoVisitanteId;
      }

      await partidosService.actualizarPartido(partido.idPartido, partidoData);
      onSuccess();
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !partido) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Edit className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Editar Partido</h3>
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

          {/* Información actual del partido */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Partido Actual</h4>
            <p className="text-sm text-blue-800">
              <strong>{partido.nombreEquipoLocal}</strong> vs <strong>{partido.nombreEquipoVisitante}</strong>
            </p>
          </div>

          {/* Fecha del Partido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha y Hora del Partido *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="datetime-local"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  if (error) setError(null);
                }}
                className="input-field w-full pl-10"
                required
              />
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => {
                  setUbicacion(e.target.value);
                  if (error) setError(null);
                }}
                className="input-field w-full pl-10"
                placeholder="Ej: Gimnasio Municipal"
                maxLength={200}
                required
              />
            </div>
          </div>

          {/* Resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resultado *
            </label>
            <select
              value={resultado}
              onChange={(e) => {
                setResultado(e.target.value as ResultadoPartido);
                if (error) setError(null);
              }}
              className="input-field w-full"
              required
            >
              {ResultadosPartido.map((res) => (
                <option key={res} value={res}>
                  {res}
                </option>
              ))}
            </select>
          </div>

          {/* Opción para cambiar equipos */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setMostrarCambioEquipos(!mostrarCambioEquipos)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {mostrarCambioEquipos ? '▼ Ocultar cambio de equipos' : '▶ Cambiar equipos (opcional)'}
            </button>
          </div>

          {/* Sección de cambio de equipos (colapsable) */}
          {mostrarCambioEquipos && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Cambiar Equipos
              </h4>

              {/* Selector de Torneo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Seleccionar Torneo
                </label>
                <select
                  value={selectedTorneoId || ''}
                  onChange={(e) => setSelectedTorneoId(e.target.value ? Number(e.target.value) : null)}
                  className="input-field w-full"
                  disabled={loadingTorneos}
                >
                  <option value="">
                    {loadingTorneos ? 'Cargando torneos...' : 'Seleccione un torneo'}
                  </option>
                  {torneos.map((torneo) => (
                    <option key={torneo.idTorneo} value={torneo.idTorneo}>
                      {torneo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Seleccionar Categoría
                </label>
                <select
                  value={selectedCategoriaId || ''}
                  onChange={(e) => setSelectedCategoriaId(e.target.value ? Number(e.target.value) : null)}
                  className="input-field w-full"
                  disabled={!selectedTorneoId || loadingCategorias}
                >
                  <option value="">
                    {!selectedTorneoId 
                      ? 'Primero seleccione un torneo' 
                      : loadingCategorias 
                      ? 'Cargando categorías...' 
                      : 'Seleccione una categoría'}
                  </option>
                  {categorias.map((categoria) => (
                    <option key={categoria.idTorneoCategoria} value={categoria.idCategoria}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Equipo Local (Inscripción) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. Seleccionar Equipo Local
                </label>
                <select
                  value={selectedInscripcionId || ''}
                  onChange={(e) => setSelectedInscripcionId(e.target.value ? Number(e.target.value) : null)}
                  className="input-field w-full"
                  disabled={!selectedCategoriaId || loadingInscripciones}
                >
                  <option value="">
                    {!selectedCategoriaId 
                      ? 'Primero seleccione una categoría' 
                      : loadingInscripciones 
                      ? 'Cargando equipos...' 
                      : 'Seleccione un equipo'}
                  </option>
                  {inscripciones.map((inscripcion) => (
                    <option key={inscripcion.idInscripcion} value={inscripcion.idInscripcion}>
                      {inscripcion.nombreEquipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Equipo Visitante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipo Visitante
                </label>
                <select
                  value={selectedEquipoVisitanteId || ''}
                  onChange={(e) => setSelectedEquipoVisitanteId(e.target.value ? Number(e.target.value) : null)}
                  className="input-field w-full"
                  disabled={loadingEquiposVisitantes}
                >
                  <option value="">
                    {loadingEquiposVisitantes ? 'Cargando equipos visitantes...' : 'Seleccione un equipo visitante'}
                  </option>
                  {equiposVisitantes.map((equipo) => (
                    <option key={equipo.idEquipoVisitante} value={equipo.idEquipoVisitante}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
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
              className="btn-primary"
              disabled={loading || !fecha || !ubicacion.trim()}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPartidoModal;
