import React from 'react';
import type { EstadoPago } from '../types';

interface EstadoBadgeProps {
  estado: EstadoPago;
  className?: string;
}

const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado, className = '' }) => {
  const getEstadoConfig = (estado: EstadoPago) => {
    switch (estado) {
      case 'pagado':
        return {
          text: 'Pagado',
          className: 'badge-paid'
        };
      case 'pendiente':
        return {
          text: 'Pendiente',
          className: 'badge-pending'
        };
      case 'atraso':
        return {
          text: 'Atrasado',
          className: 'badge-overdue'
        };
      case 'rechazado':
        return {
          text: 'Rechazado',
          className: 'badge-rejected'
        };
      default:
        return {
          text: estado,
          className: 'badge-rejected'
        };
    }
  };

  const config = getEstadoConfig(estado);

  return (
    <span className={`${config.className} ${className}`}>
      {config.text}
    </span>
  );
};

export default EstadoBadge;