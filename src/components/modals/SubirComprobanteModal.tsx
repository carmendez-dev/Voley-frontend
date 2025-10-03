import React, { useState, useEffect } from 'react';
import { X, Upload, FileCheck } from 'lucide-react';
import { uploadService } from '../../services/api';
import type { PagoCreateRequest } from '../../types';

interface SubirComprobanteModalProps {
  pagoId: number;
  datosPago: PagoCreateRequest;
  onClose: () => void;
  onSuccess: () => void;
}

const SubirComprobanteModal: React.FC<SubirComprobanteModalProps> = ({ 
  pagoId,
  datosPago,
  onClose, 
  onSuccess 
}) => {
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError('El comprobante debe ser una imagen (JPG, PNG, etc.)');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }

      setComprobante(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setComprobante(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comprobante) {
      setError('Debe seleccionar un comprobante');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📤 Iniciando subida de comprobante');
      console.log('   - Pago ID:', pagoId);
      console.log('   - Archivo:', comprobante.name, comprobante.type);
      console.log('   - Datos del pago:', datosPago);
      
      const ruta = await uploadService.subirComprobante(comprobante, pagoId, datosPago);
      
      console.log('✅ Comprobante subido exitosamente');
      console.log('   - Ruta guardada:', ruta);
      
      onSuccess();
    } catch (err: any) {
      console.error('❌ Error al subir comprobante:', err);
      console.error('   - Response:', err.response);
      setError(err.response?.data?.error || err.message || 'Error al subir el comprobante');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    console.log('⏭️ Usuario omitió subir comprobante');
    onSuccess(); // Cerrar modal sin subir
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Subir Comprobante de Pago
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pago ID: #{pagoId} (Opcional)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Campo de archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comprobante de Pago (Opcional)
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label
                    htmlFor="comprobante-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Seleccionar Imagen
                  </label>
                  <input
                    id="comprobante-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  PNG, JPG, GIF hasta 5MB
                </p>
              </div>
            ) : (
              <div className="relative border-2 border-green-400 rounded-lg p-4">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded"
                />
                <div className="mt-2 flex items-center text-green-600 text-sm">
                  <FileCheck size={16} className="mr-1" />
                  Comprobante listo para subir
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Omitir
            </button>
            <button
              type="submit"
              disabled={!comprobante || loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Subiendo...' : 'Subir Comprobante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubirComprobanteModal;
