# Corrección: Endpoint procesarPago

## 🐛 Problema

Error al intentar procesar un pago:

```
Required request parameter 'monto' for method parameter type Double is not present
```

### Causa

El backend espera los datos como **query parameters**, pero el frontend los enviaba en el **body como JSON**.

---

## ✅ Solución Aplicada

### Archivo: `src/services/api.ts`

**Antes:**
```typescript
async procesarPago(id: number, datosPago: PagoProcesarRequest): Promise<Pago> {
  const response = await api.post<ApiResponse<Pago>>(`/pagos/${id}/procesar`, datosPago);
  return response.data.data!;
}
```

**Después:**
```typescript
async procesarPago(id: number, datosPago: PagoProcesarRequest): Promise<Pago> {
  // Construir query params en lugar de body JSON
  const params = new URLSearchParams();
  params.append('monto', datosPago.monto.toString());
  params.append('metodoPago', datosPago.metodoPago);
  if (datosPago.comprobante) {
    params.append('comprobante', datosPago.comprobante);
  }
  if (datosPago.observaciones) {
    params.append('observaciones', datosPago.observaciones);
  }
  
  const response = await api.post<ApiResponse<Pago>>(`/pagos/${id}/procesar?${params.toString()}`);
  return response.data.data!;
}
```

---

## 📋 Detalles Técnicos

### Request que se envía ahora:

```http
POST /api/pagos/11/procesar?monto=50000&metodoPago=efectivo&comprobante=ruta.jpg&observaciones=Pago%20recibido HTTP/1.1
Host: localhost:8080
Content-Type: application/json
```

### Parámetros:
- `monto` (obligatorio): Monto del pago
- `metodoPago` (obligatorio): Método de pago (efectivo, transferencia, etc.)
- `comprobante` (opcional): Ruta del comprobante de pago
- `observaciones` (opcional): Observaciones adicionales

---

## 🧪 Verificación

### Prueba Manual:

1. **Abre el frontend**: `http://localhost:5174`
2. **Ve a "Gestión de Pagos"**
3. **Haz clic en "Editar Estado"** de un pago
4. **Selecciona estado "Pagado"**
5. **Llena los campos**:
   - Método de pago: "efectivo"
   - Comprobante: (opcional)
   - Observaciones: (opcional)
6. **Haz clic en "Guardar"**
7. **Verifica**: No debe aparecer error de parámetros faltantes

### Request de Ejemplo:

```
POST http://localhost:8080/api/pagos/11/procesar?monto=50000&metodoPago=efectivo
```

---

## 📊 Comparación Backend vs Frontend

### Backend (Spring Boot) espera:

```java
@PostMapping("/{id}/procesar")
public ResponseEntity<?> procesarPago(
    @PathVariable Long id,
    @RequestParam Double monto,              // Query param
    @RequestParam String metodoPago,         // Query param
    @RequestParam(required = false) String comprobante,
    @RequestParam(required = false) String observaciones
)
```

### Frontend (ahora envía):

```typescript
URL: /pagos/11/procesar?monto=50000&metodoPago=efectivo&comprobante=...
```

✅ **Coincidencia correcta**

---

## 🔍 Notas Adicionales

### URLSearchParams

- **Codificación automática**: Espacios → `%20`, caracteres especiales se escapan
- **Valores opcionales**: Solo se agregan si existen (`if (datosPago.comprobante)`)
- **Conversión de números**: `monto.toString()` para convertir a string

### Ejemplo de URL generada:

```
/pagos/11/procesar?monto=50000&metodoPago=transferencia&observaciones=Pago%20verificado
```

---

## ✅ Checklist

- [x] Modificar `procesarPago` en `api.ts`
- [x] Usar `URLSearchParams` para query params
- [x] Manejar parámetros opcionales
- [x] Convertir `monto` a string
- [x] Verificar compilación (0 errores)
- [ ] Probar desde el frontend
- [ ] Verificar que el pago se procese correctamente

---

## 🚀 Próximos Pasos

1. **Asegúrate de que CORS esté configurado**: Ver `CONFIGURACION-CORS-BACKEND.md`
2. **Prueba procesar un pago** desde el frontend
3. **Si necesitas subir comprobantes**: Implementa el backend siguiendo `GUIA-BACKEND-UPLOAD.md`

---

## 📚 Referencias

- [URLSearchParams MDN](https://developer.mozilla.org/es/docs/Web/API/URLSearchParams)
- [Spring @RequestParam](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestParam.html)
