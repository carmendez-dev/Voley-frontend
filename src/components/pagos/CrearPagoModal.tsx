import React, { useState, useEffect } from 'react';
import { X, Upload, FileCheck, Search } from 'lucide-react';
import { pagoService } from '../../services/api';
import type { Usuario, PagoCreateRequest } from '../../types';

interface CrearPagoModalProps {
  usuarios: Usuario[];
  onClose: () => void;
  onSuccess: () => void;
}

const CrearPagoModal: React.FC<CrearPagoModalProps> = ({ usuarios, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<PagoCreateRequest>({
    usuarioId: undefined,
    periodoMes: new Date().getMonth() + 1,
    periodoAnio: new Date().getFullYear(),
    monto: 0,
    estado: 'pendiente',
    metodoPago: '',
    comprobante: null,
    observaciones: ''
  });
  const [archivoComprobante, setArchivoComprobante] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>(usuarios);

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

  // Filtrar usuarios según búsqueda
  useEffect(() => {
    if (!busquedaUsuario.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const busquedaLower = busquedaUsuario.toLowerCase();
    const filtrados = usuarios.filter(usuario => {
      const nombreCompleto = usuario.nombreCompleto?.toLowerCase() || '';
      const nombres = usuario.nombres?.toLowerCase() || '';
      const apellidos = usuario.apellidos?.toLowerCase() || '';
      const email = usuario.email?.toLowerCase() || '';
      const cedula = usuario.cedula || '';

      return (
        nombreCompleto.includes(busquedaLower) ||
        nombres.includes(busquedaLower) ||
        apellidos.includes(busquedaLower) ||
        email.includes(busquedaLower) ||
        cedula.includes(busquedaLower)
      );
    });

    setUsuariosFiltrados(filtrados);
  }, [busquedaUsuario, usuarios]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación adicional para estado 'pagado'
    if (formData.estado === 'pagado') {
      if (!formData.metodoPago || formData.metodoPago.trim() === '') {
        setError('Debe seleccionar un método de pago cuando el estado es "Pagado"');
        setLoading(false);
        return;
      }
    }

    console.log('📋 Datos del pago:', formData);
    console.log('📎 Archivo adjunto:', archivoComprobante?.name);

    try {
      // ✅ NUEVO: Enviar con multipart/form-data si hay archivo
      const pagoCreado = await pagoService.crearPagoConComprobante(
        formData,
        archivoComprobante
      );
      
      console.log('✅ Pago creado exitosamente:', pagoCreado);
      onSuccess();
    } catch (err: any) {
      console.error('❌ Error al crear pago:', err);
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Error al crear el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Para usuarioId, si el value es vacío, dejar como undefined
    if (name === 'usuarioId') {
      setFormData(prev => ({
        ...prev,
        usuarioId: value === '' ? undefined : Number(value)
      }));
      return;
    }
    
    // Si cambia el estado, limpiar método de pago si el estado NO es 'pagado'
    if (name === 'estado') {
      if (value !== 'pagado') {
        setFormData(prev => ({
          ...prev,
          estado: value as any,
          metodoPago: ''
        }));
        setError('');
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'periodoMes' || name === 'periodoAnio' || name === 'monto'
        ? Number(value)
        : value
    }));
  };

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

      setArchivoComprobante(file);
      
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
    setArchivoComprobante(null);
    setImagePreview(null);
  };

  const meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-primary">Crear Nuevo Pago</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Usuario con búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario *
            </label>
            
            {/* Campo de búsqueda con icono */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o cédula..."
                value={busquedaUsuario}
                onChange={(e) => setBusquedaUsuario(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            
            {/* Select de usuarios filtrados */}
            <select
              name="usuarioId"
              value={formData.usuarioId || ''}
              onChange={handleChange}
              required
              className="input-field w-full"
              size={6}
            >
              <option value="">-- Seleccionar usuario --</option>
              {usuariosFiltrados.length === 0 ? (
                <option disabled>No se encontraron usuarios</option>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombreCompleto || `${usuario.nombres} ${usuario.apellidos}`} • {usuario.cedula}
                  </option>
                ))
              )}
            </select>
            
            {busquedaUsuario && (
              <p className="text-xs text-gray-500 mt-1">
                {usuariosFiltrados.length} usuario(s) encontrado(s)
              </p>
            )}
          </div>

          {/* Período */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mes *
              </label>
              <select
                name="periodoMes"
                value={formData.periodoMes}
                onChange={handleChange}
                required
                className="input-field w-full"
              >
                {meses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                name="periodoAnio"
                value={formData.periodoAnio}
                onChange={handleChange}
                required
                min="2020"
                max="2030"
                className="input-field w-full"
              />
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto *
            </label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="input-field w-full"
              placeholder="0.00"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="input-field w-full"
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="atraso">Atrasado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          {/* Método de Pago - Solo visible si estado es 'pagado' */}
          {formData.estado === 'pagado' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago *
              </label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                required
                className="input-field w-full"
              >
                <option value="">Seleccionar método</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA_BANCARIA">Transferencia Bancaria</option>
                <option value="DEPOSITO">Depósito</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          )}

          {/* Comprobante - Opcional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comprobante de Pago (Opcional)
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <div className="mt-3">
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
              <div className="relative border-2 border-green-400 rounded-lg p-3">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                >
                  <X size={16} />
                </button>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-contain rounded"
                />
                <div className="mt-2 flex items-center text-green-600 text-sm">
                  <FileCheck size={16} className="mr-1" />
                  Comprobante listo
                </div>
              </div>
            )}
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="input-field w-full resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div>

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
              disabled={
                loading || 
                !formData.usuarioId ||
                (formData.estado === 'pagado' && !formData.metodoPago)
              }
              title={
                !formData.usuarioId 
                  ? 'Debe seleccionar un usuario' 
                  : formData.estado === 'pagado' && !formData.metodoPago
                  ? 'Debe seleccionar un método de pago'
                  : ''
              }
            >
              {loading ? 'Creando...' : 'Crear Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearPagoModal;