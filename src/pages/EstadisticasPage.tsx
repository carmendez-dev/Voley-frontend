import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Trophy, UserCheck, Calendar, Target, Award, Loader2 } from 'lucide-react';
import SecondaryNavigation from '../components/shared/SecondaryNavigation';
import GestionEquiposVisitantes from '../components/equipos-visitantes/GestionEquiposVisitantes';
import GestionPartidos from '../components/partidos/GestionPartidos';
import estadisticasService from '../services/estadisticas.service';
import type { EstadisticasGenerales } from '../types/estadisticas.types';

const EstadisticasPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<'dashboard' | 'equipos-visitantes' | 'partidos'>('dashboard');
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales | null>(null);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(true);

  useEffect(() => {
    if (activeModule === 'dashboard') {
      cargarEstadisticas();
    }
  }, [activeModule]);

  const cargarEstadisticas = async () => {
    setLoadingEstadisticas(true);
    try {
      const data = await estadisticasService.obtenerEstadisticasGenerales();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

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

  const renderDashboard = () => {
    if (loadingEstadisticas) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      );
    }

    if (!estadisticas) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No se pudieron cargar las estadísticas</p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-indigo-600" />
            Estadísticas Generales
          </h2>
          <p className="text-gray-600">Resumen completo del rendimiento del sistema</p>
        </div>
        
        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Partidos */}
          <div className="bg-white rounded-lg shadow-md border-2 border-indigo-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Partidos</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{estadisticas.totalPartidos}</p>
              </div>
              <Trophy className="h-12 w-12 text-indigo-400" />
            </div>
          </div>

          {/* Partidos Ganados */}
          <div className="bg-white rounded-lg shadow-md border-2 border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganados</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.partidosGanados}</p>
              </div>
              <Award className="h-12 w-12 text-green-400" />
            </div>
          </div>

          {/* Partidos Perdidos */}
          <div className="bg-white rounded-lg shadow-md border-2 border-red-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Perdidos</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{estadisticas.partidosPerdidos}</p>
              </div>
              <Target className="h-12 w-12 text-red-400" />
            </div>
          </div>

          {/* Partidos Pendientes */}
          <div className="bg-white rounded-lg shadow-md border-2 border-yellow-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.partidosPendientes}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Estadísticas Detalladas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sets */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Sets</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Total Jugados:</span>
                <span className="text-xl font-bold text-blue-900">{estadisticas.totalSetsJugados}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Ganados:</span>
                <span className="text-xl font-bold text-green-600">{estadisticas.setsGanados}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Perdidos:</span>
                <span className="text-xl font-bold text-red-600">{estadisticas.setsPerdidos}</span>
              </div>
            </div>
          </div>

          {/* Puntos y Errores */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Rendimiento</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Total Puntos:</span>
                <span className="text-xl font-bold text-green-600">{estadisticas.totalPuntos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Total Errores:</span>
                <span className="text-xl font-bold text-red-600">{estadisticas.totalErrores}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Efectividad:</span>
                <span className="text-xl font-bold text-green-900">
                  {estadisticas.totalPuntos > 0 
                    ? ((estadisticas.totalPuntos / (estadisticas.totalPuntos + estadisticas.totalErrores)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Walkovers */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Walkovers</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">A Favor:</span>
                <span className="text-xl font-bold text-green-600">{estadisticas.partidosWalkover}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">En Contra:</span>
                <span className="text-xl font-bold text-red-600">{estadisticas.partidosWalkoverContra}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

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
