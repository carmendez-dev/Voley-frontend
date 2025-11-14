import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, Search, Filter } from 'lucide-react';
import partidosService from '../../services/partidos.service';
import torneoService from '../../services/torneos.service';
import { torneoCategoriaService } from '../../services/relaciones.service';
import inscripcionesService from '../../services/inscripciones.service';
import type { Partido, ResultadoPartido } from '../../types/partido.types';
import { ResultadosPartido } from '../../types/partido.types';
import type { Torneo } from '../../types/torneo.types';
import type { TorneoCategoria } from '../../types/relaciones.types';
import type { Inscripcion } from '../../types/inscripcion.types';
import PartidoCard from './PartidoCard';
import PartidoCardSkeleton from './PartidoCardSkeleton';
import CrearPartidoModal from './CrearPartidoModal';
import DetallePartidoModal from './DetallePartidoModal';
import EditarPartidoModal from './EditarPartidoModal';
import EliminarPartidoModal from './EliminarPartidoModal';
import ComenzarPartidoModal from './ComenzarPartidoModal';
import ToastContainer from '../ui/ToastContainer';
import { useToast } from '../../hooks/useToast';

const GestionPartidos: React.FC = () => {
  // Toast notifications
  const { toasts, removeToast, success, error: showError } = useToast();
  
  // Estados principales
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroResultado, setFiltroResultado] = useState<ResultadoPartido | 'Todos'>('Todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  
  // Estados para filtros en cascada
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [categorias, setCategorias] = useState<TorneoCategoria[]>([]);
  const [equipos, setEquipos] = useState<Inscripcion[]>([]);
  const [filtroTorneoId, setFiltroTorneoId] = useState<number | null>(null);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<number | null>(null);
  const [filtroEquipoId, setFiltroEquipoId] = useState<number | null>(null);
  
  // Estados de carga para filtros en cascada
  const [loadingTorneos, setLoadingTorneos] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingEquipos, setLoadingEquipos] = useState(false);

  // Estados de modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalComenzar, setModalComenzar] = useState(false);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);

  // Cargar partidos y torneos al montar el componente
  useEffect(() => {
    cargarPartidos();
    cargarTorneos();
  }, []);
  
  // Cargar categorías cuando se selecciona un torneo
  useEffect(() => {
    if (filtroTorneoId) {
      cargarCategorias(filtroTorneoId);
      setFiltroCategoriaId(null);
      setFiltroEquipoId(null);
      setCategorias([]);
      setEquipos([]);
    } else {
      setCategorias([]);
      setEquipos([]);
      setFiltroCategoriaId(null);
      setFiltroEquipoId(null);
    }
  }, [filtroTorneoId]);
  
  // Cargar equipos cuando se selecciona una categoría
  useEffect(() => {
    if (filtroTorneoId && filtroCategoriaId) {
      cargarEquipos(filtroTorneoId, filtroCategoriaId);
      setFiltroEquipoId(null);
      setEquipos([]);
    } else {
      setEquipos([]);
      setFiltroEquipoId(null);
    }
  }, [filtroCategoriaId]);

  const cargarPartidos = async () => {
    try {
      setCargando(true);
      const data = await partidosService.obtenerPartidos();
      setPartidos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando partidos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los partidos';
      showError(errorMessage);
      setPartidos([]);
    } finally {
      setCargando(false);
    }
  };
  
  const cargarTorneos = async () => {
    setLoadingTorneos(true);
    try {
      const data = await torneoService.obtenerActivos();
      setTorneos(data);
    } catch (err) {
      console.error('Error cargando torneos:', err);
    } finally {
      setLoadingTorneos(false);
    }
  };
  
  const cargarCategorias = async (torneoId: number) => {
    setLoadingCategorias(true);
    try {
      const data = await torneoCategoriaService.obtenerCategoriasPorTorneo(torneoId);
      setCategorias(data);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    } finally {
      setLoadingCategorias(false);
    }
  };
  
  const cargarEquipos = async (torneoId: number, categoriaId: number) => {
    setLoadingEquipos(true);
    try {
      const data = await inscripcionesService.obtenerPorTorneoYCategoria(torneoId, categoriaId);
      setEquipos(data);
    } catch (err) {
      console.error('Error cargando equipos:', err);
    } finally {
      setLoadingEquipos(false);
    }
  };

  // Handlers para abrir modales
  const abrirModalCrear = () => {
    setModalCrear(true);
  };

  const handleVer = (partido: Partido) => {
    setPartidoSeleccionado(partido);
    setModalDetalle(true);
  };

  const handleEditar = (partido: Partido) => {
    setPartidoSeleccionado(partido);
    setModalEditar(true);
  };

  const handleEliminar = (partido: Partido) => {
    setPartidoSeleccionado(partido);
    setModalEliminar(true);
  };

  const handleComenzar = (partido: Partido) => {
    setPartidoSeleccionado(partido);
    setModalComenzar(true);
  };

  // Cerrar modales
  const cerrarModales = () => {
    setModalCrear(false);
    setModalDetalle(false);
    setModalEditar(false);
    setModalEliminar(false);
    setModalComenzar(false);
    setPartidoSeleccionado(null);
  };

  // Handlers de éxito que refrescan los datos
  const handlePartidoCreado = () => {
    success('Partido creado exitosamente');
    cargarPartidos();
    cerrarModales();
  };

  const handlePartidoActualizado = () => {
    success('Partido actualizado exitosamente');
    cargarPartidos();
    cerrarModales();
  };

  const handlePartidoEliminado = () => {
    success('Partido eliminado exitosamente');
    cargarPartidos();
    cerrarModales();
  };

  // Lógica de filtrado
  const partidosFiltrados = useMemo(() => {
    if (!Array.isArray(partidos)) {
      return [];
    }
    return partidos.filter((partido) => {
      // Filtro por búsqueda (nombre de equipos)
      const busquedaLower = busqueda.toLowerCase();
      const coincideBusqueda =
        busqueda === '' ||
        partido.nombreEquipoLocal.toLowerCase().includes(busquedaLower) ||
        partido.nombreEquipoVisitante.toLowerCase().includes(busquedaLower);

      if (!coincideBusqueda) return false;

      // Filtro por resultado
      const coincideResultado =
        filtroResultado === 'Todos' || partido.resultado === filtroResultado;

      if (!coincideResultado) return false;
      
      // Filtro por equipo (inscripción local)
      if (filtroEquipoId && partido.idInscripcionLocal !== filtroEquipoId) {
        return false;
      }

      // Filtro por rango de fechas
      const fechaPartido = new Date(partido.fecha);

      if (fechaDesde) {
        const desde = new Date(fechaDesde);
        if (fechaPartido < desde) return false;
      }

      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        // Agregar 23:59:59 al día seleccionado para incluir todo el día
        hasta.setHours(23, 59, 59, 999);
        if (fechaPartido > hasta) return false;
      }

      return true;
    });
  }, [partidos, busqueda, filtroResultado, filtroEquipoId, fechaDesde, fechaHasta]);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroResultado('Todos');
    setFechaDesde('');
    setFechaHasta('');
    setFiltroTorneoId(null);
    setFiltroCategoriaId(null);
    setFiltroEquipoId(null);
  };

  // Renderizar skeleton cards durante la carga
  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <PartidoCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Partidos</h1>
          <p className="text-gray-600">Administra los partidos del sistema</p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Crear Partido</span>
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="flex items-center space-x-2 text-gray-700 font-medium">
          <Filter size={20} />
          <span>Filtros</span>
        </div>

        {/* Primera fila de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda por equipos */}
          <div>
            <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar equipos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre del equipo..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Filtro por resultado */}
          <div>
            <label htmlFor="filtroResultado" className="block text-sm font-medium text-gray-700 mb-1">
              Resultado
            </label>
            <select
              id="filtroResultado"
              value={filtroResultado}
              onChange={(e) => setFiltroResultado(e.target.value as ResultadoPartido | 'Todos')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Todos">Todos</option>
              {ResultadosPartido.map((resultado) => (
                <option key={resultado} value={resultado}>
                  {resultado}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha desde */}
          <div>
            <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              id="fechaDesde"
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              id="fechaHasta"
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        {/* Segunda fila: Filtros en cascada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-200">
          {/* Filtro por Torneo */}
          <div>
            <label htmlFor="filtroTorneo" className="block text-sm font-medium text-gray-700 mb-1">
              Torneo
            </label>
            <select
              id="filtroTorneo"
              value={filtroTorneoId || ''}
              onChange={(e) => setFiltroTorneoId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loadingTorneos}
            >
              <option value="">
                {loadingTorneos ? 'Cargando torneos...' : 'Todos los torneos'}
              </option>
              {torneos.map((torneo) => (
                <option key={torneo.idTorneo} value={torneo.idTorneo}>
                  {torneo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Categoría */}
          <div>
            <label htmlFor="filtroCategoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="filtroCategoria"
              value={filtroCategoriaId || ''}
              onChange={(e) => setFiltroCategoriaId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!filtroTorneoId || loadingCategorias}
            >
              <option value="">
                {!filtroTorneoId 
                  ? 'Selecciona un torneo primero' 
                  : loadingCategorias 
                  ? 'Cargando categorías...' 
                  : 'Todas las categorías'}
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.idTorneoCategoria} value={categoria.idCategoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Equipo */}
          <div>
            <label htmlFor="filtroEquipo" className="block text-sm font-medium text-gray-700 mb-1">
              Equipo Local
            </label>
            <select
              id="filtroEquipo"
              value={filtroEquipoId || ''}
              onChange={(e) => setFiltroEquipoId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!filtroCategoriaId || loadingEquipos}
            >
              <option value="">
                {!filtroCategoriaId 
                  ? 'Selecciona una categoría primero' 
                  : loadingEquipos 
                  ? 'Cargando equipos...' 
                  : 'Todos los equipos'}
              </option>
              {equipos.map((equipo) => (
                <option key={equipo.idInscripcion} value={equipo.idInscripcion}>
                  {equipo.nombreEquipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {(busqueda || filtroResultado !== 'Todos' || fechaDesde || fechaHasta || filtroTorneoId || filtroCategoriaId || filtroEquipoId) && (
          <div className="flex justify-end">
            <button
              onClick={limpiarFiltros}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}

        {/* Contador de resultados */}
        {!cargando && (
          <div className="text-sm text-gray-600">
            Mostrando {partidosFiltrados.length} de {partidos.length} partidos
          </div>
        )}
      </div>

      {/* Grid de partidos */}
      {cargando ? (
        renderSkeletonCards()
      ) : partidos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay partidos registrados</h3>
          <p className="text-gray-500 mb-4">
            Comienza creando tu primer partido para gestionar los encuentros deportivos.
          </p>
          <button
            onClick={abrirModalCrear}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Crear Primer Partido</span>
          </button>
        </div>
      ) : partidosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron partidos</h3>
          <p className="text-gray-500 mb-4">
            No hay partidos que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.
          </p>
          <button
            onClick={limpiarFiltros}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partidosFiltrados.map((partido) => (
            <PartidoCard
              key={partido.idPartido}
              partido={partido}
              onVer={handleVer}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onComenzar={handleComenzar}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      {modalCrear && (
        <CrearPartidoModal
          onClose={cerrarModales}
          onSuccess={handlePartidoCreado}
        />
      )}

      <DetallePartidoModal
        partido={partidoSeleccionado}
        isOpen={modalDetalle}
        onClose={cerrarModales}
      />

      <EditarPartidoModal
        partido={partidoSeleccionado}
        isOpen={modalEditar}
        onClose={cerrarModales}
        onSuccess={handlePartidoActualizado}
      />

      <EliminarPartidoModal
        partido={partidoSeleccionado}
        isOpen={modalEliminar}
        onClose={cerrarModales}
        onSuccess={handlePartidoEliminado}
      />

      <ComenzarPartidoModal
        partido={partidoSeleccionado}
        isOpen={modalComenzar}
        onClose={cerrarModales}
        onPartidoActualizado={cargarPartidos}
      />
    </div>
  );
};

export default GestionPartidos;
