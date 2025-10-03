# Funcionalidad "Ver Detalle" de Pagos Procesados

## ✅ Cambios Implementados

### 1. **Nuevo Modal: VerDetallePagoModal**

Se creó un nuevo modal (`src/components/modals/VerDetallePagoModal.tsx`) que muestra:

- ✅ **Información completa del pago**
- ✅ **Información del usuario**
- ✅ **Estado del pago** (con badge visual)
- ✅ **Detalles**: Período, Monto, Método de Pago, Fechas
- ✅ **Observaciones** (si existen)
- ✅ **Comprobante de pago** (con preview de imagen)
- ✅ **Fechas del sistema** (creación y actualización)
- ✅ **Scroll bloqueado** cuando está abierto
- ✅ **Diseño responsive** y visualmente atractivo

#### Características del Comprobante:

- **Preview de imagen**: Si el comprobante es una imagen, se muestra en el modal
- **Enlace para abrir**: Abre la imagen en tamaño completo en una nueva pestaña
- **Manejo de errores**: Si la imagen no carga, muestra un mensaje
- **URL del servidor**: `http://localhost:8080/{ruta_comprobante}`

---

### 2. **Actualización de VerPagosUsuarioModal**

Se modificó el modal de lista de pagos del usuario:

- ✅ **Nuevo prop**: `onVerDetalle` para callback de ver detalle
- ✅ **Botón "Ver"** para pagos con estado "pagado"
- ✅ **Botón "Editar"** para pagos NO pagados (pendiente, atraso, rechazado)
- ✅ **Icono Eye** para identificar visualmente la acción "Ver"

**Lógica Condicional:**
```tsx
{pago.estado === 'pagado' && onVerDetalle ? (
  <Eye /> // Ver detalle completo
) : (
  <Edit /> // Editar pago
)}
```

---

### 3. **Actualización de GestionPagos**

Se agregó:

- ✅ **Estado**: `showDetalleModal` y callback `handleVerDetallePago`
- ✅ **Import**: `VerDetallePagoModal`
- ✅ **Prop**: `onVerDetalle` pasado a `VerPagosUsuarioModal`
- ✅ **Renderizado**: Modal de detalle cuando se activa

---

### 4. **Actualización de Types**

Se agregaron campos opcionales al interface `Pago`:

```typescript
export interface Pago {
  // ... campos existentes
  fechaCreacion?: string | null;
  fechaActualizacion?: string | null;
}
```

---

## 🧪 Cómo Probar la Funcionalidad

### Paso 1: Procesar un Pago

1. Abre el frontend: `http://localhost:5174`
2. Ve a **"Gestión de Pagos"**
3. Haz clic en el ícono 👁️ de un usuario
4. Selecciona un pago con estado **"Pendiente"** o **"Atraso"**
5. Haz clic en el ícono **✏️ Editar**
6. Cambia el estado a **"Pagado"**
7. Llena los campos:
   - **Método de Pago**: `transferencia` o `efectivo`
   - **Comprobante**: (Opcional) Sube una imagen
   - **Observaciones**: (Opcional) Agrega un comentario
8. Haz clic en **"Guardar"**

### Paso 2: Ver el Detalle

1. En la lista de pagos del usuario, el pago ahora tiene estado **"Pagado"**
2. El botón cambió de **✏️ Editar** a **👁️ Ver**
3. Haz clic en **👁️ Ver**
4. Se abrirá el modal **"Detalle del Pago"** con toda la información

---

## 🔍 Verificar que el Comprobante se Guarda en la Base de Datos

### Problema Reportado:
> "No se me guardó en la base de datos la ruta del comprobante"

### Solución: Verificación en Backend

#### 1. **Verificar el Request que se envía**

Abre las **DevTools del navegador** (F12) → **Network** → **Filtrar por "procesar"**

Deberías ver un request como:
```http
POST /api/pagos/11/procesar?monto=50000&metodoPago=transferencia&comprobante=uploads/comprobantes/comp_11_1234567890.jpg&observaciones=Pago%20verificado
```

**Verifica que**:
- ✅ El parámetro `comprobante` está presente en la URL
- ✅ La ruta del comprobante es válida (ej: `uploads/comprobantes/comp_11_...`)

#### 2. **Verificar en el Backend (Logs)**

Agrega logs en tu controlador de Spring Boot:

```java
@PostMapping("/{id}/procesar")
public ResponseEntity<?> procesarPago(
    @PathVariable Long id,
    @RequestParam Double monto,
    @RequestParam String metodoPago,
    @RequestParam(required = false) String comprobante,
    @RequestParam(required = false) String observaciones
) {
    System.out.println("===== PROCESAR PAGO =====");
    System.out.println("ID: " + id);
    System.out.println("Monto: " + monto);
    System.out.println("Método: " + metodoPago);
    System.out.println("Comprobante: " + comprobante); // ⬅️ VERIFICAR ESTE
    System.out.println("Observaciones: " + observaciones);
    
    // Tu lógica de guardado...
    Pago pagoActualizado = pagoService.procesarPago(id, monto, metodoPago, comprobante, observaciones);
    
    System.out.println("Comprobante guardado: " + pagoActualizado.getComprobante());
    
    return ResponseEntity.ok(new ApiResponse<>(true, pagoActualizado, "Pago procesado"));
}
```

**Verifica en los logs**:
- ✅ `Comprobante: uploads/comprobantes/comp_11_...` (NO debe ser `null`)
- ✅ `Comprobante guardado: uploads/comprobantes/comp_11_...` (confirmación de guardado)

#### 3. **Verificar en la Base de Datos**

Ejecuta una consulta SQL:

```sql
SELECT id, usuario_id, monto, estado, comprobante, metodo_pago, observaciones
FROM pagos
WHERE id = 11;
```

**Verifica que**:
- ✅ El campo `comprobante` NO sea `NULL`
- ✅ El campo `comprobante` contenga la ruta: `uploads/comprobantes/comp_11_...`

#### 4. **Verificar el Servicio de Guardado**

Revisa tu servicio en el backend:

```java
@Service
public class PagoService {
    
    public Pago procesarPago(Long id, Double monto, String metodoPago, String comprobante, String observaciones) {
        Pago pago = pagoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado"));
        
        pago.setEstado("pagado");
        pago.setMonto(monto);
        pago.setMetodoPago(metodoPago);
        pago.setComprobante(comprobante); // ⬅️ VERIFICAR QUE SE ASIGNA
        pago.setObservaciones(observaciones);
        pago.setFechaPago(new Date());
        
        Pago savedPago = pagoRepository.save(pago);
        
        System.out.println("✅ Pago guardado - Comprobante: " + savedPago.getComprobante());
        
        return savedPago;
    }
}
```

---

## 🚨 Posibles Problemas y Soluciones

### Problema 1: Comprobante es NULL en Base de Datos

**Causa**: El parámetro no se está enviando o el servicio no lo guarda.

**Solución**:
1. Verifica que el parámetro `comprobante` llega al controlador
2. Verifica que se asigna con `pago.setComprobante(comprobante)`
3. Verifica que se guarda con `pagoRepository.save(pago)`

### Problema 2: Comprobante no se muestra en el Modal

**Causa**: La ruta no es accesible desde el frontend.

**Solución**:
1. Configura archivos estáticos en el backend:
   ```java
   @Configuration
   public class WebConfig implements WebMvcConfigurer {
       @Override
       public void addResourceHandlers(ResourceHandlerRegistry registry) {
           registry.addResourceHandler("/uploads/**")
                   .addResourceLocations("file:public/uploads/");
       }
   }
   ```

2. Verifica que la carpeta existe: `public/uploads/comprobantes/`

### Problema 3: Imagen no Carga (404)

**Causa**: La ruta del archivo no coincide con la configuración del servidor.

**Solución**:
1. Verifica la URL en el navegador: `http://localhost:8080/uploads/comprobantes/comp_11_1234567890.jpg`
2. Si falla, ajusta la ruta en `WebConfig` o en el código de upload

---

## 📦 Código de Referencia

### Frontend: Construcción de la Ruta del Comprobante

```typescript
// En EditarEstadoModal.tsx (línea 63-73)
if (archivoComprobante) {
  const timestamp = new Date().getTime();
  const extension = archivoComprobante.name.split('.').pop();
  rutaComprobante = `uploads/comprobantes/comp_${pago.id}_${timestamp}.${extension}`;
  
  console.log('Archivo a subir:', archivoComprobante);
  console.log('Ruta generada:', rutaComprobante);
  // ⚠️ TODO: Implementar upload real al servidor
}
```

**⚠️ IMPORTANTE**: Este código genera la ruta pero **NO sube el archivo**. Es necesario implementar el upload real siguiendo `GUIA-BACKEND-UPLOAD.md`.

### Frontend: Envío al Backend

```typescript
// En api.ts (línea 74-87)
async procesarPago(id: number, datosPago: PagoProcesarRequest): Promise<Pago> {
  const params = new URLSearchParams();
  params.append('monto', datosPago.monto.toString());
  params.append('metodoPago', datosPago.metodoPago);
  if (datosPago.comprobante) {
    params.append('comprobante', datosPago.comprobante); // ✅ Se envía
  }
  if (datosPago.observaciones) {
    params.append('observaciones', datosPago.observaciones);
  }
  
  const response = await api.post<ApiResponse<Pago>>(`/pagos/${id}/procesar?${params.toString()}`);
  return response.data.data!;
}
```

---

## ✅ Checklist de Verificación

### Frontend:
- [x] Modal `VerDetallePagoModal` creado
- [x] Botón "Ver" en pagos pagados
- [x] Botón "Editar" en pagos NO pagados
- [x] Comprobante se envía en query params
- [x] Preview de imagen en modal de detalle
- [x] Scroll lock en modales
- [x] 0 errores de compilación

### Backend (pendiente de verificar):
- [ ] Parámetro `comprobante` llega al controlador
- [ ] Parámetro se asigna a la entidad Pago
- [ ] Entidad se guarda en la base de datos
- [ ] Campo `comprobante` en BD NO es NULL
- [ ] Archivos estáticos configurados (para servir imágenes)
- [ ] Carpeta `public/uploads/comprobantes/` existe

### Upload de Archivos (pendiente):
- [ ] Backend endpoint `/api/upload/comprobantes` implementado
- [ ] Multer instalado y configurado
- [ ] Frontend actualizado para subir archivo real
- [ ] Prueba end-to-end de upload

---

## 🎯 Próximos Pasos

1. **Verificar Guardado en BD**: 
   - Agrega logs en el backend
   - Ejecuta consulta SQL
   - Confirma que `comprobante` no es NULL

2. **Implementar Upload Real** (si es necesario):
   - Sigue `GUIA-BACKEND-UPLOAD.md`
   - Actualiza frontend con código de `CODIGO-INTEGRACION-FINAL.md`

3. **Probar Flujo Completo**:
   - Procesar pago → Verificar BD → Ver detalle → Verificar imagen

---

## 📚 Documentación Relacionada

- `CONFIGURACION-CORS-BACKEND.md` - Configuración de CORS
- `CORRECCION-PROCESAR-PAGO.md` - Corrección de query params
- `GUIA-BACKEND-UPLOAD.md` - Implementación de upload de archivos
- `CODIGO-INTEGRACION-FINAL.md` - Código de integración frontend-backend
- `UPLOAD-COMPROBANTES.md` - Sistema completo de upload

---

## 🐛 Debugging

Si el comprobante NO se guarda:

```javascript
// 1. En el navegador (DevTools → Console)
console.log('Comprobante enviado:', rutaComprobante);

// 2. En el backend (Controller)
System.out.println("Comprobante recibido: " + comprobante);

// 3. En el backend (Service)
System.out.println("Comprobante a guardar: " + pago.getComprobante());

// 4. En el backend (Después de save)
System.out.println("Comprobante guardado: " + savedPago.getComprobante());

// 5. En la base de datos
SELECT comprobante FROM pagos WHERE id = ?;
```

---

## 📝 Notas

- El modal de detalle **solo se muestra** desde el modal de lista de pagos del usuario
- Para pagos **NO pagados**, se sigue mostrando el botón **"Editar"**
- Para pagos **pagados**, se muestra el botón **"Ver"**
- La imagen del comprobante se carga desde: `http://localhost:8080/{ruta}`
- Si la imagen no existe, se muestra un mensaje de error amigable
