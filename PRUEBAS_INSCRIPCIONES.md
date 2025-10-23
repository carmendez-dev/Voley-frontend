# 🧪 Guía de Pruebas - Módulo de Inscripciones

## ✅ Pre-requisitos

Antes de probar el módulo, asegúrate de:

1. **Backend corriendo** en `http://localhost:8080`
2. **Base de datos** con datos de prueba:
   - Al menos 1 torneo creado
   - Al menos 1 categoría asociada al torneo
   - Al menos 1 equipo creado
3. **Frontend corriendo** con `npm run dev`

---

## 🚀 Iniciar el Frontend

```bash
cd voley-frontend
npm run dev
```

El frontend debería estar disponible en `http://localhost:5173` (o el puerto que Vite asigne).

---

## 📝 Casos de Prueba

### 1. Acceder al Módulo
**Pasos:**
1. Abrir el navegador en `http://localhost:5173`
2. Buscar el menú "Inscripciones" con icono 📝
3. Click en "Inscripciones"

**Resultado esperado:**
- Se muestra la página de Gestión de Inscripciones
- Tabla vacía o con inscripciones existentes
- Botón "Nueva Inscripción" visible

---

### 2. Crear Inscripción Válida
**Pasos:**
1. Click en "Nueva Inscripción"
2. Seleccionar un torneo del dropdown
3. Esperar a que se carguen las categorías
4. Seleccionar una categoría
5. Seleccionar un equipo
6. (Opcional) Agregar observaciones
7. Click en "Crear Inscripción"

**Resultado esperado:**
- Modal se cierra
- Mensaje de éxito (verificar en consola)
- Nueva inscripción aparece en la tabla
- Estado inicial: "INSCRITO" (verde)

---

### 3. Validación de Campos Obligatorios
**Pasos:**
1. Click en "Nueva Inscripción"
2. Intentar enviar sin seleccionar torneo
3. Seleccionar torneo pero no categoría
4. Seleccionar categoría pero no equipo

**Resultado esperado:**
- Mensaje de error: "Por favor complete todos los campos obligatorios"
- Modal permanece abierto
- No se crea la inscripción

---

### 4. Carga Dinámica de Categorías
**Pasos:**
1. Click en "Nueva Inscripción"
2. Observar el dropdown de categorías (debe estar deshabilitado)
3. Seleccionar un torneo
4. Observar el dropdown de categorías

**Resultado esperado:**
- Dropdown de categorías deshabilitado inicialmente
- Mensaje: "Primero seleccione un torneo"
- Al seleccionar torneo, se habilita y carga categorías
- Si el torneo no tiene categorías: mensaje "Este torneo no tiene categorías asociadas"

---

### 5. Ver Detalle de Inscripción
**Pasos:**
1. En la tabla, click en el icono de ojo (👁️) de una inscripción
2. Observar la información mostrada

**Resultado esperado:**
- Modal se abre con información completa
- Campos de solo lectura: ID, Fecha, Torneo, Categoría, Equipo
- Campos editables: Estado, Observaciones
- Botón "Editar" visible

---

### 6. Editar Estado de Inscripción
**Pasos:**
1. Abrir detalle de una inscripción
2. Click en "Editar"
3. Cambiar el estado (ej: de "inscrito" a "retirado")
4. Agregar/modificar observaciones
5. Click en "Guardar Cambios"

**Resultado esperado:**
- Modal se cierra
- Inscripción se actualiza en la tabla
- Badge de estado cambia de color
- Observaciones guardadas

---

### 7. Cancelar Edición
**Pasos:**
1. Abrir detalle de una inscripción
2. Click en "Editar"
3. Cambiar estado y observaciones
4. Click en "Cancelar"

**Resultado esperado:**
- Modo edición se desactiva
- Cambios no se guardan
- Valores originales se restauran

---

### 8. Eliminar Inscripción
**Pasos:**
1. En la tabla, click en el icono de papelera (🗑️)
2. Leer el mensaje de confirmación
3. Click en "Eliminar"

**Resultado esperado:**
- Modal de confirmación se muestra
- Información de la inscripción visible
- Advertencia: "Esta acción no se puede deshacer"
- Al confirmar: inscripción desaparece de la tabla

---

### 9. Cancelar Eliminación
**Pasos:**
1. Click en icono de papelera
2. Click en "Cancelar"

**Resultado esperado:**
- Modal se cierra
- Inscripción permanece en la tabla

---

### 10. Filtrar por Estado
**Pasos:**
1. Crear inscripciones con diferentes estados
2. Usar el dropdown de filtro de estado
3. Seleccionar "Inscrito"
4. Seleccionar "Retirado"
5. Seleccionar "Descalificado"
6. Seleccionar "Todos los estados"

**Resultado esperado:**
- Tabla muestra solo inscripciones del estado seleccionado
- Contador actualizado: "Inscripciones (X)"
- Al seleccionar "Todos": muestra todas

---

### 11. Buscar por Texto
**Pasos:**
1. En el campo de búsqueda, escribir nombre de torneo
2. Escribir nombre de categoría
3. Escribir nombre de equipo
4. Escribir texto que no existe

**Resultado esperado:**
- Tabla filtra en tiempo real
- Búsqueda case-insensitive
- Si no hay resultados: mensaje "No se encontraron inscripciones con los filtros aplicados"

---

### 12. Combinar Filtros
**Pasos:**
1. Seleccionar estado "Inscrito"
2. Escribir texto en búsqueda
3. Observar resultados

**Resultado esperado:**
- Ambos filtros se aplican simultáneamente
- Solo inscripciones que cumplan ambas condiciones

---

### 13. Limpiar Filtros
**Pasos:**
1. Aplicar filtro de estado
2. Escribir en búsqueda
3. Click en "Limpiar Filtros"

**Resultado esperado:**
- Estado vuelve a "Todos los estados"
- Campo de búsqueda se vacía
- Tabla muestra todas las inscripciones

---

### 14. Tabla Vacía
**Pasos:**
1. Eliminar todas las inscripciones
2. O aplicar filtros que no coincidan con ninguna

**Resultado esperado:**
- Icono grande de documento
- Mensaje: "No hay inscripciones"
- Submensaje apropiado según contexto
- Botón "Crear Primera Inscripción" (si no hay filtros)

---

### 15. Manejo de Errores del Backend
**Pasos:**
1. Detener el backend
2. Intentar crear una inscripción
3. Intentar cargar inscripciones

**Resultado esperado:**
- Mensaje de error visible
- No se rompe la aplicación
- Logs en consola del navegador

---

### 16. Estados de Carga
**Pasos:**
1. Observar al cargar la página
2. Observar al crear inscripción
3. Observar al actualizar
4. Observar al eliminar

**Resultado esperado:**
- Spinner de carga al inicio
- Botones muestran "Creando...", "Guardando...", "Eliminando..."
- Botones deshabilitados durante operaciones

---

### 17. Badges de Estado
**Pasos:**
1. Crear inscripciones con cada estado
2. Observar los colores en la tabla

**Resultado esperado:**
- **INSCRITO**: Fondo verde claro, texto verde oscuro
- **RETIRADO**: Fondo amarillo claro, texto amarillo oscuro
- **DESCALIFICADO**: Fondo rojo claro, texto rojo oscuro

---

### 18. Formato de Fecha
**Pasos:**
1. Observar la columna "Fecha" en la tabla
2. Observar la fecha en el modal de detalle

**Resultado esperado:**
- Formato legible (ej: "23/10/2025")
- En detalle: formato con hora (ej: "23/10/2025, 11:30:45")

---

### 19. Responsividad
**Pasos:**
1. Redimensionar ventana del navegador
2. Probar en diferentes tamaños

**Resultado esperado:**
- Tabla con scroll horizontal en pantallas pequeñas
- Modales centrados y responsivos
- Filtros se adaptan al ancho

---

### 20. Navegación
**Pasos:**
1. Desde Inscripciones, ir a otro módulo
2. Volver a Inscripciones

**Resultado esperado:**
- Datos se recargan correctamente
- Filtros se resetean
- No hay errores en consola

---

## 🐛 Errores Comunes y Soluciones

### Error: "Cannot read property 'data' of undefined"
**Causa:** Backend no está corriendo o endpoint incorrecto
**Solución:** Verificar que el backend esté en `http://localhost:8080`

### Error: "Este torneo no tiene categorías asociadas"
**Causa:** El torneo seleccionado no tiene categorías
**Solución:** Asociar categorías al torneo en el módulo de Torneos

### Error: No se cargan las inscripciones
**Causa:** Problema de CORS o backend
**Solución:** Verificar configuración de CORS en el backend

### Error: Modal no se cierra
**Causa:** Error en la operación
**Solución:** Revisar consola del navegador y logs del backend

---

## 📊 Datos de Prueba Recomendados

### Torneos
- Torneo de Verano 2025
- Copa Primavera 2025
- Liga Nacional 2025

### Categorías
- Sub-18 Masculino
- Sub-21 Femenino
- Libre Mixto

### Equipos
- Los Tigres
- Las Águilas
- Los Leones
- Las Panteras

### Inscripciones de Ejemplo
1. Los Tigres → Torneo de Verano → Sub-18 Masculino → Inscrito
2. Las Águilas → Copa Primavera → Sub-21 Femenino → Inscrito
3. Los Leones → Liga Nacional → Libre Mixto → Retirado
4. Las Panteras → Torneo de Verano → Libre Mixto → Descalificado

---

## ✅ Checklist de Pruebas

- [ ] Acceder al módulo
- [ ] Crear inscripción válida
- [ ] Validar campos obligatorios
- [ ] Carga dinámica de categorías
- [ ] Ver detalle
- [ ] Editar estado
- [ ] Cancelar edición
- [ ] Eliminar inscripción
- [ ] Cancelar eliminación
- [ ] Filtrar por estado
- [ ] Buscar por texto
- [ ] Combinar filtros
- [ ] Limpiar filtros
- [ ] Tabla vacía
- [ ] Manejo de errores
- [ ] Estados de carga
- [ ] Badges de estado
- [ ] Formato de fecha
- [ ] Responsividad
- [ ] Navegación

---

## 📝 Reporte de Bugs

Si encuentras un bug, reporta:
1. **Descripción:** ¿Qué pasó?
2. **Pasos para reproducir:** ¿Cómo llegaste ahí?
3. **Resultado esperado:** ¿Qué debería pasar?
4. **Resultado actual:** ¿Qué pasó realmente?
5. **Logs:** Consola del navegador y backend
6. **Navegador:** Chrome, Firefox, etc.

---

**¡Buenas pruebas! 🚀**
