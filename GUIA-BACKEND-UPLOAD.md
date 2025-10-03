# 🚀 Guía Rápida: Implementar Upload de Comprobantes (Backend)

## 📋 Opción Recomendada: Carpeta Local

### Paso 1: Crear Estructura de Carpetas

```powershell
# En la raíz de tu proyecto backend
New-Item -Path "public/uploads/comprobantes" -ItemType Directory -Force
```

### Paso 2: Instalar Multer

```bash
npm install multer
```

### Paso 3: Crear Archivo de Rutas

Crea `routes/upload.js`:

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/comprobantes/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `comp_${req.body.pagoId}_${timestamp}${extension}`);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Endpoint POST /api/upload/comprobantes
router.post('/comprobantes', upload.single('comprobante'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo'
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al subir el archivo',
      error: error.message
    });
  }
});

module.exports = router;
```

### Paso 4: Registrar Rutas en el Servidor

En `app.js` o `server.js`:

```javascript
const express = require('express');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middlewares existentes...
app.use(express.json());

// Servir archivos estáticos
app.use('/uploads', express.static('public/uploads'));

// Rutas
app.use('/api/upload', uploadRoutes);

// Otras rutas...
```

### Paso 5: Actualizar Frontend

En `src/components/modals/EditarEstadoModal.tsx`, reemplaza el TODO:

```typescript
// Si hay un archivo de imagen, subirlo primero
if (archivoComprobante) {
  const formData = new FormData();
  formData.append('comprobante', archivoComprobante);
  formData.append('pagoId', pago.id.toString());

  const uploadResponse = await fetch('http://localhost:8080/api/upload/comprobantes', {
    method: 'POST',
    body: formData
  });

  if (!uploadResponse.ok) {
    throw new Error('Error al subir el comprobante');
  }

  const uploadData = await uploadResponse.json();
  
  if (uploadData.success) {
    rutaComprobante = uploadData.data.ruta;
  } else {
    throw new Error(uploadData.message || 'Error al subir el archivo');
  }
}
```

### Paso 6: Probar

1. **Inicia el backend**:
   ```bash
   npm start
   ```

2. **Inicia el frontend**:
   ```bash
   npm run dev
   ```

3. **Prueba el upload**:
   - Abre Gestión de Pagos
   - Click en "Editar" un pago
   - Selecciona "Pagado"
   - Sube una imagen
   - Guarda

4. **Verifica**:
   - Revisa que el archivo se guardó en `backend/public/uploads/comprobantes/`
   - Verifica que la ruta se guardó en la base de datos
   - Accede a: `http://localhost:8080/uploads/comprobantes/comp_X_XXXX.jpg`

---

## 🔧 Configuración CORS (Si es Necesario)

Si tienes problemas de CORS:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5174', // URL del frontend
  credentials: true
}));
```

---

## ✅ Checklist de Implementación

- [ ] Crear carpeta `public/uploads/comprobantes/`
- [ ] Instalar `npm install multer`
- [ ] Crear archivo `routes/upload.js`
- [ ] Registrar rutas en `app.js`
- [ ] Servir archivos estáticos `/uploads`
- [ ] Actualizar frontend (reemplazar TODO)
- [ ] Probar upload completo
- [ ] Verificar archivo guardado
- [ ] Verificar acceso por URL

---

## 🐛 Troubleshooting

### Error: "Cannot POST /api/upload/comprobantes"
✅ Verifica que registraste las rutas: `app.use('/api/upload', uploadRoutes)`

### Error: "No se recibió ningún archivo"
✅ Verifica que el campo del form se llama `comprobante`: `upload.single('comprobante')`

### Error: "ENOENT: no such file or directory"
✅ Crea la carpeta: `public/uploads/comprobantes/`

### Las imágenes no se ven (404)
✅ Verifica que configuraste: `app.use('/uploads', express.static('public/uploads'))`

### Error de CORS
✅ Instala y configura: `npm install cors`

---

## 📝 Variables de Entorno (.env)

```env
PORT=8080
UPLOAD_DIR=public/uploads/comprobantes
MAX_FILE_SIZE=5242880
```

Usar en el código:

```javascript
const uploadDir = process.env.UPLOAD_DIR || 'public/uploads/comprobantes';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
```

---

**¡Listo para implementar!** 🚀
