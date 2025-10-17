import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { pagoService, usuarioService } from '../../services/api';
import type { Pago, Usuario } from '../../types';
import EstadoBadge from '../shared/EstadoBadge';

const Reportes: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(() => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [pagosData, usuariosData] = await Promise.all([
        pagoService.obtenerTodosLosPagos(),
        usuarioService.obtenerTodosLosUsuarios()
      ]);
      setPagos(pagosData);
      setUsuarios(usuariosData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pagos por período seleccionado
  const pagosFiltrados = pagos.filter(pago => {
    if (!periodoSeleccionado) return true;
    const [anio, mes] = periodoSeleccionado.split('-').map(Number);
    return pago.periodoAnio === anio && pago.periodoMes === mes;
  });

  // Calcular estadísticas
  const estadisticas = {
    totalPagos: pagosFiltrados.length,
    pagosPagados: pagosFiltrados.filter(p => p.estado === 'pagado').length,
    pagosPendientes: pagosFiltrados.filter(p => p.estado === 'pendiente').length,
    pagosAtrasados: pagosFiltrados.filter(p => p.estado === 'atraso').length,
    pagosRechazados: pagosFiltrados.filter(p => p.estado === 'rechazado').length,
    montoTotal: pagosFiltrados.reduce((sum, p) => sum + p.monto, 0),
    montoPagado: pagosFiltrados.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.monto, 0),
    montoPendiente: pagosFiltrados.filter(p => p.estado !== 'pagado').reduce((sum, p) => sum + p.monto, 0),
  };

  // Calcular porcentajes
  const porcentajes = {
    pagados: estadisticas.totalPagos > 0 ? (estadisticas.pagosPagados / estadisticas.totalPagos * 100) : 0,
    pendientes: estadisticas.totalPagos > 0 ? (estadisticas.pagosPendientes / estadisticas.totalPagos * 100) : 0,
    atrasados: estadisticas.totalPagos > 0 ? (estadisticas.pagosAtrasados / estadisticas.totalPagos * 100) : 0,
    rechazados: estadisticas.totalPagos > 0 ? (estadisticas.pagosRechazados / estadisticas.totalPagos * 100) : 0,
  };

  // Resumen por estado de pago
  const estadosPago = pagosFiltrados.reduce((acc, pago) => {
    acc[pago.estado] = (acc[pago.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(amount);
  };

  const formatPeriodo = (periodo: string) => {
    if (!periodo) return 'Todos los períodos';
    const [anio, mes] = periodo.split('-');
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${meses[parseInt(mes) - 1]} ${anio}`;
  };

  const formatPeriodoPago = (mes: number, anio: number) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${meses[mes - 1]} ${anio}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Reportes y Estadísticas</h2>
        <button className="btn-primary">
          <Download className="w-5 h-5" />
          Exportar
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <label className="font-medium text-gray-700">Período:</label>
          </div>
          <select
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los períodos</option>
            {Array.from({ length: 12 }, (_, i) => {
              const fecha = new Date();
              fecha.setMonth(fecha.getMonth() - i);
              const valor = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
              const texto = formatPeriodo(valor);
              return (
                <option key={valor} value={valor}>{texto}</option>
              );
            })}
          </select>
          <div className="text-sm text-gray-600">
            Mostrando datos para: <span className="font-medium">{formatPeriodo(periodoSeleccionado)}</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-primary">Total Pagos</h3>
          <p className="text-3xl font-bold text-blue-600">{estadisticas.totalPagos}</p>
          <p className="text-sm text-gray-500">En el período</p>
        </div>
        
        <div className="card text-center">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-primary">Monto Total</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(estadisticas.montoTotal)}</p>
          <p className="text-sm text-gray-500">Esperado</p>
        </div>
        
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-primary">Monto Recaudado</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(estadisticas.montoPagado)}</p>
          <p className="text-sm text-green-600">{porcentajes.pagados.toFixed(1)}% del total</p>
        </div>
        
        <div className="card text-center">
          <Users className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-primary">Usuarios Activos</h3>
          <p className="text-3xl font-bold text-primary">{usuarios.length}</p>
          <p className="text-sm text-gray-500">Registrados</p>
        </div>
      </div>

      {/* Estados de Pagos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-primary mb-4">Estado de Pagos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Pagados</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{estadisticas.pagosPagados}</span>
                <span className="text-sm text-gray-500 ml-2">({porcentajes.pagados.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${porcentajes.pagados}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Pendientes</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{estadisticas.pagosPendientes}</span>
                <span className="text-sm text-gray-500 ml-2">({porcentajes.pendientes.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${porcentajes.pendientes}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Atrasados</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{estadisticas.pagosAtrasados}</span>
                <span className="text-sm text-gray-500 ml-2">({porcentajes.atrasados.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${porcentajes.atrasados}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>Rechazados</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{estadisticas.pagosRechazados}</span>
                <span className="text-sm text-gray-500 ml-2">({porcentajes.rechazados.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-500 h-2 rounded-full" 
                style={{ width: `${porcentajes.rechazados}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold text-primary mb-4">Estados de Pago</h3>
          <div className="space-y-3">
            {Object.entries(estadosPago).map(([estado, cantidad]) => (
              <div key={estado} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium capitalize">{estado}</span>
                <span className="text-lg font-bold text-primary">{cantidad}</span>
              </div>
            ))}
            {Object.keys(estadosPago).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No hay datos de estados de pago
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="card">
        <h3 className="text-xl font-semibold text-primary mb-4">Resumen Financiero</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800">Ingresos Recaudados</h4>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(estadisticas.montoPagado)}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800">Pendiente por Recaudar</h4>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(estadisticas.montoPendiente)}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">Eficiencia de Cobro</h4>
            <p className="text-2xl font-bold text-blue-600">{porcentajes.pagados.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Pagos Recientes */}
      <div className="card">
        <h3 className="text-xl font-semibold text-primary mb-4">Pagos Recientes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagosFiltrados.slice(0, 5).map((pago) => (
                <tr key={pago.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pago.usuarioNombre || 'Usuario no encontrado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPeriodoPago(pago.periodoMes, pago.periodoAnio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(pago.monto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <EstadoBadge estado={pago.estado} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pago.fechaRegistro).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;