import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usuarioService } from '../../services/api';
import type { Usuario, UsuarioCreateRequest } from '../../types';

interface EditarUsuarioModalProps {
  usuario: Usuario;
  onClose: () => void;
  onSuccess: () => void;
}

const EditarUsuarioModal: React.FC<EditarUsuarioModalProps> = ({ usuario, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UsuarioCreateRequest>({
    primerNombre: usuario.primerNombre,
    segundoNombre: usuario.segundoNombre || '',
    tercerNombre: usuario.tercerNombre || '',
    primerApellido: usuario.primerApellido,
    segundoApellido: usuario.segundoApellido || '',
    fechaNacimiento: usuario.fechaNacimiento,
    cedula: usuario.cedula,
    genero: usuario.genero,
    email: usuario.email,
    celular: usuario.celular,
    direccion: usuario.direccion || '',
    contactoEmergencia: usuario.contactoEmergencia || '',
    peso: usuario.peso || undefined,
    altura: usuario.altura || undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await usuarioService.actualizar(usuario.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al actualizar usuario:', err);
      setError(err.response?.data?.message || 'Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'peso' || name === 'altura' ? (value ? Number(value) : undefined) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primer Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primer Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="primerNombre"
                value={formData.primerNombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Segundo Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segundo Nombre
              </label>
              <input
                type="text"
                name="segundoNombre"
                value={formData.segundoNombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tercer Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tercer Nombre
              </label>
              <input
                type="text"
                name="tercerNombre"
                value={formData.tercerNombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Primer Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primer Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="primerApellido"
                value={formData.primerApellido}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Segundo Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segundo Apellido
              </label>
              <input
                type="text"
                name="segundoApellido"
                value={formData.segundoApellido}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cédula */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cédula <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género <span className="text-red-500">*</span>
              </label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Celular */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contacto de Emergencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contacto de Emergencia
              </label>
              <input
                type="tel"
                name="contactoEmergencia"
                value={formData.contactoEmergencia}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                name="peso"
                value={formData.peso || ''}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Altura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (metros)
              </label>
              <input
                type="number"
                name="altura"
                value={formData.altura || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuarioModal;
