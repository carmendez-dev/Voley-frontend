import React from 'react';
import { Eye, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import type { Partido, ResultadoPartido } from '../../types/partido.types';
import partidosService from '../../services/partidos.service';

interface PartidoCardProps {
  partido: Partido;
  onVer: (partido: Partido) => void;
  onEditar: (partido: Partido) => void;
  onEliminar: (partido: Partido) => void;
  onComenzar: (partido: Partido) => void;
}

const PartidoCard: React.FC<PartidoCardProps> = ({
  partido,
  onVer,
  onEditar,
  onEliminar,
  onComenzar,
}) => {
  // Obtener estilos dinámicos según resultado
  const estilos = partidosService.obtenerEstilosPorResultado(partido.resultado);

  // Formatear fecha
  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  // Obtener configuración del badge de resultado
  const getBadgeConfig = (resultado: ResultadoPartido) => {
    switch (resultado) {
      case 'Ganado':
        return {
          text: 'Ganado',
          className: 'bg-green-100 text-green-800 border-green-300',
        };
      case 'Perdido':
        return {
          text: 'Perdido',
          className: 'bg-red-100 text-red-800 border-red-300',
        };
      case 'Walkover':
        return {
          text: 'Walkover',
          className: 'bg-green-200 text-green-900 border-green-400',
        };
      case 'WalkoverContra':
        return {
          text: 'Walkover en contra',
          className: 'bg-orange-100 text-orange-800 border-orange-300',
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
    <div
      className={`${estilos.bgColor} rounded-lg border-2 ${estilos.borderColor} shadow-lg ${estilos.shadowColor} p-6 transition-all hover:shadow-xl`}
    >
      {/* Título del partido */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 text-center">
          {partido.nombreEquipoLocal} vs {partido.nombreEquipoVisitante}
        </h3>
      </div>

      {/* Badge de resultado */}
      <div className="flex justify-center mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold border ${badgeConfig.className}`}
        >
          {badgeConfig.text}
        </span>
      </div>

      {/* Información del partido */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start space-x-2 text-gray-700">
          <Calendar size={18} className="mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium">Fecha:</span>
            <br />
            <span>{formatearFecha(partido.fecha)}</span>
          </div>
        </div>

        <div className="flex items-start space-x-2 text-gray-700">
          <MapPin size={18} className="mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium">Ubicación:</span>
            <br />
            <span>{partido.ubicacion}</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onVer(partido)}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          title="Ver detalles"
        >
          <Eye size={16} />
          <span>Ver</span>
        </button>

        {partido.resultado === 'Pendiente' && (
          <>
            <button
              onClick={() => onComenzar(partido)}
              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              title="Comenzar partido"
            >
              <Calendar size={16} />
              <span>Comenzar</span>
            </button>

            <button
              onClick={() => onEditar(partido)}
              className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              title="Modificar partido"
            >
              <Edit size={16} />
              <span>Modificar</span>
            </button>
          </>
        )}

        <button
          onClick={() => onEliminar(partido)}
          className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          title="Eliminar partido"
        >
          <Trash2 size={16} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default PartidoCard;
