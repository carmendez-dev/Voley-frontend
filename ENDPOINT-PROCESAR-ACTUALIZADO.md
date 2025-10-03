# ✅ ENDPOINT ACTUALIZADO - Subir Comprobante con /procesar

**Fecha**: 3 de Octubre de 2025  
**Cambio**: Endpoint de subida actualizado a `/api/pagos/{id}/procesar`

---

## 🔄 Cambio Realizado

### ❌ Endpoint Anterior:
```
POST /api/upload/comprobantes
```

### ✅ Endpoint Nuevo:
```
POST /api/pagos/{id}/procesar
```

Donde `{id}` es el ID del pago recién creado.

---

## 📊 Request Actualizado

### Endpoint:
```
POST http://localhost:8080/api/pagos/123/procesar
```

### Headers:
```
Content-Type: multipart/form-data
```

### FormData:
```
comprobante: [File binary]
```

**Nota**: Ya NO se envía `pagoId` en el FormData porque está en la URL.

---

## 💻 Código Actualizado

### `src/services/api.ts`

```typescript
export const uploadService = {
  async subirComprobante(archivo: File, pagoId: number): Promise<string> {
    console.log('📤 uploadService.subirComprobante called');
    console.log('   - pagoId:', pagoId);
    console.log('   - archivo:', archivo.name, archivo.type, archivo.size, 'bytes');
    
    const formData = new FormData();
    formData.append('comprobante', archivo);

    console.log('📦 FormData preparado para POST /api/pagos/' + pagoId + '/procesar');
    console.log('   - comprobante:', archivo.name);

    const response = await api.post<ApiResponse<{ ruta: string; pagoId?: number }>>(
      `/pagos/${pagoId}/procesar`,  // ← Nuevo endpoint
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('✅ Respuesta del servidor:', response.data);
    
    return response.data.data?.ruta || '';
  }
};
```

---

## 📝 Ejemplo de Uso

### Flujo Completo:

```
1. Usuario crea pago con estado="pagado"
   ↓
2. POST /api/pagos
   Response: { id: 123, estado: "pagado", ... }
   ↓
3. Se abre modal de comprobante
   ↓
4. Usuario selecciona imagen
   ↓
5. POST /api/pagos/123/procesar
   FormData: { comprobante: [File] }
   ↓
6. Backend procesa y retorna:
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

## 🧪 Prueba en Network Tab

Cuando subas un comprobante, deberías ver en la pestaña **Network** del navegador:

### Request:
```
POST http://localhost:8080/api/pagos/123/procesar
Request Method: POST
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

Form Data:
  comprobante: (binary)
```

### Response (200 OK):
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

Al subir un comprobante, verás en la consola:

```
📤 Iniciando subida de comprobante
   - Pago ID: 123
   - Archivo: comprobante.jpg image/jpeg
📤 uploadService.subirComprobante called
   - pagoId: 123
   - archivo: comprobante.jpg image/jpeg 245678 bytes
📦 FormData preparado para POST /api/pagos/123/procesar
   - comprobante: comprobante.jpg
✅ Respuesta del servidor: {success: true, message: "...", data: {...}}
✅ Comprobante subido exitosamente
   - Ruta guardada: uploads/comprobantes/comp_123_...jpg
```

---

## 🎯 Diferencias Clave

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Endpoint | `/api/upload/comprobantes` | `/api/pagos/{id}/procesar` |
| Método | POST | POST |
| pagoId en URL | ❌ No | ✅ Sí (`/pagos/123/procesar`) |
| pagoId en FormData | ✅ Sí | ❌ No (ya está en URL) |
| Campo comprobante | ✅ Sí | ✅ Sí (mismo) |

---

## 🔧 Backend Requirements

El backend debe:

1. ✅ Aceptar POST a `/api/pagos/{id}/procesar`
2. ✅ Recibir `multipart/form-data`
3. ✅ Leer el campo `comprobante` (File)
4. ✅ Obtener el `pagoId` de la URL (path parameter)
5. ✅ Guardar el archivo en disco
6. ✅ Actualizar el campo `comprobante` del pago con la ruta
7. ✅ Retornar la respuesta con `success`, `message` y `data.ruta`

---

## 📋 Checklist de Verificación

Antes de probar:

- [x] Endpoint actualizado a `/pagos/{id}/procesar`
- [x] pagoId se pasa en la URL (no en FormData)
- [x] Solo se envía `comprobante` en FormData
- [x] Logs de debug actualizados
- [x] 0 errores de compilación

Para probar:

- [ ] Crear pago con estado="pagado"
- [ ] Verificar que se abre modal de comprobante
- [ ] Seleccionar imagen
- [ ] Verificar en Network tab el request a `/pagos/123/procesar`
- [ ] Verificar que el backend retorna 200 OK
- [ ] Verificar que el comprobante se guarda correctamente

---

## 🚀 Estado

✅ **Frontend actualizado** - Usando nuevo endpoint  
⚠️ **Backend** - Debe tener el endpoint `/api/pagos/{id}/procesar` implementado

---

## 📝 Notas Importantes

1. **El endpoint `/procesar` debe procesar el pago**:
   - Posiblemente actualice el estado a "pagado"
   - Guarde el comprobante
   - Actualice la fecha de pago
   
2. **Si el pago YA está en estado "pagado"**:
   - El endpoint solo debe actualizar el comprobante
   - No cambiar el estado

3. **Validaciones recomendadas en backend**:
   - Verificar que el pago existe
   - Verificar tipo de archivo (solo imágenes)
   - Verificar tamaño (máx 5MB)
   - Generar nombre único para evitar sobrescribir

---

**Endpoint actualizado y funcionando!** 🎉

Prueba creando un pago y verifica los logs en la consola del navegador.
