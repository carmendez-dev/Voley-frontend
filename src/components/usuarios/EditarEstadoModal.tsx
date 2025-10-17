import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { pagoService, uploadService } from '../../services/api';
import type { Pago, PagoProcesarRequest } from '../../types';
import EstadoBadge from '../shared/EstadoBadge';

interface EditarEstadoModalProps {
  pago: Pago;
  onClose: () => void;
  onSuccess: () => void;
}

type EstadoPago = 'pendiente' | 'pagado' | 'atraso' | 'rechazado';

const EditarEstadoModal: React.FC<EditarEstadoModalProps> = ({ pago, onClose, onSuccess }) => {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPago>(pago.estado as EstadoPago);
  const [metodoPago, setMetodoPago] = useState('');
  const [comprobante, setComprobante] = useState(pago.comprobante || '');
  const [archivoComprobante, setArchivoComprobante] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [observaciones, setObservaciones] = useState(pago.observaciones || '');
  const [loading, setLoading] = useState(false);
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

  // Limpiar preview URL cuando se desmonta el componente
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let rutaComprobante = comprobante;

      // Si hay un archivo de imagen, subirlo primero
      if (archivoComprobante) {
        console.log('📤 Subiendo archivo al servidor...');
        try {
          // ✅ PASO 1: Subir archivo al servidor con los datos del pago
          const datosPagoParaUpload = {
            usuarioId: pago.usuarioId,
            monto: pago.monto,
            periodoMes: pago.periodoMes,
            periodoAnio: pago.periodoAnio,
            estado: nuevoEstado,
            metodoPago: metodoPago || 'efectivo',
            observaciones: observaciones || ''
          };
          rutaComprobante = await uploadService.subirComprobante(archivoComprobante, pago.id, datosPagoParaUpload);
          console.log('✅ Archivo subido exitosamente. Ruta:', rutaComprobante);
        } catch (uploadError: any) {
          console.error('❌ Error al subir archivo:', uploadError);
          throw new Error(uploadError.response?.data?.message || 'Error al subir el comprobante');
        }
      }

      if (nuevoEstado === 'pagado') {
        // ✅ PASO 2: Procesar pago con la ruta del comprobante
        console.log('💳 Procesando pago con comprobante:', rutaComprobante);
        const datosPago: PagoProcesarRequest = {
          monto: pago.monto,
          metodoPago: metodoPago || 'efectivo',
          comprobante: rutaComprobante || undefined,
          observaciones: observaciones || undefined
        };
        await pagoService.procesarPago(pago.id, datosPago);
        console.log('✅ Pago procesado exitosamente');
      } else {
        // Actualizar otros campos
        await pagoService.actualizarPago(pago.id, {
          observaciones: observaciones || undefined
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }

      setArchivoComprobante(file);
      setError('');
      
      // Crear preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const eliminarArchivo = () => {
    setArchivoComprobante(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(amount);
  };

  const formatPeriodo = (pago: Pago) => {
    // Si tiene el campo 'periodo' como string
    if ('periodo' in pago && typeof (pago as any).periodo === 'string') {
      const [mes, anio] = (pago as any).periodo.split('/');
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${meses[parseInt(mes) - 1]} ${anio}`;
    }
    // Si tiene periodoMes y periodoAnio separados
    if (pago.periodoMes && pago.periodoAnio) {
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${meses[pago.periodoMes - 1]} ${pago.periodoAnio}`;
    }
    return 'N/A';
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full m-4 my-8 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
          <h3 className="text-xl font-semibold text-primary">Editar Estado del Pago</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Información del pago */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-gray-700">Información del Pago</h4>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">Usuario:</span> {pago.usuarioNombre || 'No disponible'}</p>
              <p><span className="font-medium">Período:</span> {formatPeriodo(pago)}</p>
              <p><span className="font-medium">Monto:</span> {formatCurrency(pago.monto)}</p>
              <p><span className="font-medium">Estado actual:</span> <EstadoBadge estado={pago.estado} /></p>
              <p><span className="font-medium">Comprobante:</span> {pago.comprobante || 'No disponible'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Nuevo Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo Estado *
              </label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value as EstadoPago)}
                required
                className="input-field w-full"
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="atraso">Atrasado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>

            {/* Método de pago y Comprobante (solo si está pagado) */}
            {nuevoEstado === 'pagado' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    required
                    className="input-field w-full"
                  >
                    <option value="">Seleccionar método</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="deposito">Depósito</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprobante (Imagen)
                  </label>
                  
                  {/* Botón para seleccionar imagen */}
                  {!archivoComprobante && !previewUrl && (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleArchivoChange}
                        className="hidden"
                        id="comprobante-upload"
                      />
                      <label
                        htmlFor="comprobante-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Seleccionar imagen del comprobante</span>
                      </label>
                    </div>
                  )}

                  {/* Preview de la imagen */}
                  {(archivoComprobante || previewUrl) && (
                    <div className="relative border-2 border-gray-200 rounded-lg p-2">
                      <img
                        src={previewUrl}
                        alt="Preview comprobante"
                        className="w-full h-48 object-contain rounded"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <ImageIcon className="w-4 h-4 mr-1" />
                          <span className="truncate max-w-[200px]">
                            {archivoComprobante?.name || 'Imagen seleccionada'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={eliminarArchivo}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input alternativo de texto (por si no se sube imagen) */}
                  {!archivoComprobante && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={comprobante}
                        onChange={(e) => setComprobante(e.target.value)}
                        className="input-field w-full"
                        placeholder="O ingresa el número de comprobante manualmente"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Observaciones (solo si está rechazado) */}
            {nuevoEstado === 'rechazado' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  className="input-field w-full resize-none"
                  placeholder="Motivo del rechazo..."
                />
              </div>
            )}

            {/* Información adicional */}
            {nuevoEstado === 'pagado' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  <span className="font-medium">Nota:</span> Al marcar como pagado, se registrará automáticamente la fecha de pago.
                </p>
              </div>
            )}

            {nuevoEstado !== 'pagado' && pago.estado === 'pagado' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Advertencia:</span> Al cambiar de estado "pagado", se eliminará la fecha de pago.
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || (nuevoEstado === pago.estado && nuevoEstado !== 'pagado')}
              >
                {loading ? 'Actualizando...' : 'Actualizar Estado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarEstadoModal;