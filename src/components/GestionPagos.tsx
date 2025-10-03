import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, DollarSign } from 'lucide-react';
import { pagoService, usuarioService } from '../services/api';
import type { Pago, Usuario } from '../types';
import CrearPagoModal from './modals/CrearPagoModal';
import EditarEstadoModal from './modals/EditarEstadoModal';
import VerPagosUsuarioModal from './modals/VerPagosUsuarioModal';
import VerDetallePagoModal from './modals/VerDetallePagoModal';

const GestionPagos: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showVerUsuarioModal, setShowVerUsuarioModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [pagosData, usuariosData] = await Promise.all([
        pagoService.obtenerTodosLosPagos(),
        usuarioService.obtenerTodosLosUsuarios()
      ]);
      
      // Debug: verificar datos recibidos
      console.log('=== Datos cargados del Backend ===');
      console.log('Pagos:', pagosData.length, '| Usuarios:', usuariosData.length);
      
      // Verificar estados de usuarios
      const estadosUsuarios = usuariosData.reduce((acc, u) => {
        acc[u.estado || 'SIN_ESTADO'] = (acc[u.estado || 'SIN_ESTADO'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Verificar estados de pagos
      const estadosPagos = pagosData.reduce((acc, p) => {
        acc[p.estado] = (acc[p.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('Estados Usuarios:', estadosUsuarios, '| Estados Pagos:', estadosPagos);
      
      // Debug: verificar si hay pagos sin información de usuario
      const pagosSinUsuario = pagosData.filter(pago => !pago.usuarioNombre);
      if (pagosSinUsuario.length > 0) {
        console.warn('Se encontraron pagos sin información de usuario:', pagosSinUsuario);
      }
      
      setPagos(pagosData);
      setUsuarios(usuariosData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerUsuario = (usuarioId: number) => {
    setUsuarioSeleccionado(usuarioId.toString());
    setShowVerUsuarioModal(true);
  };

  const handleEditarPagoDesdeModal = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setShowEditarModal(true);
    setShowVerUsuarioModal(false);
  };

  const handleEliminarPagoDesdeModal = async (_pagoId: number) => {
    // Recargar los datos después de eliminar
    await cargarDatos();
  };

  const handleVerDetallePago = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setShowDetalleModal(true);
    setShowVerUsuarioModal(false);
  };

  // Agrupar pagos por usuario y calcular estadísticas
  const usuariosConPagos = React.useMemo(() => {
    const usuariosMap = new Map<number, {
      usuario: Usuario;
      pendientes: number;
      atrasados: number;
      pagados: number;
      rechazados: number;
    }>();

    // IMPORTANTE: Usar TODOS los pagos, no solo los filtrados
    pagos.forEach(pago => {
      const usuario = usuarios.find(u => u.id === pago.usuarioId);
      if (!usuario) return;

      if (!usuariosMap.has(pago.usuarioId)) {
        usuariosMap.set(pago.usuarioId, {
          usuario,
          pendientes: 0,
          atrasados: 0,
          pagados: 0,
          rechazados: 0
        });
      }

      const stats = usuariosMap.get(pago.usuarioId)!;
      
      // Contar según el estado del pago (usar toLowerCase para normalizar)
      const estadoNormalizado = pago.estado.toLowerCase();
      
      switch (estadoNormalizado) {
        case 'pendiente':
          stats.pendientes++;
          break;
        case 'atraso':  // CORREGIDO: era 'atrasado', debe ser 'atraso'
        case 'atrasado': // Mantener ambos por compatibilidad
          stats.atrasados++;
          break;
        case 'pagado':
          stats.pagados++;
          break;
        case 'rechazado':
          stats.rechazados++;
          break;
        default:
          console.warn(`Estado desconocido: "${pago.estado}" para pago ID ${pago.id}`);
      }
    });

    let result = Array.from(usuariosMap.values());
    
    // Aplicar filtros de búsqueda si existen
    if (searchTerm) {
      result = result.filter(({ usuario }) => 
        usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.cedula.includes(searchTerm) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    console.log(`✅ ${result.length} usuarios con pagos calculados`);
    return result;
  }, [pagos, usuarios, searchTerm]); // Agregado searchTerm como dependencia

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
        <h2 className="text-3xl font-bold text-primary">Gestión de Pagos</h2>
        <button
          onClick={() => setShowCrearModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Crear Pago
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por usuario o método de pago..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="input-field w-full"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="atraso">Atrasado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-primary">Total Pagos</h3>
          <p className="text-2xl font-bold text-green-600">{pagos.length}</p>
        </div>
        <div className="card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold text-primary">Pagados</h3>
          <p className="text-2xl font-bold text-green-600">
            {pagos.filter(p => p.estado === 'pagado').length}
          </p>
        </div>
        <div className="card text-center">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold text-primary">Pendientes</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {pagos.filter(p => p.estado === 'pendiente').length}
          </p>
        </div>
        <div className="card text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold text-primary">Atrasados</h3>
          <p className="text-2xl font-bold text-red-600">
            {pagos.filter(p => p.estado === 'atraso').length}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tabla de Pagos */}
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendientes
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atrasados
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagados
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rechazados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosConPagos.map(({ usuario, pendientes, atrasados, pagados, rechazados }) => {
                return (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {usuario.cedula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {`${usuario.nombres} ${usuario.apellidos}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {usuario.email}
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                      {pendientes}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
                      {atrasados}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                      {pagados}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">
                      {rechazados}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleVerUsuario(usuario.id)}
                      className="text-primary hover:text-primary/80"
                      title="Ver pagos del usuario"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {showCrearModal && (
        <CrearPagoModal
          usuarios={usuarios}
          onClose={() => setShowCrearModal(false)}
          onSuccess={() => {
            setShowCrearModal(false);
            cargarDatos();
          }}
        />
      )}

      {showEditarModal && pagoSeleccionado && (
        <EditarEstadoModal
          pago={pagoSeleccionado}
          onClose={() => {
            setShowEditarModal(false);
            setPagoSeleccionado(null);
          }}
          onSuccess={() => {
            setShowEditarModal(false);
            setPagoSeleccionado(null);
            cargarDatos();
          }}
        />
      )}

      {showVerUsuarioModal && usuarioSeleccionado && (
        <VerPagosUsuarioModal
          cedulaUsuario={usuarioSeleccionado}
          onClose={() => {
            setShowVerUsuarioModal(false);
            setUsuarioSeleccionado(null);
          }}
          onEditarPago={handleEditarPagoDesdeModal}
          onEliminarPago={handleEliminarPagoDesdeModal}
          onVerDetalle={handleVerDetallePago}
        />
      )}

      {showDetalleModal && pagoSeleccionado && (
        <VerDetallePagoModal
          pago={pagoSeleccionado}
          nombreUsuario={pagoSeleccionado.usuarioNombre || 'Usuario desconocido'}
          onClose={() => {
            setShowDetalleModal(false);
            setPagoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
};

export default GestionPagos;