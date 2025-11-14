import React, { useState, useEffect } from 'react';
import { Plus, Search, UserCheck, Loader2 } from 'lucide-react';
import profesoresService from '../../services/profesores.service';
import type { Profesor, EstadoProfesor } from '../../types/profesor.types';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../ui/ToastContainer';
import ProfesorCard from './ProfesorCard';
import CrearProfesorModal from './CrearProfesorModal';
import EditarProfesorModal from './EditarProfesorModal';
import EliminarProfesorModal from './EliminarProfesorModal';
import CambiarPasswordModal from './CambiarPasswordModal';

const GestionProfesores: React.FC = () => {
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoProfesor | 'Todos'>('Todos');
  
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<Profesor | null>(null);

  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = async () => {
    try {
      setCargando(true);
      const data = await profesoresService.obtenerTodos();
      setProfesores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando profesores:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los profesores';
      showError(errorMessage);
      setProfesores([]);
    } finally {
      setCargando(false);
    }
  };

  const profesoresFiltrados = profesores.filter((profesor) => {
    const coincideBusqueda =
      busqueda === '' ||
      profesor.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      profesor.cedula?.toLowerCase().includes(busqueda.toLowerCase()) ||
      profesor.email?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado = filtroEstado === 'Todos' || profesor.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const handleEditar = (profesor: Profesor) => {
    setProfesorSeleccionado(profesor);
    setModalEditar(true);
  };

  const handleEliminar = (profesor: Profesor) => {
    setProfesorSeleccionado(profesor);
    setModalEliminar(true);
  };

  const handleCambiarPassword = (profesor: Profesor) => {
    setProfesorSeleccionado(profesor);
    setModalPassword(true);
  };

  const cerrarModales = () => {
    setModalCrear(false);
    setModalEditar(false);
    setModalEliminar(false);
    setModalPassword(false);
    setProfesorSeleccionado(null);
  };

  const handleProfesorCreado = () => {
    success('Profesor creado exitosamente');
    cargarProfesores();
    cerrarModales();
  };

  const handleProfesorActualizado = () => {
    success('Profesor actualizado exitosamente');
    cargarProfesores();
    cerrarModales();
  };

  const handleProfesorEliminado = () => {
    success('Profesor eliminado exitosamente');
    cargarProfesores();
    cerrarModales();
  };

  const handlePasswordCambiado = () => {
    success('Contraseña actualizada exitosamente');
    cerrarModales();
  };

  if (cargando) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="text-gray-600">Cargando profesores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesores</h1>
          <p className="text-gray-600">Administra los profesores del sistema</p>
        </div>
        <button
          onClick={() => setModalCrear(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Crear Profesor</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, cédula o email..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="filtroEstado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="filtroEstado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as EstadoProfesor | 'Todos')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Mostrando {profesoresFiltrados.length} de {profesores.length} profesores
        </div>
      </div>

      {profesores.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <UserCheck size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay profesores registrados</h3>
          <p className="text-gray-500 mb-4">
            Comienza creando tu primer profesor.
          </p>
          <button
            onClick={() => setModalCrear(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Crear Primer Profesor</span>
          </button>
        </div>
      ) : profesoresFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron profesores</h3>
          <p className="text-gray-500">
            No hay profesores que coincidan con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profesoresFiltrados.map((profesor) => (
            <ProfesorCard
              key={profesor.idProfesor}
              profesor={profesor}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onCambiarPassword={handleCambiarPassword}
            />
          ))}
        </div>
      )}

      {modalCrear && (
        <CrearProfesorModal
          onClose={cerrarModales}
          onSuccess={handleProfesorCreado}
        />
      )}

      <EditarProfesorModal
        profesor={profesorSeleccionado}
        isOpen={modalEditar}
        onClose={cerrarModales}
        onSuccess={handleProfesorActualizado}
      />

      <EliminarProfesorModal
        profesor={profesorSeleccionado}
        isOpen={modalEliminar}
        onClose={cerrarModales}
        onSuccess={handleProfesorEliminado}
      />

      <CambiarPasswordModal
        profesor={profesorSeleccionado}
        isOpen={modalPassword}
        onClose={cerrarModales}
        onSuccess={handlePasswordCambiado}
      />
    </div>
  );
};

export default GestionProfesores;
