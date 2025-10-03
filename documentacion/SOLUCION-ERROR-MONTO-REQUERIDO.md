# Solución: Error "Required parameter 'monto' is not present"

## 📌 Problema Encontrado

Al intentar subir el comprobante al endpoint `/api/pagos/{id}/procesar`, el backend respondía con:

```json
{
    "timestamp": "2025-10-03T14:31:11.865+00:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Required parameter 'monto' is not present.",
    "path": "/api/pagos/30/procesar"
}
```

## 🔍 Causa del Error

El backend estaba esperando **TODOS** los campos del pago en la petición:
- `usuarioId`
- `monto` ⚠️
- `periodoMes`
- `periodoAnio`
- `estado`
- `metodoPago`
- `observaciones` (opcional)
- `comprobante` (archivo)

Pero el frontend solo estaba enviando:
- ❌ `comprobante` (archivo)

## ✅ Solución Implementada

### 1. Actualizado `SubirComprobanteModal.tsx`

Ahora **recibe los datos del pago** que se creó previamente:

```typescript
interface SubirComprobanteModalProps {
  pagoId: number;
  datosPago: PagoCreateRequest;  // ✅ NUEVO: recibe datos del pago
  onClose: () => void;
  onSuccess: () => void;
}
```

### 2. Actualizado `CrearPagoModal.tsx`

Guardamos los datos del pago y los pasamos al modal de comprobante:

```typescript
const [datosDelPago, setDatosDelPago] = useState<PagoCreateRequest | null>(null);

// Cuando se crea el pago exitosamente
if (formData.estado === 'pagado') {
  setPagoIdCreado(pagoCreado.id);
  setDatosDelPago(formData);  // ✅ Guardar datos para pasarlos al modal
  setShowComprobanteModal(true);
}

// Al renderizar el modal
{showComprobanteModal && pagoIdCreado && datosDelPago && (
  <SubirComprobanteModal 
    pagoId={pagoIdCreado}
    datosPago={datosDelPago}  // ✅ Pasar datos al modal
    onClose={...}
    onSuccess={...}
  />
)}
```

### 3. Actualizado `uploadService` en `api.ts`

El servicio ahora envía **TODOS** los campos en el FormData:

```typescript
async subirComprobante(archivo: File, pagoId: number, datosPago: any): Promise<string> {
  const formData = new FormData();
  
  // Archivo
  formData.append('comprobante', archivo);
  
  // ✅ TODOS los campos del pago
  formData.append('usuarioId', datosPago.usuarioId?.toString() || '');
  formData.append('monto', datosPago.monto?.toString() || '0');
  formData.append('periodoMes', datosPago.periodoMes?.toString() || '');
  formData.append('periodoAnio', datosPago.periodoAnio?.toString() || '');
  formData.append('estado', datosPago.estado || 'pagado');
  formData.append('metodoPago', datosPago.metodoPago || '');
  if (datosPago.observaciones) {
    formData.append('observaciones', datosPago.observaciones);
  }

  // Enviar al endpoint
  const response = await api.post(`/pagos/${pagoId}/procesar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data.data?.ruta || '';
}
```

### 4. También Actualizado `EditarEstadoModal.tsx`

Para ser consistente, al editar un pago también enviamos todos los datos:

```typescript
const datosPagoParaUpload = {
  usuarioId: pago.usuarioId,
  monto: pago.monto,
  periodoMes: pago.periodoMes,
  periodoAnio: pago.periodoAnio,
  estado: nuevoEstado,
  metodoPago: metodoPago || 'efectivo',
  observaciones: observaciones || ''
};

rutaComprobante = await uploadService.subirComprobante(
  archivoComprobante, 
  pago.id, 
  datosPagoParaUpload  // ✅ Pasar todos los datos
);
```

## 📤 Request Enviado Ahora

```
POST /api/pagos/30/procesar
Content-Type: multipart/form-data

FormData:
  - comprobante: (archivo)
  - usuarioId: 5
  - monto: 150
  - periodoMes: 10
  - periodoAnio: 2025
  - estado: pagado
  - metodoPago: transferencia
  - observaciones: Pago mensualidad octubre
```

## 🎯 Comportamiento del Backend Esperado

El backend debería:

1. **Recibir** todos los parámetros en el FormData
2. **Validar** que `monto` existe (y otros campos requeridos)
3. **Procesar** el archivo comprobante
4. **Actualizar** el pago con la ruta del comprobante
5. **Responder** con:

```json
{
  "success": true,
  "message": "Pago procesado correctamente",
  "data": {
    "ruta": "uploads/comprobantes/comp_30_20251003_143025.jpg",
    "pagoId": 30
  }
}
```

## 📝 Logs de Depuración

Con los cambios, ahora verás en la consola:

```
📤 Iniciando subida de comprobante
   - Pago ID: 30
   - Archivo: comprobante.jpg image/jpeg
   - Datos del pago: {usuarioId: 5, monto: 150, ...}

📦 FormData preparado para POST /api/pagos/30/procesar
   - comprobante: comprobante.jpg
   - usuarioId: 5
   - monto: 150
   - periodoMes: 10
   - periodoAnio: 2025
   - estado: pagado
   - metodoPago: transferencia

✅ Respuesta del servidor: {...}
```

## ⚠️ Importante

Si aún recibes el error después de estos cambios, verifica que:

1. ✅ El backend acepta `@RequestParam` para todos los campos
2. ✅ Los nombres de los parámetros coinciden exactamente (case-sensitive)
3. ✅ El backend acepta `multipart/form-data`
4. ✅ El parámetro `comprobante` se recibe como `@RequestPart("comprobante") MultipartFile`

## 🔧 Estructura del Endpoint Backend Esperada

```java
@PostMapping("/pagos/{id}/procesar")
public ResponseEntity<?> procesarPago(
    @PathVariable Long id,
    @RequestParam Long usuarioId,
    @RequestParam Double monto,
    @RequestParam Integer periodoMes,
    @RequestParam Integer periodoAnio,
    @RequestParam String estado,
    @RequestParam String metodoPago,
    @RequestParam(required = false) String observaciones,
    @RequestPart("comprobante") MultipartFile comprobante
) {
    // Procesar pago...
}
```

## ✅ Estado Actual

- ✅ Frontend envía todos los campos requeridos
- ✅ FormData incluye: archivo + todos los datos del pago
- ✅ Logs detallados para debugging
- ⏳ Esperando que backend procese correctamente
