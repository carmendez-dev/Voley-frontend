import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { rosterService, usuarioService } from '../../services';
import type { Usuario, CrearRosterDTO } from '../../types';

interface AgregarJugadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  idInscripcion: number;
  onJugadorAgregado: () => void;
}

const AgregarJugadorModal: React.FC<AgregarJugadorModalProps> = ({
  isOpen,
  onClose,
  idInscripcion,
  onJugadorAgregado
}) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarUsuarios();
    }
  }, [isOpen]);

  useEffect(() => {
    filtrarUsuarios();
  }, [busqueda, usuarios]);

  const cargarUsuarios = async () => {
    try {
      const data = await usuarioService.obtenerTodos({ estado: 'Activo' });
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error al cargar los usuarios');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (usuarioSeleccionado === 0) {
      setError('Por favor seleccione un jugador');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dto: CrearRosterDTO = {
        idInscripcion,
        idUsuario: usuarioSeleccionado
      };

      await rosterService.agregarJugador(dto);
      onJugadorAgregado();
    } catch (error: any) {
      console.error('Error al agregar jugador:', error);
      const mensaje = error.response?.data?.message || 'Error al agregar jugador al roster';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Agregar Jugador al Roster</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Jugador
            </label>
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
          </div>

          {/* Lista de Usuarios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Jugador *
            </label>
            <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
              {usuariosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {busqueda.trim() ? 'No se encontraron jugadores' : 'No hay usuarios disponibles'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {usuariosFiltrados.map((usuario) => (
                    <label
                      key={usuario.id}
                      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
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
                        <div className="text-sm text-gray-500">
                          {usuario.email} • CI: {usuario.cedula}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || usuarioSeleccionado === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Agregando...' : 'Agregar al Roster'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarJugadorModal;
