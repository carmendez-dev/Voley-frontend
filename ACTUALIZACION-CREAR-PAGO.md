# 📝 Actualización: Crear Nuevo Pago

## ✅ Cambios Implementados

Se ha actualizado el sistema de creación de pagos para cumplir con la especificación del backend.

---

## 📋 Especificación del Backend

### **Endpoint:**
```http
POST http://localhost:8080/api/pagos
```

### **Body (JSON):**
```json
{
  "usuario_id": 8,
  "periodo_mes": 10,
  "periodo_anio": 2025,
  "monto": 80.00,
  "estado": "pagado",
  "metodo_pago": "Efectivo",      // ⚠️ Opcional (recomendado para estado 'pagado')
  "comprobante": "COMP-2025-0010", // ⚠️ Opcional
  "observaciones": "Pago de cuota mensual diciembre" // ⚠️ Opcional
}
```

### **Campos:**
- ✅ **usuario_id** (number, requerido)
- ✅ **periodo_mes** (number 1-12, requerido)
- ✅ **periodo_anio** (number, requerido)
- ✅ **monto** (number, requerido)
- ✅ **estado** (string: 'pendiente' | 'pagado' | 'atraso' | 'rechazado', requerido)
- ⚠️ **metodo_pago** (string, opcional - recomendado para 'pagado')
- ⚠️ **comprobante** (string, opcional)
- ⚠️ **observaciones** (string, opcional)

---

## 🔄 Cambios en el Frontend

### 1. **Actualización de Types (`src/types/index.ts`)**

**ANTES:**
```typescript
export interface PagoCreateRequest {
  usuarioId: number;
  periodoMes: number;
  periodoAnio: number;
  monto: number;
  fechaVencimiento: string;
  observaciones?: string;
}
```

**AHORA:**
```typescript
export interface PagoCreateRequest {
  usuario_id?: number;       // Backend espera snake_case, opcional para validación
  periodo_mes: number;       // Backend espera snake_case
  periodo_anio: number;      // Backend espera snake_case
  monto: number;
  estado: 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
  metodo_pago?: string;      // Opcional - solo para estado 'pagado'
  comprobante?: File | null; // Opcional - Archivo de imagen (no string)
  observaciones?: string;    // Opcional
}
```

**Cambios:**
- ✅ Nombres de campos cambiados a **snake_case** (usuario_id, periodo_mes, periodo_anio)
- ✅ Agregado campo **estado** (requerido)
- ✅ Agregado campo **metodo_pago** (opcional)
- ✅ Agregado campo **comprobante** (opcional)
- ❌ Eliminado campo **fechaVencimiento** (backend lo genera automáticamente)

---

### 2. **Actualización del Modal (`CrearPagoModal.tsx`)**

#### **Estado Inicial del Formulario:**

**ANTES:**
```typescript
const [formData, setFormData] = useState<PagoCreateRequest>({
  usuarioId: 0,
  periodoMes: new Date().getMonth() + 1,
  periodoAnio: new Date().getFullYear(),
  monto: 0,
  fechaVencimiento: '...',
  observaciones: ''
});
```

**AHORA:**
```typescript
const [formData, setFormData] = useState<PagoCreateRequest>({
  usuario_id: 0,
  periodo_mes: new Date().getMonth() + 1,
  periodo_anio: new Date().getFullYear(),
  monto: 0,
  estado: 'pendiente',
  metodo_pago: '',
  comprobante: '',
  observaciones: ''
});
```

#### **Nuevos Campos en el Formulario:**

1. **Campo Estado (Requerido)**
```tsx
<select name="estado" value={formData.estado} onChange={handleChange} required>
  <option value="pendiente">Pendiente</option>
  <option value="pagado">Pagado</option>
  <option value="atraso">Atrasado</option>
  <option value="rechazado">Rechazado</option>
</select>
```

2. **Campo Método de Pago (Condicional)**
```tsx
{/* Solo se muestra si estado === 'pagado' */}
{formData.estado === 'pagado' && (
  <select name="metodo_pago" value={formData.metodo_pago}>
    <option value="">Seleccionar método</option>
    <option value="Efectivo">Efectivo</option>
    <option value="Transferencia">Transferencia</option>
    <option value="Tarjeta">Tarjeta</option>
    <option value="Otro">Otro</option>
  </select>
)}
```

3. **Campo Comprobante (Opcional)**
```tsx
<input 
  type="text" 
  name="comprobante" 
  placeholder="Ej: COMP-2025-0010"
/>
```

#### **Campos Eliminados:**
- ❌ **Fecha de Vencimiento** (el backend la genera automáticamente)

---

### 3. **Actualización del Servicio API (`src/services/api.ts`)**

**Mejoras:**
- ✅ Limpia campos opcionales vacíos antes de enviar
- ✅ Logs de debugging
- ✅ Valida y elimina campos con strings vacíos

```typescript
async crearPago(pagoData: PagoCreateRequest): Promise<Pago> {
  // Limpiar campos opcionales vacíos antes de enviar
  const dataToSend: any = { ...pagoData };
  
  // Eliminar campos opcionales si están vacíos
  if (!dataToSend.metodo_pago || dataToSend.metodo_pago.trim() === '') {
    delete dataToSend.metodo_pago;
  }
  if (!dataToSend.comprobante || dataToSend.comprobante.trim() === '') {
    delete dataToSend.comprobante;
  }
  if (!dataToSend.observaciones || dataToSend.observaciones.trim() === '') {
    delete dataToSend.observaciones;
  }

  console.log('📤 Creando pago:', dataToSend);
  
  const response = await api.post<ApiResponse<Pago>>('/pagos', dataToSend);
  
  console.log('✅ Pago creado:', response.data.data);
  
  return response.data.data!;
}
```

---

## 🎯 Flujo de Creación de Pagos

### **Escenario 1: Crear Pago Pendiente**

1. Usuario selecciona **Estado: Pendiente**
2. Llena los campos:
   - Usuario
   - Período (Mes/Año)
   - Monto
   - Observaciones (opcional)
3. Click en **"Crear Pago"**

**Request enviado:**
```json
{
  "usuario_id": 8,
  "periodo_mes": 10,
  "periodo_anio": 2025,
  "monto": 80.00,
  "estado": "pendiente",
  "observaciones": "Cuota mensual octubre"
}
```

---

### **Escenario 2: Crear Pago Pagado**

1. Usuario selecciona **Estado: Pagado**
2. **Aparece campo "Método de Pago"**
3. Llena los campos:
   - Usuario
   - Período (Mes/Año)
   - Monto
   - **Método de Pago** (Efectivo, Transferencia, etc.)
   - Comprobante (opcional)
   - Observaciones (opcional)
4. Click en **"Crear Pago"**

**Request enviado:**
```json
{
  "usuario_id": 8,
  "periodo_mes": 10,
  "periodo_anio": 2025,
  "monto": 80.00,
  "estado": "pagado",
  "metodo_pago": "Efectivo",
  "comprobante": "COMP-2025-0010",
  "observaciones": "Pago de cuota mensual octubre"
}
```

---

## 📊 Comparación Visual

### **Modal ANTES:**

```
┌─────────────────────────────────────┐
│ Crear Nuevo Pago                    │
├─────────────────────────────────────┤
│ Usuario: [Seleccionar]              │
│ Mes: [Octubre] Año: [2025]          │
│ Monto: [80.00]                      │
│ Fecha Vencimiento: [2025-11-10]     │
│ Observaciones: [...texto...]        │
│                                     │
│         [Cancelar] [Crear Pago]     │
└─────────────────────────────────────┘
```

### **Modal AHORA:**

```
┌─────────────────────────────────────┐
│ Crear Nuevo Pago                    │
├─────────────────────────────────────┤
│ Usuario: [Seleccionar]              │
│ Mes: [Octubre] Año: [2025]          │
│ Monto: [80.00]                      │
│ Estado: [Pendiente ▼]               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Si estado = 'pagado':           │ │
│ │ Método de Pago: [Efectivo ▼]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Comprobante: [COMP-2025-0010]       │
│ Observaciones: [...texto...]        │
│                                     │
│         [Cancelar] [Crear Pago]     │
└─────────────────────────────────────┘
```

---

## 🧪 Ejemplos de Request

### **1. Pago Pendiente (Mínimo)**
```json
{
  "usuario_id": 8,
  "periodo_mes": 10,
  "periodo_anio": 2025,
  "monto": 80.00,
  "estado": "pendiente"
}
```

### **2. Pago Pagado (Completo)**
```json
{
  "usuario_id": 8,
  "periodo_mes": 10,
  "periodo_anio": 2025,
  "monto": 80.00,
  "estado": "pagado",
  "metodo_pago": "Efectivo",
  "comprobante": "COMP-2025-0010",
  "observaciones": "Pago de cuota mensual octubre"
}
```

### **3. Pago Atrasado con Observaciones**
```json
{
  "usuario_id": 8,
  "periodo_mes": 9,
  "periodo_anio": 2025,
  "monto": 80.00,
  "estado": "atraso",
  "observaciones": "Pago de septiembre - vencido"
}
```

### **4. Pago Rechazado**
```json
{
  "usuario_id": 8,
  "periodo_mes": 10,
  "periodo_anio": 2025,
  "monto": 80.00,
  "estado": "rechazado",
  "observaciones": "Cheque sin fondos"
}
```

---

## ✅ Validaciones Implementadas

### **Frontend:**
- ✅ Usuario requerido (no puede ser 0)
- ✅ Monto requerido y mayor a 0
- ✅ Estado requerido (pendiente, pagado, atraso, rechazado)
- ✅ Campos opcionales vacíos se eliminan antes de enviar
- ✅ Método de pago solo visible si estado = 'pagado'

### **Backend (debe validar):**
- ⚠️ usuario_id existe en la tabla usuarios
- ⚠️ periodo_mes entre 1-12
- ⚠️ periodo_anio válido
- ⚠️ monto > 0
- ⚠️ estado es uno de los valores permitidos

---

## 🐛 Debugging

### **Logs en la Consola del Navegador:**

Al crear un pago, verás:
```
📤 Creando pago: {
  usuario_id: 8,
  periodo_mes: 10,
  periodo_anio: 2025,
  monto: 80,
  estado: "pagado",
  metodo_pago: "Efectivo",
  comprobante: "COMP-2025-0010",
  observaciones: "Pago de cuota mensual octubre"
}
✅ Pago creado: { id: 45, usuario_id: 8, ... }
```

### **Request HTTP en Network Tab:**

```http
POST http://localhost:8080/api/pagos
Content-Type: application/json

{
  "usuario_id": 8,
  "periodo_mes": 10,
  "periodo_anio": 2025,
  "monto": 80.00,
  "estado": "pagado",
  "metodo_pago": "Efectivo",
  "comprobante": "COMP-2025-0010",
  "observaciones": "Pago de cuota mensual octubre"
}
```

---

## 🎯 Testing

### **Caso 1: Crear Pago Pendiente**
1. Abre `http://localhost:5174`
2. Ve a **Gestión de Pagos**
3. Click en **"Crear Pago"**
4. Llena:
   - Usuario: Juan Pérez
   - Mes: Octubre
   - Año: 2025
   - Monto: 80
   - **Estado: Pendiente**
   - Observaciones: Cuota mensual
5. Click en **"Crear Pago"**
6. Verifica que el pago aparece en la tabla

### **Caso 2: Crear Pago Pagado**
1. Click en **"Crear Pago"**
2. Llena:
   - Usuario: María López
   - Mes: Noviembre
   - Año: 2025
   - Monto: 80
   - **Estado: Pagado** ← Se muestra campo "Método de Pago"
   - **Método de Pago: Efectivo**
   - Comprobante: COMP-2025-0011
   - Observaciones: Pago noviembre
3. Click en **"Crear Pago"**
4. Verifica en la tabla que aparece como "Pagado"

### **Caso 3: Crear Pago sin Opcionales**
1. Click en **"Crear Pago"**
2. Llena SOLO campos requeridos:
   - Usuario
   - Mes/Año
   - Monto
   - Estado: Pendiente
3. Deja vacíos: Comprobante y Observaciones
4. Click en **"Crear Pago"**
5. Verifica en Network tab que los campos vacíos NO se envían

---

## 📝 Notas Importantes

### **Snake Case en el Backend:**
El backend espera los nombres de campos en **snake_case**:
- ✅ `usuario_id` (NO `usuarioId`)
- ✅ `periodo_mes` (NO `periodoMes`)
- ✅ `periodo_anio` (NO `periodoAnio`)
- ✅ `metodo_pago` (NO `metodoPago`)

### **Estado Determina el Endpoint:**
- Si se crea con **estado = 'pagado'**, el backend puede procesarlo directamente
- Si se crea con **estado = 'pendiente'** y luego se quiere marcar como pagado, se usa el endpoint:
  ```
  POST /api/pagos/{id}/procesar
  ```

### **Fecha de Vencimiento:**
- ❌ NO se envía desde el frontend
- ✅ El backend la genera automáticamente (probablemente último día del mes del período)

---

## ✅ Checklist de Implementación

- [x] Actualizar interface `PagoCreateRequest` con campos snake_case
- [x] Agregar campo `estado` requerido
- [x] Agregar campos opcionales (`metodo_pago`, `comprobante`, `observaciones`)
- [x] Actualizar modal para incluir select de estado
- [x] Mostrar método de pago solo si estado = 'pagado'
- [x] Eliminar campo fecha de vencimiento
- [x] Limpiar campos opcionales vacíos en el servicio API
- [x] Agregar logs de debugging
- [x] Compilación: 0 errores ✅
- [ ] Probar creación de pago pendiente
- [ ] Probar creación de pago pagado
- [ ] Verificar en BD que los datos se guardan correctamente

---

## 🚀 Estado Actual

- ✅ **Frontend:** Completamente actualizado
- ✅ **Types:** Actualizados a snake_case
- ✅ **Modal:** Campos nuevos agregados
- ✅ **API Service:** Limpieza de campos opcionales
- ✅ **Compilación:** 0 errores
- ⏳ **Pendiente:** Probar con el backend

---

**Fecha de actualización:** 3 de octubre de 2025  
**Estado:** Listo para probar ✅
