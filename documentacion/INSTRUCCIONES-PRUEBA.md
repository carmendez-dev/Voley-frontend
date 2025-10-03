# 🧪 INSTRUCCIONES DE PRUEBA - Sistema de Pagos

**Fecha**: 3 de Enero de 2025

---

## ⚡ Inicio Rápido

### 1. Hard Reload del Navegador

**IMPORTANTE**: Antes de cualquier prueba, hacer hard reload para limpiar cache:

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

O:

```
Windows/Linux: Ctrl + F5
Mac: Cmd + Shift + Delete (limpiar cache)
```

---

### 2. Abrir DevTools

Presionar **F12** o **Ctrl + Shift + I** para abrir las herramientas de desarrollo.

**Pestañas importantes**:
- **Console**: Ver logs del sistema
- **Network**: Ver requests/responses HTTP

---

## 🎯 Prueba 1: Crear Pago Básico (Sin Comprobante)

### Objetivo
Verificar que el sistema crea un pago correctamente con el formato de backend esperado.

### Pasos

1. **Navegar a Gestión de Pagos**:
   - Click en "Gestión de Pagos" en el menú lateral

2. **Abrir Modal de Creación**:
   - Click en botón "Crear Pago" (esquina superior derecha)

3. **Llenar Formulario**:
   ```
   Usuario:         [Seleccionar cualquier usuario, ej: id=8]
   Período Mes:     11 (Noviembre)
   Período Año:     2025
   Monto:           80
   Estado:          pendiente
   Método de Pago:  TRANSFERENCIA_BANCARIA
   Observaciones:   Pago de prueba básico
   Comprobante:     [NO seleccionar archivo]
   ```

4. **Verificar Botón Habilitado**:
   - El botón "Crear Pago" debe estar habilitado (azul)
   - Si está gris, verificar que hay usuario seleccionado

5. **Enviar Formulario**:
   - Click en "Crear Pago"

### Verificaciones en Network Tab

**Request a `/api/pagos`**:

**Method**: POST  
**URL**: `http://localhost:8080/api/pagos`  
**Content-Type**: `application/json`

**Request Payload**:
```json
{
  "usuario": {
    "id": 8
  },
  "periodoMes": 11,
  "periodoAnio": 2025,
  "monto": 80,
  "estado": "pendiente",
  "metodoPago": "TRANSFERENCIA_BANCARIA",
  "observaciones": "Pago de prueba básico"
}
```

**Response Esperada**:
```json
{
  "success": true,
  "message": "Pago creado exitosamente",
  "data": {
    "id": 123,
    "usuario": {
      "id": 8,
      "nombreCompleto": "Juan Pérez",
      ...
    },
    "periodoMes": 11,
    "periodoAnio": 2025,
    "monto": 80,
    "estado": "pendiente",
    "metodoPago": "TRANSFERENCIA_BANCARIA",
    "observaciones": "Pago de prueba básico",
    "fechaCreacion": "2025-01-03T...",
    ...
  }
}
```

**Status Code**: 201 Created

### Verificaciones en Console

Deberías ver:
```
📤 Creando pago (sin comprobante): {usuario: {id: 8}, periodoMes: 11, ...}
✅ Pago creado con ID: 123
```

### Verificaciones en UI

1. ✅ Modal se cierra automáticamente
2. ✅ Tabla de pagos se recarga
3. ✅ Nuevo pago aparece en la tabla con:
   - Usuario: Juan Pérez (o el seleccionado)
   - Período: 11/2025
   - Monto: $80.00
   - Estado: Badge "pendiente" (amarillo)
   - Método: TRANSFERENCIA_BANCARIA

### ✅ Resultado Esperado

- **Status**: 201 Created
- **Payload**: Formato correcto con `{usuario: {id: 8}}`
- **Pago creado**: Aparece en tabla
- **Sin errores**: En console ni en network

---

## 🎯 Prueba 2: Crear Pago Con Comprobante

### Objetivo
Verificar el flujo completo: crear pago → subir comprobante → actualizar pago.

### Preparación

Tener una imagen lista (jpg, png, gif, webp) de menos de 5MB.

### Pasos

1. **Navegar a Gestión de Pagos**

2. **Abrir Modal de Creación**

3. **Llenar Formulario**:
   ```
   Usuario:         [Seleccionar usuario, ej: id=10]
   Período Mes:     12 (Diciembre)
   Período Año:     2024
   Monto:           100
   Estado:          pagado
   Método de Pago:  EFECTIVO
   Observaciones:   Pago con comprobante
   Comprobante:     [SELECCIONAR IMAGEN]
   ```

4. **Seleccionar Comprobante**:
   - Click en el input de archivo
   - Seleccionar una imagen (jpg, png, etc.)

5. **Verificar Preview**:
   - Debe aparecer preview de la imagen debajo del input
   - Debe mostrar el nombre del archivo

6. **Enviar Formulario**:
   - Click en "Crear Pago"

### Verificaciones en Network Tab

**Primera Request - Crear Pago**:

**Method**: POST  
**URL**: `http://localhost:8080/api/pagos`  
**Content-Type**: `application/json`

**Request Payload**:
```json
{
  "usuario": {
    "id": 10
  },
  "periodoMes": 12,
  "periodoAnio": 2024,
  "monto": 100,
  "estado": "pagado",
  "metodoPago": "EFECTIVO",
  "observaciones": "Pago con comprobante"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 124,  // ⚠️ Importante: este ID se usa para subir
    ...
  }
}
```

---

**Segunda Request - Subir Comprobante**:

**Method**: POST  
**URL**: `http://localhost:8080/api/upload/comprobantes`  
**Content-Type**: `multipart/form-data`

**Form Data**:
```
comprobante: [archivo binario]
pagoId: 124
```

**Response**:
```json
{
  "success": true,
  "data": {
    "ruta": "uploads/comprobantes/comp_124_20250103.jpg"
  }
}
```

### Verificaciones en Console

Deberías ver:
```
📤 Creando pago (sin comprobante): {usuario: {id: 10}, periodoMes: 12, ...}
✅ Pago creado con ID: 124
📤 Subiendo comprobante para pago ID: 124
✅ Comprobante subido: uploads/comprobantes/comp_124_20250103.jpg
```

### Verificaciones en UI

1. ✅ Modal se cierra
2. ✅ Tabla se recarga
3. ✅ Nuevo pago aparece con:
   - Comprobante: ícono o enlace al archivo
   - Estado: Badge "pagado" (verde)

### ✅ Resultado Esperado

- **Primera request**: 201 Created
- **Segunda request**: 200 OK con ruta del archivo
- **Orden correcto**: Crear pago PRIMERO, luego subir
- **pagoId enviado**: En FormData de upload

---

## 🎯 Prueba 3: Validación de Usuario

### Objetivo
Verificar que no se puede crear un pago sin usuario.

### Pasos

1. **Abrir Modal de Creación**

2. **NO seleccionar usuario**:
   - Dejar el select en "Selecciona un usuario"

3. **Llenar resto del formulario**:
   ```
   Período Mes:  1
   Período Año:  2025
   Monto:        50
   Estado:       pendiente
   ```

4. **Verificar Botón Deshabilitado**:
   - El botón "Crear Pago" debe estar **GRIS**
   - No debe ser clickeable

5. **Intentar enviar** (no debería poder):
   - Click en botón deshabilitado
   - NO debe pasar nada

### ✅ Resultado Esperado

- **Botón deshabilitado**: Gris, no clickeable
- **Sin request**: No se envía nada al backend
- **Validación frontend**: Previene envío inválido

---

## 🎯 Prueba 4: Validación de Comprobante

### Objetivo
Verificar que solo se aceptan archivos de imagen y menores a 5MB.

### Pasos Caso 1: Archivo No Válido (PDF)

1. **Abrir Modal**

2. **Intentar subir PDF**:
   - Click en input de archivo
   - Seleccionar un archivo PDF

3. **Verificar Rechazo**:
   - Debe aparecer mensaje de error
   - Archivo no debe cargarse
   - No debe aparecer preview

**Mensaje Esperado**:
```
Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)
```

### Pasos Caso 2: Archivo Muy Grande (>5MB)

1. **Abrir Modal**

2. **Intentar subir imagen grande**:
   - Seleccionar imagen mayor a 5MB

3. **Verificar Rechazo**:
   - Debe aparecer mensaje de error
   - Archivo no debe cargarse

**Mensaje Esperado**:
```
El archivo no debe superar los 5MB
```

### ✅ Resultado Esperado

- **Validación de tipo**: Solo imágenes (jpg, png, gif, webp)
- **Validación de tamaño**: Máximo 5MB
- **Mensajes claros**: Indica el problema
- **Sin crash**: Sistema sigue funcionando

---

## 🎯 Prueba 5: Ver Detalles de Pago

### Objetivo
Verificar que se pueden ver los detalles completos de un pago.

### Pasos

1. **En la tabla de pagos**:
   - Localizar un pago con comprobante

2. **Abrir detalles**:
   - Click en botón "Ver Detalle" o ícono 👁️

3. **Verificar Modal de Detalles**:
   - Debe mostrar:
     - Usuario completo
     - Período (mes/año)
     - Monto
     - Estado
     - Método de pago
     - Comprobante (imagen o enlace)
     - Observaciones
     - Fechas (creación, actualización)

### ✅ Resultado Esperado

- **Modal se abre**: Sin errores
- **Datos completos**: Toda la información del pago
- **Imagen visible**: Si tiene comprobante

---

## 🐛 Troubleshooting

### Problema: "El usuario del pago no puede ser nulo"

**Síntoma**: Error 400 con este mensaje

**Diagnóstico**:
1. Abrir Network Tab
2. Ver Request Payload
3. Verificar estructura de `usuario`

**Debe ser**:
```json
{
  "usuario": {
    "id": 8
  }
}
```

**NO debe ser**:
```json
{
  "usuarioId": 8
}
```

```json
{
  "usuario_id": 8
}
```

**Solución**: El archivo `api.ts` ya hace esta conversión. Si ves el error, verificar logs en console.

---

### Problema: Campos con guiones bajos en payload

**Síntoma**: Backend rechaza con error de campos no reconocidos

**Diagnóstico**:
Ver Request Payload en Network Tab

**Debe usar camelCase**:
```json
{
  "periodoMes": 11,
  "periodoAnio": 2025,
  "metodoPago": "TRANSFERENCIA_BANCARIA"
}
```

**NO debe usar snake_case**:
```json
{
  "periodo_mes": 11,
  "periodo_anio": 2025,
  "metodo_pago": "TRANSFERENCIA_BANCARIA"
}
```

**Solución**: Los archivos ya están corregidos. Si ves snake_case, algo está mal.

---

### Problema: Comprobante no se sube

**Síntoma**: Pago se crea pero no tiene comprobante

**Diagnóstico**:
1. Ver Console logs
2. Verificar orden de requests en Network Tab

**Debe ser**:
```
1. POST /api/pagos (sin comprobante)
2. POST /api/upload/comprobantes (con pagoId)
```

**NO debe ser**:
```
1. POST /api/upload/comprobantes
2. POST /api/pagos
```

**Verificar en Console**:
```
✅ Correcto:
📤 Creando pago (sin comprobante)
✅ Pago creado con ID: 123
📤 Subiendo comprobante para pago ID: 123
✅ Comprobante subido

❌ Incorrecto:
📤 Subiendo comprobante
❌ Error: pagoId no definido
```

---

### Problema: Botón siempre deshabilitado

**Síntoma**: No puedo enviar el formulario aunque haya seleccionado usuario

**Diagnóstico**:
1. Abrir React DevTools
2. Ver estado del componente `CrearPagoModal`
3. Verificar `formData.usuarioId`

**Debe ser**:
```javascript
formData = {
  usuarioId: 8,  // Número válido
  ...
}
```

**NO debe ser**:
```javascript
formData = {
  usuarioId: undefined,  // ❌ Undefined
  ...
}
```

```javascript
formData = {
  usuarioId: 0,  // ❌ Cero
  ...
}
```

**Solución**: Verificar que el select tiene `value={formData.usuarioId || ''}` y `onChange` convierte correctamente.

---

## 📊 Checklist Final

Antes de dar por terminadas las pruebas:

- [ ] ✅ Crear pago sin comprobante funciona
- [ ] ✅ Crear pago con comprobante funciona
- [ ] ✅ Request tiene formato correcto: `{usuario: {id: 8}}`
- [ ] ✅ Todos los campos usan camelCase
- [ ] ✅ Upload ocurre DESPUÉS de crear pago
- [ ] ✅ pagoId se envía en FormData de upload
- [ ] ✅ Validación de usuario funciona (botón deshabilitado)
- [ ] ✅ Validación de archivo funciona (tipo y tamaño)
- [ ] ✅ Modal se cierra después de crear
- [ ] ✅ Tabla se recarga automáticamente
- [ ] ✅ Sin errores en console
- [ ] ✅ Sin errores en network tab (excepto errores esperados de validación)

---

## 🎉 ¡Pruebas Completadas!

Si todos los checks están en verde, el sistema está funcionando correctamente y listo para producción.

---

**Última actualización**: 3 de Enero de 2025
