import React, { useState, useEffect } from 'react';
import { X, Download, Printer, Users } from 'lucide-react';
import type { Inscripcion } from '../../types';

interface RosterEquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscripcion: Inscripcion;
}

// Tipo para jugador según el backend
interface Jugador {
  idRoster: number;
  idInscripcion: number;
  idUsuario: number;
  fechaRegistro: string;
  nombreJugador: string;
  emailJugador: string;
  nombreEquipo: string;
  nombreTorneo: string;
  nombreCategoria: string;
}

interface RosterResponse {
  total: number;
  data: Jugador[];
  success: boolean;
  message: string;
  timestamp: string;
}

const RosterEquipoModal: React.FC<RosterEquipoModalProps> = ({
  isOpen,
  onClose,
  inscripcion
}) => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarJugadores();
    }
  }, [isOpen, inscripcion.idEquipo]);

  const cargarJugadores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamar al endpoint real
      const response = await fetch(`http://localhost:8080/api/roster/inscripciones/${inscripcion.idInscripcion}`);
      const data: RosterResponse = await response.json();
      
      if (data.success) {
        setJugadores(data.data);
      } else {
        setError(data.message || 'Error al cargar los jugadores');
      }
    } catch (error) {
      console.error('Error cargando jugadores:', error);
      setError('Error al cargar los jugadores del equipo');
    } finally {
      setLoading(false);
    }
  };

  const obtenerAnioActual = (): number => {
    return new Date().getFullYear();
  };

  const generarContenidoHTML = (): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Roster - ${inscripcion.nombreEquipo}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #4F46E5;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #4F46E5;
            margin: 0 0 10px 0;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
          }
          .info-section {
            background: #F3F4F6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
          }
          .info-section p {
            margin: 5px 0;
            font-size: 14px;
          }
          .info-section strong {
            color: #4F46E5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #4F46E5;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 13px;
          }
          tr:nth-child(even) {
            background-color: #F9FAFB;
          }
          tr:hover {
            background-color: #F3F4F6;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #9CA3AF;
            border-top: 1px solid #E5E7EB;
            padding-top: 20px;
          }
          .total {
            text-align: right;
            margin-top: 15px;
            font-weight: bold;
            color: #4F46E5;
            font-size: 14px;
          }
          @media print {
            body {
              padding: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ROSTER DE EQUIPO</h1>
          <p>Sistema de Gestión de Voleibol</p>
        </div>
        
        <div class="info-section">
          <p><strong>Año:</strong> ${obtenerAnioActual()}</p>
          <p><strong>Torneo:</strong> ${jugadores.length > 0 ? jugadores[0].nombreTorneo : inscripcion.nombreTorneo}</p>
          <p><strong>Categoría:</strong> ${jugadores.length > 0 ? jugadores[0].nombreCategoria : inscripcion.nombreCategoria}</p>
          <p><strong>Equipo:</strong> ${jugadores.length > 0 ? jugadores[0].nombreEquipo : inscripcion.nombreEquipo}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 10%;">#</th>
              <th style="width: 50%;">Nombre del Jugador</th>
              <th style="width: 40%;">Email</th>
            </tr>
          </thead>
          <tbody>
            ${jugadores.map((jugador, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${jugador.nombreJugador}</td>
                <td>${jugador.emailJugador}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          Total de jugadores: ${jugadores.length}
        </div>

        <div class="footer">
          <p>Documento generado el ${new Date().toLocaleString()}</p>
          <p>Sistema de Gestión de Voleibol © 2025</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleDescargarPDF = () => {
    const contenidoHTML = generarContenidoHTML();
    const ventana = window.open('', '_blank');
    
    if (ventana) {
      ventana.document.write(contenidoHTML);
      ventana.document.close();
      
      // Esperar a que se cargue el contenido
      ventana.onload = () => {
        ventana.print();
        // Cerrar la ventana después de imprimir/cancelar
        ventana.onafterprint = () => {
          ventana.close();
        };
      };
    }
  };

  const handleImprimir = () => {
    const contenidoHTML = generarContenidoHTML();
    const ventana = window.open('', '_blank');
    
    if (ventana) {
      ventana.document.write(contenidoHTML);
      ventana.document.close();
      
      ventana.onload = () => {
        ventana.print();
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="text-indigo-600" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Roster del Equipo</h2>
              <p className="text-sm text-gray-600">{inscripcion.nombreEquipo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Información del equipo */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Año</p>
                <p className="font-semibold text-gray-900">{obtenerAnioActual()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Torneo</p>
                <p className="font-semibold text-gray-900">
                  {jugadores.length > 0 ? jugadores[0].nombreTorneo : inscripcion.nombreTorneo}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Categoría</p>
                <p className="font-semibold text-gray-900">
                  {jugadores.length > 0 ? jugadores[0].nombreCategoria : inscripcion.nombreCategoria}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Equipo</p>
                <p className="font-semibold text-gray-900">
                  {jugadores.length > 0 ? jugadores[0].nombreEquipo : inscripcion.nombreEquipo}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 mb-6">
            <button
              onClick={handleDescargarPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={loading || jugadores.length === 0}
            >
              <Download size={18} />
              <span>Guardar PDF</span>
            </button>
            <button
              onClick={handleImprimir}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading || jugadores.length === 0}
            >
              <Printer size={18} />
              <span>Imprimir</span>
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Tabla de jugadores */}
              {jugadores.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay jugadores</h3>
                  <p className="text-gray-500">Este equipo aún no tiene jugadores registrados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre del Jugador
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jugadores.map((jugador, index) => (
                        <tr key={jugador.idRoster} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {jugador.nombreJugador}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {jugador.emailJugador}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mt-4 text-right text-sm font-semibold text-gray-700">
                    Total de jugadores: {jugadores.length}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RosterEquipoModal;
