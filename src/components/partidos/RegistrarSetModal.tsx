import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, Edit } from 'lucide-react';
import type { Partido } from '../../types/partido.types';
import type { RosterJugador } from '../../types/roster.types';
import type { TipoAccion, ResultadoAccion, AccionJuego } from '../../types/accion-juego.types';
import accionesJuegoService from '../../services/acciones-juego.service';
import { useToast } from '../../hooks/useToast';
import ConfirmModal from '../ui/ConfirmModal';

interface RegistrarSetModalProps {
  partido: Partido | null;
  jugadores: RosterJugador[];
  numeroSet: number;
  idSetPartido?: number;
  puntosIniciales?: { local: number; visitante: number };
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (numeroSet: number, puntosLocal: number, puntosVisitante: number) => Promise<void>;
}

const RegistrarSetModal: React.FC<RegistrarSetModalProps> = ({
  partido,
  jugadores,
  numeroSet,
  idSetPartido,
  puntosIniciales,
  isOpen,
  onClose,
  onGuardar
}) => {
  const { success, error: showError } = useToast();
  
  const [puntosLocal, setPuntosLocal] = useState(puntosIniciales?.local || 0);
  const [puntosVisitante, setPuntosVisitante] = useState(puntosIniciales?.visitante || 0);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(null);
  const [posicionSeleccionada, setPosicionSeleccionada] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  
  // Estados para tipos y resultados de acción
  const [tiposAccion, setTiposAccion] = useState<TipoAccion[]>([]);
  const [resultadosAccion, setResultadosAccion] = useState<ResultadoAccion[]>([]);
  const [tipoAccionSeleccionado, setTipoAccionSeleccionado] = useState<number | null>(null);
  
  // Estados para acciones de juego
  const [acciones, setAcciones] = useState<AccionJuego[]>([]);
  const [loadingAcciones, setLoadingAcciones] = useState(false);
  
  // Estados para modal de confirmación
  const [modalConfirmEliminar, setModalConfirmEliminar] = useState(false);
  const [accionAEliminar, setAccionAEliminar] = useState<number | null>(null);

  // Actualizar puntos cuando cambian los puntos iniciales
  useEffect(() => {
    if (puntosIniciales) {
      setPuntosLocal(puntosIniciales.local);
      setPuntosVisitante(puntosIniciales.visitante);
    } else {
      setPuntosLocal(0);
      setPuntosVisitante(0);
    }
  }, [puntosIniciales, isOpen]);

  // Cargar tipos y resultados de acción al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarTiposYResultados();
      if (idSetPartido) {
        cargarAcciones();
      }
    }
  }, [isOpen, idSetPartido]);

  const cargarTiposYResultados = async () => {
    try {
      const [tipos, resultados] = await Promise.all([
        accionesJuegoService.obtenerTiposAccion(),
        accionesJuegoService.obtenerResultadosAccion()
      ]);
      setTiposAccion(tipos);
      setResultadosAccion(resultados);
    } catch (err) {
      console.error('Error cargando tipos y resultados:', err);
    }
  };

  const cargarAcciones = async () => {
    if (!idSetPartido) return;
    
    setLoadingAcciones(true);
    try {
      const data = await accionesJuegoService.obtenerAccionesPorSet(idSetPartido);
      setAcciones(data);
    } catch (err) {
      console.error('Error cargando acciones:', err);
      setAcciones([]);
    } finally {
      setLoadingAcciones(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const incrementarPuntosLocal = () => {
    setPuntosLocal(prev => prev + 1);
  };

  const decrementarPuntosLocal = () => {
    setPuntosLocal(prev => Math.max(0, prev - 1));
  };

  const incrementarPuntosVisitante = () => {
    setPuntosVisitante(prev => prev + 1);
  };

  const decrementarPuntosVisitante = () => {
    setPuntosVisitante(prev => Math.max(0, prev - 1));
  };

  const handleRegistrarAccion = async (idResultadoAccion: number) => {
    if (!idSetPartido || !tipoAccionSeleccionado) return;
    
    // Validar que se haya seleccionado jugador o posición
    if (jugadorSeleccionado === null && posicionSeleccionada === null) {
      showError('Debes seleccionar un jugador o una posición del equipo visitante');
      return;
    }

    try {
      await accionesJuegoService.crearAccion({
        idSetPartido,
        idTipoAccion: tipoAccionSeleccionado,
        idResultadoAccion,
        idRoster: jugadorSeleccionado || 0,
        posicionVisitante: posicionSeleccionada || 0
      });

      success('Acción registrada exitosamente');
      
      // Recargar acciones y actualizar puntos
      await cargarAcciones();
      
      // Limpiar selecciones
      setJugadorSeleccionado(null);
      setPosicionSeleccionada(null);
      setTipoAccionSeleccionado(null);
      
      // Actualizar puntos del set
      await onGuardar(numeroSet, puntosLocal, puntosVisitante);
    } catch (err) {
      console.error('Error registrando acción:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar la acción';
      showError(errorMessage);
    }
  };

  const abrirModalEliminarAccion = (idAccion: number) => {
    setAccionAEliminar(idAccion);
    setModalConfirmEliminar(true);
  };

  const cerrarModalEliminarAccion = () => {
    setModalConfirmEliminar(false);
    setAccionAEliminar(null);
  };

  const confirmarEliminarAccion = async () => {
    if (accionAEliminar === null) return;

    try {
      await accionesJuegoService.eliminarAccion(accionAEliminar);
      success('Acción eliminada exitosamente');
      await cargarAcciones();
      cerrarModalEliminarAccion();
    } catch (err) {
      console.error('Error eliminando acción:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la acción';
      showError(errorMessage);
    }
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await onGuardar(numeroSet, puntosLocal, puntosVisitante);
      onClose();
    } catch (error) {
      console.error('Error guardando set:', error);
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen || !partido) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[60]"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
          <h3 className="text-xl font-bold text-white">
            Set {numeroSet}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Marcador */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Equipo Local */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {partido.nombreEquipoLocal}
              </h4>
              <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-6">
                <div className="text-6xl font-bold text-indigo-600 mb-4">
                  {puntosLocal}
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={decrementarPuntosLocal}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Decrementar"
                  >
                    <Minus size={20} />
                  </button>
                  <button
                    onClick={incrementarPuntosLocal}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    title="Incrementar"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400">VS</div>
            </div>

            {/* Equipo Visitante */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {partido.nombreEquipoVisitante}
              </h4>
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
                <div className="text-6xl font-bold text-purple-600 mb-4">
                  {puntosVisitante}
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={decrementarPuntosVisitante}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Decrementar"
                  >
                    <Minus size={20} />
                  </button>
                  <button
                    onClick={incrementarPuntosVisitante}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    title="Incrementar"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de equipos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            {/* Jugadores del equipo local */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Jugadores de {partido.nombreEquipoLocal}
              </h4>
              
              {jugadores.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    No hay jugadores registrados en el roster.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {jugadores.map((jugador) => (
                    <button
                      key={jugador.idRoster}
                      onClick={() => setJugadorSeleccionado(
                        jugadorSeleccionado === jugador.idRoster ? null : jugador.idRoster
                      )}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        jugadorSeleccionado === jugador.idRoster
                          ? 'bg-indigo-100 border-indigo-500 shadow-md'
                          : 'bg-white border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 text-center">
                        {jugador.nombreJugador}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              
              {jugadorSeleccionado && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Seleccionado:</strong>{' '}
                    {jugadores.find(j => j.idRoster === jugadorSeleccionado)?.nombreJugador}
                  </p>
                </div>
              )}
            </div>

            {/* Posiciones del equipo visitante */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Posiciones de {partido.nombreEquipoVisitante}
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((posicion) => (
                  <button
                    key={posicion}
                    onClick={() => setPosicionSeleccionada(
                      posicionSeleccionada === posicion ? null : posicion
                    )}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      posicionSeleccionada === posicion
                        ? 'bg-purple-100 border-purple-500 shadow-md'
                        : 'bg-white border-gray-300 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-2xl font-bold text-gray-900 text-center">
                      {posicion}
                    </p>
                  </button>
                ))}
              </div>
              
              {posicionSeleccionada && (
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700">
                    <strong>Posición seleccionada:</strong> {posicionSeleccionada}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tipos de Acción */}
          {(jugadorSeleccionado !== null || posicionSeleccionada !== null) && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Tipo de Acción
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tiposAccion.map((tipo) => (
                  <button
                    key={tipo.idTipoAccion}
                    onClick={() => setTipoAccionSeleccionado(tipo.idTipoAccion)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      tipoAccionSeleccionado === tipo.idTipoAccion
                        ? 'bg-indigo-100 border-indigo-500 shadow-md'
                        : 'bg-white border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900 text-center">
                      {tipo.descripcion}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resultados de Acción */}
          {tipoAccionSeleccionado !== null && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Resultado
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {resultadosAccion.map((resultado) => (
                  <button
                    key={resultado.idResultadoAccion}
                    onClick={() => handleRegistrarAccion(resultado.idResultadoAccion)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      resultado.descripcion === 'Punto'
                        ? 'bg-green-50 border-green-500 hover:bg-green-100'
                        : 'bg-red-50 border-red-500 hover:bg-red-100'
                    }`}
                  >
                    <p className="text-lg font-bold text-gray-900 text-center">
                      {resultado.descripcion}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bitácora de Acciones */}
          {idSetPartido && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Bitácora de Acciones
              </h4>
              
              {loadingAcciones ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">Cargando acciones...</p>
                </div>
              ) : acciones.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 text-center">
                    No hay acciones registradas aún
                  </p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {acciones.map((accion, index) => (
                    <div
                      key={accion.idAccionJuego}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          #{acciones.length - index} - {accion.tipoAccionDescripcion || 'Acción'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {accion.nombreJugador || `Posición ${accion.posicionVisitante}`} •{' '}
                          <span className={accion.resultadoAccionDescripcion === 'Punto' ? 'text-green-600' : 'text-red-600'}>
                            {accion.resultadoAccionDescripcion}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => abrirModalEliminarAccion(accion.idAccionJuego)}
                        className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar acción"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleGuardar}
              disabled={guardando}
              className="btn-primary bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando...' : `Guardar Set ${numeroSet}`}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={modalConfirmEliminar}
        title="Eliminar Acción"
        message="¿Estás seguro de que deseas eliminar esta acción? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmarEliminarAccion}
        onCancel={cerrarModalEliminarAccion}
      />
    </div>
  );
};

export default RegistrarSetModal;
