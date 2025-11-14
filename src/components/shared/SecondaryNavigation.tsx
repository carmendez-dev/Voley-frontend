import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SecondaryNavigationProps {
  title: string;
  items: NavigationItem[];
  activeItem: string;
  onItemChange: (id: string) => void;
}

const SecondaryNavigation: React.FC<SecondaryNavigationProps> = ({
  title,
  items,
  activeItem,
  onItemChange
}) => {
  const navigate = useNavigate();

  return (
    <nav className="shadow-sm border-b border-gray-200 sticky top-0 z-10" style={{ backgroundColor: '#3F5073' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            title="Volver al inicio"
          >
            <Home size={20} />
            <span className="hidden sm:inline">Inicio</span>
          </button>

          {/* Title */}
          <h1 className="text-xl font-bold text-white hidden md:block">
            {title}
          </h1>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onItemChange(item.id)}
                  className={`
                    px-4 py-2 rounded-lg
                    transition-colors duration-200
                    flex items-center space-x-2
                    text-sm font-medium
                    ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNavigation;
