import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Trash2, Search, UserPlus } from 'lucide-react';
import { rosterService, usuarioService } from '../../services';
import type { RosterJugador, Usuario, Inscripcion } from '../../types';

interface RosterInscripcionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscripcion: Inscripcion;
}

const RosterInscripcionModal: React.FC<RosterInscripcionModalProps> = ({
  isOpen,
  onClose,
  inscripcion
}) => {
  const [roster, setRoster] = useState<RosterJugador[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number>(0);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarRoster();
      cargarUsuarios();
    }
  }, [isOpen]);

  useEffect(() => {
    filtrarUsuarios();
  }, [busqueda, usuarios]);

  const cargarRoster = async () => {
    try {
      const data = await rosterService.obtenerPorInscripcion(inscripcion.idInscripcion!);
      setRoster(data);
    } catch (error) {
      console.error('Error cargando roster:', error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const data = await usuarioService.obtenerTodos({ estado: 'Activo' });
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const filtrarUsuarios = () => {
    if (!busqueda.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const busquedaLower = busqueda.toLowerCase();
    const filtrados = usuarios.filter(usuario =>
      usuario.nombreCompleto.toLowerCase().includes(busquedaLower) ||
      usuario.email.toLowerCase().includes(busquedaLower) ||
      usuario.cedula.includes(busqueda)
    );
    setUsuariosFiltrados(filtrados);
  };

  const handleAgregarJugador = async () => {
    if (usuarioSeleccionado === 0) {
      setError('Por favor seleccione un jugador');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await rosterService.agregarJugador({
        idInscripcion: inscripcion.idInscripcion!,
        idUsuario: usuarioSeleccionado
      });

      setMostrarAgregar(false);
      setUsuarioSeleccionado(0);
      setBusqueda('');
      cargarRoster();
    } catch (error: any) {
      console.error('Error al agregar jugador:', error);
      setError(error.response?.data?.message || 'Error al agregar jugador al roster');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarJugador = async (idRoster: number) => {
    if (!window.confirm('¿Está seguro de eliminar este jugador del roster?')) {
      return;
    }

    try {
      await rosterService.eliminarJugador(idRoster);
      cargarRoster();
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      setError(error.response?.data?.message || 'Error al eliminar jugador');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Roster de Jugadores</h2>
            <p className="text-gray-600 mt-1">
              {inscripcion.nombreEquipo} - {inscripcion.nombreTorneo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Botón Agregar */}
          {!mostrarAgregar && (
            <button
              onClick={() => setMostrarAgregar(true)}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              <span>Agregar Jugador</span>
            </button>
          )}

          {/* Formulario Agregar */}
          {mostrarAgregar && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Agregar Jugador</h3>
                <button
                  onClick={() => {
                    setMostrarAgregar(false);
                    setUsuarioSeleccionado(0);
                    setBusqueda('');
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o cédula..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Lista de Usuarios */}
              <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                {usuariosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron jugadores
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {usuariosFiltrados.map((usuario) => (
                      <label
                        key={usuario.id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                          usuarioSeleccionado === usuario.id ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="usuario"
                          value={usuario.id}
                          checked={usuarioSeleccionado === usuario.id}
                          onChange={() => setUsuarioSeleccionado(usuario.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombreCompleto}
                          </div>
                          <div className="text-xs text-gray-500">
                            {usuario.email} • CI: {usuario.cedula}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón Agregar */}
              <button
                onClick={handleAgregarJugador}
                disabled={loading || usuarioSeleccionado === 0}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Agregando...' : 'Agregar al Roster'}
              </button>
            </div>
          )}

          {/* Lista de Jugadores */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Users size={20} />
              <span>Jugadores ({roster.length})</span>
            </h3>

            {roster.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <UserPlus size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No hay jugadores en el roster</p>
              </div>
            ) : (
              <div className="space-y-2">
                {roster.map((jugador, index) => (
                  <div
                    key={jugador.idRoster}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {jugador.nombreJugador}
                        </div>
                        <div className="text-sm text-gray-500">
                          {jugador.emailJugador}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEliminarJugador(jugador.idRoster)}
                      className="text-red-600 hover:text-red-700 p-2 rounded"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RosterInscripcionModal;
