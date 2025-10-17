import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Trash2, Edit } from 'lucide-react';
import { equipoService } from '../../services/api';
import type { Equipo } from '../../types';
import CrearEquipoModal from './CrearEquipoModal';
import EditarEquipoModal from './EditarEquipoModal';
import EliminarEquipoModal from './EliminarEquipoModal';

const GestionEquipos: React.FC = () => {
  // Estados principales
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState<Equipo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');

  // Estados de modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarEquipos();
  }, []);

  // Aplicar filtros cuando cambian los equipos o la búsqueda
  useEffect(() => {
    aplicarFiltros();
  }, [equipos, busqueda]);

  const cargarEquipos = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await equipoService.obtenerTodos();
      setEquipos(data);
    } catch (error) {
      console.error('Error cargando equipos:', error);
      setError('Error al cargar los equipos');
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    let equiposFiltrados = [...equipos];

    // Filtro por búsqueda de nombre
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase().trim();
      equiposFiltrados = equiposFiltrados.filter(equipo =>
        equipo.nombre.toLowerCase().includes(busquedaLower) ||
        (equipo.descripcion && equipo.descripcion.toLowerCase().includes(busquedaLower))
      );
    }

    setEquiposFiltrados(equiposFiltrados);
  };

  const manejarBusqueda = (valor: string) => {
    setBusqueda(valor);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
  };

  // Funciones de modales
  const abrirModalCrear = () => {
    setModalCrear(true);
  };

  const abrirModalEditar = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo);
    setModalEditar(true);
  };

  const abrirModalEliminar = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalCrear(false);
    setModalEditar(false);
    setModalEliminar(false);
    setEquipoSeleccionado(null);
  };

  const manejarEquipoCreado = () => {
    cargarEquipos();
    cerrarModales();
  };

  const manejarEquipoActualizado = () => {
    cargarEquipos();
    cerrarModales();
  };

  const manejarEquipoEliminado = () => {
    cargarEquipos();
    cerrarModales();
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Equipos</h1>
          <p className="text-gray-600">Administra los equipos del sistema</p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Equipo</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar equipos por nombre o descripción..."
                value={busqueda}
                onChange={(e) => manejarBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla de equipos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Users size={20} />
            <span>Equipos ({equiposFiltrados.length})</span>
          </h2>
        </div>

        {equiposFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos</h3>
            <p className="text-gray-500 mb-4">
              {busqueda.trim() ? 'No se encontraron equipos con los filtros aplicados.' : 'Comienza creando tu primer equipo.'}
            </p>
            {!busqueda.trim() && (
              <button
                onClick={abrirModalCrear}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
                <span>Crear Primer Equipo</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equiposFiltrados.map((equipo) => (
                  <tr key={equipo.idEquipo || `equipo-${equipos.indexOf(equipo)}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {equipo.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {equipo.descripcion || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => abrirModalEditar(equipo)}
                          className="text-indigo-600 hover:text-indigo-700 p-1 rounded"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => abrirModalEliminar(equipo)}
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
        <CrearEquipoModal
          isOpen={modalCrear}
          onClose={cerrarModales}
          onEquipoCreado={manejarEquipoCreado}
        />
      )}

      {modalEditar && equipoSeleccionado && (
        <EditarEquipoModal
          isOpen={modalEditar}
          onClose={cerrarModales}
          equipo={equipoSeleccionado}
          onEquipoActualizado={manejarEquipoActualizado}
        />
      )}

      {modalEliminar && equipoSeleccionado && (
        <EliminarEquipoModal
          isOpen={modalEliminar}
          onClose={cerrarModales}
          equipo={equipoSeleccionado}
          onEquipoEliminado={manejarEquipoEliminado}
        />
      )}
    </div>
  );
};

export default GestionEquipos;