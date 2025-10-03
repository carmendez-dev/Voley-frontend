# ✅ Solución Final: Error de Conversión MultipartFile a String

## 🚨 Error Recibido

```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "Failed to convert value of type 'StandardMultipartFile' to required type 'java.lang.String'"
}
```

## 🔍 Causa del Problema

Spring Boot diferencia entre dos tipos de parámetros en peticiones `multipart/form-data`:

1. **`@RequestParam`** - Para parámetros de texto (String, números, etc.)
2. **`@RequestPart`** - Para archivos (MultipartFile)

Cuando mezclamos ambos en el **mismo FormData**, Spring intenta convertir TODO como `@RequestParam`, incluyendo el archivo, lo cual falla porque un archivo no puede ser String.

### ❌ Lo que estábamos enviando (INCORRECTO)

```
POST /api/pagos/32/procesar
Content-Type: multipart/form-data

FormData:
  - comprobante: [FILE]  ❌ Spring intenta convertirlo a String
  - usuarioId: "5"
  - monto: "150"
  - periodoMes: "10"
  ...
```

El backend esperaba:
```java
@PostMapping("/pagos/{id}/procesar")
public ResponseEntity<?> procesarPago(
    @PathVariable Long id,
    @RequestParam Long usuarioId,    // ✅ Parámetro de texto
    @RequestParam Double monto,      // ✅ Parámetro de texto
    ...
    @RequestPart MultipartFile comprobante  // ❌ Archivo (conflicto!)
)
```

## ✅ Solución Implementada

Separar los parámetros de texto del archivo:
- **Parámetros de texto** → Query params en la URL (`?usuarioId=5&monto=150...`)
- **Archivo** → FormData body

### ✅ Lo que enviamos ahora (CORRECTO)

```
POST /api/pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia
Content-Type: multipart/form-data

FormData:
  - comprobante: [FILE]  ✅ Solo el archivo en FormData
```

## 📝 Código Actualizado

### `src/services/api.ts`

```typescript
export const uploadService = {
  async subirComprobante(archivo: File, pagoId: number, datosPago: any): Promise<string> {
    // ✅ Solo el archivo en FormData
    const formData = new FormData();
    formData.append('comprobante', archivo);

    // ✅ Parámetros como query params
    const params = new URLSearchParams({
      usuarioId: datosPago.usuarioId?.toString() || '',
      monto: datosPago.monto?.toString() || '0',
      periodoMes: datosPago.periodoMes?.toString() || '',
      periodoAnio: datosPago.periodoAnio?.toString() || '',
      estado: datosPago.estado || 'pagado',
      metodoPago: datosPago.metodoPago || '',
    });

    if (datosPago.observaciones) {
      params.append('observaciones', datosPago.observaciones);
    }

    // ✅ URL con query params
    const url = `/pagos/${pagoId}/procesar?${params.toString()}`;

    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data.data?.ruta || '';
  }
};
```

## 🎯 Ejemplo de Request Real

```
POST http://localhost:8080/api/pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia&observaciones=Pago%20octubre
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

------WebKitFormBoundary...
Content-Disposition: form-data; name="comprobante"; filename="recibo.jpg"
Content-Type: image/jpeg

[BINARY DATA]
------WebKitFormBoundary...--
```

## 🔧 Backend Esperado (Spring Boot)

```java
@PostMapping("/pagos/{id}/procesar")
public ResponseEntity<?> procesarPago(
    @PathVariable Long id,
    @RequestParam Long usuarioId,           // ✅ Query param
    @RequestParam Double monto,             // ✅ Query param
    @RequestParam Integer periodoMes,       // ✅ Query param
    @RequestParam Integer periodoAnio,      // ✅ Query param
    @RequestParam String estado,            // ✅ Query param
    @RequestParam String metodoPago,        // ✅ Query param
    @RequestParam(required = false) String observaciones,  // ✅ Query param
    @RequestPart("comprobante") MultipartFile comprobante  // ✅ Archivo en FormData
) {
    // Guardar archivo
    String rutaArchivo = guardarComprobante(comprobante);
    
    // Actualizar pago
    Pago pago = pagoService.findById(id);
    pago.setComprobante(rutaArchivo);
    pago.setEstado(estado);
    // ... actualizar otros campos
    
    pagoService.save(pago);
    
    return ResponseEntity.ok(new ApiResponse(true, "Pago procesado", pago));
}
```

## 📊 Comparación

| Aspecto | Antes (❌) | Ahora (✅) |
|---------|-----------|-----------|
| **Parámetros texto** | FormData | Query params en URL |
| **Archivo** | FormData | FormData |
| **Backend recibe** | Todo mezclado → Error | Separado correctamente |
| **Spring interpreta** | Todo como @RequestParam | @RequestParam + @RequestPart |
| **Resultado** | Error 500 conversión | ✅ Funciona |

## 🧪 Cómo Verificar en Network Tab

1. Abrir DevTools → Network
2. Crear pago con estado="pagado"
3. Subir comprobante
4. Buscar request `POST .../pagos/32/procesar`
5. Verificar:
   - ✅ **Request URL**: Debe tener query params (`?usuarioId=5&monto=150...`)
   - ✅ **Request Payload**: Solo `comprobante` (archivo)
   - ✅ **Content-Type**: `multipart/form-data`

## 📝 Logs Esperados

```
📤 uploadService.subirComprobante called
   - pagoId: 32
   - archivo: recibo.jpg image/jpeg 245678 bytes
   - datosPago: {usuarioId: 5, monto: 150, ...}

📦 Request preparado:
   - URL: /pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia
   - FormData: comprobante = recibo.jpg
   - Query params: usuarioId=5&monto=150&periodoMes=10&...

✅ Respuesta del servidor: {success: true, data: {ruta: "uploads/..."}}
```

## ⚡ Por Qué Funciona

1. **Query params** (`?usuarioId=5&monto=150...`) → Spring los mapea automáticamente a `@RequestParam`
2. **FormData solo con archivo** → Spring lo mapea a `@RequestPart("comprobante")`
3. **No hay conflicto** → Cada tipo de dato va por su canal apropiado

## 🎉 Resultado Final

✅ El archivo se sube correctamente  
✅ Todos los parámetros se reciben en el backend  
✅ No hay errores de conversión  
✅ El pago se procesa y actualiza correctamente  

---

**Archivos modificados:**
- ✅ `src/services/api.ts` - Separar params de archivo
- ✅ `src/components/modals/SubirComprobanteModal.tsx` - Pasa datos del pago
- ✅ `src/components/modals/CrearPagoModal.tsx` - Guarda y pasa datos
- ✅ `src/components/modals/EditarEstadoModal.tsx` - Consistencia
