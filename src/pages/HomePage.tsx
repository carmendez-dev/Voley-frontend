import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, BarChart3, UserCheck } from 'lucide-react';
import SectionCard from '../components/shared/SectionCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'pagos',
      title: 'Gestión de Pagos',
      description: 'Administra pagos y reportes financieros del sistema',
      icon: DollarSign,
      color: 'green' as const,
      path: '/pagos'
    },
    {
      id: 'jugadores',
      title: 'Gestión de Jugadores',
      description: 'Gestiona usuarios, equipos, torneos, categorías e inscripciones',
      icon: Users,
      color: 'blue' as const,
      path: '/jugadores'
    },
    {
      id: 'profesores',
      title: 'Gestión de Profesores',
      description: 'Administra profesores y sus datos en el sistema',
      icon: UserCheck,
      color: 'indigo' as const,
      path: '/profesores'
    },
    {
      id: 'estadisticas',
      title: 'Estadísticas',
      description: 'Visualiza métricas y reportes del sistema',
      icon: BarChart3,
      color: 'purple' as const,
      path: '/estadisticas'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAEF' }}>
      {/* Header */}
      <header className="shadow-sm border-b border-gray-200" style={{ backgroundColor: '#3F5073' }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Sistema de Gestión de Voleibol
            </h1>
            <p className="text-lg text-gray-200">
              Selecciona una sección para comenzar
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              title={section.title}
              description={section.description}
              icon={section.icon}
              color={section.color}
              onClick={() => navigate(section.path)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12" style={{ backgroundColor: '#3F5073' }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-200">
            © 2025 Sistema de Gestión de Voleibol. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
