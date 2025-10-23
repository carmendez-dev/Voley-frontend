# 📝 Módulo de Inscripciones

## Componentes

### GestionInscripciones.tsx
Componente principal que muestra la lista de inscripciones con filtros y búsqueda.

**Características:**
- Tabla con todas las inscripciones
- Filtro por estado (Inscrito, Retirado, Descalificado)
- Búsqueda por torneo, categoría o equipo
- Acciones: Ver detalle, Eliminar

### CrearInscripcionModal.tsx
Modal para crear nuevas inscripciones.

**Características:**
- Selección de torneo
- Carga dinámica de categorías según torneo
- Selección de equipo
- Campo opcional de observaciones

### DetalleInscripcionModal.tsx
Modal para ver y editar inscripciones existentes.

**Características:**
- Vista de información completa
- Modo edición para estado y observaciones
- Validaciones en tiempo real

### EliminarInscripcionModal.tsx
Modal de confirmación para eliminar inscripciones.

**Características:**
- Confirmación con información de la inscripción
- Advertencia de acción irreversible

## Uso

```typescript
import GestionInscripciones from './components/inscripciones/GestionInscripciones';

// En tu router o App.tsx
<GestionInscripciones />
```

## Estados de Inscripción

- 🟢 **inscrito** - Equipo inscrito activamente
- 🟡 **retirado** - Equipo retirado del torneo
- 🔴 **descalificado** - Equipo descalificado

## API Endpoints

- `GET /api/inscripciones` - Listar todas
- `POST /api/inscripciones` - Crear nueva
- `GET /api/inscripciones/{id}` - Obtener por ID
- `PUT /api/inscripciones/{id}` - Actualizar
- `DELETE /api/inscripciones/{id}` - Eliminar
