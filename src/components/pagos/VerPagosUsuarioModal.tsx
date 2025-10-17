import React, { useState, useEffect } from 'react';
import { X, User, DollarSign, Calendar, CreditCard, Edit, Trash2, Eye } from 'lucide-react';
import { pagoService } from '../../services/api';
import type { Pago } from '../../types';
import EstadoBadge from '../shared/EstadoBadge';

interface VerPagosUsuarioModalProps {
  cedulaUsuario: string; // Aunque se llama cedulaUsuario, ahora recibe el ID
  onClose: () => void;
  onEditarPago?: (pago: Pago) => void;
  onEliminarPago?: (pagoId: number) => void;
  onVerDetalle?: (pago: Pago) => void;
}

const VerPagosUsuarioModal: React.FC<VerPagosUsuarioModalProps> = ({ 
  cedulaUsuario, 
  onClose, 
  onEditarPago, 
  onEliminarPago,
  onVerDetalle
}) => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    // Guardar posición actual del scroll
    const scrollY = window.scrollY;
    
    // Bloquear scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Limpiar al desmontar
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      // Restaurar posición del scroll
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cedulaUsuario]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Usar el ID del usuario para obtener sus pagos
      const usuarioId = parseInt(cedulaUsuario);
      const pagosFiltrados = await pagoService.obtenerPagosPorUsuario(usuarioId);
      setPagos(pagosFiltrados);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(amount);
  };

  const formatPeriodo = (pago: Pago) => {
    // Si tiene el campo 'periodo' como string (nuevo formato del endpoint /usuario/{id})
    if ('periodo' in pago && typeof (pago as any).periodo === 'string') {
      const [mes, anio] = (pago as any).periodo.split('/');
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${meses[parseInt(mes) - 1]} ${anio}`;
    }
    // Si tiene periodoMes y periodoAnio separados (formato antiguo)
    if (pago.periodoMes && pago.periodoAnio) {
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${meses[pago.periodoMes - 1]} ${pago.periodoAnio}`;
    }
    return 'N/A';
  };

  const handleEditarPago = (pago: Pago) => {
    if (onEditarPago) {
      onEditarPago(pago);
      onClose();
    }
  };

  const handleEliminarPago = async (pagoId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      try {
        await pagoService.eliminarPago(pagoId);
        // Recargar datos después de eliminar
        await cargarDatos();
        if (onEliminarPago) {
          onEliminarPago(pagoId);
        }
      } catch (error) {
        console.error('Error al eliminar pago:', error);
        alert('Error al eliminar el pago. Inténtalo de nuevo.');
      }
    }
  };

  // Calcular estadísticas
  const estadisticas = {
    totalPagos: pagos.length,
    pagosPagados: pagos.filter(p => p.estado === 'pagado').length,
    pagosPendientes: pagos.filter(p => p.estado === 'pendiente').length,
    pagosAtrasados: pagos.filter(p => p.estado === 'atraso').length,
    montoTotal: pagos.reduce((sum, p) => sum + p.monto, 0),
    montoPagado: pagos.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.monto, 0),
    montoPendiente: pagos.filter(p => p.estado !== 'pagado').reduce((sum, p) => sum + p.monto, 0),
  };

  const nombreUsuario = pagos[0]?.usuarioNombre || 'Usuario';
  const emailUsuario = pagos[0]?.usuario?.email || '';

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full m-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold text-primary">Error</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-primary">Pagos del Usuario</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información del Usuario */}
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-primary" />
              <div>
                <h4 className="text-lg font-semibold text-primary">{nombreUsuario}</h4>
                <p className="text-gray-600">{emailUsuario}</p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h5 className="font-semibold text-gray-700">Total Pagos</h5>
              <p className="text-xl font-bold text-blue-600">{estadisticas.totalPagos}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
              <h5 className="font-semibold text-gray-700">Pagados</h5>
              <p className="text-xl font-bold text-green-600">{estadisticas.pagosPagados}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              </div>
              <h5 className="font-semibold text-gray-700">Pendientes</h5>
              <p className="text-xl font-bold text-yellow-600">{estadisticas.pagosPendientes}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              </div>
              <h5 className="font-semibold text-gray-700">Atrasados</h5>
              <p className="text-xl font-bold text-red-600">{estadisticas.pagosAtrasados}</p>
            </div>
          </div>

          {/* Resumen de Montos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h5 className="font-semibold text-gray-700">Monto Total</h5>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(estadisticas.montoTotal)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <h5 className="font-semibold text-gray-700">Monto Pagado</h5>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(estadisticas.montoPagado)}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <h5 className="font-semibold text-gray-700">Monto Pendiente</h5>
              <p className="text-xl font-bold text-yellow-600">
                {formatCurrency(estadisticas.montoPendiente)}
              </p>
            </div>
          </div>

          {/* Lista de Pagos */}
          <div>
            <h5 className="text-lg font-semibold text-primary mb-4">Historial de Pagos</h5>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pagos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay pagos registrados para este usuario
                </div>
              ) : (
                pagos.map((pago) => (
                  <div key={pago.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{formatPeriodo(pago)}</span>
                          <EstadoBadge estado={pago.estado} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Monto:</span> {formatCurrency(pago.monto)}
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-1" />
                            <span className="font-medium">Fecha:</span> {new Date(pago.fechaRegistro).toLocaleDateString()}
                          </div>
                        </div>
                        {pago.comprobante && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-gray-700">Comprobante:</span> {pago.comprobante}
                          </div>
                        )}
                        {pago.observaciones && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-gray-700">Observaciones:</span> {pago.observaciones}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {pago.estado === 'pagado' && onVerDetalle ? (
                          // Si el pago está pagado, mostrar botón "Ver" en lugar de "Editar"
                          <button
                            onClick={() => onVerDetalle(pago)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Ver detalle completo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          // Si no está pagado, mostrar botón "Editar"
                          <button
                            onClick={() => handleEditarPago(pago)}
                            className="text-secondary hover:text-secondary/80 p-1"
                            title="Editar pago"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEliminarPago(pago.id)}
                          className="text-accent hover:text-accent/80 p-1"
                          title="Eliminar pago"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Botón cerrar */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerPagosUsuarioModal;