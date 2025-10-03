# 🚀 Quick Fix - Error "monto is not present"

## Problema
```
400 Bad Request: Required parameter 'monto' is not present
```

## Solución en 3 Pasos

### ✅ 1. `api.ts` - Agregar todos los datos al FormData

```typescript
// ANTES ❌
formData.append('comprobante', archivo);

// AHORA ✅
formData.append('comprobante', archivo);
formData.append('usuarioId', datosPago.usuarioId?.toString());
formData.append('monto', datosPago.monto?.toString());
formData.append('periodoMes', datosPago.periodoMes?.toString());
formData.append('periodoAnio', datosPago.periodoAnio?.toString());
formData.append('estado', datosPago.estado);
formData.append('metodoPago', datosPago.metodoPago);
```

### ✅ 2. `SubirComprobanteModal.tsx` - Recibir datos del pago

```typescript
// Agregar prop
interface SubirComprobanteModalProps {
  pagoId: number;
  datosPago: PagoCreateRequest;  // ✅ NUEVO
  onClose: () => void;
  onSuccess: () => void;
}

// Pasar al servicio
await uploadService.subirComprobante(comprobante, pagoId, datosPago);
```

### ✅ 3. `CrearPagoModal.tsx` - Pasar datos al modal

```typescript
// Guardar datos
const [datosDelPago, setDatosDelPago] = useState<PagoCreateRequest | null>(null);

// Al crear pago
if (formData.estado === 'pagado') {
  setDatosDelPago(formData);  // ✅ GUARDAR
  setShowComprobanteModal(true);
}

// Pasar al modal
<SubirComprobanteModal 
  pagoId={pagoIdCreado}
  datosPago={datosDelPago}  // ✅ PASAR
  onClose={...}
  onSuccess={...}
/>
```

## Request Final

```
POST /api/pagos/30/procesar

FormData:
✅ comprobante: (archivo)
✅ usuarioId: 5
✅ monto: 150          ← YA NO FALTA
✅ periodoMes: 10
✅ periodoAnio: 2025
✅ estado: pagado
✅ metodoPago: transferencia
```

## Test

1. Crear pago con estado="pagado"
2. Subir comprobante
3. Verificar en Network tab que se envían TODOS los campos
4. ✅ No más error 400

---

Ver detalles completos en `SOLUCION-ERROR-MONTO-REQUERIDO.md`
