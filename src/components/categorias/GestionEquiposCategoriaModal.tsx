import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Search, Users, UserCheck } from 'lucide-react';
import { categoriaEquipoService, equipoService } from '../../services/api';
import type { Categoria, Equipo, EquipoCategoria } from '../../types';

interface GestionEquiposCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: Categoria;
}

const GestionEquiposCategoriaModal: React.FC<GestionEquiposCategoriaModalProps> = ({
  isOpen,
  onClose,
  categoria
}) => {
  const [equiposAsignados, setEquiposAsignados] = useState<EquipoCategoria[]>([]);
  const [todosLosEquipos, setTodosLosEquipos] = useState<Equipo[]>([]);
  const [equiposDisponibles, setEquiposDisponibles] = useState<Equipo[]>([]);
  const [busquedaDisponibles, setBusquedaDisponibles] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen, categoria.idCategoria]);

  useEffect(() => {
    filtrarEquiposDisponibles();
  }, [todosLosEquipos, equiposAsignados, busquedaDisponibles]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const [equipos, equiposAsignadosData] = await Promise.all([
        equipoService.obtenerTodos(),
        categoriaEquipoService.obtenerEquiposPorCategoria(categoria.idCategoria)
      ]);

      setTodosLosEquipos(equipos);
      setEquiposAsignados(equiposAsignadosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  const filtrarEquiposDisponibles = () => {
    const idsAsignados = new Set(equiposAsignados.map(ea => ea.idEquipo));
    
    let disponibles = todosLosEquipos.filter(equipo => 
      !idsAsignados.has(equipo.idEquipo)
    );

    if (busquedaDisponibles.trim()) {
      const busqueda = busquedaDisponibles.toLowerCase().trim();
      disponibles = disponibles.filter(equipo =>
        equipo.nombre.toLowerCase().includes(busqueda) ||
        (equipo.descripcion && equipo.descripcion.toLowerCase().includes(busqueda))
      );
    }

    setEquiposDisponibles(disponibles);
  };

  const asignarEquipo = async (equipo: Equipo) => {
    try {
      setProcesando(prev => ({ ...prev, [equipo.idEquipo]: true }));
      setError(null);

      await categoriaEquipoService.asignarEquipo(categoria.idCategoria, equipo.idEquipo);
      
      // Actualizar el estado local
      setEquiposAsignados(prev => [...prev, {
        idEquipo: equipo.idEquipo,
        nombreEquipo: equipo.nombre,
        descripcion: equipo.descripcion || '',
        idCategoria: categoria.idCategoria,
        nombreCategoria: categoria.nombre
      }]);

    } catch (error) {
      console.error('Error asignando equipo:', error);
      setError(error instanceof Error ? error.message : 'Error al asignar equipo');
    } finally {
      setProcesando(prev => ({ ...prev, [equipo.idEquipo]: false }));
    }
  };

  const desasignarEquipo = async (equipoAsignado: EquipoCategoria) => {
    try {
      setProcesando(prev => ({ ...prev, [equipoAsignado.idEquipo]: true }));
      setError(null);

      await categoriaEquipoService.desasignarEquipo(categoria.idCategoria, equipoAsignado.idEquipo);
      
      // Actualizar el estado local
      setEquiposAsignados(prev => 
        prev.filter(ea => ea.idEquipo !== equipoAsignado.idEquipo)
      );

    } catch (error) {
      console.error('Error desasignando equipo:', error);
      setError(error instanceof Error ? error.message : 'Error al desasignar equipo');
    } finally {
      setProcesando(prev => ({ ...prev, [equipoAsignado.idEquipo]: false }));
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
                <UserCheck size={24} />
                <span>Gestionar Equipos de la Categoría</span>
              </h3>
              <p className="text-gray-600 mt-1">
                Categoría: <span className="font-medium">{categoria.nombre}</span>
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

          {cargando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Equipos Asignados */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <UserCheck size={20} className="text-green-600" />
                  <h4 className="text-lg font-medium text-gray-900">
                    Equipos Asignados ({equiposAsignados.length})
                  </h4>
                </div>

                {equiposAsignados.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <UserCheck size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay equipos asignados a esta categoría</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {equiposAsignados.map((equipoAsignado) => (
                      <div
                        key={equipoAsignado.idEquipo}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-green-900">
                            {equipoAsignado.nombreEquipo}
                          </h5>
                          {equipoAsignado.descripcion && (
                            <p className="text-sm text-green-700 mt-1">
                              {equipoAsignado.descripcion}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => desasignarEquipo(equipoAsignado)}
                          disabled={procesando[equipoAsignado.idEquipo]}
                          className="ml-3 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Desasignar equipo"
                        >
                          {procesando[equipoAsignado.idEquipo] ? (
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

              {/* Equipos Disponibles */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users size={20} className="text-blue-600" />
                  <h4 className="text-lg font-medium text-gray-900">
                    Equipos Disponibles ({equiposDisponibles.length})
                  </h4>
                </div>

                {/* Búsqueda */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar equipos disponibles..."
                    value={busquedaDisponibles}
                    onChange={(e) => setBusquedaDisponibles(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {equiposDisponibles.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      {busquedaDisponibles.trim() 
                        ? 'No se encontraron equipos disponibles' 
                        : 'Todos los equipos están asignados a esta categoría'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {equiposDisponibles.map((equipo) => (
                      <div
                        key={equipo.idEquipo}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900">
                            {equipo.nombre}
                          </h5>
                          {equipo.descripcion && (
                            <p className="text-sm text-blue-700 mt-1">
                              {equipo.descripcion}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => asignarEquipo(equipo)}
                          disabled={procesando[equipo.idEquipo]}
                          className="ml-3 p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Asignar equipo"
                        >
                          {procesando[equipo.idEquipo] ? (
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
                {equiposAsignados.length} equipo(s) asignado(s) de {todosLosEquipos.length} total
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

export default GestionEquiposCategoriaModal;