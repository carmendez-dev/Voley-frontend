import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Calendar } from 'lucide-react';
import { rosterService } from '../../services';
import type { RosterJugador } from '../../types';

const InscripcionesJugador: React.FC = () => {
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();

  const [inscripciones, setInscripciones] = useState<RosterJugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idUsuario) {
      cargarInscripciones();
    }
  }, [idUsuario]);

  const cargarInscripciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rosterService.obtenerPorUsuario(Number(idUsuario));
      setInscripciones(data);
    } catch (error) {
      console.error('Error cargando inscripciones:', error);
      setError('Error al cargar las inscripciones');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const nombreJugador = inscripciones.length > 0 ? inscripciones[0].nombreJugador : 'Jugador';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inscripciones de {nombreJugador}</h1>
          <p className="text-gray-600">Historial de participación en torneos</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de Inscripciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Trophy size={20} />
            <span>Inscripciones ({inscripciones.length})</span>
          </h2>
        </div>

        {inscripciones.length === 0 ? (
          <div className="text-center py-12">
            <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay inscripciones registradas
            </h3>
            <p className="text-gray-500">
              Este jugador aún no está inscrito en ningún torneo
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {inscripciones.map((inscripcion) => (
              <div
                key={inscripcion.idRoster}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Trophy className="text-indigo-600" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inscripcion.nombreTorneo}
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Equipo:</strong> {inscripcion.nombreEquipo}
                      </p>
                      <p>
                        <strong>Categoría:</strong> {inscripcion.nombreCategoria}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>
                          Inscrito el {new Date(inscripcion.fechaRegistro).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/roster/inscripciones/${inscripcion.idInscripcion}`)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Ver Roster →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InscripcionesJugador;
