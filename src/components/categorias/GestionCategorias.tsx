import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Award, Users, Venus, Mars, BarChart3 } from 'lucide-react';
import { categoriaService } from '../../services/api';
import type { 
  Categoria, 
  CategoriaFiltros, 
  CategoriaEstadisticas, 
  GeneroCategoria 
} from '../../types';
import EstadoBadgeGenero from '../shared/EstadoBadgeGenero';
import CrearCategoriaModal from './CrearCategoriaModal';
import EditarCategoriaModal from './EditarCategoriaModal';
import EliminarCategoriaModal from './EliminarCategoriaModal';
import EstadisticasCategoriasModal from './EstadisticasCategoriasModal';

const GestionCategorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<CategoriaFiltros>({});
  const [busqueda, setBusqueda] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [showEstadisticasModal, setShowEstadisticasModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [estadisticas, setEstadisticas] = useState<CategoriaEstadisticas | null>(null);

  // Cargar categorías
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosActuales: CategoriaFiltros = {};
      if (filtros.genero) filtrosActuales.genero = filtros.genero;
      if (busqueda.trim()) filtrosActuales.nombre = busqueda.trim();
      
      const data = await categoriaService.obtenerTodas(filtrosActuales);
      setCategorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
      console.error('Error cargando categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      const stats = await categoriaService.obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  useEffect(() => {
    cargarCategorias();
    cargarEstadisticas();
  }, [filtros, busqueda]);

  const handleBuscar = () => {
    cargarCategorias();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const handleCrearCategoria = () => {
    setShowCrearModal(true);
  };

  const handleEditarCategoria = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setShowEditarModal(true);
  };

  const handleEliminarCategoria = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setShowEliminarModal(true);
  };

  const handleModalSuccess = () => {
    cargarCategorias();
    cargarEstadisticas();
    setCategoriaSeleccionada(null);
  };

  const onCloseModal = () => {
    setShowCrearModal(false);
    setShowEditarModal(false);
    setShowEliminarModal(false);
    setShowEstadisticasModal(false);
    setCategoriaSeleccionada(null);
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
          <Award className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
            <p className="text-gray-600">Administra categorías de voleibol</p>
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
            onClick={handleCrearCategoria}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* Cards de Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalCategorias}</p>
                <p className="text-gray-600">Total Categorías</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Mars className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{estadisticas.categoriasMasculinas}</p>
                <p className="text-gray-600">Masculinas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-100">
                <Venus className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{estadisticas.categoriasFemeninas}</p>
                <p className="text-gray-600">Femeninas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{estadisticas.categoriasMixtas}</p>
                <p className="text-gray-600">Mixtas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Búsqueda */}
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
                className="btn-outline px-3 py-2"
              >
                Buscar
              </button>
            </div>

            {/* Filtro por género */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filtros.genero || ''}
                onChange={(e) => setFiltros({ ...filtros, genero: e.target.value as GeneroCategoria || undefined })}
                className="input-field w-40"
              >
                <option value="">Todos los géneros</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Mixto">Mixto</option>
              </select>
            </div>
          </div>

          {/* Limpiar filtros */}
          {(filtros.genero || busqueda) && (
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

      {/* Lista de Categorías */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">No hay categorías disponibles</p>
                    <p className="text-sm">Crea una nueva categoría para comenzar</p>
                  </td>
                </tr>
              ) : (
                categorias.map((categoria, index) => (
                  <tr key={categoria.idCategoria || `categoria-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{categoria.idCategoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{categoria.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EstadoBadgeGenero genero={categoria.genero} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditarCategoria(categoria)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        title="Editar categoría"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEliminarCategoria(categoria)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {showCrearModal && (
        <CrearCategoriaModal
          onClose={onCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {showEditarModal && categoriaSeleccionada && (
        <EditarCategoriaModal
          categoria={categoriaSeleccionada}
          onClose={onCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {showEliminarModal && categoriaSeleccionada && (
        <EliminarCategoriaModal
          categoria={categoriaSeleccionada}
          onClose={onCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {showEstadisticasModal && estadisticas && (
        <EstadisticasCategoriasModal
          estadisticas={estadisticas}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
};

export default GestionCategorias;