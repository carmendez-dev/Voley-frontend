# 📸 Sistema de Upload de Comprobantes de Pago

## ✅ Cambios Implementados en el Frontend

### 1. **Modal de Editar Pago Mejorado** (`EditarEstadoModal.tsx`)

#### Nuevas Funcionalidades:

✅ **Upload de imágenes** para comprobantes
✅ **Preview en tiempo real** de la imagen seleccionada
✅ **Validaciones**:
  - Solo acepta archivos de imagen (jpg, png, gif, etc.)
  - Tamaño máximo: 5MB
✅ **Input alternativo** de texto para comprobantes sin imagen
✅ **Bloqueo de scroll** del fondo cuando el modal está abierto
✅ **Restauración de posición** al cerrar el modal

#### Código Actualizado:

```typescript
// Estados agregados
const [archivoComprobante, setArchivoComprobante] = useState<File | null>(null);
const [previewUrl, setPreviewUrl] = useState<string>('');

// Función para manejar selección de archivo
const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    setArchivoComprobante(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }
};
```

---

## 🔧 Configuración del Backend (PENDIENTE)

### Opción 1: Upload Directo al Servidor Backend

#### Paso 1: Crear Carpeta para Comprobantes

En tu proyecto backend, crea la siguiente estructura:

```
backend/
├── public/
│   └── uploads/
│       └── comprobantes/
│           └── .gitkeep
```

**PowerShell:**
```powershell
# En la raíz del proyecto backend
New-Item -Path "public/uploads/comprobantes" -ItemType Directory -Force
New-Item -Path "public/uploads/comprobantes/.gitkeep" -ItemType File
```

#### Paso 2: Configurar Multer (Node.js/Express)

Instalar dependencia:
```bash
npm install multer
```

Crear endpoint de upload:
```javascript
// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/comprobantes/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `comp_${req.body.pagoId}_${uniqueSuffix}${extension}`)
  }
});

// Validar archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Endpoint para subir comprobante
router.post('/comprobantes', upload.single('comprobante'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo' });
  }

  const rutaArchivo = `uploads/comprobantes/${req.file.filename}`;
  
  res.json({
    success: true,
    message: 'Archivo subido correctamente',
    data: {
      ruta: rutaArchivo,
      nombreOriginal: req.file.originalname,
      tamaño: req.file.size
    }
  });
});

module.exports = router;
```

Registrar ruta en el servidor principal:
```javascript
// app.js o server.js
const uploadRoutes = require('./routes/upload');

app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('public/uploads')); // Servir archivos estáticos
```

#### Paso 3: Actualizar Frontend para Usar el Endpoint

```typescript
// En EditarEstadoModal.tsx - handleSubmit
if (archivoComprobante) {
  const formData = new FormData();
  formData.append('comprobante', archivoComprobante);
  formData.append('pagoId', pago.id.toString());

  const uploadResponse = await fetch('http://localhost:8080/api/upload/comprobantes', {
    method: 'POST',
    body: formData
  });

  const uploadData = await uploadResponse.json();
  
  if (uploadData.success) {
    rutaComprobante = uploadData.data.ruta;
  } else {
    throw new Error('Error al subir el archivo');
  }
}
```

---

### Opción 2: Upload a Servicio Cloud (AWS S3, Cloudinary, etc.)

#### Cloudinary (Recomendado para Imágenes)

**1. Instalar SDK:**
```bash
npm install cloudinary multer-storage-cloudinary
```

**2. Configurar:**
```javascript
// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'comprobantes-pagos',
    allowed_formats: ['jpg', 'png', 'gif', 'jpeg'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

module.exports = { cloudinary, storage };
```

**3. Endpoint:**
```javascript
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.post('/comprobantes', upload.single('comprobante'), (req, res) => {
  res.json({
    success: true,
    data: {
      ruta: req.file.path, // URL de Cloudinary
      publicId: req.file.filename
    }
  });
});
```

---

## 🎨 UI del Modal de Editar

### Vista del Comprobante:

```
┌─────────────────────────────────────┐
│  Comprobante (Imagen)               │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │   📤  Seleccionar imagen del  │  │
│  │       comprobante             │  │
│  └───────────────────────────────┘  │
│                                     │
│  O ingresa el número manualmente:  │
│  ┌───────────────────────────────┐  │
│  │  COMP-2025-001                │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Después de Seleccionar Imagen:

```
┌─────────────────────────────────────┐
│  Comprobante (Imagen)               │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │   [PREVIEW DE LA IMAGEN]      │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  📷 comprobante_123.jpg  [Eliminar] │
└─────────────────────────────────────┘
```

---

## 🔒 Bloqueo de Scroll

### Problema Resuelto:

❌ **ANTES**: Al abrir el modal, se podía hacer scroll en la página de fondo
✅ **DESPUÉS**: El scroll se bloquea y al cerrar, vuelve a la misma posición

### Código Implementado:

```typescript
useEffect(() => {
  // Guardar posición actual
  const scrollY = window.scrollY;
  
  // Bloquear scroll
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';

  // Restaurar al cerrar
  return () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  };
}, []);
```

---

## 📋 Modales Actualizados

✅ **EditarEstadoModal** - Upload de comprobantes + bloqueo scroll
✅ **VerPagosUsuarioModal** - Bloqueo scroll
✅ **CrearPagoModal** - Bloqueo scroll

---

## 🚀 Próximos Pasos

### Para el Backend:

1. **Elegir método de almacenamiento**:
   - [ ] Opción 1: Carpeta local (`public/uploads/comprobantes/`)
   - [ ] Opción 2: Cloudinary (recomendado)
   - [ ] Opción 3: AWS S3
   - [ ] Opción 4: Otro servicio cloud

2. **Implementar endpoint** `/api/upload/comprobantes`:
   - [ ] POST - Recibe archivo multipart/form-data
   - [ ] Validar tipo de archivo
   - [ ] Validar tamaño
   - [ ] Generar nombre único
   - [ ] Guardar archivo
   - [ ] Retornar ruta del archivo

3. **Actualizar endpoint** `/api/pagos/{id}/procesar`:
   - [ ] Aceptar ruta del comprobante
   - [ ] Guardar en base de datos

4. **Servir archivos estáticos**:
   - [ ] Configurar Express para servir `/uploads`
   - [ ] O configurar CORS si usas cloud

### Para el Frontend:

1. **Actualizar `handleSubmit`** en `EditarEstadoModal.tsx`:
   - Reemplazar el código TODO con la llamada real al endpoint
   - Ver ejemplo en Opción 1 - Paso 3

2. **Probar flujo completo**:
   - [ ] Seleccionar imagen
   - [ ] Ver preview
   - [ ] Subir al servidor
   - [ ] Guardar pago
   - [ ] Verificar que se guardó la ruta

---

## 📝 Ejemplo de Flujo Completo

1. Usuario hace click en "Editar" pago
2. Se abre modal (scroll bloqueado)
3. Usuario selecciona "Pagado"
4. Aparecen campos de método de pago y comprobante
5. Usuario hace click en "Seleccionar imagen"
6. Selecciona imagen (se valida tamaño y tipo)
7. Se muestra preview
8. Usuario completa formulario y da "Actualizar"
9. Frontend sube imagen al backend
10. Backend guarda imagen y retorna ruta
11. Frontend actualiza pago con la ruta del comprobante
12. Modal se cierra
13. Scroll se restaura a la posición original
14. Tabla se recarga con datos actualizados

---

**Estado:** ✅ Frontend completado | ⏳ Backend pendiente

**Fecha:** 3 de octubre de 2025  
**Versión:** 3.0
