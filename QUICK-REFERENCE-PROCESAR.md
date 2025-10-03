# ⚡ REFERENCIA RÁPIDA - Endpoint Procesar

**Endpoint Actualizado**: `POST /api/pagos/{id}/procesar`

---

## 📋 Resumen Ultra-Rápido

### Flujo:
```
1. Crear pago → POST /api/pagos
2. Si estado="pagado" → Modal aparece
3. Subir comprobante → POST /api/pagos/{id}/procesar
```

---

## 🔧 Código Frontend

```typescript
// api.ts
async subirComprobante(archivo: File, pagoId: number): Promise<string> {
  const formData = new FormData();
  formData.append('comprobante', archivo);

  const response = await api.post(
    `/pagos/${pagoId}/procesar`,  // ← pagoId en URL
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  
  return response.data.data?.ruta || '';
}
```

---

## 📊 Request

```
POST /api/pagos/123/procesar
Content-Type: multipart/form-data

FormData:
  comprobante: [File]
```

---

## ✅ Response Esperada

```json
{
  "success": true,
  "message": "Archivo subido correctamente",
  "data": {
    "ruta": "uploads/comprobantes/comp_123_20251003_143025.jpg",
    "pagoId": 123
  }
}
```

---

## 🔍 Logs de Debug

```
📤 uploadService.subirComprobante called
   - pagoId: 123
   - archivo: comprobante.jpg image/jpeg 245678 bytes
📦 FormData preparado para POST /api/pagos/123/procesar
   - comprobante: comprobante.jpg
✅ Respuesta del servidor: {success: true, ...}
```

---

## ⚙️ Backend Necesita

```java
@PostMapping("/pagos/{id}/procesar")
public ResponseEntity<?> procesarPago(
    @PathVariable Long id,
    @RequestPart("comprobante") MultipartFile comprobante
) {
    // 1. Validar archivo
    // 2. Guardar archivo
    // 3. Actualizar pago
    // 4. Retornar respuesta
}
```

---

## 🧪 Test Rápido

1. Crear pago con estado="pagado"
2. Modal aparece automáticamente
3. Subir imagen
4. Verificar en Network tab:
   - URL: `/api/pagos/123/procesar`
   - Method: POST
   - FormData: solo `comprobante`

---

**¡Listo para probar!** 🚀
