import React, { useState, useEffect } from 'react';
import { Plus, Search, Trophy, Filter, BarChart3, Users, Clock, CheckCircle } from 'lucide-react';
import { torneoService } from '../services/api';
import type { Torneo, TorneoFiltros, EstadoTorneo, TorneoEstadisticas } from '../types';
import EstadoBadgeTorneo from './EstadoBadgeTorneo';
import CrearTorneoModal from './modals/CrearTorneoModal';
import EditarTorneoModal from './modals/EditarTorneoModal';
import CambiarEstadoTorneoModal from './modals/CambiarEstadoTorneoModal';
import EliminarTorneoModal from './modals/EliminarTorneoModal';
import EstadisticasTorneoModal from './modals/EstadisticasTorneoModal';

const GestionTorneos: React.FC = () => {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<TorneoFiltros>({});
  const [busqueda, setBusqueda] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showCambiarEstadoModal, setShowCambiarEstadoModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [showEstadisticasModal, setShowEstadisticasModal] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState<Torneo | null>(null);
  const [estadisticas, setEstadisticas] = useState<TorneoEstadisticas | null>(null);

  // Cargar torneos
  const cargarTorneos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosActuales: TorneoFiltros = {};
      if (filtros.estado) filtrosActuales.estado = filtros.estado;
      if (busqueda.trim()) filtrosActuales.nombre = busqueda.trim();
      
      const data = await torneoService.obtenerTodos(filtrosActuales);
      setTorneos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar torneos');
      console.error('Error cargando torneos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      const stats = await torneoService.obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  useEffect(() => {
    cargarTorneos();
    cargarEstadisticas();
  }, [filtros, busqueda]);

  const formatearFecha = (fecha?: string): string => {
    if (!fecha) return 'No definida';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleBuscar = () => {
    cargarTorneos();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const handleCrearTorneo = () => {
    setShowCrearModal(true);
  };

  const handleEditarTorneo = (torneo: Torneo) => {
    setTorneoSeleccionado(torneo);
    setShowEditarModal(true);
  };

  const handleCambiarEstado = (torneo: Torneo) => {
    setTorneoSeleccionado(torneo);
    setShowCambiarEstadoModal(true);
  };

  const handleEliminarTorneo = (torneo: Torneo) => {
    setTorneoSeleccionado(torneo);
    setShowEliminarModal(true);
  };

  const handleModalSuccess = () => {
    cargarTorneos();
    cargarEstadisticas();
    setTorneoSeleccionado(null);
  };

  const onCloseModal = () => {
    setShowCrearModal(false);
    setShowEditarModal(false);
    setShowCambiarEstadoModal(false);
    setShowEliminarModal(false);
    setShowEstadisticasModal(false);
    setTorneoSeleccionado(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Torneos</h1>
            <p className="text-gray-600">Administra torneos de voleibol</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowEstadisticasModal(true)}
            className="btn-outline flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Estadísticas</span>
          </button>
          <button
            onClick={handleCrearTorneo}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Torneo</span>
          </button>
        </div>
      </div>

      {/* Cards de Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Torneos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalTorneos}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.torneosPendientes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.torneosActivos}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Finalizados</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.torneosFinalizados}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Búsqueda por nombre */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={handleKeyPress}
                className="input-field w-64"
              />
              <button
                onClick={handleBuscar}
                className="btn-outline"
              >
                Buscar
              </button>
            </div>

            {/* Filtro por estado */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filtros.estado || ''}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as EstadoTorneo || undefined })}
                className="input-field"
              >
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Activo">Activo</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          {/* Limpiar filtros */}
          {(filtros.estado || busqueda) && (
            <button
              onClick={() => {
                setFiltros({});
                setBusqueda('');
              }}
              className="btn-outline text-sm"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Lista de Torneos */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Torneo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {torneos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {filtros.estado || busqueda ? 'No se encontraron torneos con los filtros aplicados' : 'No hay torneos registrados'}
                  </td>
                </tr>
              ) : (
                torneos.map((torneo) => (
                  <tr key={torneo.idTorneo} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {torneo.nombre}
                        </div>
                        {torneo.descripcion && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {torneo.descripcion}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EstadoBadgeTorneo estado={torneo.estado} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatearFecha(torneo.fechaInicio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatearFecha(torneo.fechaFin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditarTorneo(torneo)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleCambiarEstado(torneo)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Estado
                      </button>
                      <button
                        onClick={() => handleEliminarTorneo(torneo)}
                        className="text-red-600 hover:text-red-900"
                        disabled={torneo.estado === 'Activo'}
                        title={torneo.estado === 'Activo' ? 'No se puede eliminar un torneo activo' : 'Eliminar torneo'}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales - Temporalmente comentados para testing */}
      {/* Modales */}
      {showCrearModal && (
        <CrearTorneoModal
          onClose={onCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {showEditarModal && torneoSeleccionado && (
        <EditarTorneoModal
          torneo={torneoSeleccionado}
          onClose={onCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {showCambiarEstadoModal && torneoSeleccionado && (
        <CambiarEstadoTorneoModal
          torneo={torneoSeleccionado}
          onClose={onCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {showEliminarModal && torneoSeleccionado && (
        <EliminarTorneoModal
          torneo={torneoSeleccionado}
          onClose={onCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {showEstadisticasModal && estadisticas && (
        <EstadisticasTorneoModal
          estadisticas={estadisticas}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
};

export default GestionTorneos;