import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, ArrowLeft, UserPlus } from 'lucide-react';
import { rosterService } from '../../services';
import { usuarioService } from '../../services';
import type { RosterJugador, Usuario } from '../../types';
import AgregarJugadorModal from './AgregarJugadorModal';
import EliminarJugadorRosterModal from './EliminarJugadorRosterModal';

const GestionRosterInscripcion: React.FC = () => {
  const { idInscripcion } = useParams<{ idInscripcion: string }>();
  const navigate = useNavigate();

  const [roster, setRoster] = useState<RosterJugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<RosterJugador | null>(null);

  useEffect(() => {
    if (idInscripcion) {
      cargarRoster();
    }
  }, [idInscripcion]);

  const cargarRoster = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rosterService.obtenerPorInscripcion(Number(idInscripcion));
      setRoster(data);
    } catch (error) {
      console.error('Error cargando roster:', error);
      setError('Error al cargar el roster');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalAgregar = () => setModalAgregar(true);

  const abrirModalEliminar = (jugador: RosterJugador) => {
    setJugadorSeleccionado(jugador);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalAgregar(false);
    setModalEliminar(false);
    setJugadorSeleccionado(null);
  };

  const manejarJugadorAgregado = () => {
    cargarRoster();
    cerrarModales();
  };

  const manejarJugadorEliminado = () => {
    cargarRoster();
    cerrarModales();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Obtener información del primer jugador para mostrar datos del equipo
  const infoEquipo = roster.length > 0 ? roster[0] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inscripciones')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roster de Jugadores</h1>
            {infoEquipo && (
              <p className="text-gray-600">
                {infoEquipo.nombreEquipo} - {infoEquipo.nombreTorneo} ({infoEquipo.nombreCategoria})
              </p>
            )}
          </div>
        </div>
        <button
          onClick={abrirModalAgregar}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Agregar Jugador</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabla de Jugadores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Users size={20} />
            <span>Jugadores ({roster.length})</span>
          </h2>
        </div>

        {roster.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay jugadores en el roster</h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando jugadores a este equipo
            </p>
            <button
              onClick={abrirModalAgregar}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              <span>Agregar Primer Jugador</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roster.map((jugador, index) => (
                  <tr key={jugador.idRoster} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {jugador.nombreJugador}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {jugador.emailJugador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(jugador.fechaRegistro).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => abrirModalEliminar(jugador)}
                        className="text-red-600 hover:text-red-700 p-1 rounded"
                        title="Eliminar del roster"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {modalAgregar && (
        <AgregarJugadorModal
          isOpen={modalAgregar}
          onClose={cerrarModales}
          idInscripcion={Number(idInscripcion)}
          onJugadorAgregado={manejarJugadorAgregado}
        />
      )}

      {modalEliminar && jugadorSeleccionado && (
        <EliminarJugadorRosterModal
          isOpen={modalEliminar}
          onClose={cerrarModales}
          jugador={jugadorSeleccionado}
          onJugadorEliminado={manejarJugadorEliminado}
        />
      )}
    </div>
  );
};

export default GestionRosterInscripcion;
