# 📘 Guía de Uso - Servicios y Tipos

## 🎯 Cómo Importar y Usar los Servicios

### ✅ Forma Recomendada (Barrel Imports)

```typescript
// En cualquier componente
import { usuarioService, pagoService, torneoService } from '../../services';
import type { Usuario, Pago, Torneo } from '../../types';
```

### ✅ Forma Específica (Imports Directos)

```typescript
// Importar servicio específico
import { usuarioService } from '../../services/usuarios.service';
import type { Usuario, UsuarioCreateRequest } from '../../types/usuario.types';
```

---

## 📦 Servicios Disponibles

### 1. Usuario Service

```typescript
import { usuarioService } from '../../services';
import type { Usuario, UsuarioCreateRequest } from '../../types';

// Obtener todos los usuarios
const usuarios = await usuarioService.obtenerTodos();

// Obtener usuario por ID
const usuario = await usuarioService.obtenerPorId(1);

// Crear usuario
const nuevoUsuario = await usuarioService.crear({
  primerNombre: 'Juan',
  primerApellido: 'Pérez',
  // ... más campos
});

// Actualizar usuario
const actualizado = await usuarioService.actualizar(1, {
  email: 'nuevo@email.com'
});

// Eliminar usuario
await usuarioService.eliminar(1);

// Cambiar estado
await usuarioService.cambiarEstado(1, 'Inactivo');

// Obtener estadísticas
const stats = await usuarioService.obtenerEstadisticas();

// Buscar usuarios
const resultados = await usuarioService.buscar('Juan');
```

---

### 2. Pago Service

```typescript
import { pagoService } from '../../services';
import type { Pago, PagoCreateRequest } from '../../types';

// Crear pago sin comprobante
const pago = await pagoService.crearPago({
  usuarioId: 1,
  periodoMes: 10,
  periodoAnio: 2025,
  monto: 50,
  estado: 'pendiente'
});

// Crear pago con comprobante
const pagoConComprobante = await pagoService.crearPagoConComprobante(
  {
    usuarioId: 1,
    periodoMes: 10,
    periodoAnio: 2025,
    monto: 50,
    estado: 'pagado',
    metodoPago: 'transferencia'
  },
  archivoFile // File object
);

// Obtener todos los pagos
const pagos = await pagoService.obtenerTodosLosPagos();

// Obtener pagos por usuario
const pagosPorUsuario = await pagoService.obtenerPagosPorUsuario(1);

// Obtener pagos por estado
const pagosPendientes = await pagoService.obtenerPagosPorEstado('pendiente');

// Procesar pago
await pagoService.procesarPago(1, {
  monto: 50,
  metodoPago: 'efectivo'
});

// Eliminar pago
await pagoService.eliminarPago(1);
```

---

### 3. Torneo Service

```typescript
import { torneoService } from '../../services';
import type { Torneo, TorneoCreateRequest } from '../../types';

// Obtener todos los torneos
const torneos = await torneoService.obtenerTodos();

// Obtener con filtros
const torneosActivos = await torneoService.obtenerTodos({
  estado: 'Activo'
});

// Obtener por ID
const torneo = await torneoService.obtenerPorId(1);

// Crear torneo
const nuevoTorneo = await torneoService.crear({
  nombre: 'Torneo de Verano 2025',
  descripcion: 'Torneo anual',
  fechaInicio: '2025-01-01',
  fechaFin: '2025-01-31'
});

// Actualizar torneo
const actualizado = await torneoService.actualizar(1, {
  nombre: 'Nuevo nombre'
});

// Cambiar estado
await torneoService.cambiarEstado(1, 'Activo');

// Obtener torneos activos
const activos = await torneoService.obtenerActivos();

// Obtener estadísticas
const stats = await torneoService.obtenerEstadisticas();

// Eliminar torneo
await torneoService.eliminar(1);
```

---

### 4. Categoría Service

```typescript
import { categoriaService } from '../../services';
import type { Categoria, CategoriaCreateRequest } from '../../types';

// Obtener todas las categorías
const categorias = await categoriaService.obtenerTodas();

// Obtener con filtros
const masculinas = await categoriaService.obtenerTodas({
  genero: 'MASCULINO'
});

// Obtener por ID
const categoria = await categoriaService.obtenerPorId(1);

// Crear categoría
const nueva = await categoriaService.crear({
  nombre: 'Sub-18',
  genero: 'MASCULINO'
});

// Actualizar categoría
const actualizada = await categoriaService.actualizar(1, {
  nombre: 'Sub-21'
});

// Obtener estadísticas
const stats = await categoriaService.obtenerEstadisticas();

// Eliminar categoría
await categoriaService.eliminar(1);
```

---

### 5. Equipo Service

```typescript
import { equipoService } from '../../services';
import type { Equipo, EquipoCreateRequest } from '../../types';

// Obtener todos los equipos
const equipos = await equipoService.obtenerTodos();

// Obtener con filtros
const filtrados = await equipoService.obtenerTodos({
  nombre: 'Tigres'
});

// Obtener por ID
const equipo = await equipoService.obtenerPorId(1);

// Crear equipo
const nuevo = await equipoService.crear({
  nombre: 'Los Tigres',
  descripcion: 'Equipo profesional'
});

// Actualizar equipo
const actualizado = await equipoService.actualizar(1, {
  nombre: 'Los Tigres FC'
});

// Eliminar equipo
await equipoService.eliminar(1);
```

---

### 6. Relaciones Service

```typescript
import { torneoCategoriaService, categoriaEquipoService } from '../../services';

// === TORNEO-CATEGORÍA ===

// Obtener categorías de un torneo
const categorias = await torneoCategoriaService.obtenerCategoriasPorTorneo(1);

// Obtener torneos de una categoría
const torneos = await torneoCategoriaService.obtenerTorneosPorCategoria(1);

// Asociar categoría a torneo
await torneoCategoriaService.asociarCategoriaATorneo(1, 2);

// Desasociar categoría de torneo
await torneoCategoriaService.desasociarCategoriaDelTorneo(1, 2);

// Verificar asociación
const existe = await torneoCategoriaService.verificarAsociacion(1, 2);

// === CATEGORÍA-EQUIPO ===

// Obtener equipos de una categoría
const equipos = await categoriaEquipoService.obtenerEquiposPorCategoria(1);

// Asignar equipo a categoría
await categoriaEquipoService.asignarEquipo(1, 2);

// Desasignar equipo de categoría
await categoriaEquipoService.desasignarEquipo(1, 2);
```

---

### 7. Inscripciones Service

```typescript
import inscripcionesService from '../../services/inscripciones.service';
import type { Inscripcion, CrearInscripcionDTO } from '../../types';

// Obtener todas las inscripciones
const inscripciones = await inscripcionesService.obtenerTodas();

// Obtener por ID
const inscripcion = await inscripcionesService.obtenerPorId(1);

// Obtener por estado
const inscritos = await inscripcionesService.obtenerPorEstado('inscrito');

// Obtener por torneo y categoría
const inscripcionesTorneo = await inscripcionesService.obtenerPorTorneoYCategoria(1, 2);

// Obtener por equipo
const inscripcionesEquipo = await inscripcionesService.obtenerPorEquipo(1);

// Crear inscripción
const nueva = await inscripcionesService.crear({
  idTorneoCategoria: 5,
  idEquipo: 2,
  observaciones: 'Inscripción inicial'
});

// Actualizar inscripción
const actualizada = await inscripcionesService.actualizar(1, {
  estado: 'retirado',
  observaciones: 'Equipo retirado por lesiones'
});

// Cambiar estado
await inscripcionesService.cambiarEstado(1, 'descalificado', 'Violación de reglas');

// Eliminar inscripción
await inscripcionesService.eliminar(1);
```

---

### 8. Upload Service

```typescript
import { uploadService } from '../../services';

// Subir comprobante de pago
const ruta = await uploadService.subirComprobante(
  archivoFile,
  pagoId,
  {
    usuarioId: 1,
    monto: 50,
    periodoMes: 10,
    periodoAnio: 2025,
    estado: 'pagado',
    metodoPago: 'transferencia'
  }
);
```

---

## 🎨 Ejemplos en Componentes React

### Ejemplo 1: Listar Usuarios

```typescript
import React, { useState, useEffect } from 'react';
import { usuarioService } from '../../services';
import type { Usuario } from '../../types';

const ListaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.obtenerTodos();
      setUsuarios(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {usuarios.map(usuario => (
        <div key={usuario.id}>{usuario.nombreCompleto}</div>
      ))}
    </div>
  );
};
```

---

### Ejemplo 2: Crear Torneo

```typescript
import React, { useState } from 'react';
import { torneoService } from '../../services';
import type { TorneoCreateRequest } from '../../types';

const CrearTorneo: React.FC = () => {
  const [formData, setFormData] = useState<TorneoCreateRequest>({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const torneo = await torneoService.crear(formData);
      console.log('Torneo creado:', torneo);
      // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error:', error);
      // Mostrar mensaje de error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.nombre}
        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        placeholder="Nombre del torneo"
      />
      {/* Más campos... */}
      <button type="submit">Crear Torneo</button>
    </form>
  );
};
```

---

### Ejemplo 3: Gestión de Inscripciones

```typescript
import React, { useState, useEffect } from 'react';
import inscripcionesService from '../../services/inscripciones.service';
import { torneoService, equipoService, torneoCategoriaService } from '../../services';
import type { Inscripcion, Torneo, Equipo, TorneoCategoria } from '../../types';

const GestionInscripciones: React.FC = () => {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [categorias, setCategorias] = useState<TorneoCategoria[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [inscripcionesData, torneosData, equiposData] = await Promise.all([
        inscripcionesService.obtenerTodas(),
        torneoService.obtenerTodos(),
        equipoService.obtenerTodos()
      ]);
      
      setInscripciones(inscripcionesData);
      setTorneos(torneosData);
      setEquipos(equiposData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarCategorias = async (torneoId: number) => {
    try {
      const data = await torneoCategoriaService.obtenerCategoriasPorTorneo(torneoId);
      setCategorias(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const crearInscripcion = async (idTorneoCategoria: number, idEquipo: number) => {
    try {
      await inscripcionesService.crear({
        idTorneoCategoria,
        idEquipo,
        observaciones: 'Nueva inscripción'
      });
      
      cargarDatos(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {/* UI aquí */}
    </div>
  );
};
```

---

## 🔧 Manejo de Errores

### Patrón Recomendado

```typescript
try {
  const data = await usuarioService.obtenerTodos();
  // Éxito
} catch (error: any) {
  // Error del backend
  if (error.response?.status === 404) {
    console.error('No encontrado');
  } else if (error.response?.status === 400) {
    console.error('Datos inválidos:', error.response.data.message);
  } else {
    console.error('Error general:', error.message);
  }
}
```

---

## 📝 TypeScript Tips

### Usar tipos correctamente

```typescript
// ✅ Correcto
import type { Usuario } from '../../types';
const usuario: Usuario = await usuarioService.obtenerPorId(1);

// ✅ Correcto con Partial
import type { UsuarioCreateRequest } from '../../types';
const actualizacion: Partial<UsuarioCreateRequest> = {
  email: 'nuevo@email.com'
};

// ✅ Correcto con arrays
import type { Torneo } from '../../types';
const torneos: Torneo[] = await torneoService.obtenerTodos();
```

---

## 🎯 Mejores Prácticas

1. **Siempre usar try-catch**
   ```typescript
   try {
     await service.metodo();
   } catch (error) {
     // Manejar error
   }
   ```

2. **Usar tipos TypeScript**
   ```typescript
   import type { Usuario } from '../../types';
   const usuario: Usuario = ...;
   ```

3. **Importar desde index**
   ```typescript
   import { usuarioService } from '../../services';
   ```

4. **Logs para debugging**
   ```typescript
   console.log('📝 Creando usuario:', data);
   ```

5. **Estados de carga**
   ```typescript
   const [loading, setLoading] = useState(false);
   ```

---

## ✅ Checklist de Uso

- [ ] Importar servicio desde `../../services`
- [ ] Importar tipos desde `../../types`
- [ ] Usar try-catch para errores
- [ ] Manejar estados de carga
- [ ] Mostrar mensajes de error al usuario
- [ ] Recargar datos después de operaciones
- [ ] Usar tipos TypeScript correctamente

---

**¡Listo para usar! 🚀**
