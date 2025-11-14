import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Trophy, Loader2, Target, AlertCircle } from 'lucide-react';
import type { Partido, ResultadoPartido } from '../../types/partido.types';
import type { SetPartido } from '../../types/set.types';
import type { EstadisticasPartido } from '../../types/estadisticas.types';
import setsService from '../../services/sets.service';
import estadisticasService from '../../services/estadisticas.service';

interface DetallePartidoModalProps {
  partido: Partido | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetallePartidoModal: React.FC<DetallePartidoModalProps> = ({
  partido,
  isOpen,
  onClose,
}) => {
  const [sets, setSets] = useState<SetPartido[]>([]);
  const [loadingSets, setLoadingSets] = useState(false);
  const [estadisticas, setEstadisticas] = useState<EstadisticasPartido | null>(null);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);

  // Cargar sets y estadísticas cuando se abre el modal y el partido no está pendiente
  useEffect(() => {
    if (isOpen && partido && partido.resultado !== 'Pendiente') {
      cargarSets();
      cargarEstadisticas();
    }
  }, [isOpen, partido]);

  const cargarSets = async () => {
    if (!partido) return;

    setLoadingSets(true);
    try {
      const data = await setsService.obtenerPorPartido(partido.idPartido);
      setSets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando sets:', err);
      setSets([]);
    } finally {
      setLoadingSets(false);
    }
  };

  const cargarEstadisticas = async () => {
    if (!partido) return;

    setLoadingEstadisticas(true);
    try {
      const data = await estadisticasService.obtenerEstadisticasPartido(partido.idPartido);
      setEstadisticas(data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setEstadisticas(null);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  if (!isOpen || !partido) return null;

  // Formatear fecha de manera legible
  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  // Obtener configuración del badge de resultado con colores
  const getBadgeConfig = (resultado: ResultadoPartido) => {
    switch (resultado) {
      case 'Ganado':
        return {
          text: 'Ganado',
          className: 'bg-green-100 text-green-800 border-green-500',
        };
      case 'Perdido':
        return {
          text: 'Perdido',
          className: 'bg-red-100 text-red-800 border-red-500',
        };
      case 'Walkover':
        return {
          text: 'Walkover',
          className: 'bg-green-200 text-green-900 border-green-700',
        };
      case 'WalkoverContra':
        return {
          text: 'Walkover en contra',
          className: 'bg-orange-100 text-orange-800 border-orange-500',
        };
      case 'Pendiente':
      default:
        return {
          text: 'Pendiente',
          className: 'bg-gray-100 text-gray-800 border-gray-300',
        };
    }
  };

  const badgeConfig = getBadgeConfig(partido.resultado);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalles del Partido
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Título del partido */}
          <div className="text-center pb-4 border-b border-gray-200">
            <h3 className="text-3xl font-bold text-gray-900">
              {partido.nombreEquipoLocal}
              <span className="text-gray-500 mx-3">vs</span>
              {partido.nombreEquipoVisitante}
            </h3>
          </div>

          {/* Badge de resultado */}
          <div className="flex justify-center">
            <span
              className={`px-4 py-2 rounded-full text-base font-semibold border-2 ${badgeConfig.className}`}
            >
              {badgeConfig.text}
            </span>
          </div>

          {/* Información detallada */}
          <div className="space-y-4">
            {/* Fecha */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar size={24} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Fecha y Hora
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  {formatearFecha(partido.fecha)}
                </p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <MapPin size={24} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Ubicación
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  {partido.ubicacion}
                </p>
              </div>
            </div>

            {/* Equipos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Equipo Local */}
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <Users size={24} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    Equipo Local
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {partido.nombreEquipoLocal}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    ID Inscripción: {partido.idInscripcionLocal}
                  </p>
                </div>
              </div>

              {/* Equipo Visitante */}
              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <Users size={24} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                    Equipo Visitante
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {partido.nombreEquipoVisitante}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    ID Equipo: {partido.idEquipoVisitante}
                  </p>
                </div>
              </div>
            </div>

            {/* ID del Partido */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Trophy size={24} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  ID del Partido
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  #{partido.idPartido}
                </p>
              </div>
            </div>
          </div>

          {/* Sets del partido (solo si no está pendiente) */}
          {partido.resultado !== 'Pendiente' && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-indigo-600" />
                Resultados por Set
              </h4>

              {loadingSets ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-gray-600">Cargando sets...</p>
                </div>
              ) : sets.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    No hay sets registrados para este partido.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sets.map((set) => (
                    <div
                      key={set.idSetPartido}
                      className={`p-4 rounded-lg border-2 ${
                        set.ganador === 'Local'
                          ? 'bg-blue-50 border-blue-300'
                          : set.ganador === 'Visitante'
                          ? 'bg-purple-50 border-purple-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Set {set.numeroSet}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          {set.puntosLocal} - {set.puntosVisitante}
                        </p>
                        <p className={`text-xs font-medium ${
                          set.ganador === 'Local'
                            ? 'text-blue-700'
                            : set.ganador === 'Visitante'
                            ? 'text-purple-700'
                            : 'text-gray-700'
                        }`}>
                          {set.ganador === 'Local' && `Ganó ${partido.nombreEquipoLocal}`}
                          {set.ganador === 'Visitante' && `Ganó ${partido.nombreEquipoVisitante}`}
                          {set.ganador === 'Empate' && 'Empate'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Estadísticas del partido */}
          {partido.resultado !== 'Pendiente' && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-indigo-600" />
                Estadísticas del Partido
              </h4>

              {loadingEstadisticas ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-gray-600">Cargando estadísticas...</p>
                </div>
              ) : !estadisticas ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    No hay estadísticas disponibles para este partido.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Resumen de sets */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
                      <p className="text-sm font-medium text-blue-700 mb-1">Sets Ganados</p>
                      <p className="text-3xl font-bold text-blue-900">{estadisticas.setsGanadosLocal}</p>
                      <p className="text-xs text-blue-600 mt-1">{partido.nombreEquipoLocal}</p>
                    </div>
                    <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 text-center">
                      <p className="text-sm font-medium text-purple-700 mb-1">Sets Ganados</p>
                      <p className="text-3xl font-bold text-purple-900">{estadisticas.setsGanadosVisitante}</p>
                      <p className="text-xs text-purple-600 mt-1">{partido.nombreEquipoVisitante}</p>
                    </div>
                  </div>

                  {/* Estadísticas por equipo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Equipo Local */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 mb-3 text-center">
                        {partido.nombreEquipoLocal}
                      </h5>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Total Puntos:</span>
                          <span className="text-lg font-bold text-green-600">{estadisticas.puntosLocal}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Total Errores:</span>
                          <span className="text-lg font-bold text-red-600">{estadisticas.erroresLocal}</span>
                        </div>
                      </div>

                      {estadisticas.puntosPorTipoLocal.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-blue-300">
                          <p className="text-xs font-semibold text-blue-800 mb-2">Puntos por Tipo:</p>
                          <div className="space-y-1">
                            {estadisticas.puntosPorTipoLocal.map((stat, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-blue-700">{stat.tipoAccion}:</span>
                                <span className="font-medium text-blue-900">{stat.cantidad}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {estadisticas.erroresPorTipoLocal.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-300">
                          <p className="text-xs font-semibold text-blue-800 mb-2">Errores por Tipo:</p>
                          <div className="space-y-1">
                            {estadisticas.erroresPorTipoLocal.map((stat, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-blue-700">{stat.tipoAccion}:</span>
                                <span className="font-medium text-blue-900">{stat.cantidad}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Equipo Visitante */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-900 mb-3 text-center">
                        {partido.nombreEquipoVisitante}
                      </h5>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-700">Total Puntos:</span>
                          <span className="text-lg font-bold text-green-600">{estadisticas.puntosVisitante}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-700">Total Errores:</span>
                          <span className="text-lg font-bold text-red-600">{estadisticas.erroresVisitante}</span>
                        </div>
                      </div>

                      {estadisticas.puntosPorTipoVisitante.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-purple-300">
                          <p className="text-xs font-semibold text-purple-800 mb-2">Puntos por Tipo:</p>
                          <div className="space-y-1">
                            {estadisticas.puntosPorTipoVisitante.map((stat, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-purple-700">{stat.tipoAccion}:</span>
                                <span className="font-medium text-purple-900">{stat.cantidad}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {estadisticas.erroresPorTipoVisitante.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-purple-300">
                          <p className="text-xs font-semibold text-purple-800 mb-2">Errores por Tipo:</p>
                          <div className="space-y-1">
                            {estadisticas.erroresPorTipoVisitante.map((stat, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-purple-700">{stat.tipoAccion}:</span>
                                <span className="font-medium text-purple-900">{stat.cantidad}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallePartidoModal;
