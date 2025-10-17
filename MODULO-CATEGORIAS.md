# 🏅 Módulo de Gestión de Categorías - Sistema de Voleibol

## 📋 **Descripción General**

El módulo de Gestión de Categorías permite administrar las categorías de voleibol del sistema, con funcionalidad completa CRUD, filtros avanzados, estadísticas y gestión de relaciones con torneos.

## ✨ **Características Principales**

### 🎯 **Funcionalidades Básicas**
- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar categorías
- ✅ **Búsqueda por Nombre**: Búsqueda inteligente con endpoint optimizado
- ✅ **Filtros por Género**: Masculino, Femenino, Mixto
- ✅ **Estadísticas en Tiempo Real**: Distribución por género y totales
- ✅ **Validaciones Avanzadas**: Frontend y backend
- ✅ **Interfaz Responsive**: Diseño adaptativo para todos los dispositivos

### 🔗 **Gestión de Relaciones**
- ✅ **Asociar/Desasociar**: Categorías con torneos
- ✅ **Endpoint Optimizado**: Formato especial para relaciones torneo-categoría
- ✅ **Verificación de Estado**: Prevención de eliminación con dependencias

### 🎨 **Experiencia de Usuario**
- ✅ **Modales Mejorados**: ESC key, backdrop click, scroll management
- ✅ **Badges Visuales**: Indicadores de género con colores e iconos
- ✅ **Loading States**: Indicadores de carga en todas las operaciones
- ✅ **Manejo de Errores**: Mensajes descriptivos y amigables

## 🗂️ **Estructura de Archivos**

```
src/
├── types/index.ts                          # Tipos TypeScript
├── services/api.ts                         # Servicios de API
├── components/
│   ├── GestionCategorias.tsx              # Componente principal
│   ├── EstadoBadgeGenero.tsx              # Badge de género
│   └── modals/
│       ├── CrearCategoriaModal.tsx        # Modal crear
│       ├── EditarCategoriaModal.tsx       # Modal editar
│       ├── EliminarCategoriaModal.tsx     # Modal eliminar
│       ├── EstadisticasCategoriasModal.tsx # Modal estadísticas
│       └── GestionTorneoCategoriaModal.tsx # Modal relaciones
└── App.tsx                                # Integración de rutas
└── Navigation.tsx                         # Navegación
```

## 🔧 **Configuración e Instalación**

### 1. **Tipos TypeScript**
Los tipos están definidos en `src/types/index.ts`:

```typescript
// Género de categoría
export type GeneroCategoria = 'Masculino' | 'Femenino' | 'Mixto';

// Entidad principal
export interface Categoria {
  idCategoria: number;
  nombre: string;
  genero: GeneroCategoria;
}

// Request para crear categoría
export interface CategoriaCreateRequest {
  nombre: string;
  genero: GeneroCategoria;
}

// Request para actualizar categoría
export interface CategoriaUpdateRequest {
  nombre?: string;
  genero?: GeneroCategoria;
}

// Estadísticas
export interface CategoriaEstadisticas {
  totalCategorias: number;
  categoriasMasculinas: number;
  categoriasFemeninas: number;
  categoriasMixtas: number;
}

// Filtros
export interface CategoriaFiltros {
  genero?: GeneroCategoria;
  nombre?: string;
}

// Relaciones Torneo-Categoría
export interface TorneoCategoria {
  idCategoria: number;
  nombre: string;
  idTorneo: number;
  nombreTorneo: string;
}
```

### 2. **Servicios de API**
Implementados en `src/services/api.ts`:

```typescript
// Servicio principal de categorías
export const categoriaService = {
  obtenerTodas(filtros?: CategoriaFiltros): Promise<Categoria[]>
  obtenerPorId(id: number): Promise<Categoria>
  crear(data: CategoriaCreateRequest): Promise<Categoria>
  actualizar(id: number, data: CategoriaUpdateRequest): Promise<Categoria>
  eliminar(id: number): Promise<void>
  obtenerEstadisticas(): Promise<CategoriaEstadisticas>
}

// Servicio de relaciones torneo-categoría
export const torneoCategoriaService = {
  obtenerCategoriasPorTorneo(torneoId: number): Promise<TorneoCategoria[]>
  obtenerTorneosPorCategoria(categoriaId: number): Promise<CategoriaTorneo[]>
  asociarCategoriaATorneo(torneoId: number, categoriaId: number): Promise<void>
  desasociarCategoriaDelTorneo(torneoId: number, categoriaId: number): Promise<void>
  verificarAsociacion(torneoId: number, categoriaId: number): Promise<boolean>
}
```

## 📡 **Endpoints del Backend**

### **Categorías - CRUD Básico**
```
GET    /api/categorias                    # Obtener todas
GET    /api/categorias/{id}              # Obtener por ID
POST   /api/categorias                   # Crear nueva
PUT    /api/categorias/{id}              # Actualizar
DELETE /api/categorias/{id}              # Eliminar
```

### **Búsqueda y Filtros**
```
GET    /api/categorias/buscar?nombre={nombre}       # Buscar por nombre
GET    /api/categorias/genero/{genero}              # Filtrar por género
GET    /api/categorias/estadisticas                 # Obtener estadísticas
```

### **Relaciones Torneo-Categoría**
```
GET    /api/torneos/{torneoId}/categorias           # Categorías de torneo (optimizado)
GET    /api/categorias/{categoriaId}/torneos        # Torneos de categoría
POST   /api/torneos/{torneoId}/categorias/{categoriaId}     # Asociar
DELETE /api/torneos/{torneoId}/categorias/{categoriaId}     # Desasociar
GET    /api/torneos/{torneoId}/categorias/{categoriaId}/existe # Verificar
```

## 🎮 **Guía de Uso**

### **1. Vista Principal - GestionCategorias**

**Características:**
- 📊 **Cards de Estadísticas**: Total, Masculinas, Femeninas, Mixtas
- 🔍 **Búsqueda por Nombre**: Campo de texto con botón de búsqueda
- 🔽 **Filtro por Género**: Dropdown con opciones
- 📋 **Tabla de Categorías**: Lista con acciones CRUD
- ➕ **Botón Nueva Categoría**: Abre modal de creación
- 📈 **Botón Estadísticas**: Abre modal con gráficos

**Componente:**
```tsx
import GestionCategorias from './components/GestionCategorias';

// En App.tsx
case 'categorias':
  return <GestionCategorias />;
```

### **2. Badge de Género - EstadoBadgeGenero**

**Características:**
- 🎨 **Colores Diferenciados**: Azul (Masculino), Rosa (Femenino), Morado (Mixto)
- 🔣 **Iconos Representativos**: ♂️ ♀️ ⚊
- 📏 **Tamaños**: sm, md, lg

**Uso:**
```tsx
import EstadoBadgeGenero from './components/EstadoBadgeGenero';

<EstadoBadgeGenero genero="Masculino" tamaño="md" />
<EstadoBadgeGenero genero="Femenino" tamaño="sm" />
<EstadoBadgeGenero genero="Mixto" tamaño="lg" />
```

### **3. Modal Crear Categoría**

**Campos:**
- **Nombre** (requerido): 2-100 caracteres
- **Género** (requerido): Masculino/Femenino/Mixto

**Validaciones:**
- ✅ Nombre no vacío
- ✅ Longitud mínima y máxima
- ✅ Género seleccionado

### **4. Modal Editar Categoría**

**Características:**
- 🔄 **Detección de Cambios**: Solo envía campos modificados
- ✏️ **Indicador Visual**: Muestra cuando hay cambios pendientes
- 🚫 **Botón Deshabilitado**: Si no hay cambios

### **5. Modal Eliminar Categoría**

**Seguridad:**
- ⚠️ **Confirmación por Texto**: Debe escribir exactamente el nombre
- 🛡️ **Protección de Dependencias**: No elimina si está asociada a torneos
- 📋 **Información Detallada**: Muestra datos de la categoría

### **6. Modal Estadísticas**

**Visualización:**
- 📊 **Resumen General**: Total de categorías
- 📈 **Distribución por Género**: Cards individuales con porcentajes
- 📉 **Barras de Progreso**: Representación visual de distribución
- ⚡ **Datos en Tiempo Real**: Actualizados dinámicamente

### **7. Modal Gestión Torneo-Categoría**

**Funcionalidades:**
- 🔗 **Asociar Categorías**: Dropdown con categorías disponibles
- ❌ **Desasociar**: Con confirmación
- 👁️ **Visualización**: Lista de categorías asociadas
- 🔄 **Actualización Automática**: Refresca datos tras cambios

## 💻 **Ejemplos de Uso en Código**

### **Cargar Categorías con Filtros**
```typescript
import { categoriaService } from '../services/api';

// Todas las categorías
const categorias = await categoriaService.obtenerTodas();

// Filtrar por género
const masculinas = await categoriaService.obtenerTodas({ genero: 'Masculino' });

// Buscar por nombre
const busqueda = await categoriaService.obtenerTodas({ nombre: 'juvenil' });
```

### **Crear Nueva Categoría**
```typescript
const nuevaCategoria = await categoriaService.crear({
  nombre: 'Juvenil Masculino',
  genero: 'Masculino'
});
```

### **Gestionar Relaciones**
```typescript
import { torneoCategoriaService } from '../services/api';

// Obtener categorías de un torneo
const categorias = await torneoCategoriaService.obtenerCategoriasPorTorneo(25);

// Asociar categoría a torneo
await torneoCategoriaService.asociarCategoriaATorneo(25, 3);

// Desasociar
await torneoCategoriaService.desasociarCategoriaDelTorneo(25, 3);
```

### **Usar Badge de Género**
```tsx
const CategoriaItem = ({ categoria }) => (
  <div className="flex items-center space-x-2">
    <span>{categoria.nombre}</span>
    <EstadoBadgeGenero genero={categoria.genero} />
  </div>
);
```

## 🎨 **Personalización de Estilos**

### **Colores de Género**
```css
/* Masculino - Azul */
.genero-masculino {
  background-color: #dbeafe; /* blue-100 */
  color: #1e40af; /* blue-800 */
}

/* Femenino - Rosa */
.genero-femenino {
  background-color: #fce7f3; /* pink-100 */
  color: #be185d; /* pink-700 */
}

/* Mixto - Morado */
.genero-mixto {
  background-color: #f3e8ff; /* purple-100 */
  color: #7c3aed; /* purple-600 */
}
```

### **Iconos de Género**
```typescript
const iconosGenero = {
  Masculino: '♂️',
  Femenino: '♀️',
  Mixto: '⚊'
};
```

## 🔗 **Integración con Otros Módulos**

### **Con Módulo de Torneos**
```tsx
import GestionTorneoCategoriaModal from './modals/GestionTorneoCategoriaModal';

// En GestionTorneos.tsx
const [showCategorias, setShowCategorias] = useState(false);

<button onClick={() => setShowCategorias(true)}>
  Gestionar Categorías
</button>

{showCategorias && (
  <GestionTorneoCategoriaModal
    torneo={torneoSeleccionado}
    onClose={() => setShowCategorias(false)}
    onSuccess={handleModalSuccess}
  />
)}
```

## 🐛 **Manejo de Errores**

### **Errores Comunes**
```typescript
// Error de validación
{
  status: 400,
  message: "El nombre es requerido"
}

// Categoría no encontrada
{
  status: 404,
  message: "Categoría no encontrada"
}

// Dependencias existentes
{
  status: 409,
  message: "No se puede eliminar. Tiene dependencias."
}
```

### **Implementación en Componentes**
```typescript
try {
  await categoriaService.eliminar(id);
} catch (error) {
  if (error.response?.status === 409) {
    setError('No se puede eliminar. La categoría está asociada a torneos.');
  } else {
    setError('Error inesperado al eliminar la categoría.');
  }
}
```

## 📈 **Métricas y Monitoreo**

### **Console Logs**
```typescript
// Actividad de la API
console.log('🏅 Obteniendo todas las categorías', filtros);
console.log('📋 Respuesta categorías:', response.data);
console.log('✅ Categoría creada:', response.data);
console.log('❌ Error obteniendo categorías:', error);
```

### **Estadísticas Útiles**
- **Total de Categorías**: Para planificación de torneos
- **Distribución por Género**: Para equilibrio competitivo
- **Categorías Populares**: Más asociadas a torneos

## 🚀 **Próximas Mejoras**

### **Funcionalidades Planificadas**
- 🏆 **Historial de Participación**: Categorías más usadas en torneos
- 📊 **Gráficos Avanzados**: Charts interactivos con Chart.js
- 🔄 **Importación/Exportación**: CSV/Excel de categorías
- 🎯 **Plantillas Predefinidas**: Categorías estándar de voleibol
- 🏅 **Sistema de Rankings**: Categorías por nivel de competencia

### **Optimizaciones Técnicas**
- ⚡ **Lazy Loading**: Carga diferida de modales
- 🔄 **Cache Inteligente**: React Query para datos
- 📱 **PWA**: Funcionalidad offline
- 🎨 **Themes**: Modo oscuro/claro

## 📞 **Soporte y Contacto**

Para reportar errores o solicitar nuevas funcionalidades relacionadas con el módulo de categorías:

1. **GitHub Issues**: Crear issue en el repositorio
2. **Documentación**: Consultar esta guía completa
3. **Código de Ejemplo**: Ver implementaciones en el proyecto

---

## 📝 **Changelog**

### **v1.0.0** (Enero 2025)
- ✅ CRUD completo de categorías
- ✅ Búsqueda y filtros avanzados
- ✅ Gestión de relaciones torneo-categoría
- ✅ Estadísticas en tiempo real
- ✅ Mejoras UX en modales
- ✅ Integración completa con navegación

---

**🏅 ¡El módulo de Gestión de Categorías está listo para usar!**