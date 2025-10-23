import React from 'react';
import type { EstadoInscripcion } from '../../types';
import { EstadosInscripcion } from '../../types';

interface EstadoBadgeInscripcionProps {
  estado: EstadoInscripcion;
  className?: string;
}

const EstadoBadgeInscripcion: React.FC<EstadoBadgeInscripcionProps> = ({ estado, className = '' }) => {
  const getEstadoConfig = () => {
    switch (estado) {
      case EstadosInscripcion.INSCRITO:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          label: 'INSCRITO'
        };
      case EstadosInscripcion.RETIRADO:
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          label: 'RETIRADO'
        };
      case EstadosInscripcion.DESCALIFICADO:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          label: 'DESCALIFICADO'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          label: estado.toUpperCase()
        };
    }
  };

  const config = getEstadoConfig();

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  );
};

export default EstadoBadgeInscripcion;
