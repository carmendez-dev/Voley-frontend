# 📊 Diagrama de Flujo - Subida de Comprobante

## 🔄 Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CREAR PAGO                                                   │
│    CrearPagoModal                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST /api/pagos
                              │ {usuarioId, monto, estado="pagado", ...}
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. PAGO CREADO                                                  │
│    Backend responde: {id: 32, usuarioId: 5, monto: 150, ...}   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Si estado === "pagado"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. ABRIR MODAL COMPROBANTE                                      │
│    SubirComprobanteModal                                        │
│    - pagoId: 32                                                 │
│    - datosPago: {usuarioId: 5, monto: 150, ...}                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Usuario selecciona imagen
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. PREPARAR REQUEST                                             │
│    uploadService.subirComprobante()                             │
│                                                                 │
│    FormData:                   Query Params:                   │
│    ├─ comprobante: [FILE]      ├─ usuarioId=5                  │
│                                 ├─ monto=150                    │
│                                 ├─ periodoMes=10                │
│                                 ├─ periodoAnio=2025             │
│                                 ├─ estado=pagado                │
│                                 └─ metodoPago=transferencia     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST /pagos/32/procesar?params...
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. BACKEND PROCESA                                              │
│                                                                 │
│    @PathVariable id = 32                                        │
│    @RequestParam usuarioId = 5                                  │
│    @RequestParam monto = 150.0                                  │
│    @RequestParam periodoMes = 10                                │
│    @RequestParam periodoAnio = 2025                             │
│    @RequestParam estado = "pagado"                              │
│    @RequestParam metodoPago = "transferencia"                   │
│    @RequestPart comprobante = MultipartFile                     │
│                                                                 │
│    ├─ Validar parámetros                                        │
│    ├─ Guardar archivo en disco                                  │
│    ├─ Actualizar pago con ruta del comprobante                  │
│    └─ Retornar respuesta                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Response 200 OK
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. RESPUESTA EXITOSA                                            │
│    {                                                            │
│      "success": true,                                           │
│      "message": "Pago procesado",                               │
│      "data": {                                                  │
│        "ruta": "uploads/comprobantes/comp_32_xyz.jpg",          │
│        "pagoId": 32                                             │
│      }                                                          │
│    }                                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ onSuccess()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. ACTUALIZAR UI                                                │
│    - Cerrar modal                                               │
│    - Refrescar lista de pagos                                   │
│    - Mostrar mensaje de éxito                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Puntos Clave

### ✅ Separación de Datos

```
┌─────────────────────┐
│   Request Final     │
└─────────────────────┘
         │
         ├─────────────────────────┬────────────────────────┐
         │                         │                        │
    ┌────▼────┐              ┌─────▼──────┐         ┌──────▼──────┐
    │   URL   │              │Query Params│         │  FormData   │
    └─────────┘              └────────────┘         └─────────────┘
         │                         │                        │
    /pagos/32/procesar        ?usuarioId=5            comprobante:
                              &monto=150               [FILE.jpg]
                              &periodoMes=10
                              &...
```

### 🔧 Backend Mapping

```
┌──────────────────────────────────────────────────────────────┐
│  Spring Boot Controller                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  @PostMapping("/pagos/{id}/procesar")                        │
│  public ResponseEntity<?> procesarPago(                      │
│                                                              │
│      @PathVariable Long id         ◄── URL path             │
│      @RequestParam Long usuarioId  ◄── Query param          │
│      @RequestParam Double monto    ◄── Query param          │
│      @RequestParam Integer periodoMes ◄── Query param       │
│      ...                                                     │
│      @RequestPart MultipartFile comprobante ◄── FormData    │
│  )                                                           │
└──────────────────────────────────────────────────────────────┘
```

## ⚡ Evolución de la Solución

### ❌ Intento 1: Solo comprobante
```
FormData: { comprobante: [FILE] }
Result: ❌ Error "monto is not present"
```

### ❌ Intento 2: Todo en FormData
```
FormData: { 
  comprobante: [FILE],
  usuarioId: "5",
  monto: "150",
  ...
}
Result: ❌ Error "Cannot convert MultipartFile to String"
```

### ✅ Solución Final: Separado
```
URL: /pagos/32/procesar?usuarioId=5&monto=150&...
FormData: { comprobante: [FILE] }
Result: ✅ Funciona perfectamente
```

## 🎨 Estructura de Datos

```typescript
// Frontend prepara
{
  archivo: File,          // Va a FormData
  pagoId: 32,            // Va a URL path
  datosPago: {           // Van a Query params
    usuarioId: 5,
    monto: 150,
    periodoMes: 10,
    periodoAnio: 2025,
    estado: "pagado",
    metodoPago: "transferencia"
  }
}

// Se convierte en
POST /pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia

Content-Type: multipart/form-data
FormData: comprobante = [BINARY DATA]
```

## 📸 Vista de Network Tab (DevTools)

```
Request URL: 
http://localhost:8080/api/pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia

Request Method: POST

Request Headers:
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

Request Payload:
------WebKitFormBoundary...
Content-Disposition: form-data; name="comprobante"; filename="recibo.jpg"
Content-Type: image/jpeg

[Binary data]
------WebKitFormBoundary...--
```

## 🎉 Estado Final

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│ Frontend  │────▶│  Backend  │────▶│  Database │
└───────────┘     └───────────┘     └───────────┘
      │                 │                  │
  ✅ Envío        ✅ Recepción        ✅ Guardado
  correcto         correcta            exitoso
```

---

**Componentes involucrados:**
1. `CrearPagoModal.tsx` - Inicia flujo
2. `SubirComprobanteModal.tsx` - Captura archivo
3. `uploadService` (api.ts) - Envía request
4. Backend Spring Boot - Procesa y guarda
