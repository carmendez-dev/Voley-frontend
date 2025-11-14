import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GestionPagosLayout from './layouts/GestionPagosLayout';
import GestionJugadoresLayout from './layouts/GestionJugadoresLayout';
import EstadisticasPage from './pages/EstadisticasPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página Principal */}
        <Route path="/" element={<HomePage />} />
        
        {/* Gestión de Pagos */}
        <Route path="/pagos" element={<GestionPagosLayout />} />
        
        {/* Gestión de Jugadores */}
        <Route path="/jugadores" element={<GestionJugadoresLayout />} />
        
        {/* Estadísticas */}
        <Route path="/estadisticas" element={<EstadisticasPage />} />
        
        {/* Redirect por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
