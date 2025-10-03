# Migración a Nueva Estructura de API

## ✅ Archivos Actualizados

### 1. `src/types/index.ts` - Tipos de Datos
**Cambios realizados:**
- ✅ `Usuario`: `nombreCompleto` → `nombres` + `apellidos`
- ✅ `Usuario`: `cedulaUsuario` → `cedula`
- ✅ `Usuario`: `tipoUsuario` → `tipo` (valores: `JUGADOR | ENTRENADOR | ADMINISTRADOR`)
- ✅ `Usuario`: `estado` ahora usa valores UPPERCASE: `ACTIVO | INACTIVO`
- ✅ `Pago`: `nombreUsuario` → `usuarioNombre`
- ✅ `Pago`: `cedulaUsuario` → `usuarioId`
- ✅ `Pago`: `periodoMesAnio` → `periodoMes` + `periodoAnio` 
- ✅ `Pago`: `estadoPago` → `estado`
- ✅ Nueva interfaz `ApiResponse<T>` para respuestas de API
- ✅ Nueva interfaz `UsuarioCreateRequest`
- ✅ Nueva interfaz `PagoProcesarRequest`

### 2. `src/services/api.ts` - Capa de Servicios
**Cambios realizados:**
- ✅ Todos los métodos ahora usan `ApiResponse<T>` wrapper
- ✅ `pagoService.crearPago()` - usa `PagoCreateRequest`
- ✅ `pagoService.procesarPago()` - nuevo método para procesar pagos
- ✅ `pagoService.actualizarPago()` - reemplaza `actualizarEstadoPago`
- ✅ `pagoService.obtenerPagosPorUsuario()` - retorna `Pago[]`
- ✅ `usuarioService.crearUsuario()` - usa `UsuarioCreateRequest`
- ✅ Extracción de datos desde `response.data.data` o `response.data.data || []`

### 3. `src/components/GestionUsuarios.tsx` - Gestión de Usuarios
**Cambios realizados:**
- ✅ Filtro de usuarios: `tipo === 'JUGADOR'`
- ✅ Display de nombres: `{usuario.nombres} {usuario.apellidos}`
- ✅ Estados: `'ACTIVO'` y `'INACTIVO'`
- ✅ Estadísticas de activos/inactivos usa UPPERCASE
- ✅ Búsqueda por nombres, apellidos, email, celular y cédula
- ✅ handleVerPagos usa `usuario.cedula` o `usuario.id`

### 4. `src/components/GestionPagos.tsx` - Gestión de Pagos
**Cambios realizados:**
- ✅ Búsqueda por `usuarioNombre` (ya no `nombreUsuario` ni `cedulaUsuario`)
- ✅ Filtro por `estado` (ya no `estadoPago`)
- ✅ Estadísticas usan `estado === 'pagado' | 'pendiente' | 'atraso'`
- ✅ Tabla muestra `usuarioNombre` y `usuarioId`
- ✅ Nueva función `formatPeriodo(mes, anio)` que recibe 2 parámetros
- ✅ EstadoBadge recibe `pago.estado`
- ✅ handleVerUsuario usa `usuarioId` en lugar de `cedulaUsuario`

### 5. `src/components/modals/VerPagosUsuarioModal.tsx` - Modal de Pagos
**Cambios realizados:**
- ✅ Usa `pagoService.obtenerPagosPorUsuario(usuarioId)` directamente
- ✅ Cálculo de estadísticas en el frontend: `totalPagos`, `pagosPagados`, `pagosPendientes`, etc.
- ✅ Display de pagos con `formatPeriodo(pago.periodoMes, pago.periodoAnio)`
- ✅ EstadoBadge usa `pago.estado`
- ✅ handleEditarPago recibe objeto `Pago` completo
- ✅ Nombres de usuario desde `pagos[0]?.usuarioNombre`

---

## ⏳ Archivos PENDIENTES de Actualización

### 6. `src/components/modals/CrearPagoModal.tsx`
**Errores a corregir:**
```typescript
// ❌ Estado inicial incorrecto
const [formData, setFormData] = useState<PagoCreateRequest>({
  usuario_id: 0,      // ❌ Cambiar a: usuarioId
  periodo_mes: 1,     // ❌ Cambiar a: periodoMes
  periodo_anio: 2025, // ❌ Cambiar a: periodoAnio
  monto: 0,
  estado: '',         // ❌ ELIMINAR (no es parte de PagoCreateRequest)
  metodo_pago: '',    // ❌ ELIMINAR (no es parte de PagoCreateRequest)
  comprobante: ''     // ❌ Cambiar a: opcional (observaciones)
});

// ✅ Corrección:
const [formData, setFormData] = useState<PagoCreateRequest>({
  usuarioId: 0,
  periodoMes: 1,
  periodoAnio: 2025,
  monto: 0,
  fechaVencimiento: new Date().toISOString().split('T')[0],
  observaciones: ''
});
```

**Cambios necesarios:**
- Actualizar todas las referencias `usuario_id` → `usuarioId`
- Actualizar `periodo_mes` → `periodoMes`
- Actualizar `periodo_anio` → `periodoAnio`
- Eliminar campos `estado` y `metodo_pago` del formulario de creación
- Agregar campo `fechaVencimiento` requerido
- Renombrar `comprobante` → `observaciones`

### 7. `src/components/modals/EditarEstadoModal.tsx`
**Errores a corregir:**
```typescript
// ❌ Uso de campo inexistente
const [nuevoEstado, setNuevoEstado] = useState<EstadoPago>(pago.estadoPago);

// ✅ Corrección:
const [nuevoEstado, setNuevoEstado] = useState(pago.estado);

// ❌ Método no existente
await pagoService.actualizarEstadoPago(pago.id, nuevoEstado);

// ✅ Corrección:
await pagoService.actualizarPago(pago.id, { 
  // Dependiendo del nuevo estado, usar procesarPago() o actualizarPago()
});
```

**Cambios necesarios:**
- Cambiar `pago.estadoPago` → `pago.estado` (6 ocurrencias)
- Cambiar `pago.nombreUsuario` → `pago.usuarioNombre`
- Cambiar `pago.periodoMesAnio` → usar `formatPeriodo(pago.periodoMes, pago.periodoAnio)`
- Reemplazar `actualizarEstadoPago()` con lógica apropiada:
  - Si se marca como "pagado": usar `pagoService.procesarPago(id, { monto, metodoPago, comprobante })`
  - Si se actualiza otro dato: usar `pagoService.actualizarPago(id, cambios)`

### 8. `src/components/Reportes.tsx`
**Errores a corregir:**
```typescript
// ❌ Parsing de período incorrecto
const [mesTexto, anioTexto] = pago.periodoMesAnio.split(' ');

// ✅ Corrección:
const mes = pago.periodoMes;
const anio = pago.periodoAnio;

// ❌ Filtros por estadoPago
pagosFiltrados.filter(p => p.estadoPago === 'pagado')

// ✅ Corrección:
pagosFiltrados.filter(p => p.estado === 'pagado')

// ❌ Display de nombreUsuario
{pago.nombreUsuario || 'Usuario no encontrado'}

// ✅ Corrección:
{pago.usuarioNombre || 'Usuario no encontrado'}
```

**Cambios necesarios:**
- Línea 43: `pago.periodoMesAnio.split()` → usar `pago.periodoMes`, `pago.periodoAnio`
- Líneas 56-62, 75: `pago.estadoPago` → `pago.estado` (8 ocurrencias)
- Línea 312: `pago.nombreUsuario` → `pago.usuarioNombre`
- Línea 315: `pago.periodoMesAnio` → `formatPeriodo(pago.periodoMes, pago.periodoAnio)`
- Línea 321: `pago.estadoPago` → `pago.estado`

---

## 📋 Resumen de Cambios de Nomenclatura

| Tipo | Campo Antiguo | Campo Nuevo | Notas |
|------|---------------|-------------|-------|
| **Usuario** | `nombreCompleto` | `nombres` + `apellidos` | Separados |
| **Usuario** | `cedulaUsuario` | `cedula` | Sin prefijo |
| **Usuario** | `tipoUsuario` | `tipo` | UPPERCASE values |
| **Usuario** | `estado: 'activo'` | `estado: 'ACTIVO'` | Mayúsculas |
| **Usuario** | `telefono` | ❌ Eliminado | Solo `celular` |
| **Pago** | `nombreUsuario` | `usuarioNombre` | Orden cambiado |
| **Pago** | `cedulaUsuario` | `usuarioId` | Cambio de concepto |
| **Pago** | `periodoMesAnio` | `periodoMes` + `periodoAnio` | Separados |
| **Pago** | `estadoPago` | `estado` | Sin sufijo |
| **API** | Respuesta directa | `ApiResponse<T>` wrapper | Estructura envuelta |

## 🔧 Helpers Necesarios

```typescript
// Función para formatear período (ya implementada en varios componentes)
const formatPeriodo = (mes: number, anio: number) => {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${meses[mes - 1]} ${anio}`;
};

// Función para obtener nombre completo de usuario
const getNombreCompleto = (usuario: Usuario) => {
  return `${usuario.nombres} ${usuario.apellidos}`;
};
```

## 🎯 Pasos Siguientes

1. **Actualizar CrearPagoModal.tsx**: Corregir nombres de campos en formData
2. **Actualizar EditarEstadoModal.tsx**: Usar `estado` en lugar de `estadoPago` y método correcto de API
3. **Actualizar Reportes.tsx**: Cambiar todos los campos de Pago a la nueva estructura
4. **Probar compilación**: `npm run build`
5. **Probar con backend real**: Iniciar backend en puerto 8080 y verificar integración
6. **Agregar manejo de errores**: Capturar y mostrar mensajes de `ApiResponse.message`

## 📝 Notas Importantes

- **Backend API Base URL**: `http://localhost:8080/api`
- **Formato de respuesta**: Todas las respuestas vienen en `{ success, message, timestamp, data, total? }`
- **Acceso a datos**: Siempre usar `response.data.data` para obtener el payload
- **Enums**: Todos los enums ahora son UPPERCASE (JUGADOR, ENTRENADOR, ACTIVO, INACTIVO, MASCULINO, FEMENINO)
- **Eliminación de pagos**: El backend valida que no se puedan eliminar pagos con estado "pagado"
