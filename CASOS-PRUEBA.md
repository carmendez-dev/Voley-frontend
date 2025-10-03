# 🧪 CASOS DE PRUEBA Y EJEMPLOS DE USO

## 🎯 CASOS DE USO PRINCIPALES

### **Caso de Uso 1: Gestión Completa de Pago**

**Escenario**: Un administrador necesita crear, monitorear y gestionar pagos mensuales

**Pasos**:
1. **Crear Nuevo Pago**
   ```
   Usuario: Carmen Alejandra Mendez Romero
   Cédula: 10659976
   Período: Diciembre 2025
   Monto: $80.000 COP
   Estado: Pendiente
   Observaciones: Pago mensual diciembre
   ```

2. **Búsqueda y Filtrado**
   ```
   Buscar: "Carmen"
   Filtro Estado: "Pendiente"
   Resultado: 1 pago encontrado
   ```

3. **Actualizar Estado**
   ```
   Estado: Pendiente → Pagado
   Comprobante: COMP-2025-0020
   Observaciones: Pago confirmado vía transferencia
   ```

4. **Verificar Estadísticas**
   ```
   Total Pagos: +1
   Pagos Realizados: +1
   Monto Cobrado: +$80.000
   ```

### **Caso de Uso 2: Gestión de Pagos Atrasados**

**Escenario**: Identificar y gestionar pagos vencidos

**Pasos**:
1. **Filtrar Pagos en Atraso**
   ```
   Filtro Estado: "Atraso"
   Resultado: Lista de pagos vencidos
   ```

2. **Contactar Usuario**
   ```
   Ver Pagos Usuario → Juan Pérez (1234567)
   Historial: 3 pagos atrasados
   Total Deuda: $240.000
   ```

3. **Procesar Pago Atrasado**
   ```
   Estado: Atraso → Pagado
   Comprobante: COMP-2025-0021
   Observaciones: Pago múltiple - 3 meses
   ```

### **Caso de Uso 3: Generación de Reportes**

**Escenario**: Generar reporte mensual para administración

**Pasos**:
1. **Acceder a Reportes**
   ```
   Navegación → Reportes
   Vista: Dashboard con estadísticas
   ```

2. **Filtrar por Período**
   ```
   Período: Septiembre 2025
   Aplicar filtros
   ```

3. **Analizar Resultados**
   ```
   Total Pagos: 5
   Pagos Realizados: 2 (40%)
   Pagos Pendientes: 3 (60%)
   Monto Total: $430.000
   Monto Cobrado: $230.000
   ```

---

## 🧪 CASOS DE PRUEBA FUNCIONALES

### **Test Suite: Gestión de Pagos**

#### **TC001: Crear Pago Exitoso**
```
Precondiciones: 
- Sistema iniciado
- Lista de usuarios disponible

Pasos:
1. Click en "Nuevo Pago"
2. Seleccionar usuario "Juan Pérez"
3. Ingresar período "Enero 2026"
4. Ingresar monto "100000"
5. Seleccionar estado "Pendiente"
6. Click en "Crear Pago"

Resultado Esperado:
- Modal se cierra
- Mensaje de éxito mostrado
- Pago aparece en la lista
- Estadísticas actualizadas
```

#### **TC002: Validación de Campos Requeridos**
```
Pasos:
1. Click en "Nuevo Pago"
2. Dejar campos vacíos
3. Click en "Crear Pago"

Resultado Esperado:
- Mensajes de error mostrados
- Campos requeridos marcados en rojo
- Modal permanece abierto
- No se crea el pago
```

#### **TC003: Editar Estado de Pago**
```
Precondiciones:
- Al menos un pago existe

Pasos:
1. Click en icono de edición (✏️)
2. Cambiar estado a "Pagado"
3. Agregar observaciones
4. Click en "Actualizar"

Resultado Esperado:
- Estado actualizado en lista
- Badge cambia de color
- Estadísticas actualizadas
```

#### **TC004: Eliminar Pago**
```
Precondiciones:
- Al menos un pago existe

Pasos:
1. Click en icono de eliminación (🗑️)
2. Confirmar en diálogo
3. Verificar lista actualizada

Resultado Esperado:
- Pago removido de lista
- Estadísticas actualizadas
- Mensaje de confirmación
```

### **Test Suite: Búsqueda y Filtros**

#### **TC005: Búsqueda por Nombre**
```
Precondiciones:
- Múltiples pagos en sistema

Pasos:
1. Ingresar "Carmen" en campo búsqueda
2. Verificar resultados

Resultado Esperado:
- Solo pagos de Carmen mostrados
- Contador actualizado
- Otros pagos ocultos
```

#### **TC006: Filtro por Estado**
```
Pasos:
1. Seleccionar "Pagado" en filtro estado
2. Verificar resultados

Resultado Esperado:
- Solo pagos con estado "Pagado"
- Lista filtrada correctamente
```

#### **TC007: Combinación de Filtros**
```
Pasos:
1. Buscar "Juan"
2. Filtrar por "Pendiente"

Resultado Esperado:
- Solo pagos de Juan con estado Pendiente
- Filtros aplicados simultáneamente
```

### **Test Suite: Responsividad**

#### **TC008: Vista Móvil**
```
Pasos:
1. Redimensionar ventana a 375px
2. Verificar layout
3. Probar navegación

Resultado Esperado:
- Layout se adapta correctamente
- Tabla scrollable horizontalmente
- Botones accesibles
```

---

## 📊 DATOS DE PRUEBA

### **Usuarios de Prueba**
```json
[
  {
    "id": 1,
    "nombreCompleto": "Juan Pérez",
    "email": "juan.perez@email.com",
    "telefono": "3001234567",
    "cedulaUsuario": "1234567",
    "estado": "activo"
  },
  {
    "id": 2,
    "nombreCompleto": "Carmen Alejandra Mendez Romero", 
    "email": "carmen.mendez@email.com",
    "telefono": "3007654321",
    "cedulaUsuario": "10659976",
    "estado": "activo"
  },
  {
    "id": 3,
    "nombreCompleto": "María González",
    "email": "maria.gonzalez@email.com", 
    "telefono": "3009876543",
    "cedulaUsuario": "4567890",
    "estado": "inactivo"
  }
]
```

### **Pagos de Prueba**
```json
[
  {
    "id": 1,
    "nombreUsuario": "Juan Pérez",
    "cedulaUsuario": "1234567",
    "periodoMesAnio": "Septiembre 2025",
    "monto": 150.00,
    "comprobante": "comp_123.jpg",
    "fechaRegistro": "2025-05-22",
    "estadoPago": "pagado",
    "observaciones": "Pago mensual septiembre"
  },
  {
    "id": 2,
    "nombreUsuario": "Carmen Alejandra Mendez Romero",
    "cedulaUsuario": "10659976", 
    "periodoMesAnio": "Octubre 2025",
    "monto": 80.00,
    "comprobante": null,
    "fechaRegistro": "2025-09-25",
    "estadoPago": "pendiente",
    "observaciones": null
  }
]
```

---

## 🚨 CASOS DE PRUEBA DE ERROR

### **Error Handling Tests**

#### **TC009: API No Disponible**
```
Simulación:
- Detener servidor backend
- Intentar cargar pagos

Resultado Esperado:
- Mensaje de error mostrado
- Loading state manejado
- Botón de reintentar disponible
```

#### **TC010: Error de Red**
```
Simulación:
- Desconectar internet
- Intentar crear pago

Resultado Esperado:
- Error de conexión mostrado
- Datos no se pierden
- Posibilidad de reintentar
```

#### **TC011: Datos Corruptos**
```
Simulación:
- API retorna JSON inválido
- Campos faltantes en respuesta

Resultado Esperado:
- Error manejado graciosamente
- Valores por defecto mostrados
- Sistema sigue funcionando
```

### **Validation Tests**

#### **TC012: Monto Inválido**
```
Pasos:
1. Ingresar monto negativo: "-100"
2. Intentar crear pago

Resultado Esperado:
- Error de validación
- Campo marcado como inválido
```

#### **TC013: Caracteres Especiales**
```
Pasos:
1. Ingresar observaciones con HTML: "<script>alert('test')</script>"
2. Crear pago

Resultado Esperado:
- Contenido sanitizado
- No ejecución de scripts
```

---

## ⚡ PRUEBAS DE PERFORMANCE

### **Performance Test Cases**

#### **TC014: Carga de Datos Masivos**
```
Simulación:
- 1000+ pagos en sistema
- Cargar lista completa

Métricas Esperadas:
- Tiempo de carga < 3 segundos
- Sin bloqueo de UI
- Memoria estable
```

#### **TC015: Búsqueda Rápida**
```
Simulación:
- Búsqueda en lista de 500 pagos
- Filtros múltiples aplicados

Métricas Esperadas:
- Respuesta inmediata < 100ms
- Sin lag en typing
- Resultados precisos
```

#### **TC016: Memoria y CPU**
```
Simulación:
- Uso prolongado 30+ minutos
- Múltiples operaciones CRUD

Métricas Esperadas:
- Sin memory leaks
- CPU usage estable
- Garbage collection eficiente
```

---

## 🔒 PRUEBAS DE SEGURIDAD

### **Security Test Cases**

#### **TC017: XSS Prevention**
```
Pasos:
1. Ingresar script malicioso en observaciones
2. Verificar renderizado

Resultado Esperado:
- Script no ejecutado
- Contenido escaped correctamente
```

#### **TC018: Input Sanitization**
```
Pasos:
1. Intentar SQL injection en campos
2. Verificar procesamiento

Resultado Esperado:
- Inputs sanitizados
- No errores de backend
```

#### **TC019: CORS Policy**
```
Pasos:
1. Intentar acceso desde dominio no autorizado
2. Verificar respuesta

Resultado Esperado:
- Request bloqueado
- Error CORS mostrado
```

---

## 📱 PRUEBAS DE USABILIDAD

### **Usability Test Scenarios**

#### **Escenario 1: Usuario Nuevo**
```
Perfil: Administrador sin experiencia técnica
Tarea: Crear primer pago del mes

Métricas:
- Tiempo para completar tarea
- Número de errores cometidos
- Satisfacción del usuario (1-10)
```

#### **Escenario 2: Usuario Experimentado**
```
Perfil: Administrador con experiencia
Tarea: Procesar 20 pagos pendientes

Métricas:
- Eficiencia en flujo de trabajo
- Uso de atajos/filtros
- Tiempo total invertido
```

#### **Escenario 3: Usuario Móvil**
```
Perfil: Usuario en dispositivo móvil
Tarea: Verificar estado de pagos

Métricas:
- Facilidad de navegación
- Accesibilidad de botones
- Experiencia responsive
```

---

## 🔧 SETUP DE TESTING

### **Testing Environment**

```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
npm install --save-dev vitest
npm install --save-dev jsdom

# Configurar test script
npm test
```

### **Mock Data Setup**

```typescript
// tests/mocks/data.ts
export const mockPagos: Pago[] = [
  {
    id: 1,
    nombreUsuario: "Juan Test",
    cedulaUsuario: "12345678",
    periodoMesAnio: "Enero 2026",
    monto: 100000,
    estadoPago: "pendiente",
    comprobante: null,
    fechaRegistro: "2025-12-01",
    observaciones: "Test payment"
  }
];

export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nombreCompleto: "Juan Test",
    email: "juan@test.com",
    cedulaUsuario: "12345678",
    estado: "activo"
  }
];
```

### **Test Utilities**

```typescript
// tests/utils.tsx
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

export const mockApiService = {
  obtenerTodosLosPagos: jest.fn(),
  crearPago: jest.fn(),
  actualizarEstadoPago: jest.fn(),
  eliminarPago: jest.fn()
};
```

---

## 📋 CHECKLIST DE TESTING

### **Pre-Release Testing Checklist**

#### **Funcionalidad Core**
- [ ] Crear pago funciona correctamente
- [ ] Editar estado de pago funciona
- [ ] Eliminar pago funciona
- [ ] Búsqueda y filtros funcionan
- [ ] Estadísticas se actualizan correctamente

#### **UI/UX**
- [ ] Responsive design en todos los breakpoints
- [ ] Modales abren y cierran correctamente
- [ ] Loading states mostrados apropiadamente
- [ ] Error messages claros y útiles
- [ ] Navegación intuitiva

#### **Performance**
- [ ] Tiempo de carga inicial < 3s
- [ ] Interacciones responden < 100ms
- [ ] Sin memory leaks detectados
- [ ] Bundle size optimizado

#### **Compatibilidad**
- [ ] Chrome (últimas 2 versiones)
- [ ] Firefox (últimas 2 versiones)
- [ ] Safari (últimas 2 versiones)
- [ ] Edge (últimas 2 versiones)
- [ ] Dispositivos móviles (iOS/Android)

#### **Seguridad**
- [ ] Inputs sanitizados
- [ ] XSS protection activa
- [ ] CORS configurado correctamente
- [ ] Variables sensibles no expuestas

---

*Esta guía de testing proporciona un framework completo para validar la funcionalidad, performance y seguridad del sistema antes de deployment.*