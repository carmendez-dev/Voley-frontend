# 🧪 PRUEBA RÁPIDA: Comprobante Obligatorio en Pagos

**Fecha**: 3 de Octubre de 2025  
**Función**: Crear pago con estado "Pagado" y comprobante obligatorio

---

## ⚡ Inicio Rápido

### 1. Recargar la Aplicación

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### 2. Abrir DevTools

Presionar **F12** → Ir a pestaña **Console**

---

## 🎯 Prueba 1: Crear Pago con Estado "Pagado"

### Pasos

1. **Ir a "Gestión de Pagos"**
   - Click en el menú lateral

2. **Abrir Modal**
   - Click en botón "Crear Pago"

3. **Llenar Formulario Básico**
   ```
   Usuario:     [Seleccionar cualquier usuario]
   Mes:         Octubre (10)
   Año:         2025
   Monto:       100
   ```

4. **Seleccionar Estado "Pagado"**
   ```
   Estado: [Pagado ▼]
   ```

5. **Verificar que Aparecen Nuevos Campos**
   
   Deberías ver:
   
   ✅ Campo "Método de Pago *" (con asterisco rojo)
   ```
   ┌──────────────────────────────┐
   │ Método de Pago *             │
   │ [Seleccionar método ▼]       │
   └──────────────────────────────┘
   ```
   
   ✅ Campo "Comprobante de Pago *" (con asterisco rojo)
   ```
   ┌──────────────────────────────┐
   │ Comprobante de Pago *        │
   │ ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮ │
   │ ┆    📷                    ┆ │
   │ ┆ Subir comprobante de pago┆ │
   │ ╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯ │
   └──────────────────────────────┘
   ```

6. **Verificar Botón Deshabilitado**
   
   El botón "Crear Pago" debe estar **GRIS** y deshabilitado
   
   ```
   [Cancelar]  [Crear Pago]  ← GRIS/DESHABILITADO
   ```

7. **Seleccionar Método de Pago**
   ```
   Método de Pago: [Transferencia Bancaria ▼]
   ```
   
   ⚠️ Botón sigue deshabilitado (falta comprobante)

8. **Adjuntar Comprobante**
   
   - Click en el área de upload
   - Seleccionar una imagen (JPG, PNG, etc.)
   
   Deberías ver:
   
   ✅ Preview de la imagen
   ```
   ┌──────────────────────────────┐
   │ Comprobante de Pago *        │
   │ ┏━━━━━━━━━━━━━━━━━━━━━━┓   │
   │ ┃ [Imagen Preview]   [X]┃   │
   │ ┃                       ┃   │
   │ ┗━━━━━━━━━━━━━━━━━━━━━━┛   │
   │ ✅ Comprobante listo para   │
   │    subir                    │
   └──────────────────────────────┘
   ```
   
   ✅ Borde verde alrededor de la imagen
   
   ✅ Mensaje "Comprobante listo para subir" con ícono ✅

9. **Verificar Botón Habilitado**
   
   Ahora el botón debe estar **AZUL** y habilitado
   
   ```
   [Cancelar]  [Crear Pago]  ← AZUL/HABILITADO
   ```

10. **Enviar Formulario**
    
    - Click en "Crear Pago"

### Resultado Esperado

**En Console**:
```
📋 FormData antes de enviar: {
  usuarioId: X,
  periodoMes: 10,
  periodoAnio: 2025,
  monto: 100,
  estado: "pagado",
  metodoPago: "TRANSFERENCIA_BANCARIA",
  comprobante: File {...},
  observaciones: ""
}

📤 Creando pago (sin comprobante): {...}
✅ Pago creado con ID: 126
📤 Subiendo comprobante para pago ID: 126
✅ Comprobante subido: uploads/comprobantes/comp_126_20251003.jpg
✅ Pago creado exitosamente
```

**En UI**:
- ✅ Modal se cierra
- ✅ Tabla se actualiza
- ✅ Nuevo pago aparece con:
  - Estado: Badge verde "pagado"
  - Método: Transferencia Bancaria
  - Comprobante: ícono o enlace

---

## 🎯 Prueba 2: Intentar Crear Pago "Pagado" Sin Comprobante

### Pasos

1. Abrir modal "Crear Pago"

2. Llenar datos básicos

3. Seleccionar estado "Pagado"

4. Seleccionar método de pago

5. **NO adjuntar comprobante**

6. Verificar botón

### Resultado Esperado

❌ **Botón "Crear Pago" DESHABILITADO (gris)**

Al pasar el mouse sobre el botón:
```
Tooltip: "Debe adjuntar el comprobante de pago"
```

---

## 🎯 Prueba 3: Cambiar Estado de "Pagado" a "Pendiente"

### Pasos

1. Abrir modal "Crear Pago"

2. Llenar datos básicos

3. Seleccionar estado "Pagado"

4. Seleccionar método de pago: "Transferencia Bancaria"

5. Adjuntar comprobante (ver preview)

6. **Cambiar estado a "Pendiente"**

### Resultado Esperado

✅ **Campos desaparecen**:
- Campo "Método de Pago" → Oculto
- Campo "Comprobante" → Oculto

✅ **Datos se limpian**:
- metodoPago = ""
- comprobante = null
- imagePreview = null

✅ **Botón se habilita**:
- Ya no requiere método ni comprobante

---

## 🎯 Prueba 4: Validación de Archivo Inválido

### Caso A: Archivo PDF

**Pasos**:
1. Crear pago con estado "Pagado"
2. Intentar subir un PDF

**Resultado**:
```
❌ Error: "El comprobante debe ser una imagen (JPG, PNG, etc.)"
```

### Caso B: Imagen Muy Grande (>5MB)

**Pasos**:
1. Crear pago con estado "Pagado"
2. Intentar subir imagen de 6MB

**Resultado**:
```
❌ Error: "La imagen no debe superar los 5MB"
```

---

## 🎯 Prueba 5: Crear Pago "Pendiente" (Sin Comprobante)

### Pasos

1. Abrir modal

2. Llenar datos:
   ```
   Usuario: [Seleccionar]
   Mes: 10
   Año: 2025
   Monto: 80
   Estado: Pendiente
   ```

3. Verificar que NO aparecen:
   - ❌ Campo "Método de Pago"
   - ❌ Campo "Comprobante"

4. Click "Crear Pago"

### Resultado Esperado

✅ Pago se crea exitosamente
✅ Sin método de pago
✅ Sin comprobante
✅ Todo normal

---

## ✅ Checklist de Verificación

- [ ] Al seleccionar "Pagado", aparecen campos de método y comprobante
- [ ] Ambos campos tienen asterisco (*) indicando obligatorio
- [ ] Botón deshabilitado sin método de pago
- [ ] Botón deshabilitado sin comprobante
- [ ] Preview de imagen funciona correctamente
- [ ] Borde verde en imagen seleccionada
- [ ] Mensaje "Comprobante listo para subir" aparece
- [ ] Al cambiar de "Pagado" a otro estado, campos desaparecen
- [ ] Datos se limpian al cambiar de estado
- [ ] Validación de tipo de archivo funciona (rechaza PDF)
- [ ] Validación de tamaño funciona (rechaza >5MB)
- [ ] Crear pago "Pendiente" funciona sin comprobante
- [ ] Logs en console muestran el flujo correcto
- [ ] Comprobante se sube después de crear pago
- [ ] Pago aparece en tabla con comprobante

---

## 🐛 Problemas Comunes

### Problema: Botón siempre deshabilitado

**Causa**: Probablemente falta seleccionar usuario

**Solución**: Verificar que se haya seleccionado un usuario del dropdown

---

### Problema: No aparecen campos de método y comprobante

**Causa**: Estado no es "Pagado"

**Solución**: Seleccionar exactamente "Pagado" en el dropdown de estado

---

### Problema: Error al subir comprobante

**Causa 1**: Archivo no es una imagen
**Solución**: Usar JPG, PNG, GIF o WebP

**Causa 2**: Archivo muy grande (>5MB)
**Solución**: Reducir tamaño de imagen o usar otra

---

## 📊 Comparación Antes vs Después

### ANTES

| Estado | Método de Pago | Comprobante |
|--------|----------------|-------------|
| Pendiente | ❌ No visible | ⚠️ Opcional (visible) |
| Pagado | ⚠️ Opcional (visible) | ⚠️ Opcional (visible) |
| Atrasado | ❌ No visible | ⚠️ Opcional (visible) |

**Problema**: Se podían crear pagos "pagados" sin comprobante ❌

---

### DESPUÉS

| Estado | Método de Pago | Comprobante |
|--------|----------------|-------------|
| Pendiente | ❌ No visible | ❌ No visible |
| **Pagado** | **✅ Obligatorio** | **✅ Obligatorio** |
| Atrasado | ❌ No visible | ❌ No visible |
| Rechazado | ❌ No visible | ❌ No visible |

**Solución**: Pagos "pagados" SIEMPRE tienen método y comprobante ✅

---

## 🎉 Resumen

### Lo Nuevo

1. ✅ **Comprobante obligatorio** cuando estado = "Pagado"
2. ✅ **Método de pago obligatorio** cuando estado = "Pagado"
3. ✅ **Validación automática** en tiempo real
4. ✅ **Botón inteligente** (se habilita/deshabilita según contexto)
5. ✅ **Limpieza automática** al cambiar de estado

### Beneficios

- 🔒 **Integridad de datos**: No hay pagos "pagados" sin evidencia
- 📸 **Auditoría completa**: Todos los pagos tienen comprobante
- 🎯 **UX mejorada**: Usuario sabe exactamente qué es obligatorio
- ⚡ **Prevención de errores**: Validación antes de enviar

---

**Última actualización**: 3 de Octubre de 2025  
**Estado**: ✅ LISTO PARA PROBAR

---

## 🚀 ¡Listo!

El sistema ahora **garantiza** que todos los pagos con estado "Pagado" tengan su comprobante correspondiente.

**Próximo paso**: ¡Probar la funcionalidad! 🧪
