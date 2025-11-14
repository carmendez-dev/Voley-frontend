import React, { useState, useEffect } from 'react';
import { X, Users, Loader2, Play, Trophy } from 'lucide-react';
import rosterService from '../../services/roster.service';
import setsService from '../../services/sets.service';
import partidosService from '../../services/partidos.service';
import type { Partido, ResultadoPartido } from '../../types/partido.types';
import { ResultadosPartido } from '../../types/partido.types';
import type { RosterJugador } from '../../types/roster.types';
import type { SetPartido } from '../../types/set.types';
import RegistrarSetModal from './RegistrarSetModal';
import ConfirmModal from '../ui/ConfirmModal';
import { useToast } from '../../hooks/useToast';

interface ComenzarPartidoModalProps {
  partido: Partido | null;
  isOpen: boolean;
  onClose: () => void;
  onPartidoActualizado?: () => void;
}

const ComenzarPartidoModal: React.FC<ComenzarPartidoModalProps> = ({
  partido,
  isOpen,
  onClose,
  onPartidoActualizado
}) => {
  const { success, error: showError } = useToast();
  const [jugadores, setJugadores] = useState<RosterJugador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el modal de registrar set
  const [modalRegistrarSet, setModalRegistrarSet] = useState(false);
  const [setSeleccionado, setSetSeleccionado] = useState<number>(1);
  
  // Estado para guardar los sets del partido
  const [sets, setSets] = useState<SetPartido[]>([]);
  
  // Estado para el modal de cambiar resultado
  const [mostrarCambiarResultado, setMostrarCambiarResultado] = useState(false);
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState<ResultadoPartido>('Ganado');
  const [cambiandoResultado, setCambiandoResultado] = useState(false);
  
  // Estado para el modal de confirmación de eliminación
  const [modalConfirmEliminar, setModalConfirmEliminar] = useState(false);
  const [setAEliminar, setSetAEliminar] = useState<number | null>(null);

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

  // Cargar jugadores y sets cuando se abre el modal
  useEffect(() => {
    if (isOpen && partido) {
      cargarJugadores();
      cargarSets();
    }
  }, [isOpen, partido]);

  const cargarJugadores = async () => {
    if (!partido) return;

    setLoading(true);
    setError(null);

    try {
      const data = await rosterService.obtenerPorInscripcion(partido.idInscripcionLocal);
      setJugadores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando jugadores:', err);
      setError('Error al cargar los jugadores del equipo');
      setJugadores([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarSets = async () => {
    if (!partido) return;

    try {
      const data = await setsService.obtenerPorPartido(partido.idPartido);
      setSets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando sets:', err);
      // No mostramos error al usuario, simplemente no hay sets registrados
      setSets([]);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const abrirModalSet = async (numeroSet: number) => {
    if (!partido) return;

    // Verificar si el set ya existe
    const setExistente = sets.find(s => s.numeroSet === numeroSet);
    
    if (!setExistente) {
      // Crear el set automáticamente con 0-0
      try {
        await setsService.crearSet({
          idPartido: partido.idPartido,
          numeroSet,
          puntosLocal: 0,
          puntosVisitante: 0
        });
        
        // Recargar los sets
        await cargarSets();
      } catch (err) {
        console.error('Error creando set:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error al crear el set';
        showError(errorMessage);
        return;
      }
    }
    
    setSetSeleccionado(numeroSet);
    setModalRegistrarSet(true);
  };

  const cerrarModalSet = () => {
    setModalRegistrarSet(false);
  };

  const handleGuardarSet = async (numeroSet: number, puntosLocal: number, puntosVisitante: number) => {
    if (!partido) return;

    try {
      const setExistente = sets.find(s => s.numeroSet === numeroSet);

      if (setExistente) {
        // Actualizar set existente
        await setsService.actualizarSet(setExistente.idSetPartido, {
          puntosLocal,
          puntosVisitante
        });
        success(`Set ${numeroSet} actualizado exitosamente`);
      } else {
        // Crear nuevo set
        await setsService.crearSet({
          idPartido: partido.idPartido,
          numeroSet,
          puntosLocal,
          puntosVisitante
        });
        success(`Set ${numeroSet} registrado exitosamente`);
      }

      // Recargar los sets
      await cargarSets();
    } catch (err) {
      console.error('Error guardando set:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el set';
      showError(errorMessage);
    }
  };

  const getSetData = (numeroSet: number): SetPartido | undefined => {
    return sets.find(s => s.numeroSet === numeroSet);
  };

  const getEstadoSet = (numeroSet: number) => {
    const set = getSetData(numeroSet);
    if (!set) return null;
    return `${set.puntosLocal} - ${set.puntosVisitante}`;
  };

  const abrirModalEliminarSet = (numeroSet: number) => {
    setSetAEliminar(numeroSet);
    setModalConfirmEliminar(true);
  };

  const cerrarModalEliminarSet = () => {
    setModalConfirmEliminar(false);
    setSetAEliminar(null);
  };

  const confirmarEliminarSet = async () => {
    if (setAEliminar === null) return;

    const set = getSetData(setAEliminar);
    if (!set) return;

    try {
      await setsService.eliminarSet(set.idSetPartido);
      success(`Set ${setAEliminar} eliminado exitosamente`);
      await cargarSets();
      cerrarModalEliminarSet();
    } catch (err) {
      console.error('Error eliminando set:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el set';
      showError(errorMessage);
    }
  };

  const handleCambiarResultado = async () => {
    if (!partido) return;

    setCambiandoResultado(true);
    try {
      await partidosService.cambiarResultado(partido.idPartido, resultadoSeleccionado);
      success(`Resultado del partido actualizado a: ${resultadoSeleccionado}`);
      setMostrarCambiarResultado(false);
      
      // Notificar al componente padre para que recargue los datos
      if (onPartidoActualizado) {
        onPartidoActualizado();
      }
      
      // Cerrar el modal después de un breve delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error cambiando resultado:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar el resultado';
      showError(errorMessage);
    } finally {
      setCambiandoResultado(false);
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
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Comenzar Partido</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Información del partido */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Partido</h4>
            <p className="text-sm text-blue-800">
              <strong>{partido.nombreEquipoLocal}</strong> vs <strong>{partido.nombreEquipoVisitante}</strong>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {new Date(partido.fecha).toLocaleString('es-ES', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}
            </p>
          </div>

          {/* Lista de jugadores */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Jugadores de {partido.nombreEquipoLocal}
            </h4>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                <p className="text-gray-600">Cargando jugadores...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : jugadores.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  No hay jugadores registrados en el roster de este equipo.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg divide-y divide-gray-200">
                {jugadores.map((jugador, index) => (
                  <div
                    key={jugador.idRoster}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {jugador.nombreJugador}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {jugadores.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Total: {jugadores.length} jugador{jugadores.length !== 1 ? 'es' : ''}
              </p>
            )}
          </div>

          {/* Botones de Sets */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Registrar Sets
            </h4>
            
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((numeroSet) => {
                const estadoSet = getEstadoSet(numeroSet);
                const setData = getSetData(numeroSet);
                return (
                  <div key={numeroSet} className="relative">
                    <button
                      onClick={() => abrirModalSet(numeroSet)}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        estadoSet
                          ? 'bg-green-50 border-green-500 hover:bg-green-100'
                          : 'bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Set {numeroSet}
                        </p>
                        {estadoSet ? (
                          <p className="text-xs font-medium text-green-700">
                            {estadoSet}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">Crear set</p>
                        )}
                      </div>
                    </button>
                    {setData && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalEliminarSet(numeroSet);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs font-bold"
                        title="Eliminar set"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cambiar Resultado del Partido */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Finalizar Partido
              </h4>
              {!mostrarCambiarResultado && (
                <button
                  onClick={() => setMostrarCambiarResultado(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Cambiar Resultado
                </button>
              )}
            </div>

            {mostrarCambiarResultado && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                <div>
                  <label htmlFor="resultadoPartido" className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona el resultado del partido
                  </label>
                  <select
                    id="resultadoPartido"
                    value={resultadoSeleccionado}
                    onChange={(e) => setResultadoSeleccionado(e.target.value as ResultadoPartido)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={cambiandoResultado}
                  >
                    {ResultadosPartido.filter(r => r !== 'Pendiente').map((resultado) => (
                      <option key={resultado} value={resultado}>
                        {resultado}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setMostrarCambiarResultado(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={cambiandoResultado}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCambiarResultado}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cambiandoResultado}
                  >
                    {cambiandoResultado ? 'Guardando...' : 'Confirmar Resultado'}
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Advertencia:</strong> Al cambiar el resultado, el partido dejará de estar pendiente y no podrás modificarlo desde esta pantalla.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Nota informativa */}
          {!mostrarCambiarResultado && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Nota:</strong> Haz clic en cada set para registrar los puntos del partido. Cuando termines, usa el botón "Cambiar Resultado" para finalizar el partido.
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={cambiandoResultado}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Registrar Set */}
      <RegistrarSetModal
        partido={partido}
        jugadores={jugadores}
        numeroSet={setSeleccionado}
        puntosIniciales={
          getSetData(setSeleccionado)
            ? {
                local: getSetData(setSeleccionado)!.puntosLocal,
                visitante: getSetData(setSeleccionado)!.puntosVisitante
              }
            : undefined
        }
        isOpen={modalRegistrarSet}
        onClose={cerrarModalSet}
        onGuardar={handleGuardarSet}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={modalConfirmEliminar}
        title="Eliminar Set"
        message={`¿Estás seguro de que deseas eliminar el Set ${setAEliminar}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmarEliminarSet}
        onCancel={cerrarModalEliminarSet}
      />
    </div>
  );
};

export default ComenzarPartidoModal;
