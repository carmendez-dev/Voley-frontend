import React from 'react';
import type { GeneroCategoria } from '../types';

interface EstadoBadgeGeneroProps {
  genero: GeneroCategoria;
  tamaño?: 'sm' | 'md' | 'lg';
}

const EstadoBadgeGenero: React.FC<EstadoBadgeGeneroProps> = ({ 
  genero, 
  tamaño = 'md' 
}) => {
  const obtenerEstilos = () => {
    const estilosBase = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: '500',
      borderRadius: '9999px',
      textAlign: 'center' as const,
      whiteSpace: 'nowrap' as const,
    };

    const tamaños = {
      sm: {
        fontSize: '0.75rem',
        padding: '2px 8px',
      },
      md: {
        fontSize: '0.875rem',
        padding: '4px 12px',
      },
      lg: {
        fontSize: '1rem',
        padding: '6px 16px',
      },
    };

    const colores = {
      Masculino: {
        backgroundColor: '#dbeafe', // blue-100
        color: '#1e40af', // blue-800
      },
      Femenino: {
        backgroundColor: '#fce7f3', // pink-100
        color: '#be185d', // pink-700
      },
      Mixto: {
        backgroundColor: '#f3e8ff', // purple-100
        color: '#7c3aed', // purple-600
      },
    };

    return {
      ...estilosBase,
      ...tamaños[tamaño],
      ...colores[genero],
    };
  };

  const obtenerIcono = () => {
    switch (genero) {
      case 'Masculino':
        return '♂️';
      case 'Femenino':
        return '♀️';
      case 'Mixto':
        return '⚊';
      default:
        return '❓';
    }
  };

  return (
    <span style={obtenerEstilos()}>
      <span>{obtenerIcono()}</span>
      <span>{genero}</span>
    </span>
  );
};

export default EstadoBadgeGenero;