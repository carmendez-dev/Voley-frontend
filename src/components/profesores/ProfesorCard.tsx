import React from 'react';
import { Edit, Trash2, Mail, Phone, User, CreditCard, Lock } from 'lucide-react';
import type { Profesor } from '../../types/profesor.types';

interface ProfesorCardProps {
  profesor: Profesor;
  onEditar: (profesor: Profesor) => void;
  onEliminar: (profesor: Profesor) => void;
  onCambiarPassword: (profesor: Profesor) => void;
}

const ProfesorCard: React.FC<ProfesorCardProps> = ({ profesor, onEditar, onEliminar, onCambiarPassword }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{profesor.nombreCompleto}</h3>
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                profesor.estado === 'Activo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {profesor.estado}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {profesor.cedula && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CreditCard size={16} />
            <span>{profesor.cedula}</span>
          </div>
        )}
        {profesor.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail size={16} />
            <span className="truncate">{profesor.email}</span>
          </div>
        )}
        {profesor.celular && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone size={16} />
            <span>{profesor.celular}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEditar(profesor)}
            className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <Edit size={16} />
            <span>Editar</span>
          </button>
          <button
            onClick={() => onEliminar(profesor)}
            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Trash2 size={16} />
            <span>Eliminar</span>
          </button>
        </div>
        {profesor.cedula && (
          <button
            onClick={() => onCambiarPassword(profesor)}
            className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm w-full"
          >
            <Lock size={16} />
            <span>Cambiar Contraseña</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfesorCard;
