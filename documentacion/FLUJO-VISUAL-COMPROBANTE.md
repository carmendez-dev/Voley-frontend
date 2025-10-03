# 🎨 FLUJO VISUAL: Crear Pago con Comprobante

**Fecha**: 3 de Octubre de 2025

---

## 📱 Flujo de Usuario

### Escenario: Usuario quiere registrar un pago que ya fue realizado

---

## PASO 1: Abrir Modal

```
┌─────────────────────────────────────────────────┐
│  Gestión de Pagos                               │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Estadísticas                                │
│  📋 Tabla de pagos...                           │
│                                                 │
│                          [➕ Crear Pago] ← CLICK│
└─────────────────────────────────────────────────┘
```

---

## PASO 2: Llenar Datos Básicos

```
┌─────────────────────────────────────────────────┐
│  ✖ Crear Nuevo Pago                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  Usuario *                                      │
│  [Juan Pérez - juan@email.com ▼]               │
│                                                 │
│  Mes *              Año *                       │
│  [Octubre ▼]        [2025]                      │
│                                                 │
│  Monto *                                        │
│  [100.00]                                       │
│                                                 │
│  Estado *                                       │
│  [Pendiente ▼]  ← Estado actual                 │
│                                                 │
│  Observaciones                                  │
│  [                           ]                  │
│                                                 │
│                    [Cancelar] [Crear Pago]      │
│                               ↑ HABILITADO      │
└─────────────────────────────────────────────────┘
```

**Estado Actual**:
- ✅ Campos básicos llenos
- ✅ Botón "Crear Pago" habilitado
- ℹ️ Estado = "Pendiente"

---

## PASO 3: Cambiar Estado a "Pagado"

```
┌─────────────────────────────────────────────────┐
│  ✖ Crear Nuevo Pago                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  Usuario *                                      │
│  [Juan Pérez - juan@email.com ▼]               │
│                                                 │
│  Mes *              Año *                       │
│  [Octubre ▼]        [2025]                      │
│                                                 │
│  Monto *                                        │
│  [100.00]                                       │
│                                                 │
│  Estado *                                       │
│  [Pagado ▼]  ← CAMBIÓ A PAGADO                  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ ⚡ NUEVOS CAMPOS APARECEN ABAJO           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Método de Pago * ← NUEVO                       │
│  [Seleccionar método ▼]                         │
│                                                 │
│  Comprobante de Pago * ← NUEVO                  │
│  ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮      │
│  ┆          📷                              ┆      │
│  ┆   Subir comprobante de pago             ┆      │
│  ┆   (JPG, PNG, GIF, WebP - Máx. 5MB)      ┆      │
│  ╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯      │
│                                                 │
│  Observaciones                                  │
│  [Pago realizado mediante transferencia]        │
│                                                 │
│                    [Cancelar] [Crear Pago]      │
│                               ↑ DESHABILITADO   │
└─────────────────────────────────────────────────┘
```

**Estado Actual**:
- ✅ Campos básicos llenos
- ⚠️ Nuevos campos aparecieron (método y comprobante)
- ❌ Método de pago vacío
- ❌ Comprobante no seleccionado
- ❌ Botón "Crear Pago" DESHABILITADO (gris)

**Tooltip del botón**:
```
🖱️ Hover: "Debe seleccionar un método de pago"
```

---

## PASO 4: Seleccionar Método de Pago

```
┌─────────────────────────────────────────────────┐
│  Estado *                                       │
│  [Pagado ▼]                                     │
│                                                 │
│  Método de Pago *                               │
│  [Transferencia Bancaria ▼] ← SELECCIONADO     │
│   ├─ Efectivo                                   │
│   ├─ Transferencia Bancaria ✓                   │
│   ├─ Depósito                                   │
│   ├─ Tarjeta                                    │
│   └─ Otro                                       │
│                                                 │
│  Comprobante de Pago *                          │
│  ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮      │
│  ┆          📷                              ┆      │
│  ┆   Subir comprobante de pago             ┆      │
│  ╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯      │
│                                                 │
│                    [Cancelar] [Crear Pago]      │
│                               ↑ DESHABILITADO   │
└─────────────────────────────────────────────────┘
```

**Estado Actual**:
- ✅ Método de pago seleccionado
- ❌ Comprobante aún falta
- ❌ Botón sigue DESHABILITADO

**Tooltip del botón**:
```
🖱️ Hover: "Debe adjuntar el comprobante de pago"
```

---

## PASO 5: Click en Área de Upload

```
┌─────────────────────────────────────────────────┐
│  Comprobante de Pago *                          │
│  ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮      │
│  ┆          📷  ← CLICK AQUÍ                ┆      │
│  ┆   Subir comprobante de pago             ┆      │
│  ╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯      │
└─────────────────────────────────────────────────┘

         ↓ Se abre selector de archivos

┌─────────────────────────────────────────────────┐
│  📁 Seleccionar archivo                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  📄 comprobante_octubre.jpg    (245 KB)        │
│  📄 recibo_pago.png            (512 KB)        │
│  📄 transferencia.jpg          (189 KB)  ← SELECT│
│  📄 comprobante.pdf            (1.2 MB)        │
│                                                 │
│               [Cancelar]  [Abrir]               │
└─────────────────────────────────────────────────┘
```

---

## PASO 6: Comprobante Seleccionado

```
┌─────────────────────────────────────────────────┐
│  Método de Pago *                               │
│  [Transferencia Bancaria ▼]                     │
│                                                 │
│  Comprobante de Pago *                          │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃                                      [✖]┃  │ ← Botón eliminar
│  ┃  ╔══════════════════════════════╗    ┃  │
│  ┃  ║                              ║    ┃  │
│  ┃  ║  [Preview de la imagen]      ║    ┃  │
│  ┃  ║  transferencia.jpg           ║    ┃  │
│  ┃  ║                              ║    ┃  │
│  ┃  ╚══════════════════════════════╝    ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│     ↑ Borde VERDE                               │
│                                                 │
│  ✅ Comprobante listo para subir                │
│                                                 │
│  Observaciones                                  │
│  [Pago realizado mediante transferencia]        │
│                                                 │
│                    [Cancelar] [Crear Pago]      │
│                               ↑ HABILITADO ✅   │
└─────────────────────────────────────────────────┘
```

**Estado Actual**:
- ✅ Usuario seleccionado
- ✅ Período y monto llenos
- ✅ Estado = "Pagado"
- ✅ Método de pago seleccionado
- ✅ Comprobante adjunto (con preview)
- ✅ Botón "Crear Pago" HABILITADO (azul)

**Visual**:
- 🟢 Borde verde alrededor del comprobante
- ✅ Mensaje "Comprobante listo para subir"
- 🔵 Botón azul habilitado

---

## PASO 7: Click en "Crear Pago"

```
┌─────────────────────────────────────────────────┐
│  ✖ Crear Nuevo Pago                             │
├─────────────────────────────────────────────────┤
│                                                 │
│            ⏳ Creando pago...                    │
│                                                 │
│  [████████████████████░░░░░░░░] 75%            │
│                                                 │
│  ✅ Pago creado con ID: 126                     │
│  📤 Subiendo comprobante...                     │
│                                                 │
│                    [Cancelar] [Creando...]      │
│                               ↑ DESHABILITADO   │
└─────────────────────────────────────────────────┘
```

---

## PASO 8: Pago Creado Exitosamente

```
┌─────────────────────────────────────────────────┐
│  ✖ Crear Nuevo Pago                             │
├─────────────────────────────────────────────────┤
│                                                 │
│         ✅ ¡Pago creado exitosamente!           │
│                                                 │
│  ✓ Pago registrado                              │
│  ✓ Comprobante subido                           │
│                                                 │
│            Modal se cierra en 2s...             │
│                                                 │
└─────────────────────────────────────────────────┘

         ↓ Modal se cierra automáticamente

┌─────────────────────────────────────────────────┐
│  Gestión de Pagos                               │
├─────────────────────────────────────────────────┤
│  📊 Estadísticas                                │
│                                                 │
│  📋 Tabla de Pagos                              │
│  ┌─────────────────────────────────────────┐   │
│  │ ID │ Usuario     │ Período │ Estado    │   │
│  ├────┼─────────────┼─────────┼───────────┤   │
│  │126 │ Juan Pérez  │ 10/2025 │🟢 Pagado  │ ← NUEVO
│  │125 │ María López │ 09/2025 │🟡 Pendiente│   │
│  │124 │ Carlos Ruiz │ 09/2025 │🔴 Atrasado│   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Resultado**:
- ✅ Pago aparece en la tabla
- ✅ Estado "Pagado" con badge verde
- ✅ Método: "Transferencia Bancaria"
- ✅ Comprobante: icono 📎 o enlace

---

## 🎭 CASO ALTERNATIVO: Usuario cambia de opinión

### Usuario llena todo y luego cambia estado a "Pendiente"

```
┌─────────────────────────────────────────────────┐
│  Estado *                                       │
│  [Pagado ▼]  ← Cambia a [Pendiente ▼]          │
│                                                 │
│  Método de Pago * ← LLENO                       │
│  [Transferencia Bancaria ▼]                     │
│                                                 │
│  Comprobante de Pago * ← CON IMAGEN             │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃  [Preview de imagen]                 ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                                 │
└─────────────────────────────────────────────────┘

         ↓ Usuario cambia a "Pendiente"

┌─────────────────────────────────────────────────┐
│  Estado *                                       │
│  [Pendiente ▼]  ← CAMBIÓ                        │
│                                                 │
│  ❌ Campos desaparecieron                       │
│  ❌ Método de pago limpiado                     │
│  ❌ Comprobante eliminado                       │
│                                                 │
│  Observaciones                                  │
│  [Pago realizado mediante transferencia]        │
│                                                 │
│                    [Cancelar] [Crear Pago]      │
│                               ↑ HABILITADO ✅   │
└─────────────────────────────────────────────────┘
```

**Comportamiento**:
- 🧹 Limpieza automática de campos
- ✅ Botón habilitado (ya no requiere método ni comprobante)
- ℹ️ Usuario puede crear pago "Pendiente" sin comprobante

---

## 🚫 CASO DE ERROR: Archivo Inválido

### Usuario intenta subir un PDF

```
┌─────────────────────────────────────────────────┐
│  Comprobante de Pago *                          │
│  ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮      │
│  ┆          📷                              ┆      │
│  ┆   Subir comprobante de pago             ┆      │
│  ╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯      │
└─────────────────────────────────────────────────┘

         ↓ Selecciona comprobante.pdf

┌─────────────────────────────────────────────────┐
│  ⚠️ ERROR                                       │
│  ┌───────────────────────────────────────────┐ │
│  │ ❌ El comprobante debe ser una imagen    │ │
│  │    (JPG, PNG, etc.)                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Comprobante de Pago *                          │
│  ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮      │
│  ┆          📷                              ┆      │
│  ┆   Subir comprobante de pago             ┆      │
│  ╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯      │
│                                                 │
│                    [Cancelar] [Crear Pago]      │
│                               ↑ DESHABILITADO   │
└─────────────────────────────────────────────────┘
```

**Comportamiento**:
- ❌ Archivo rechazado
- 🔴 Mensaje de error claro
- ❌ Comprobante no se cargó
- ❌ Botón sigue deshabilitado

---

## 📊 Resumen del Flujo

```
Inicio
  │
  ├─→ Abrir Modal "Crear Pago"
  │
  ├─→ Llenar datos básicos
  │   ├─ Usuario
  │   ├─ Período
  │   ├─ Monto
  │   └─ Estado [Pendiente]
  │
  ├─→ ¿Estado = "Pagado"?
  │   │
  │   ├─ NO → Crear pago directamente ✅
  │   │
  │   └─ SÍ → Mostrar campos adicionales
  │       │
  │       ├─→ Método de Pago (obligatorio)
  │       │   └─ Botón deshabilitado si vacío
  │       │
  │       ├─→ Comprobante (obligatorio)
  │       │   ├─ Validar tipo (solo imágenes)
  │       │   ├─ Validar tamaño (máx 5MB)
  │       │   ├─ Mostrar preview
  │       │   └─ Botón deshabilitado si vacío
  │       │
  │       └─→ Ambos campos completos
  │           └─ Habilitar botón "Crear Pago"
  │
  ├─→ Click "Crear Pago"
  │   │
  │   ├─→ Validar formulario
  │   │
  │   ├─→ Crear pago (POST /api/pagos)
  │   │
  │   ├─→ Subir comprobante (POST /api/upload/comprobantes)
  │   │
  │   └─→ Cerrar modal y actualizar tabla
  │
  └─→ FIN ✅
```

---

## 🎯 Puntos Clave

### Para el Usuario

1. ✨ **Claridad**: Campos marcados con * son obligatorios
2. 🎨 **Feedback Visual**: Borde verde = listo, gris = falta algo
3. 🚫 **Prevención**: No puede crear pago "pagado" sin comprobante
4. 👁️ **Preview**: Ve la imagen antes de subirla

### Para el Sistema

1. 🔒 **Integridad**: Todos los pagos "pagados" tienen evidencia
2. 📸 **Auditoría**: Comprobante guardado automáticamente
3. ✅ **Validación**: Frontend + Backend
4. 📊 **Trazabilidad**: Método de pago registrado

---

**Última actualización**: 3 de Octubre de 2025  
**Estado**: ✅ DOCUMENTADO
