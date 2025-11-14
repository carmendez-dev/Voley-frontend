import React, { useState } from 'react';
import { CreditCard, FileText } from 'lucide-react';
import SecondaryNavigation from '../components/shared/SecondaryNavigation';
import GestionPagos from '../components/pagos/GestionPagos';
import Reportes from '../components/reportes/Reportes';

const GestionPagosLayout: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'gestion' | 'reportes'>('gestion');

  const navigationItems = [
    { id: 'gestion', label: 'Pagos', icon: CreditCard },
    { id: 'reportes', label: 'Reportes', icon: FileText }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'gestion':
        return <GestionPagos />;
      case 'reportes':
        return <Reportes />;
      default:
        return <GestionPagos />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAEF' }}>
      <SecondaryNavigation
        title="Gestión de Pagos"
        items={navigationItems}
        activeItem={activeModule}
        onItemChange={(id) => setActiveModule(id as 'gestion' | 'reportes')}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderModule()}
      </main>
    </div>
  );
};

export default GestionPagosLayout;
