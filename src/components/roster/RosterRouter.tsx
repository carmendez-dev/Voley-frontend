import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GestionRosterInscripcion from './GestionRosterInscripcion';
import InscripcionesJugador from './InscripcionesJugador';

const RosterRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/roster/inscripciones/:idInscripcion" element={<GestionRosterInscripcion />} />
        <Route path="/roster/usuarios/:idUsuario" element={<InscripcionesJugador />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RosterRouter;
