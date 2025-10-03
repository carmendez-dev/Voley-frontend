import { useState } from 'react';
import Navigation from './components/Navigation';
import GestionPagos from './components/GestionPagos';
import GestionUsuarios from './components/GestionUsuarios';
import Reportes from './components/Reportes';
import { Settings } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('pagos');

  const renderContent = () => {
    switch (activeSection) {
      case 'pagos':
        return <GestionPagos />;
      case 'usuarios':
        return <GestionUsuarios />;
      case 'reportes':
        return <Reportes />;
      case 'configuracion':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Configuración
            </h2>
            <p className="text-gray-500">
              Panel de configuración próximamente disponible
            </p>
          </div>
        );
      default:
        return <GestionPagos />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © 2025 Sistema de Gestión Voley. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
