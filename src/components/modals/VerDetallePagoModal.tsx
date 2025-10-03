import React, { useEffect } from 'react';
import { X, Calendar, DollarSign, CreditCard, FileText, User, Image as ImageIcon } from 'lucide-react';
import type { Pago } from '../../types';
import EstadoBadge from '../EstadoBadge';

interface VerDetallePagoModalProps {
  pago: Pago;
  nombreUsuario: string;
  onClose: () => void;
}

const VerDetallePagoModal: React.FC<VerDetallePagoModalProps> = ({ pago, nombreUsuario, onClose }) => {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    const scrollY = window.scrollY;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const formatPeriodo = (pago: Pago): string => {
    if (pago.periodo) {
      return pago.periodo;
    }
    if (pago.periodoMes !== undefined && pago.periodoAnio !== undefined) {
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return `${meses[pago.periodoMes - 1]} ${pago.periodoAnio}`;
    }
    return 'N/A';
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">Detalle del Pago</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {pago.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Estado del Pago</h3>
            <EstadoBadge estado={pago.estado} />
          </div>

          {/* Información del Usuario */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Información del Usuario</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-blue-700 font-medium">Nombre</p>
                <p className="text-base text-blue-900">{nombreUsuario}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">ID Usuario</p>
                <p className="text-base text-blue-900">{pago.usuarioId}</p>
              </div>
            </div>
          </div>

          {/* Detalles del Pago */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Detalles del Pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Período */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Período</p>
                  <p className="text-base font-medium text-gray-900">{formatPeriodo(pago)}</p>
                </div>
              </div>

              {/* Monto */}
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Monto</p>
                  <p className="text-base font-medium text-gray-900">{formatMonto(pago.monto)}</p>
                </div>
              </div>

              {/* Método de Pago */}
              {pago.metodoPago && (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Método de Pago</p>
                    <p className="text-base font-medium text-gray-900 capitalize">{pago.metodoPago}</p>
                  </div>
                </div>
              )}

              {/* Fecha de Vencimiento */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Vencimiento</p>
                  <p className="text-base font-medium text-gray-900">{formatFecha(pago.fechaVencimiento)}</p>
                </div>
              </div>

              {/* Fecha de Pago */}
              {pago.fechaPago && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Pago</p>
                    <p className="text-base font-medium text-gray-900">{formatFecha(pago.fechaPago)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          {pago.observaciones && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-yellow-700" />
                <h3 className="text-base font-semibold text-yellow-900">Observaciones</h3>
              </div>
              <p className="text-sm text-yellow-800">{pago.observaciones}</p>
            </div>
          )}

          {/* Comprobante */}
          {pago.comprobante && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-semibold text-gray-900">Comprobante de Pago</h3>
              </div>
              
              {/* Mostrar imagen si es una URL de imagen */}
              {(pago.comprobante.match(/\.(jpg|jpeg|png|gif|webp)$/i) || pago.comprobante.startsWith('uploads/')) ? (
                <div className="space-y-3">
                  <img
                    src={`http://localhost:8080/${pago.comprobante}`}
                    alt="Comprobante de pago"
                    className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-300 shadow-md"
                    onError={(e) => {
                      // Si la imagen no carga, mostrar mensaje
                      (e.target as HTMLImageElement).style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-4 text-center';
                      errorDiv.innerHTML = `
                        <p class="text-sm text-red-600">No se pudo cargar la imagen</p>
                        <p class="text-xs text-red-500 mt-1">Ruta: ${pago.comprobante}</p>
                      `;
                      (e.target as HTMLImageElement).parentNode?.appendChild(errorDiv);
                    }}
                  />
                  <div className="text-center">
                    <a
                      href={`http://localhost:8080/${pago.comprobante}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Ver imagen en tamaño completo
                    </a>
                  </div>
                </div>
              ) : (
                // Si no es imagen, mostrar como texto/enlace
                <div className="bg-white rounded border border-gray-300 p-3">
                  <p className="text-sm text-gray-700 break-all">{pago.comprobante}</p>
                </div>
              )}
            </div>
          )}

          {/* Fechas del Sistema */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Información del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Fecha de Creación</p>
                <p className="text-gray-700">{formatFecha(pago.fechaCreacion || null)}</p>
              </div>
              <div>
                <p className="text-gray-500">Última Actualización</p>
                <p className="text-gray-700">{formatFecha(pago.fechaActualizacion || null)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerDetallePagoModal;
