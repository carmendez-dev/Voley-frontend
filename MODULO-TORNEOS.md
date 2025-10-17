# 🏆 Módulo de Torneos - Frontend

## Descripción
Módulo completo para la gestión de torneos de voleibol. Permite crear, editar, eliminar torneos y gestionar sus estados siguiendo el flujo de negocio definido en el backend.

## 📋 Funcionalidades Implementadas

### 🎯 Gestión Principal
- ✅ **Lista de torneos** con filtros y búsqueda
- ✅ **Crear torneo** con validaciones
- ✅ **Editar torneo** (excepto finalizados)
- ✅ **Cambiar estado** con reglas de transición
- ✅ **Eliminar torneo** (solo pendientes/finalizados)
- ✅ **Estadísticas** visuales y numéricas

### 🔍 Filtros y Búsqueda
- ✅ Filtro por estado (Pendiente, Activo, Finalizado)
- ✅ Búsqueda por nombre (case insensitive)
- ✅ Limpiar filtros
- ✅ Búsqueda en tiempo real

### 📊 Estadísticas
- ✅ Total de torneos
- ✅ Torneos por estado
- ✅ Porcentajes y gráficos
- ✅ Distribución visual

## 🎨 Componentes

### Componente Principal
- **`GestionTorneos.tsx`** - Componente principal con lista y gestión

### Componentes de UI
- **`EstadoBadgeTorneo.tsx`** - Badge para mostrar estados con colores e iconos

### Modales
- **`CrearTorneoModal.tsx`** - Crear nuevo torneo
- **`EditarTorneoModal.tsx`** - Editar torneo existente
- **`CambiarEstadoTorneoModal.tsx`** - Cambiar estado con validaciones
- **`EliminarTorneoModal.tsx`** - Eliminar con confirmación
- **`EstadisticasTorneoModal.tsx`** - Visualización de estadísticas

## 🔧 Servicios API

### TorneoService
Ubicación: `src/services/api.ts`

```typescript
export const torneoService = {
  // Operaciones CRUD básicas
  obtenerTodos(filtros?: TorneoFiltros): Promise<Torneo[]>
  obtenerPorId(id: number): Promise<Torneo>
  crear(torneo: TorneoCreateRequest): Promise<Torneo>
  actualizar(id: number, torneo: TorneoUpdateRequest): Promise<Torneo>
  eliminar(id: number): Promise<void>
  
  // Operaciones especiales
  cambiarEstado(id: number, estado: EstadoTorneo): Promise<Torneo>
  obtenerActivos(): Promise<Torneo[]>
  obtenerDisponibles(): Promise<Torneo[]>
  obtenerEstadisticas(): Promise<TorneoEstadisticas>
}
```

## 📝 Tipos TypeScript

### Tipos Principales
```typescript
// Estado del torneo
export type EstadoTorneo = 'Pendiente' | 'Activo' | 'Finalizado';

// Entidad principal
export interface Torneo {
  idTorneo: number;
  nombre: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado: EstadoTorneo;
}

// DTOs para operaciones
export interface TorneoCreateRequest {
  nombre: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface TorneoUpdateRequest {
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface CambiarEstadoTorneoRequest {
  estado: EstadoTorneo;
}

// Estadísticas
export interface TorneoEstadisticas {
  totalTorneos: number;
  torneosPendientes: number;
  torneosActivos: number;
  torneosFinalizados: number;
}

// Filtros
export interface TorneoFiltros {
  estado?: EstadoTorneo;
  nombre?: string;
}
```

## 🔐 Reglas de Negocio

### Estados de Torneo
- **Pendiente**: Torneo programado, en preparación (estado inicial)
- **Activo**: Torneo en curso
- **Finalizado**: Torneo terminado

### Transiciones de Estado Permitidas
```
Pendiente → Activo ✅
Pendiente → Finalizado ✅
Activo → Finalizado ✅
Finalizado → (ninguno) ❌
```

### Validaciones

#### Crear Torneo
- ✅ Nombre obligatorio (máx 100 caracteres)
- ✅ Fecha inicio ≤ Fecha fin (si ambas están presentes)
- ✅ Estado inicial: "Pendiente"

#### Editar Torneo
- ❌ No se puede editar torneos finalizados
- ✅ Validación de fechas
- ✅ Solo campos modificados se envían

#### Eliminar Torneo
- ❌ No se puede eliminar torneos activos
- ✅ Confirmación por nombre del torneo

#### Cambiar Estado
- ✅ Solo transiciones válidas
- ❌ Torneos finalizados no pueden cambiar
- ❌ No se puede volver a "Pendiente"

## 🎨 Características de UI

### Tabla de Torneos
- **Columnas**: Torneo, Estado, Fecha Inicio, Fecha Fin, Acciones
- **Estados visuales**: Badges con colores e iconos
- **Acciones**: Editar, Cambiar Estado, Eliminar
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### Cards de Estadísticas
- **Total**: Número total de torneos
- **Por Estado**: Contador por cada estado
- **Iconos**: Visual distintivo para cada estado
- **Colores**: Código de colores consistente

### Filtros
- **Por Estado**: Dropdown con todos los estados
- **Por Nombre**: Input de búsqueda en tiempo real
- **Limpiar**: Botón para resetear filtros

## 🎯 Estados Visuales

### Colores por Estado
- **Pendiente**: Amarillo (⏳ - En espera)
- **Activo**: Verde (🏆 - En curso)
- **Finalizado**: Gris (✅ - Completado)

### Iconos
- **Pendiente**: Clock (⏳)
- **Activo**: Trophy (🏆)
- **Finalizado**: CheckCircle (✅)

## 📱 Responsive Design

### Adaptaciones
- **Móviles**: Cards apiladas verticalmente
- **Tablets**: Grid 2x2 para estadísticas
- **Desktop**: Grid completo y tabla horizontal

### Breakpoints
- **sm**: >= 640px
- **md**: >= 768px
- **lg**: >= 1024px

## 🔄 Flujo de Usuario

### Crear Torneo
1. Click "Nuevo Torneo"
2. Llenar formulario (nombre obligatorio)
3. Agregar fechas opcionales
4. Agregar descripción opcional
5. Submit → Torneo creado con estado "Pendiente"

### Editar Torneo
1. Click "Editar" en la tabla
2. Modificar campos deseados
3. Submit → Actualización solo de campos modificados
4. ❌ Si está finalizado: Formulario deshabilitado

### Cambiar Estado
1. Click "Estado" en la tabla
2. Seleccionar nuevo estado válido
3. Ver vista previa del cambio
4. Confirmar → Estado actualizado

### Eliminar Torneo
1. Click "Eliminar" en la tabla
2. ❌ Si está activo: Botón deshabilitado
3. Escribir nombre del torneo (confirmación)
4. Confirmar → Torneo eliminado

## 🔧 Configuración

### Integración en App.tsx
```typescript
// Importar componente
import GestionTorneos from './components/GestionTorneos';

// Agregar al switch de navegación
case 'torneos':
  return <GestionTorneos />;
```

### Navegación
```typescript
// En Navigation.tsx
{ id: 'torneos', label: 'Torneos', icon: Trophy }
```

## 🚀 Endpoints Utilizados

Todos los endpoints están implementados en el backend según la especificación:

- `GET /api/torneos` - Lista todos los torneos
- `GET /api/torneos?estado=X` - Filtrar por estado
- `GET /api/torneos?nombre=X` - Buscar por nombre
- `GET /api/torneos/{id}` - Obtener por ID
- `POST /api/torneos` - Crear torneo
- `PUT /api/torneos/{id}` - Actualizar torneo
- `DELETE /api/torneos/{id}` - Eliminar torneo
- `PUT /api/torneos/{id}/estado` - Cambiar estado
- `GET /api/torneos/activos` - Torneos activos
- `GET /api/torneos/disponibles` - Torneos disponibles
- `GET /api/torneos/estadisticas` - Estadísticas

## ✅ Testing

### Casos de Prueba Recomendados

#### Crear Torneo
- ✅ Crear con solo nombre
- ✅ Crear con todos los campos
- ❌ Crear sin nombre
- ❌ Crear con fecha inicio > fecha fin

#### Editar Torneo
- ✅ Editar torneo pendiente
- ✅ Editar torneo activo
- ❌ Editar torneo finalizado

#### Cambiar Estado
- ✅ Pendiente → Activo
- ✅ Pendiente → Finalizado
- ✅ Activo → Finalizado
- ❌ Finalizado → cualquier estado

#### Eliminar Torneo
- ✅ Eliminar torneo pendiente
- ✅ Eliminar torneo finalizado
- ❌ Eliminar torneo activo

#### Filtros
- ✅ Filtrar por cada estado
- ✅ Buscar por nombre
- ✅ Combinar filtros
- ✅ Limpiar filtros

## 🐛 Manejo de Errores

### Errores Comunes
- **400**: Datos inválidos o parámetros incorrectos
- **404**: Torneo no encontrado
- **409**: Estados inválidos o conflictos de negocio
- **500**: Errores internos del servidor

### Validaciones Frontend
- Campos requeridos antes de submit
- Validación de fechas
- Confirmación para eliminación
- Estados de carga durante operaciones

## 🎨 Estilos

### Clases CSS Utilizadas
```css
/* Clases Tailwind principales */
.btn-primary - Botón principal azul
.btn-outline - Botón con borde
.input-field - Campo de entrada
.bg-gray-50 - Fondo gris claro para cards
.border-gray-200 - Bordes sutiles
```

### Colores del Sistema
- **Azul**: Acciones principales
- **Verde**: Estados activos/exitosos
- **Amarillo**: Estados de espera
- **Rojo**: Acciones destructivas
- **Gris**: Estados finalizados/neutros

---

## 📚 Documentación Relacionada

- `README.md` - Documentación general del proyecto
- `FLUJO-UNIFICADO-IMPLEMENTADO.md` - Flujo de pagos con comprobantes
- Backend API - Especificación de endpoints de torneos

---

*Módulo implementado siguiendo Clean Architecture y principios de UX/UI modernos.*