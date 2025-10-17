import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Link } from 'lucide-react';
import { torneoCategoriaService, categoriaService } from '../../services/api';
import type { 
  Torneo, 
  TorneoCategoria, 
  Categoria 
} from '../../types';

interface GestionTorneoCategoriaModalProps {
  torneo: Torneo;
  onClose: () => void;
  onSuccess: () => void;
}

const GestionTorneoCategoriaModal: React.FC<GestionTorneoCategoriaModalProps> = ({
  torneo,
  onClose,
  onSuccess
}) => {
  const [categoriasTorneo, setCategoriasTorneo] = useState<TorneoCategoria[]>([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAgregarForm, setShowAgregarForm] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [procesando, setProcesando] = useState(false);

  // Manejar ESC y prevenir scroll del body
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Manejar click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Cargar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar categorías del torneo
      const categoriasDelTorneo = await torneoCategoriaService.obtenerCategoriasPorTorneo(torneo.idTorneo);
      setCategoriasTorneo(categoriasDelTorneo);
      
      // Cargar todas las categorías para mostrar disponibles
      const todasCategorias = await categoriaService.obtenerTodas();
      
      // Filtrar categorías que no están asociadas al torneo
      const idsAsociadas = categoriasDelTorneo.map(c => c.idCategoria);
      const disponibles = todasCategorias.filter(c => !idsAsociadas.includes(c.idCategoria));
      setCategoriasDisponibles(disponibles);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [torneo.idTorneo]);

  // Asociar categoría
  const handleAsociarCategoria = async () => {
    if (!categoriaSeleccionada) return;
    
    try {
      setProcesando(true);
      await torneoCategoriaService.asociarCategoriaATorneo(torneo.idTorneo, categoriaSeleccionada);
      
      // Recargar datos
      await cargarDatos();
      setShowAgregarForm(false);
      setCategoriaSeleccionada(null);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asociar categoría');
    } finally {
      setProcesando(false);
    }
  };

  // Desasociar categoría
  const handleDesasociarCategoria = async (categoriaId: number, nombreCategoria: string) => {
    if (!confirm(`¿Estás seguro de desasociar la categoría "${nombreCategoria}" del torneo "${torneo.nombre}"?`)) {
      return;
    }
    
    try {
      setProcesando(true);
      await torneoCategoriaService.desasociarCategoriaDelTorneo(torneo.idTorneo, categoriaId);
      
      // Recargar datos
      await cargarDatos();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desasociar categoría');
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Cargando categorías...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Link className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gestionar Categorías del Torneo</h2>
              <p className="text-sm text-gray-600">
                {torneo.nombre} - ID: #{torneo.idTorneo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Información del torneo */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Información del Torneo</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div><strong>Nombre:</strong> {torneo.nombre}</div>
              <div><strong>Estado:</strong> {torneo.estado}</div>
              <div><strong>Fecha Inicio:</strong> {torneo.fechaInicio || 'No definida'}</div>
              <div><strong>Fecha Fin:</strong> {torneo.fechaFin || 'No definida'}</div>
            </div>
          </div>

          {/* Categorías asociadas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 text-gray-600 mr-2" />
                Categorías Asociadas ({categoriasTorneo.length})
              </h3>
              <button
                onClick={() => setShowAgregarForm(!showAgregarForm)}
                className="btn-primary flex items-center space-x-2"
                disabled={procesando || categoriasDisponibles.length === 0}
              >
                <Plus className="h-4 w-4" />
                <span>Asociar Categoría</span>
              </button>
            </div>

            {/* Form para agregar categoría */}
            {showAgregarForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Asociar Nueva Categoría</h4>
                {categoriasDisponibles.length === 0 ? (
                  <p className="text-gray-600 text-sm">
                    No hay categorías disponibles para asociar.
                  </p>
                ) : (
                  <div className="flex items-center space-x-3">
                    <select
                      value={categoriaSeleccionada || ''}
                      onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
                      className="input-field flex-1"
                    >
                      <option value="">Selecciona una categoría...</option>
                      {categoriasDisponibles.map((categoria) => (
                        <option key={categoria.idCategoria} value={categoria.idCategoria}>
                          {categoria.nombre} ({categoria.genero})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAsociarCategoria}
                      className="btn-primary"
                      disabled={!categoriaSeleccionada || procesando}
                    >
                      {procesando ? 'Asociando...' : 'Asociar'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAgregarForm(false);
                        setCategoriaSeleccionada(null);
                      }}
                      className="btn-outline"
                      disabled={procesando}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Lista de categorías asociadas */}
            {categoriasTorneo.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">No hay categorías asociadas</p>
                <p className="text-sm">Asocia categorías para organizar el torneo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoriasTorneo.map((categoria) => (
                  <div 
                    key={categoria.idCategoria} 
                    className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {categoria.nombre}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>ID:</strong> #{categoria.idCategoria}</p>
                          <p><strong>Torneo:</strong> {categoria.nombreTorneo}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDesasociarCategoria(categoria.idCategoria, categoria.nombre)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Desasociar categoría"
                        disabled={procesando}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pie del modal */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {categoriasTorneo.length} categoría{categoriasTorneo.length !== 1 ? 's' : ''} asociada{categoriasTorneo.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionTorneoCategoriaModal;