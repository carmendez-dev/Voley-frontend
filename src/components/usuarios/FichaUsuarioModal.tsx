import React, { useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, AlertCircle, Activity } from 'lucide-react';
import type { Usuario } from '../../types';

interface FichaUsuarioModalProps {
  usuario: Usuario;
  onClose: () => void;
}

const FichaUsuarioModal: React.FC<FichaUsuarioModalProps> = ({ usuario, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold">Ficha del Usuario</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Información Personal */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Información Personal</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                <p className="text-gray-900 font-semibold">
                  {usuario.primerNombre} {usuario.segundoNombre || ''} {usuario.tercerNombre || ''} {usuario.primerApellido} {usuario.segundoApellido || ''}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cédula</label>
                <p className="text-gray-900">{usuario.cedula}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                <p className="text-gray-900">
                  {new Date(usuario.fechaNacimiento).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Edad</label>
                <p className="text-gray-900">{usuario.edad || calcularEdad(usuario.fechaNacimiento)} años</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Género</label>
                <p className="text-gray-900">{usuario.genero}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  usuario.estado === 'Activo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {usuario.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Información de Contacto</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </label>
                <p className="text-gray-900">{usuario.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Celular
                </label>
                <p className="text-gray-900">{usuario.celular}</p>
              </div>
              {usuario.direccion && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Dirección
                  </label>
                  <p className="text-gray-900">{usuario.direccion}</p>
                </div>
              )}
              {usuario.contactoEmergencia && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Contacto de Emergencia
                  </label>
                  <p className="text-gray-900">{usuario.contactoEmergencia}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información Física */}
          {(usuario.peso || usuario.altura) && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Información Física</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {usuario.peso && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Peso</label>
                    <p className="text-gray-900 text-2xl font-bold">{usuario.peso} <span className="text-sm font-normal">kg</span></p>
                  </div>
                )}
                {usuario.altura && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Altura</label>
                    <p className="text-gray-900 text-2xl font-bold">{usuario.altura} <span className="text-sm font-normal">m</span></p>
                  </div>
                )}
                {usuario.imc && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">IMC</label>
                    <p className="text-gray-900 text-2xl font-bold">
                      {usuario.imc.toFixed(2)}
                      <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${
                        usuario.imc < 18.5 ? 'bg-yellow-100 text-yellow-800' :
                        usuario.imc < 25 ? 'bg-green-100 text-green-800' :
                        usuario.imc < 30 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {usuario.imc < 18.5 ? 'Bajo peso' :
                         usuario.imc < 25 ? 'Normal' :
                         usuario.imc < 30 ? 'Sobrepeso' :
                         'Obesidad'}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información de Registro */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Información de Registro</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                <p className="text-gray-900">
                  {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {usuario.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                  <p className="text-gray-900">
                    {new Date(usuario.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
              {usuario.tipo && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Usuario</label>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {usuario.tipo}
                  </span>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">ID del Usuario</label>
                <p className="text-gray-900 font-mono">#{usuario.id}</p>
              </div>
            </div>
          </div>

          {/* Botón de Cerrar */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaUsuarioModal;
