import React from 'react';
import { X, BarChart3, Trophy, Clock, Users, CheckCircle } from 'lucide-react';
import type { TorneoEstadisticas } from '../../types';

interface EstadisticasTorneoModalProps {
  estadisticas: TorneoEstadisticas;
  onClose: () => void;
}

const EstadisticasTorneoModal: React.FC<EstadisticasTorneoModalProps> = ({ 
  estadisticas, 
  onClose 
}) => {
  // Manejar ESC para cerrar
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    // Prevenir scroll en el body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Manejar click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const calcularPorcentaje = (valor: number, total: number): number => {
    return total > 0 ? Math.round((valor / total) * 100) : 0;
  };

  const stats = [
    {
      label: 'Total Torneos',
      value: estadisticas.totalTorneos,
      icon: Trophy,
      color: 'blue',
      percentage: 100
    },
    {
      label: 'Pendientes',
      value: estadisticas.torneosPendientes,
      icon: Clock,
      color: 'yellow',
      percentage: calcularPorcentaje(estadisticas.torneosPendientes, estadisticas.totalTorneos)
    },
    {
      label: 'Activos',
      value: estadisticas.torneosActivos,
      icon: Users,
      color: 'green',
      percentage: calcularPorcentaje(estadisticas.torneosActivos, estadisticas.totalTorneos)
    },
    {
      label: 'Finalizados',
      value: estadisticas.torneosFinalizados,
      icon: CheckCircle,
      color: 'gray',
      percentage: calcularPorcentaje(estadisticas.torneosFinalizados, estadisticas.totalTorneos)
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getBarColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      gray: 'bg-gray-500'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

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
            <div className="p-2 bg-purple-100 rounded-full">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Estadísticas de Torneos</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-700">
                        {stat.percentage}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  {stat.label !== 'Total Torneos' && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getBarColor(stat.color)}`}
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Gráfico de distribución */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Distribución por Estado</h4>
            
            {estadisticas.totalTorneos > 0 ? (
              <div className="space-y-3">
                {stats.slice(1).map((stat) => (
                  <div key={stat.label} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${getBarColor(stat.color)}`}></div>
                    <span className="text-sm text-gray-700 w-20">{stat.label}:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${getBarColor(stat.color)}`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {stat.value}
                    </span>
                    <span className="text-sm text-gray-500 w-10 text-right">
                      {stat.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay torneos registrados</p>
              </div>
            )}
          </div>

          {/* Resumen textual */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Resumen</h4>
            {estadisticas.totalTorneos > 0 ? (
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  • Tienes <strong>{estadisticas.totalTorneos}</strong> torneo{estadisticas.totalTorneos !== 1 ? 's' : ''} registrado{estadisticas.totalTorneos !== 1 ? 's' : ''}
                </p>
                {estadisticas.torneosActivos > 0 && (
                  <p>
                    • <strong>{estadisticas.torneosActivos}</strong> torneo{estadisticas.torneosActivos !== 1 ? 's' : ''} actualmente en curso
                  </p>
                )}
                {estadisticas.torneosPendientes > 0 && (
                  <p>
                    • <strong>{estadisticas.torneosPendientes}</strong> torneo{estadisticas.torneosPendientes !== 1 ? 's' : ''} pendiente{estadisticas.torneosPendientes !== 1 ? 's' : ''} de iniciar
                  </p>
                )}
                {estadisticas.torneosFinalizados > 0 && (
                  <p>
                    • <strong>{estadisticas.torneosFinalizados}</strong> torneo{estadisticas.torneosFinalizados !== 1 ? 's' : ''} finalizado{estadisticas.torneosFinalizados !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-blue-700">
                Aún no tienes torneos registrados. ¡Crea tu primer torneo para comenzar!
              </p>
            )}
          </div>

          {/* Botón cerrar */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasTorneoModal;