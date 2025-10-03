import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Gestión Voley
          </h1>
          <p className="text-gray-600">
            Test de estilos de Tailwind CSS
          </p>
        </div>

        {/* Cards de prueba */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Pagos
            </h3>
            <p className="text-gray-600">
              Gestión de pagos mensuales
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Usuarios
            </h3>
            <p className="text-gray-600">
              Administrar usuarios del sistema
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Reportes
            </h3>
            <p className="text-gray-600">
              Estadísticas y análisis
            </p>
          </div>
        </div>

        {/* Botones de prueba */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Botones de Prueba
          </h2>
          <div className="space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Primario
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Éxito
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Peligro
            </button>
            <button className="border-2 border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Outline
            </button>
          </div>
        </div>

        {/* Estados */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Estados de Pago
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Pagado
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              Pendiente
            </span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Atrasado
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              Rechazado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;