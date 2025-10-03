# 🔴 PROBLEMA IDENTIFICADO: Backend vs Frontend

## ✅ Lo que Enviamos (Frontend)

```json
{
  "usuario_id": 8,
  "periodo_mes": 11,
  "periodo_anio": 2025,
  "monto": 80,
  "estado": "pagado",
  "metodo_pago": "Transferencia"
}
```

**✅ Esto está CORRECTO según la documentación.**

---

## ❌ Lo que Responde el Backend

```json
{
  "success": false,
  "message": "Error de validación",
  "error": "El usuario del pago no puede ser nulo"
}
```

---

## 🔍 Análisis del Problema

### **Hay 3 posibilidades:**

### **Opción 1: El Backend Espera CamelCase (usuarioId)**

El backend está configurado para recibir:
```json
{
  "usuarioId": 8,  ← camelCase
  "periodoMes": 11,
  "periodoAnio": 2025,
  ...
}
```

Pero nosotros estamos enviando:
```json
{
  "usuario_id": 8,  ← snake_case
  ...
}
```

Por lo tanto, el backend NO encuentra el campo `usuarioId` y lo interpreta como nulo.

---

### **Opción 2: El Backend NO Tiene @JsonProperty**

En Spring Boot, si la clase DTO usa camelCase pero no tiene `@JsonProperty`, Jackson no mapea automáticamente snake_case a camelCase.

**Backend DTO (probablemente):**
```java
public class PagoCreateRequest {
    private Long usuarioId;  // Espera "usuarioId"
    private Integer periodoMes;
    private Integer periodoAnio;
    // ...
}
```

Sin `@JsonProperty("usuario_id")`, Jackson NO mapea `usuario_id` → `usuarioId`.

---

### **Opción 3: Configuración de Jackson Faltante**

El backend NO tiene configurado `PropertyNamingStrategies.SNAKE_CASE` en Jackson.

**Configuración que falta en el backend:**
```java
@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        return mapper;
    }
}
```

---

## ✅ SOLUCIÓN RÁPIDA: Cambiar a CamelCase

Como **el backend ya existe** y probablemente usa camelCase, la solución más rápida es **cambiar el frontend** para enviar camelCase.

### **Cambios Necesarios:**

1. **`src/types/index.ts`** → Cambiar a camelCase:
```typescript
export interface PagoCreateRequest {
  usuarioId?: number;      // ← camelCase
  periodoMes: number;      // ← camelCase
  periodoAnio: number;     // ← camelCase
  monto: number;
  estado: 'pendiente' | 'pagado' | 'atraso' | 'rechazado';
  metodoPago?: string;     // ← camelCase
  comprobante?: File | null;
  observaciones?: string;
}
```

2. **`src/services/api.ts`** → Convertir a camelCase antes de enviar:
```typescript
const dataToSend = {
  usuarioId: pagoData.usuarioId,      // ← camelCase
  periodoMes: pagoData.periodoMes,    // ← camelCase
  periodoAnio: pagoData.periodoAnio,  // ← camelCase
  monto: pagoData.monto,
  estado: pagoData.estado
};
```

3. **`src/components/modals/CrearPagoModal.tsx`** → Cambiar nombres de campos:
```typescript
const [formData, setFormData] = useState({
  usuarioId: undefined,      // ← camelCase
  periodoMes: ...,           // ← camelCase
  periodoAnio: ...,          // ← camelCase
  // ...
});

// En el select:
<select name="usuarioId" ...>  {/* ← camelCase */}
```

---

## 🎯 DECISIÓN REQUERIDA

### **Opción A: Cambiar Frontend a CamelCase** ⭐ RECOMENDADO

**Pros:**
- ✅ Solución rápida
- ✅ No requiere modificar el backend
- ✅ Compatible con otros endpoints que usan camelCase

**Contras:**
- ❌ Contradice la documentación que diste (que decía snake_case)

**Acción:** Cambiar `usuario_id` → `usuarioId` en el frontend

---

### **Opción B: Configurar Backend para Snake_Case**

**Pros:**
- ✅ Mantiene la especificación original
- ✅ Más consistente con bases de datos

**Contras:**
- ❌ Requiere modificar el backend
- ❌ Puede afectar otros endpoints
- ❌ Más complejo

**Acción:** Agregar `@JsonProperty` o configurar Jackson en el backend

---

## 🚀 PREGUNTA PARA TI

**¿Qué otros endpoints del backend usan?**

Por favor, revisa un endpoint que **funciona** (por ejemplo, editar pago):

1. Abre Network Tab
2. Edita un pago existente
3. Mira el Request Payload
4. Dime si usa:
   - **CamelCase:** `{ "usuarioId": 8, "periodoMes": 10, ... }`
   - **Snake_case:** `{ "usuario_id": 8, "periodo_mes": 10, ... }`

---

## ⚡ ACCIÓN INMEDIATA

**Si quieres la solución rápida (Opción A):**

Responde: **"Cambiar a camelCase"**

Y haré los cambios en el frontend inmediatamente.

**Si quieres verificar primero:**

Revisa el Network Tab de **otro endpoint que funcione** (como editar pago o procesar pago) y dime qué formato usa.

---

**¿Cuál opción prefieres?**
- A) Cambiar frontend a camelCase (rápido)
- B) Primero verificar qué formato usan otros endpoints
