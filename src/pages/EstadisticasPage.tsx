import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Trophy, Home, UserCheck, Calendar } from 'lucide-react';
import SecondaryNavigation from '../components/shared/SecondaryNavigation';
import GestionEquiposVisitantes from '../components/equipos-visitantes/GestionEquiposVisitantes';
import GestionPartidos from '../components/partidos/GestionPartidos';

const EstadisticasPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<'dashboard' | 'equipos-visitantes' | 'partidos'>('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'equipos-visitantes', label: 'Equipos Visitantes', icon: UserCheck },
    { id: 'partidos', label: 'Partidos', icon: Calendar }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'equipos-visitantes':
        return <GestionEquiposVisitantes />;
      case 'partidos':
        return <GestionPartidos />;
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      <div className="text-center mb-12">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Estadísticas en Desarrollo
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Esta sección estará disponible próximamente con reportes completos y métricas del sistema.
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Próximamente
        </div>
      </div>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            icon: TrendingUp,
            title: 'Métricas de Pagos',
            description: 'Análisis financiero y tendencias de pagos del sistema'
          },
          {
            icon: Users,
            title: 'Estadísticas de Jugadores',
            description: 'Datos demográficos y participación de jugadores'
          },
          {
            icon: Trophy,
            title: 'Reportes de Torneos',
            description: 'Resultados y estadísticas deportivas de torneos'
          }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Mientras tanto, puedes acceder a los reportes financieros desde la sección de{' '}
          <button
            onClick={() => navigate('/pagos')}
            className="text-indigo-600 hover:text-indigo-700 font-medium underline"
          >
            Gestión de Pagos
          </button>
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAEF' }}>
      <SecondaryNavigation
        title="Estadísticas"
        items={navigationItems}
        activeItem={activeModule}
        onItemChange={(id) => setActiveModule(id as 'dashboard' | 'equipos-visitantes' | 'partidos')}
      />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {renderModule()}
      </main>
    </div>
  );
};

export default EstadisticasPage;
