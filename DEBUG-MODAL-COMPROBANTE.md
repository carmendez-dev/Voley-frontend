# 🐛 GUÍA DE DEBUG - Modal de Comprobante No Aparece

**Fecha**: 3 de Octubre de 2025

---

## 🎯 Problema Reportado

El modal para subir comprobante NO aparece después de crear un pago con estado="pagado".

---

## ✅ Cambios Implementados para Debug

### 1. Logs de Debug Agregados

He agregado **console.log** en puntos clave para rastrear el flujo:

#### En `CrearPagoModal.tsx`:
```typescript
✅ Pago creado exitosamente: {objeto del pago}
🔍 Estado del pago: "pagado" o "pendiente"
🔍 ID del pago creado: 123
💡 Abriendo modal de comprobante para pago ID: 123
🔴 Cerrando modal de comprobante (sin subir)
```

#### En `SubirComprobanteModal.tsx`:
```typescript
📤 Iniciando subida de comprobante
   - Pago ID: 123
   - Archivo: comprobante.jpg image/jpeg
✅ Comprobante subido exitosamente
   - Ruta guardada: uploads/comprobantes/comp_123_...jpg
```

#### En `api.ts` (uploadService):
```typescript
📤 uploadService.subirComprobante called
   - pagoId: 123
   - archivo: comprobante.jpg image/jpeg 245678 bytes
📦 FormData preparado:
   - comprobante: comprobante.jpg
   - pagoId: 123
✅ Respuesta del servidor: {success, message, data}
```

---

## 🧪 Cómo Probar

### Paso 1: Abrir Consola del Navegador

1. Presiona **F12** o **Ctrl+Shift+I**
2. Ve a la pestaña **Console**
3. Limpia la consola (icono 🚫)

---

### Paso 2: Crear Pago con Estado "Pagado"

1. Abre el modal "Crear Nuevo Pago"
2. Llena los campos:
   - **Usuario**: Selecciona uno
   - **Mes/Año**: Cualquiera
   - **Monto**: Ej. 100
   - **Estado**: **"Pagado"** ⚠️ IMPORTANTE
   - **Método de Pago**: Ej. "Transferencia Bancaria"
3. Click en **"Crear Pago"**

---

### Paso 3: Revisar Logs en Consola

Deberías ver esta secuencia:

```
📋 FormData antes de enviar: {usuarioId: 8, estado: "pagado", ...}
📤 Creando pago (sin comprobante): {usuario: {id: 8}, ...}
✅ Pago creado con ID: 123
🔍 Estado del pago: pagado
🔍 ID del pago creado: 123
💡 Abriendo modal de comprobante para pago ID: 123
```

---

## 🔍 Diagnóstico según Logs

### Caso 1: NO ves "💡 Abriendo modal de comprobante"

**Problema**: El estado del pago NO es "pagado"

**Solución**:
- Verifica el log `🔍 Estado del pago:`
- Asegúrate de seleccionar **"Pagado"** en el dropdown de Estado
- Revisa que el backend retorne `estado: "pagado"` en la respuesta

---

### Caso 2: Ves "💡 Abriendo modal" pero NO aparece el modal

**Problema**: Error de renderizado o z-index

**Verificaciones**:
1. Abre las **DevTools** → pestaña **Elements**
2. Busca en el HTML: `SubirComprobanteModal`
3. Verifica que exista en el DOM

**Si NO existe**:
- Hay un error de compilación (revisar consola de errores)
- El componente no se está importando correctamente

**Si SÍ existe pero no se ve**:
- Problema de CSS/z-index
- Inspecciona el elemento y verifica:
  - `display: none` o `visibility: hidden`
  - `z-index` muy bajo
  - `opacity: 0`

---

### Caso 3: El modal aparece pero da error al subir

**Síntomas**:
```
❌ Error al subir comprobante: [error message]
```

**Verificaciones**:
1. Revisa el log `📦 FormData preparado:`
2. Verifica que contenga:
   - `comprobante`: [nombre del archivo]
   - `pagoId`: [número]

**Errores comunes**:
- **404 Not Found**: El endpoint `/api/upload/comprobantes` no existe en backend
- **400 Bad Request**: El backend no recibe correctamente el FormData
- **500 Server Error**: Error en el backend al procesar el archivo

---

## 🎬 Flujo Esperado (Correcto)

```
1. Usuario llena formulario con estado="pagado"
   ↓
2. Click "Crear Pago"
   ↓
3. POST /api/pagos (JSON)
   ↓
4. Backend retorna: {id: 123, estado: "pagado", ...}
   ↓
5. Frontend detecta estado="pagado"
   ↓
6. setPagoIdCreado(123)
   ↓
7. setShowComprobanteModal(true)
   ↓
8. Modal principal DESAPARECE (condicional !showComprobanteModal)
   ↓
9. SubirComprobanteModal APARECE
   ↓
10. Usuario sube imagen
    ↓
11. POST /api/upload/comprobantes (FormData)
    ↓
12. Backend retorna:
    {
      "success": true,
      "message": "Archivo subido correctamente",
      "data": {
        "ruta": "uploads/comprobantes/comp_123_...jpg",
        "pagoId": 123
      }
    }
    ↓
13. Ambos modales se cierran
    ↓
14. Lista de pagos se refresca
```

---

## 🔧 Verificaciones de Código

### 1. Estado en CrearPagoModal

Verifica que estos estados existan:

```typescript
const [showComprobanteModal, setShowComprobanteModal] = useState(false);
const [pagoIdCreado, setPagoIdCreado] = useState<number | null>(null);
```

### 2. Condicional de Renderizado

Verifica que el return tenga esta estructura:

```tsx
return (
  <>
    {/* Modal de comprobante */}
    {showComprobanteModal && pagoIdCreado && (
      <SubirComprobanteModal ... />
    )}

    {/* Modal principal - SOLO si NO está el de comprobante */}
    {!showComprobanteModal && (
      <div className="fixed inset-0 ...">
        {/* Contenido del modal principal */}
      </div>
    )}
  </>
);
```

**⚠️ IMPORTANTE**: El modal principal tiene `{!showComprobanteModal &&` para ocultarse cuando aparece el segundo modal.

### 3. Lógica después de crear pago

```typescript
if (formData.estado === 'pagado') {
  console.log('💡 Abriendo modal de comprobante para pago ID:', pagoCreado.id);
  setPagoIdCreado(pagoCreado.id);
  setShowComprobanteModal(true);
  setLoading(false); // ⚠️ Importante: detener loading
}
```

---

## 🛠️ Soluciones Rápidas

### Si el modal NO aparece:

#### Solución 1: Verificar Import
```typescript
import SubirComprobanteModal from './SubirComprobanteModal';
```

#### Solución 2: Verificar que el archivo existe
```
src/components/modals/SubirComprobanteModal.tsx
```

#### Solución 3: Hard Reload
1. Presiona **Ctrl+Shift+R** (Windows) o **Cmd+Shift+R** (Mac)
2. Limpia caché del navegador
3. Reinicia el servidor de desarrollo:
   ```powershell
   # Detener (Ctrl+C)
   npm run dev
   ```

#### Solución 4: Verificar que el backend retorna el ID

El backend DEBE retornar algo como:
```json
{
  "success": true,
  "data": {
    "id": 123,  ← ⚠️ IMPORTANTE: Este campo debe existir
    "estado": "pagado",
    ...
  }
}
```

Si retorna:
```json
{
  "success": true,
  "data": {
    "pagoId": 123,  ← ❌ MAL: No es "id", es "pagoId"
    ...
  }
}
```

Necesitas cambiar en `api.ts`:
```typescript
console.log('🔍 ID del pago creado:', pagoCreado.id);
// A:
console.log('🔍 ID del pago creado:', pagoCreado.pagoId);

// Y cambiar:
setPagoIdCreado(pagoCreado.id);
// A:
setPagoIdCreado(pagoCreado.pagoId);
```

---

## 📝 Checklist de Debug

Marca lo que ya verificaste:

- [ ] Console muestra "✅ Pago creado exitosamente"
- [ ] Console muestra "🔍 Estado del pago: pagado"
- [ ] Console muestra "🔍 ID del pago creado: [número]"
- [ ] Console muestra "💡 Abriendo modal de comprobante"
- [ ] El modal de comprobante aparece en pantalla
- [ ] Puedes seleccionar una imagen
- [ ] Al hacer click en "Subir Comprobante" se envía la request
- [ ] Console muestra "📤 uploadService.subirComprobante called"
- [ ] Console muestra la respuesta del servidor
- [ ] El modal se cierra después de subir

---

## 🆘 Si Nada Funciona

### Copia y pega estos logs:

1. Abre la consola
2. Copia TODOS los mensajes que aparecen al intentar crear un pago
3. Comparte los logs para analizar el problema exacto

### Información útil:

- ¿Qué aparece en la consola?
- ¿Aparece algún error en rojo?
- ¿El request a `/api/pagos` es exitoso (200)?
- ¿Qué retorna el backend en el campo `data.id`?
- ¿El estado del pago es exactamente "pagado" (minúsculas)?

---

## 📊 Request de Upload Esperado

Cuando subes el comprobante, deberías ver en la pestaña **Network**:

```
POST http://localhost:8080/api/pagos/123/procesar
Status: 200 OK
Content-Type: multipart/form-data

Form Data:
  comprobante: (binary)

Response:
{
  "success": true,
  "message": "Archivo subido correctamente",
  "data": {
    "ruta": "uploads/comprobantes/comp_123_20251003_143025.jpg",
    "pagoId": 123
  }
}
```

**Nota**: El `pagoId` va en la URL (`/pagos/123/procesar`), NO en el FormData.

---

**Con estos logs deberías poder identificar exactamente dónde está fallando el flujo!** 🔍
