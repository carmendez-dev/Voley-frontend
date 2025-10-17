import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { categoriaService } from '../../services/api';
import type { Categoria } from '../../types';

interface EliminarCategoriaModalProps {
  categoria: Categoria;
  onClose: () => void;
  onSuccess: () => void;
}

const EliminarCategoriaModal: React.FC<EliminarCategoriaModalProps> = ({
  categoria,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacionTexto, setConfirmacionTexto] = useState('');

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

  const handleConfirmacion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmacionTexto(e.target.value);
    setError(null);
  };

  const isConfirmacionValida = (): boolean => {
    return confirmacionTexto.toLowerCase() === categoria.nombre.toLowerCase();
  };

  const handleEliminar = async () => {
    if (!isConfirmacionValida()) {
      setError('Debe escribir exactamente el nombre de la categoría para confirmar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await categoriaService.eliminar(categoria.idCategoria);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error && err.message.includes('409')) {
        setError('No se puede eliminar la categoría. Puede tener dependencias o estar asociada a torneos.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al eliminar la categoría');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Eliminar Categoría</h2>
              <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
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

        <div className="p-6">
          {/* Información de la categoría */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Categoría a eliminar:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>ID:</strong> #{categoria.idCategoria}</p>
              <p><strong>Nombre:</strong> {categoria.nombre}</p>
              <p><strong>Género:</strong> {categoria.genero}</p>
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  ⚠️ Advertencia
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Esta acción eliminará permanentemente la categoría</li>
                    <li>Si está asociada a torneos, no se podrá eliminar</li>
                    <li>Los datos no se pueden recuperar una vez eliminados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Campo de confirmación */}
          <div className="mb-6">
            <label htmlFor="confirmacion" className="block text-sm font-medium text-gray-700 mb-2">
              Para confirmar, escriba exactamente el nombre de la categoría:
            </label>
            <div className="text-sm text-gray-600 mb-2">
              Escriba: <code className="bg-gray-100 px-2 py-1 rounded">{categoria.nombre}</code>
            </div>
            <input
              type="text"
              id="confirmacion"
              value={confirmacionTexto}
              onChange={handleConfirmacion}
              className="input-field w-full"
              placeholder={categoria.nombre}
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEliminar}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !isConfirmacionValida()}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar Categoría</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarCategoriaModal;