import React from 'react';
import { BarChart3, Award, Mars, Venus, Users } from 'lucide-react';
import type { CategoriaEstadisticas } from '../../types';

interface EstadisticasCategoriasModalProps {
  estadisticas: CategoriaEstadisticas;
  onClose: () => void;
}

const EstadisticasCategoriasModal: React.FC<EstadisticasCategoriasModalProps> = ({
  estadisticas,
  onClose
}) => {
  // Manejar ESC y prevenir scroll del body
  React.useEffect(() => {
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
  }, [onClose]);

  // Manejar click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calcular porcentajes
  const calcularPorcentaje = (valor: number, total: number): number => {
    return total > 0 ? Math.round((valor / total) * 100) : 0;
  };

  const porcentajeMasculino = calcularPorcentaje(estadisticas.categoriasMasculinas, estadisticas.totalCategorias);
  const porcentajeFemenino = calcularPorcentaje(estadisticas.categoriasFemeninas, estadisticas.totalCategorias);
  const porcentajeMixto = calcularPorcentaje(estadisticas.categoriasMixtas, estadisticas.totalCategorias);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Estadísticas de Categorías</h2>
              <p className="text-sm text-gray-600">Resumen y distribución por género</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Resumen General */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 text-purple-600 mr-2" />
              Resumen General
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {estadisticas.totalCategorias}
              </div>
              <p className="text-gray-600">Total de Categorías Registradas</p>
            </div>
          </div>

          {/* Distribución por Género */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución por Género
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Masculino */}
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Mars className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {estadisticas.categoriasMasculinas}
                </div>
                <p className="text-sm text-gray-600 mb-2">Masculinas</p>
                <p className="text-xs text-blue-700 font-medium">
                  {porcentajeMasculino}% del total
                </p>
              </div>

              {/* Femenino */}
              <div className="bg-pink-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Venus className="h-6 w-6 text-pink-600" />
                </div>
                <div className="text-2xl font-bold text-pink-600 mb-1">
                  {estadisticas.categoriasFemeninas}
                </div>
                <p className="text-sm text-gray-600 mb-2">Femeninas</p>
                <p className="text-xs text-pink-700 font-medium">
                  {porcentajeFemenino}% del total
                </p>
              </div>

              {/* Mixto */}
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {estadisticas.categoriasMixtas}
                </div>
                <p className="text-sm text-gray-600 mb-2">Mixtas</p>
                <p className="text-xs text-purple-700 font-medium">
                  {porcentajeMixto}% del total
                </p>
              </div>
            </div>

            {/* Barra de progreso visual */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Distribución Visual</h4>
              
              <div className="space-y-3">
                {/* Masculino */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 w-20">
                    <Mars className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Masc.</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${porcentajeMasculino}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {porcentajeMasculino}%
                  </span>
                </div>

                {/* Femenino */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 w-20">
                    <Venus className="h-4 w-4 text-pink-600" />
                    <span className="text-sm text-gray-600">Fem.</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${porcentajeFemenino}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {porcentajeFemenino}%
                  </span>
                </div>

                {/* Mixto */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 w-20">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Mixto</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${porcentajeMixto}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {porcentajeMixto}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          {estadisticas.totalCategorias === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    No hay categorías registradas
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Crea la primera categoría para comenzar a ver estadísticas.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Sistema configurado correctamente
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Tienes {estadisticas.totalCategorias} categoría{estadisticas.totalCategorias !== 1 ? 's' : ''} activa{estadisticas.totalCategorias !== 1 ? 's' : ''} en el sistema.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón de cerrar */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasCategoriasModal;