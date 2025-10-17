import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Eye } from 'lucide-react';
import { usuarioService } from '../../services/api';
import type { Usuario, Pago } from '../../types';
import VerPagosUsuarioModal from '../pagos/VerPagosUsuarioModal';

const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerPagosModal, setShowVerPagosModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.obtenerTodosLosUsuarios();
      console.log('Usuarios cargados desde API:', data);
      console.log('Total usuarios:', data.length);
      
      // Debug: mostrar tipos de usuario
      const tiposUsuario = data.map(u => u.tipo);
      console.log('Tipos de usuario encontrados:', tiposUsuario);
      
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar solo usuarios jugadores
  const usuariosJugadores = usuarios.filter(usuario => 
    usuario.tipo === 'JUGADOR' || !usuario.tipo
  );

  const usuariosFiltrados = usuariosJugadores.filter(usuario => {
    const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return nombreCompleto.includes(searchLower) ||
      usuario.email.toLowerCase().includes(searchLower) ||
      (usuario.celular && usuario.celular.toLowerCase().includes(searchLower)) ||
      (usuario.cedula && usuario.cedula.toLowerCase().includes(searchLower));
  });

  const handleVerPagos = (usuario: Usuario) => {
    // Usar cedula si está disponible, sino usar el ID convertido a string
    const identificador = usuario.cedula || usuario.id.toString();
    setUsuarioSeleccionado(identificador);
    setShowVerPagosModal(true);
  };

  const handleEditarPagoDesdeModal = (_pago: Pago) => {
    // Por ahora solo cerramos el modal, se puede implementar edición completa después
    setShowVerPagosModal(false);
    alert('Funcionalidad de edición disponible desde el módulo de Gestión de Pagos');
  };

  const handleEliminarPagoDesdeModal = async (_pagoId: number) => {
    // Modal se actualizará automáticamente después de eliminar
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Gestión de Usuarios</h2>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Búsqueda */}
      <div className="card">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <User className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-primary">Total Usuarios</h3>
          <p className="text-2xl font-bold text-primary">{usuariosJugadores.length}</p>
        </div>
        <div className="card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold text-primary">Activos</h3>
          <p className="text-2xl font-bold text-green-600">
            {usuariosJugadores.filter(u => u.estado === 'ACTIVO').length}
          </p>
        </div>
        <div className="card text-center">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold text-primary">Inactivos</h3>
          <p className="text-2xl font-bold text-gray-600">
            {usuariosJugadores.filter(u => u.estado === 'INACTIVO').length}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tabla de Usuarios */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {usuario.cedula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nombres} {usuario.apellidos}
                        </div>
                        <div className="text-sm text-gray-500">
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.estado?.toUpperCase() === 'ACTIVO' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {usuario.estado?.toUpperCase() === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuario.fechaRegistro
                      ? new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')
                      : 'No disponible'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleVerPagos(usuario)}
                      className="text-primary hover:text-primary/80"
                      title="Ver pagos del usuario"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {usuariosFiltrados.length === 0 && (
        <div className="card text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-400">Intenta con otros términos de búsqueda</p>
        </div>
      )}

      {/* Modal Ver Pagos Usuario */}
      {showVerPagosModal && usuarioSeleccionado && (
        <VerPagosUsuarioModal
          cedulaUsuario={usuarioSeleccionado}
          onClose={() => {
            setShowVerPagosModal(false);
            setUsuarioSeleccionado(null);
          }}
          onEditarPago={handleEditarPagoDesdeModal}
          onEliminarPago={handleEliminarPagoDesdeModal}
        />
      )}
    </div>
  );
};

export default GestionUsuarios;