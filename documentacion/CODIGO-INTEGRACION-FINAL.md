# 🔗 Código Final para Integración con Backend

## 📝 Reemplazar en EditarEstadoModal.tsx

### Ubicación: Línea ~65-75 (dentro de `handleSubmit`)

**BUSCAR ESTE CÓDIGO:**
```typescript
// Si hay un archivo de imagen, subirlo primero
if (archivoComprobante) {
  // TODO: Implementar upload real al servidor
  // Por ahora, generamos una ruta simulada
  const timestamp = new Date().getTime();
  const extension = archivoComprobante.name.split('.').pop();
  rutaComprobante = `uploads/comprobantes/comp_${pago.id}_${timestamp}.${extension}`;
  
  console.log('Archivo a subir:', archivoComprobante);
  console.log('Ruta generada:', rutaComprobante);
  // Aquí iría la lógica para subir el archivo al servidor
}
```

**REEMPLAZAR CON:**
```typescript
// Si hay un archivo de imagen, subirlo primero
if (archivoComprobante) {
  try {
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('comprobante', archivoComprobante);
    formData.append('pagoId', pago.id.toString());

    // Subir archivo al backend
    const uploadResponse = await fetch('http://localhost:8080/api/upload/comprobantes', {
      method: 'POST',
      body: formData
      // No incluir Content-Type header, fetch lo agrega automáticamente para FormData
    });

    // Verificar respuesta
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.message || 'Error al subir el comprobante');
    }

    const uploadData = await uploadResponse.json();
    
    if (uploadData.success && uploadData.data && uploadData.data.ruta) {
      rutaComprobante = uploadData.data.ruta;
      console.log('✅ Comprobante subido correctamente:', rutaComprobante);
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (uploadError: any) {
    console.error('❌ Error al subir comprobante:', uploadError);
    setError(`Error al subir el comprobante: ${uploadError.message}`);
    setLoading(false);
    return; // Detener la ejecución
  }
}
```

---

## 📋 Código Completo de `handleSubmit` Actualizado

Para referencia, así debería verse el método completo:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    let rutaComprobante = comprobante;

    // Si hay un archivo de imagen, subirlo primero
    if (archivoComprobante) {
      try {
        // Crear FormData para enviar el archivo
        const formData = new FormData();
        formData.append('comprobante', archivoComprobante);
        formData.append('pagoId', pago.id.toString());

        // Subir archivo al backend
        const uploadResponse = await fetch('http://localhost:8080/api/upload/comprobantes', {
          method: 'POST',
          body: formData
        });

        // Verificar respuesta
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Error al subir el comprobante');
        }

        const uploadData = await uploadResponse.json();
        
        if (uploadData.success && uploadData.data && uploadData.data.ruta) {
          rutaComprobante = uploadData.data.ruta;
          console.log('✅ Comprobante subido correctamente:', rutaComprobante);
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      } catch (uploadError: any) {
        console.error('❌ Error al subir comprobante:', uploadError);
        setError(`Error al subir el comprobante: ${uploadError.message}`);
        setLoading(false);
        return; // Detener la ejecución
      }
    }

    // Continuar con el procesamiento del pago
    if (nuevoEstado === 'pagado') {
      // Usar procesarPago para marcar como pagado
      const datosPago: PagoProcesarRequest = {
        monto: pago.monto,
        metodoPago: metodoPago || 'efectivo',
        comprobante: rutaComprobante || undefined,
        observaciones: observaciones || undefined
      };
      await pagoService.procesarPago(pago.id, datosPago);
    } else {
      // Actualizar otros campos
      await pagoService.actualizarPago(pago.id, {
        observaciones: observaciones || undefined
      });
    }
    
    onSuccess();
  } catch (err: any) {
    setError(err.response?.data?.message || err.message || 'Error al actualizar el estado');
  } finally {
    setLoading(false);
  }
};
```

---

## 🧪 Prueba de Integración

### Pasos para Probar:

1. **Verificar que el backend esté corriendo**:
   ```bash
   # En la terminal del backend
   # Debería mostrar: "Server running on port 8080"
   ```

2. **Abrir la aplicación frontend**:
   ```bash
   npm run dev
   ```

3. **Probar el flujo completo**:
   - Ir a "Gestión de Pagos"
   - Click en botón "Editar" (lápiz) de cualquier pago
   - Cambiar estado a "Pagado"
   - Seleccionar método de pago
   - Click en "Seleccionar imagen del comprobante"
   - Elegir una imagen (jpg, png, etc.)
   - Verificar que se muestra el preview
   - Click en "Actualizar Estado"
   - Ver logs en la consola del navegador (F12)

4. **Verificar logs esperados**:
   ```
   ✅ Comprobante subido correctamente: uploads/comprobantes/comp_1_1696345678901.jpg
   ```

5. **Verificar archivo guardado**:
   - En el backend, revisar carpeta: `public/uploads/comprobantes/`
   - Debe existir el archivo con el nombre generado

6. **Verificar en base de datos**:
   - El campo `comprobante` del pago debe tener la ruta:
   - Ejemplo: `uploads/comprobantes/comp_1_1696345678901.jpg`

7. **Acceder a la imagen**:
   - Abrir navegador: `http://localhost:8080/uploads/comprobantes/comp_1_XXXXX.jpg`
   - Debería mostrar la imagen subida

---

## 🐛 Debugging

### Si algo no funciona:

#### Error: "Failed to fetch"
```typescript
// Verifica que el backend esté corriendo
// Verifica la URL: http://localhost:8080/api/upload/comprobantes
```

#### Error: "CORS policy"
```javascript
// En el backend, agrega CORS:
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5174'
}));
```

#### Error: "No se recibió ningún archivo"
```typescript
// Verifica que el nombre del campo sea 'comprobante'
formData.append('comprobante', archivoComprobante);
```

#### Error 500 en el backend
```javascript
// Verifica que la carpeta exista:
// public/uploads/comprobantes/
```

### Console.log para Debug:

Agregar en `handleSubmit`:
```typescript
console.log('📤 Iniciando upload de comprobante...');
console.log('Archivo:', archivoComprobante?.name);
console.log('Tamaño:', archivoComprobante?.size);
console.log('Tipo:', archivoComprobante?.type);
console.log('Pago ID:', pago.id);

// Después del upload:
console.log('📥 Respuesta del servidor:', uploadData);
```

---

## ✅ Checklist de Implementación

### Frontend:
- [ ] Reemplazar el TODO en `EditarEstadoModal.tsx`
- [ ] Verificar que no hay errores de TypeScript
- [ ] Compilar: `npm run build`
- [ ] Correr dev server: `npm run dev`

### Backend:
- [ ] Crear carpeta `public/uploads/comprobantes/`
- [ ] Instalar Multer: `npm install multer`
- [ ] Crear `routes/upload.js` (ver GUIA-BACKEND-UPLOAD.md)
- [ ] Registrar rutas en `app.js`
- [ ] Servir archivos estáticos
- [ ] Iniciar servidor

### Pruebas:
- [ ] Subir una imagen pequeña (< 1MB)
- [ ] Subir una imagen grande (> 5MB) - debe fallar
- [ ] Subir un archivo no-imagen - debe fallar
- [ ] Verificar preview en el modal
- [ ] Verificar archivo guardado en carpeta
- [ ] Verificar ruta en base de datos
- [ ] Acceder a imagen por URL

---

## 🎯 Resultado Esperado

### En la Consola del Navegador:
```
📤 Iniciando upload de comprobante...
Archivo: comprobante_pago.jpg
Tamaño: 245678
Tipo: image/jpeg
Pago ID: 1
✅ Comprobante subido correctamente: uploads/comprobantes/comp_1_1696345678901.jpg
```

### En el Backend (Terminal):
```
POST /api/upload/comprobantes 200 245ms
```

### En la Carpeta del Backend:
```
backend/
└── public/
    └── uploads/
        └── comprobantes/
            └── comp_1_1696345678901.jpg ✅
```

### En la Base de Datos:
```sql
UPDATE pagos 
SET comprobante = 'uploads/comprobantes/comp_1_1696345678901.jpg',
    estado = 'pagado',
    fechaPago = '2025-10-03'
WHERE id = 1;
```

---

**¡Todo listo para la integración!** 🚀

Solo reemplaza el código y el sistema de upload estará funcionando completamente.
