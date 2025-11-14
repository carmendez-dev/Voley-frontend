import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Trash2, Eye, Filter, Users } from 'lucide-react';
import inscripcionesService from '../../services/inscripciones.service';
import type { Inscripcion, EstadoInscripcion } from '../../types';
import CrearInscripcionModal from './CrearInscripcionModal';
import DetalleInscripcionModal from './DetalleInscripcionModal';
import EliminarInscripcionModal from './EliminarInscripcionModal';
import RosterEquipoModal from './RosterEquipoModal';

const GestionInscripciones: React.FC = () => {
  // Estados principales
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [inscripcionesFiltradas, setInscripcionesFiltradas] = useState<Inscripcion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');

  // Estados de modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalRoster, setModalRoster] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<Inscripcion | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarInscripciones();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    aplicarFiltros();
  }, [inscripciones, busqueda, filtroEstado]);

  const cargarInscripciones = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await inscripcionesService.obtenerTodas();
      setInscripciones(data);
    } catch (error) {
      console.error('Error cargando inscripciones:', error);
      setError('Error al cargar las inscripciones');
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...inscripciones];

    // Filtro por estado
    if (filtroEstado !== 'todas') {
      resultado = resultado.filter(i => i.estado === filtroEstado);
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase().trim();
      resultado = resultado.filter(i =>
        i.nombreTorneo?.toLowerCase().includes(busquedaLower) ||
        i.nombreCategoria?.toLowerCase().includes(busquedaLower) ||
        i.nombreEquipo?.toLowerCase().includes(busquedaLower)
      );
    }

    setInscripcionesFiltradas(resultado);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todas');
  };

  // Funciones de modales
  const abrirModalCrear = () => setModalCrear(true);

  const abrirModalDetalle = (inscripcion: Inscripcion) => {
    setInscripcionSeleccionada(inscripcion);
    setModalDetalle(true);
  };

  const abrirModalEliminar = (inscripcion: Inscripcion) => {
    setInscripcionSeleccionada(inscripcion);
    setModalEliminar(true);
  };

  const abrirModalRoster = (inscripcion: Inscripcion) => {
    setInscripcionSeleccionada(inscripcion);
    setModalRoster(true);
  };

  const cerrarModales = () => {
    setModalCrear(false);
    setModalDetalle(false);
    setModalRoster(false);
    setModalEliminar(false);
    setModalRoster(false);
    setInscripcionSeleccionada(null);
  };

  const manejarInscripcionCreada = () => {
    cargarInscripciones();
    cerrarModales();
  };

  const manejarInscripcionActualizada = () => {
    cargarInscripciones();
    cerrarModales();
  };

  const manejarInscripcionEliminada = () => {
    cargarInscripciones();
    cerrarModales();
  };

  const getEstadoBadge = (estado: EstadoInscripcion) => {
    const badges = {
      inscrito: 'bg-green-100 text-green-800',
      retirado: 'bg-yellow-100 text-yellow-800',
      descalificado: 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Inscripciones</h1>
          <p className="text-gray-600">Administra las inscripciones de equipos a torneos</p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Inscripción</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por torneo, categoría o equipo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="todas">Todos los estados</option>
              <option value="inscrito">Inscrito</option>
              <option value="retirado">Retirado</option>
              <option value="descalificado">Descalificado</option>
            </select>
          </div>
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <FileText size={20} />
            <span>Inscripciones ({inscripcionesFiltradas.length})</span>
          </h2>
        </div>

        {inscripcionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay inscripciones</h3>
            <p className="text-gray-500 mb-4">
              {busqueda.trim() || filtroEstado !== 'todas'
                ? 'No se encontraron inscripciones con los filtros aplicados.'
                : 'Comienza creando tu primera inscripción.'}
            </p>
            {!busqueda.trim() && filtroEstado === 'todas' && (
              <button
                onClick={abrirModalCrear}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
                <span>Crear Primera Inscripción</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Torneo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inscripcionesFiltradas.map((inscripcion) => (
                  <tr key={inscripcion.idInscripcion} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscripcion.idInscripcion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscripcion.nombreTorneo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscripcion.nombreCategoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscripcion.nombreEquipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoBadge(inscripcion.estado)}`}>
                        {inscripcion.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inscripcion.fechaInscripcion
                        ? new Date(inscripcion.fechaInscripcion).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => abrirModalRoster(inscripcion)}
                          className="text-green-600 hover:text-green-700 p-1 rounded"
                          title="Gestionar roster"
                        >
                          <Users size={16} />
                        </button>
                        <button
                          onClick={() => abrirModalDetalle(inscripcion)}
                          className="text-indigo-600 hover:text-indigo-700 p-1 rounded"
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => abrirModalEliminar(inscripcion)}
                          className="text-red-600 hover:text-red-700 p-1 rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {modalCrear && (
        <CrearInscripcionModal
          isOpen={modalCrear}
          onClose={cerrarModales}
          onInscripcionCreada={manejarInscripcionCreada}
        />
      )}

      {modalDetalle && inscripcionSeleccionada && (
        <DetalleInscripcionModal
          isOpen={modalDetalle}
          onClose={cerrarModales}
          inscripcion={inscripcionSeleccionada}
          onInscripcionActualizada={manejarInscripcionActualizada}
        />
      )}

      {modalEliminar && inscripcionSeleccionada && (
        <EliminarInscripcionModal
          isOpen={modalEliminar}
          onClose={cerrarModales}
          inscripcion={inscripcionSeleccionada}
          onInscripcionEliminada={manejarInscripcionEliminada}
        />
      )}

      {modalRoster && inscripcionSeleccionada && (
        <RosterEquipoModal
          isOpen={modalRoster}
          onClose={cerrarModales}
          inscripcion={inscripcionSeleccionada}
        />
      )}
    </div>
  );
};

export default GestionInscripciones;
