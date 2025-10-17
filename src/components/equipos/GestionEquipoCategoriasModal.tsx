import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Search, Link, Users, Tag } from 'lucide-react';
import { categoriaService } from '../../services/api';
import type { Equipo, Categoria, CategoriaEquipo } from '../../types';

interface GestionEquipoCategoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipo: Equipo;
}

const GestionEquipoCategoriasModal: React.FC<GestionEquipoCategoriasModalProps> = ({
  isOpen,
  onClose,
  equipo
}) => {
  const [categoriasAsignadas, setCategoriasAsignadas] = useState<CategoriaEquipo[]>([]);
  const [todasLasCategorias, setTodasLasCategorias] = useState<Categoria[]>([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Categoria[]>([]);
  const [busquedaDisponibles, setBusquedaDisponibles] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen, equipo.idEquipo]);

  useEffect(() => {
    filtrarCategoriasDisponibles();
  }, [todasLasCategorias, categoriasAsignadas, busquedaDisponibles]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      // Por ahora solo cargamos las categorías disponibles
      // Las relaciones equipo-categoría se implementarán cuando el backend esté listo
      const categorias = await categoriaService.obtenerTodas();
      
      setTodasLasCategorias(categorias);
      setCategoriasAsignadas([]); // Por ahora vacío hasta que el backend implemente las relaciones
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  const filtrarCategoriasDisponibles = () => {
    const idsAsignados = new Set(categoriasAsignadas.map(ca => ca.idCategoria));
    
    let disponibles = todasLasCategorias.filter(categoria => 
      !idsAsignados.has(categoria.idCategoria)
    );

    if (busquedaDisponibles.trim()) {
      const busqueda = busquedaDisponibles.toLowerCase().trim();
      disponibles = disponibles.filter(categoria =>
        categoria.nombre.toLowerCase().includes(busqueda) ||
        (categoria.descripcion && categoria.descripcion.toLowerCase().includes(busqueda))
      );
    }

    setCategoriasDisponibles(disponibles);
  };

  const asignarCategoria = async (categoria: Categoria) => {
    try {
      setProcesando(prev => ({ ...prev, [categoria.idCategoria]: true }));
      setError(null);

      // Por ahora solo simulamos la asignación localmente
      // Cuando el backend implemente las relaciones, se usará equipoCategoriaService.asignarEquipo
      console.log('Simulando asignación de categoría:', categoria.nombre, 'al equipo:', equipo.nombre);
      
      // Actualizar el estado local temporalmente
      setCategoriasAsignadas(prev => [...prev, {
        idCategoria: categoria.idCategoria,
        nombreCategoria: categoria.nombre,
        descripcionCategoria: categoria.descripcion || '',
        genero: categoria.genero
      } as CategoriaEquipo]);

    } catch (error) {
      console.error('Error asignando categoría:', error);
      setError(error instanceof Error ? error.message : 'Error al asignar categoría');
    } finally {
      setProcesando(prev => ({ ...prev, [categoria.idCategoria]: false }));
    }
  };

  const desasignarCategoria = async (categoriaEquipo: CategoriaEquipo) => {
    try {
      setProcesando(prev => ({ ...prev, [categoriaEquipo.idCategoria]: true }));
      setError(null);

      // Por ahora solo simulamos la desasignación localmente
      // Cuando el backend implemente las relaciones, se usará equipoCategoriaService.desasignarEquipo
      console.log('Simulando desasignación de categoría:', categoriaEquipo.nombreCategoria, 'del equipo:', equipo.nombre);
      
      // Actualizar el estado local
      setCategoriasAsignadas(prev => 
        prev.filter(ca => ca.idCategoria !== categoriaEquipo.idCategoria)
      );

    } catch (error) {
      console.error('Error desasignando categoría:', error);
      setError(error instanceof Error ? error.message : 'Error al desasignar categoría');
    } finally {
      setProcesando(prev => ({ ...prev, [categoriaEquipo.idCategoria]: false }));
    }
  };

  const manejarCerrar = () => {
    setBusquedaDisponibles('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Link size={24} />
                <span>Gestionar Categorías del Equipo</span>
              </h3>
              <p className="text-gray-600 mt-1">
                Equipo: <span className="font-medium">{equipo.nombre}</span>
              </p>
            </div>
            <button
              onClick={manejarCerrar}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Aviso temporal */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              <strong>Nota:</strong> Las relaciones equipo-categoría están temporalmente simuladas hasta que el backend implemente estos endpoints.
            </p>
          </div>

          {cargando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categorías Asignadas */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Tag size={20} className="text-green-600" />
                  <h4 className="text-lg font-medium text-gray-900">
                    Categorías Asignadas ({categoriasAsignadas.length})
                  </h4>
                </div>

                {categoriasAsignadas.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay categorías asignadas</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categoriasAsignadas.map((categoriaEquipo) => (
                      <div
                        key={categoriaEquipo.idCategoria}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-green-900">
                            {categoriaEquipo.nombreCategoria}
                          </h5>
                          {categoriaEquipo.descripcionCategoria && (
                            <p className="text-sm text-green-700 mt-1">
                              {categoriaEquipo.descripcionCategoria}
                            </p>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                            {categoriaEquipo.genero === 'MASCULINO' ? '♂ Masculino' : 
                             categoriaEquipo.genero === 'FEMENINO' ? '♀ Femenino' : 
                             '⚲ Mixto'}
                          </span>
                        </div>
                        <button
                          onClick={() => desasignarCategoria(categoriaEquipo)}
                          disabled={procesando[categoriaEquipo.idCategoria]}
                          className="ml-3 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Desasignar categoría"
                        >
                          {procesando[categoriaEquipo.idCategoria] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Minus size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categorías Disponibles */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users size={20} className="text-blue-600" />
                  <h4 className="text-lg font-medium text-gray-900">
                    Categorías Disponibles ({categoriasDisponibles.length})
                  </h4>
                </div>

                {/* Búsqueda */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar categorías disponibles..."
                    value={busquedaDisponibles}
                    onChange={(e) => setBusquedaDisponibles(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {categoriasDisponibles.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      {busquedaDisponibles.trim() 
                        ? 'No se encontraron categorías disponibles' 
                        : 'Todas las categorías están asignadas'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categoriasDisponibles.map((categoria) => (
                      <div
                        key={categoria.idCategoria}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900">
                            {categoria.nombre}
                          </h5>
                          {categoria.descripcion && (
                            <p className="text-sm text-blue-700 mt-1">
                              {categoria.descripcion}
                            </p>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                            {categoria.genero === 'MASCULINO' ? '♂ Masculino' : 
                             categoria.genero === 'FEMENINO' ? '♀ Femenino' : 
                             '⚲ Mixto'}
                          </span>
                        </div>
                        <button
                          onClick={() => asignarCategoria(categoria)}
                          disabled={procesando[categoria.idCategoria]}
                          className="ml-3 p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Asignar categoría"
                        >
                          {procesando[categoria.idCategoria] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <Plus size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {categoriasAsignadas.length} categoría(s) asignada(s) de {todasLasCategorias.length} total
              </div>
              <button
                onClick={manejarCerrar}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionEquipoCategoriasModal;