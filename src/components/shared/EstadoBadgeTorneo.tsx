import React from 'react';
import type { EstadoTorneo } from '../types';

interface EstadoBadgeTorneoProps {
  estado: EstadoTorneo;
  className?: string;
}

const EstadoBadgeTorneo: React.FC<EstadoBadgeTorneoProps> = ({ estado, className = '' }) => {
  const getEstadoClasses = (estado: EstadoTorneo): string => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (estado) {
      case 'Pendiente':
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case 'Activo':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case 'Finalizado':
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const getEstadoIcon = (estado: EstadoTorneo): string => {
    switch (estado) {
      case 'Pendiente':
        return '⏳';
      case 'Activo':
        return '🏆';
      case 'Finalizado':
        return '✅';
      default:
        return '❓';
    }
  };

  return (
    <span className={`${getEstadoClasses(estado)} ${className}`}>
      <span className="mr-1">{getEstadoIcon(estado)}</span>
      {estado}
    </span>
  );
};

export default EstadoBadgeTorneo;