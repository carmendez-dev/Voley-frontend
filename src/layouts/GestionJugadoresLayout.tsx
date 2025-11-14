import React, { useState } from 'react';
import { Users, UserCheck, Trophy, Award, FileText } from 'lucide-react';
import SecondaryNavigation from '../components/shared/SecondaryNavigation';
import GestionUsuarios from '../components/usuarios/GestionUsuarios';
import GestionEquipos from '../components/equipos/GestionEquipos';
import GestionTorneos from '../components/torneos/GestionTorneos';
import GestionCategorias from '../components/categorias/GestionCategorias';
import GestionInscripciones from '../components/inscripciones/GestionInscripciones';

type ModuleType = 'usuarios' | 'equipos' | 'torneos' | 'categorias' | 'inscripciones';

const GestionJugadoresLayout: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('usuarios');

  const navigationItems = [
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'equipos', label: 'Equipos', icon: UserCheck },
    { id: 'torneos', label: 'Torneos', icon: Trophy },
    { id: 'categorias', label: 'Categorías', icon: Award },
    { id: 'inscripciones', label: 'Inscripciones', icon: FileText }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'usuarios':
        return <GestionUsuarios />;
      case 'equipos':
        return <GestionEquipos />;
      case 'torneos':
        return <GestionTorneos />;
      case 'categorias':
        return <GestionCategorias />;
      case 'inscripciones':
        return <GestionInscripciones />;
      default:
        return <GestionUsuarios />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAEF' }}>
      <SecondaryNavigation
        title="Gestión de Jugadores"
        items={navigationItems}
        activeItem={activeModule}
        onItemChange={(id) => setActiveModule(id as ModuleType)}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderModule()}
      </main>
    </div>
  );
};

export default GestionJugadoresLayout;
