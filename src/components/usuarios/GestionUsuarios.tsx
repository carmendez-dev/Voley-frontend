import React, { useState, useEffect } from 'react';
import { Search, Filter, BarChart3, UserCheck, UserX, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { usuarioService } from '../../services/api';
import type { Usuario, UsuarioEstadisticas } from '../../types';
import CrearUsuarioModal from './CrearUsuarioModal';
import EditarUsuarioModal from './EditarUsuarioModal';
import FichaUsuarioModal from './FichaUsuarioModal';
import EliminarUsuarioModal from './EliminarUsuarioModal';

const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [estadisticas, setEstadisticas] = useState<UsuarioEstadisticas | null>(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    busqueda: '',
    sortBy: 'primerNombre',
    order: 'asc'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalFichaAbierto, setModalFichaAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.obtenerTodos({});
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await usuarioService.obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarEstadisticas();
  }, []);

  // Filtrado y ordenamiento local
  useEffect(() => {
    let resultado = [...usuarios];

    // Filtrar por estado
    if (filtros.estado) {
      resultado = resultado.filter(u => u.estado === filtros.estado);
    }

    // Filtrar por búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(u => 
        u.primerNombre.toLowerCase().includes(busqueda) ||
        (u.segundoNombre || '').toLowerCase().includes(busqueda) ||
        u.primerApellido.toLowerCase().includes(busqueda) ||
        (u.segundoApellido || '').toLowerCase().includes(busqueda) ||
        u.email.toLowerCase().includes(busqueda) ||
        u.cedula.includes(busqueda)
      );
    }

    // Ordenar
    resultado.sort((a, b) => {
      let valorA: any = a[filtros.sortBy as keyof Usuario];
      let valorB: any = b[filtros.sortBy as keyof Usuario];

      if (typeof valorA === 'string') valorA = valorA.toLowerCase();
      if (typeof valorB === 'string') valorB = valorB.toLowerCase();

      if (filtros.order === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });

    setUsuariosFiltrados(resultado);
  }, [usuarios, filtros]);

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await usuarioService.cambiarEstado(id, nuevoEstado as 'Activo' | 'Inactivo');
      await cargarUsuarios();
      await cargarEstadisticas();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar estado del usuario');
    }
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarAbierto(true);
  };

  const abrirModalFicha = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalFichaAbierto(true);
  };

  const abrirModalEliminar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminarAbierto(true);
  };

  const cerrarModales = () => {
    setModalCrearAbierto(false);
    setModalEditarAbierto(false);
    setModalFichaAbierto(false);
    setModalEliminarAbierto(false);
    setUsuarioSeleccionado(null);
  };

  const handleSuccessModal = () => {
    cargarUsuarios();
    cargarEstadisticas();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema de voleibol</p>
        </div>
        <button
          onClick={() => setModalCrearAbierto(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Usuarios</h3>
                <p className="text-3xl font-bold text-blue-600">{estadisticas.totalUsuarios}</p>
              </div>
              <UserCheck className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Usuarios Activos</h3>
                <p className="text-3xl font-bold text-green-600">{estadisticas.usuariosActivos}</p>
              </div>
              <UserCheck className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Usuarios Inactivos</h3>
                <p className="text-3xl font-bold text-red-600">{estadisticas.usuariosInactivos}</p>
              </div>
              <UserX className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="w-4 h-4 inline mr-1" />
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, email o cédula..."
              value={filtros.busqueda}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="w-4 h-4 inline mr-1" />
              Estado
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Ordenar por
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.sortBy}
              onChange={(e) => setFiltros(prev => ({ ...prev, sortBy: e.target.value }))}
            >
              <option value="primerNombre">Primer Nombre</option>
              <option value="primerApellido">Primer Apellido</option>
              <option value="email">Email</option>
              <option value="fechaRegistro">Fecha Registro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.order}
              onChange={(e) => setFiltros(prev => ({ ...prev, order: e.target.value }))}
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Información Física
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.primerNombre} {usuario.segundoNombre || ''} {usuario.primerApellido} {usuario.segundoApellido || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {usuario.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {usuario.peso && usuario.altura ? (
                          <>
                            <div>Peso: {usuario.peso} kg</div>
                            <div>Altura: {usuario.altura} m</div>
                            {usuario.imc && <div>IMC: {usuario.imc.toFixed(2)}</div>}
                          </>
                        ) : (
                          <span className="text-gray-400">No disponible</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <select
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={usuario.estado}
                          onChange={(e) => handleCambiarEstado(usuario.id, e.target.value)}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                        <button
                          onClick={() => abrirModalFicha(usuario)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          title="Ver ficha completa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => abrirModalEditar(usuario)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar usuario"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => abrirModalEliminar(usuario)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {usuariosFiltrados.length === 0 && !loading && (
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
              {filtros.busqueda || filtros.estado ? (
                <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      {modalCrearAbierto && (
        <CrearUsuarioModal
          onClose={cerrarModales}
          onSuccess={handleSuccessModal}
        />
      )}

      {modalEditarAbierto && usuarioSeleccionado && (
        <EditarUsuarioModal
          usuario={usuarioSeleccionado}
          onClose={cerrarModales}
          onSuccess={handleSuccessModal}
        />
      )}

      {modalFichaAbierto && usuarioSeleccionado && (
        <FichaUsuarioModal
          usuario={usuarioSeleccionado}
          onClose={cerrarModales}
        />
      )}

      {modalEliminarAbierto && usuarioSeleccionado && (
        <EliminarUsuarioModal
          usuario={usuarioSeleccionado}
          onClose={cerrarModales}
          onSuccess={handleSuccessModal}
        />
      )}
    </div>
  );
};

export default GestionUsuarios;
