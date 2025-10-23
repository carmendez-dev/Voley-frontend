import React from 'react';
import { Users, CreditCard, BarChart3, Settings, Trophy, Award, UserCheck, FileText } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'pagos', label: 'Gestión de Pagos', icon: CreditCard },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'equipos', label: 'Equipos', icon: UserCheck },
    { id: 'torneos', label: 'Torneos', icon: Trophy },
    { id: 'categorias', label: 'Categorías', icon: Award },
    { id: 'inscripciones', label: 'Inscripciones', icon: FileText },
  ];

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">Sistema Voley</h1>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${activeSection === item.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-white hover:bg-primary/80'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;