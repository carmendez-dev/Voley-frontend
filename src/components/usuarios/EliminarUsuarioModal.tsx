import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { usuarioService } from '../../services/api';
import type { Usuario } from '../../types';

interface EliminarUsuarioModalProps {
  usuario: Usuario;
  onClose: () => void;
  onSuccess: () => void;
}

const EliminarUsuarioModal: React.FC<EliminarUsuarioModalProps> = ({ usuario, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleEliminar = async () => {
    setLoading(true);
    setError('');

    try {
      await usuarioService.eliminar(usuario.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al eliminar usuario:', err);
      setError(err.response?.data?.message || 'Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Eliminar Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex items-start mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Estás seguro de eliminar este usuario?
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Nombre:</span> {usuario.primerNombre} {usuario.segundoNombre || ''} {usuario.primerApellido} {usuario.segundoApellido || ''}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Email:</span> {usuario.email}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Cédula:</span> {usuario.cedula}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer. Todos los datos asociados a este usuario serán eliminados permanentemente.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleEliminar}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 transition-colors"
            >
              {loading ? 'Eliminando...' : 'Sí, Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarUsuarioModal;
