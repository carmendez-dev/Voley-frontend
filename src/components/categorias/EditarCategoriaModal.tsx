import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { categoriaService } from '../../services/api';
import type { Categoria, CategoriaUpdateRequest } from '../../types';

interface EditarCategoriaModalProps {
  categoria: Categoria;
  onClose: () => void;
  onSuccess: () => void;
}

const EditarCategoriaModal: React.FC<EditarCategoriaModalProps> = ({
  categoria,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CategoriaUpdateRequest>({
    nombre: categoria.nombre,
    genero: categoria.genero
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.nombre?.trim()) {
      setError('El nombre es requerido');
      return false;
    }

    if (formData.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (formData.nombre.trim().length > 100) {
      setError('El nombre no puede tener más de 100 caracteres');
      return false;
    }

    return true;
  };

  const hasChanges = (): boolean => {
    return (
      formData.nombre?.trim() !== categoria.nombre ||
      formData.genero !== categoria.genero
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!hasChanges()) {
      setError('No se han realizado cambios');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const dataToUpdate: CategoriaUpdateRequest = {
        nombre: formData.nombre!.trim(),
        genero: formData.genero
      };
      
      await categoriaService.actualizar(categoria.idCategoria, dataToUpdate);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Edit className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Editar Categoría</h2>
              <p className="text-sm text-gray-600">ID: #{categoria.idCategoria} - {categoria.nombre}</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleInputChange}
              className="input-field w-full"
              placeholder="Ej: Juvenil Masculino, Senior Femenino..."
              required
              maxLength={100}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 2 caracteres, máximo 100
            </p>
          </div>

          {/* Campo Género */}
          <div>
            <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
              Género *
            </label>
            <select
              id="genero"
              name="genero"
              value={formData.genero || categoria.genero}
              onChange={handleInputChange}
              className="input-field w-full"
              required
              disabled={loading}
            >
              <option value="Masculino">♂️ Masculino</option>
              <option value="Femenino">♀️ Femenino</option>
              <option value="Mixto">⚊ Mixto</option>
            </select>
          </div>

          {/* Indicador de cambios */}
          {hasChanges() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm">✏️ Se han detectado cambios</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
              disabled={loading || !hasChanges()}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Actualizar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCategoriaModal;