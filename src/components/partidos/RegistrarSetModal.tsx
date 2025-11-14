import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Partido } from '../../types/partido.types';
import type { RosterJugador } from '../../types/roster.types';

interface RegistrarSetModalProps {
  partido: Partido | null;
  jugadores: RosterJugador[];
  numeroSet: number;
  puntosIniciales?: { local: number; visitante: number };
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (numeroSet: number, puntosLocal: number, puntosVisitante: number) => Promise<void>;
}

const RegistrarSetModal: React.FC<RegistrarSetModalProps> = ({
  partido,
  jugadores,
  numeroSet,
  puntosIniciales,
  isOpen,
  onClose,
  onGuardar
}) => {
  const [puntosLocal, setPuntosLocal] = useState(puntosIniciales?.local || 0);
  const [puntosVisitante, setPuntosVisitante] = useState(puntosIniciales?.visitante || 0);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(null);
  const [posicionSeleccionada, setPosicionSeleccionada] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);

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

          {/* Nota informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> El registro de estadísticas por jugador y posición se implementará próximamente.
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancelar
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
    </div>
  );
};

export default RegistrarSetModal;
