# 🧪 Guía de Pruebas - Subida de Comprobante

## ✅ Checklist de Pruebas

### 1️⃣ Crear Pago sin Comprobante (estado = "pendiente")

**Pasos:**
1. Ir a "Gestión de Pagos"
2. Click "Nuevo Pago"
3. Seleccionar usuario
4. Ingresar monto: 150
5. **Estado: "Pendiente"**
6. Click "Crear Pago"

**Resultado Esperado:**
- ✅ Pago se crea exitosamente
- ✅ Modal se cierra automáticamente
- ✅ NO aparece modal de comprobante
- ✅ Lista se actualiza con el nuevo pago

**Request esperado:**
```
POST /api/pagos
{
  "usuarioId": 5,
  "monto": 150,
  "periodoMes": 10,
  "periodoAnio": 2025,
  "estado": "pendiente"
}
```

---

### 2️⃣ Crear Pago con Comprobante (estado = "pagado")

**Pasos:**
1. Ir a "Gestión de Pagos"
2. Click "Nuevo Pago"
3. Seleccionar usuario
4. Ingresar monto: 150
5. **Estado: "Pagado"**
6. Método de pago: "Transferencia"
7. Click "Crear Pago"

**Resultado Esperado (Paso 1):**
- ✅ Pago se crea exitosamente
- ✅ Modal principal se oculta
- ✅ **Modal de comprobante aparece automáticamente**
- ✅ Muestra "Pago ID: #32"

**Request esperado:**
```
POST /api/pagos
{
  "usuarioId": 5,
  "monto": 150,
  "periodoMes": 10,
  "periodoAnio": 2025,
  "estado": "pagado",
  "metodoPago": "transferencia"
}

Response:
{
  "success": true,
  "data": {
    "id": 32,
    "usuarioId": 5,
    "monto": 150,
    ...
  }
}
```

**Pasos (continuación):**
8. En modal de comprobante, click "Seleccionar Imagen"
9. Elegir archivo `recibo.jpg` (< 5MB)
10. Verificar preview de imagen
11. Click "Subir Comprobante"

**Resultado Esperado (Paso 2):**
- ✅ Se muestra "Subiendo..."
- ✅ Request se envía correctamente
- ✅ Modal se cierra
- ✅ Lista se actualiza
- ✅ Mensaje de éxito

**Request esperado:**
```
POST /api/pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia
Content-Type: multipart/form-data

FormData:
  comprobante: [recibo.jpg - image/jpeg - 245KB]

Response:
{
  "success": true,
  "message": "Pago procesado correctamente",
  "data": {
    "ruta": "uploads/comprobantes/comp_32_20251003_150050.jpg",
    "pagoId": 32
  }
}
```

---

### 3️⃣ Omitir Subida de Comprobante

**Pasos:**
1. Seguir pasos 1-7 del caso anterior
2. En modal de comprobante, click "Omitir"

**Resultado Esperado:**
- ✅ Modal se cierra inmediatamente
- ✅ **NO se envía request de upload**
- ✅ Pago queda creado sin comprobante
- ✅ Lista se actualiza

---

### 4️⃣ Validación de Archivo

**Caso A: Archivo no es imagen**

**Pasos:**
1. Crear pago pagado
2. En modal comprobante, seleccionar `documento.pdf`

**Resultado Esperado:**
- ❌ Error: "El comprobante debe ser una imagen (JPG, PNG, etc.)"
- ✅ No se sube archivo
- ✅ No se muestra preview

**Caso B: Archivo muy grande**

**Pasos:**
1. Crear pago pagado
2. En modal comprobante, seleccionar `foto.jpg` (> 5MB)

**Resultado Esperado:**
- ❌ Error: "La imagen no debe superar los 5MB"
- ✅ No se sube archivo
- ✅ No se muestra preview

**Caso C: Archivo válido**

**Pasos:**
1. Crear pago pagado
2. En modal comprobante, seleccionar `recibo.jpg` (2MB, image/jpeg)

**Resultado Esperado:**
- ✅ Preview de imagen se muestra
- ✅ Badge verde: "Comprobante listo para subir"
- ✅ Botón "Subir Comprobante" habilitado

---

### 5️⃣ Editar Estado de Pago Existente

**Pasos:**
1. Buscar pago con estado "Pendiente"
2. Click en botón de editar
3. Cambiar estado a "Pagado"
4. Seleccionar método de pago
5. Seleccionar comprobante
6. Click "Actualizar Estado"

**Resultado Esperado:**
- ✅ Request de upload se envía
- ✅ Estado se actualiza a "Pagado"
- ✅ Comprobante se guarda
- ✅ Lista se actualiza

**Request esperado:**
```
POST /api/pagos/15/procesar?usuarioId=3&monto=200&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=efectivo
Content-Type: multipart/form-data

FormData:
  comprobante: [comprobante.jpg]
```

---

## 🔍 Verificación en DevTools (Network Tab)

### Request de Creación de Pago
```
POST http://localhost:8080/api/pagos
Status: 200 OK

Request Headers:
Content-Type: application/json

Request Payload:
{
  "usuarioId": 5,
  "monto": 150,
  "periodoMes": 10,
  "periodoAnio": 2025,
  "estado": "pagado",
  "metodoPago": "transferencia"
}

Response:
{
  "success": true,
  "data": {
    "id": 32,
    "usuarioId": 5,
    "monto": 150,
    ...
  }
}
```

### Request de Upload de Comprobante
```
POST http://localhost:8080/api/pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia
Status: 200 OK

Request Headers:
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

Query String Parameters:
usuarioId: 5
monto: 150
periodoMes: 10
periodoAnio: 2025
estado: pagado
metodoPago: transferencia

Request Payload (Form Data):
comprobante: (binary)
  - name: "comprobante"
  - filename: "recibo.jpg"
  - type: "image/jpeg"
  - size: 245678 bytes

Response:
{
  "success": true,
  "message": "Pago procesado correctamente",
  "data": {
    "ruta": "uploads/comprobantes/comp_32_20251003_150050.jpg",
    "pagoId": 32
  }
}
```

---

## 📝 Console Logs Esperados

### Al crear pago con estado="pagado"
```
📋 FormData antes de enviar: {usuarioId: 5, monto: 150, estado: "pagado", ...}
✅ Pago creado exitosamente: {id: 32, ...}
🔍 Estado del pago: pagado
🔍 ID del pago creado: 32
💡 Abriendo modal de comprobante para pago ID: 32
```

### Al subir comprobante
```
📤 Iniciando subida de comprobante
   - Pago ID: 32
   - Archivo: recibo.jpg image/jpeg
   - Datos del pago: {usuarioId: 5, monto: 150, ...}

📤 uploadService.subirComprobante called
   - pagoId: 32
   - archivo: recibo.jpg image/jpeg 245678 bytes
   - datosPago: {usuarioId: 5, monto: 150, ...}

📦 Request preparado:
   - URL: /pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia
   - FormData: comprobante = recibo.jpg
   - Query params: usuarioId=5&monto=150&periodoMes=10&...

✅ Respuesta del servidor: {success: true, data: {...}}
✅ Comprobante subido exitosamente
   - Ruta guardada: uploads/comprobantes/comp_32_20251003_150050.jpg
```

### Al omitir comprobante
```
⏭️ Usuario omitió subir comprobante
```

---

## ❌ Errores Posibles y Soluciones

### Error 400: "Required parameter 'monto' is not present"
**Causa:** Backend no recibe query params  
**Solución:** ✅ Ya implementada - Params van en URL

### Error 500: "Cannot convert MultipartFile to String"
**Causa:** Archivo y params mezclados en FormData  
**Solución:** ✅ Ya implementada - Archivo en FormData, params en URL

### Error 404: Not Found
**Causa:** Backend no tiene el endpoint `/pagos/{id}/procesar`  
**Solución:** Implementar endpoint en backend

### Error 413: Payload Too Large
**Causa:** Imagen muy grande  
**Solución:** Frontend ya valida max 5MB

### Error de CORS
**Causa:** Backend no permite multipart/form-data  
**Solución:** Configurar CORS en backend

---

## ✅ Resultado Final Esperado

Después de crear un pago pagado y subir comprobante:

**En Base de Datos:**
```sql
SELECT * FROM pagos WHERE id = 32;

id  | usuario_id | monto | periodo_mes | periodo_anio | estado  | metodo_pago   | comprobante
----|------------|-------|-------------|--------------|---------|---------------|-------------
32  | 5          | 150.0 | 10          | 2025         | pagado  | transferencia | uploads/comprobantes/comp_32_20251003_150050.jpg
```

**En Disco del Servidor:**
```
backend/
  uploads/
    comprobantes/
      comp_32_20251003_150050.jpg  ✅ Archivo guardado
```

**En Frontend:**
```
Lista de Pagos:
┌──────┬─────────┬────────┬────────┬─────────────────┬─────────────┐
│ ID   │ Usuario │ Monto  │ Período│ Estado          │ Comprobante │
├──────┼─────────┼────────┼────────┼─────────────────┼─────────────┤
│ 32   │ Juan    │ $150   │ 10/2025│ 🟢 Pagado       │ ✅ Sí       │
└──────┴─────────┴────────┴────────┴─────────────────┴─────────────┘
```

---

**¡Listo para probar! 🚀**
