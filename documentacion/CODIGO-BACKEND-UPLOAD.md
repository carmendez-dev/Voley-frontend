# 🚀 Código Backend para Upload de Comprobantes

## 📋 Implementación Rápida

Copia y pega estos archivos en tu backend para implementar el upload de comprobantes.

---

## 🟢 **OPCIÓN 1: Node.js + Express + Multer**

### **Paso 1: Instalar Multer**

```bash
npm install multer
```

### **Paso 2: Crear `routes/upload.js`**

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// ===== CONFIGURACIÓN DE ALMACENAMIENTO =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/comprobantes/');
  },
  filename: function (req, file, cb) {
    const pagoId = req.body.pagoId || 'unknown';
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `comp_${pagoId}_${timestamp}${extension}`;
    cb(null, filename);
  }
});

// ===== CONFIGURACIÓN DE MULTER =====
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp)'));
    }
  }
});

// ===== ENDPOINT: POST /api/upload/comprobantes =====
router.post('/comprobantes', upload.single('comprobante'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'No se recibió ningún archivo'
      });
    }

    const ruta = `uploads/comprobantes/${req.file.filename}`;
    
    console.log('✅ Comprobante subido:', ruta);
    console.log('   - Tamaño:', req.file.size, 'bytes');
    console.log('   - Tipo:', req.file.mimetype);
    console.log('   - Pago ID:', req.body.pagoId);
    
    res.json({
      success: true,
      data: { ruta },
      message: 'Comprobante subido exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al subir comprobante:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Error al subir el archivo: ' + error.message
    });
  }
});

// ===== MANEJO DE ERRORES DE MULTER =====
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'El archivo es demasiado grande. Máximo 5MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    data: null,
    message: error.message || 'Error al procesar el archivo'
  });
});

module.exports = router;
```

### **Paso 3: Actualizar `app.js`**

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ===== CORS (PRIMERO) =====
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ARCHIVOS ESTÁTICOS (IMPORTANTE) =====
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ===== RUTAS =====
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes); // ⬅️ AGREGAR ESTA LÍNEA

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/pagos', require('./routes/pagos'));

// ===== SERVIDOR =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✅ CORS habilitado para http://localhost:5174`);
  console.log(`📁 Archivos estáticos en /uploads`);
  console.log(`📤 Endpoint de upload: POST /api/upload/comprobantes`);
});
```

### **Paso 4: Crear Directorio**

```bash
mkdir -p public/uploads/comprobantes
```

---

## 🔵 **OPCIÓN 2: Spring Boot + MultipartFile**

### **Paso 1: Configurar `application.properties`**

```properties
# Configuración de upload de archivos
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

### **Paso 2: Crear `UploadController.java`**

```java
package com.voley.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final String UPLOAD_DIR = "public/uploads/comprobantes/";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @PostMapping("/comprobantes")
    public ResponseEntity<?> subirComprobante(
            @RequestParam("comprobante") MultipartFile file,
            @RequestParam("pagoId") Long pagoId
    ) {
        try {
            // ===== VALIDACIONES =====
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, null, "No se recibió ningún archivo")
                );
            }

            // Validar tamaño
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, null, "El archivo es demasiado grande. Máximo 5MB.")
                );
            }

            // Validar tipo de archivo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, null, "Solo se permiten imágenes (jpg, png, gif, webp)")
                );
            }

            // ===== CREAR DIRECTORIO SI NO EXISTE =====
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
                System.out.println("📁 Directorio creado: " + UPLOAD_DIR);
            }

            // ===== GENERAR NOMBRE ÚNICO =====
            long timestamp = System.currentTimeMillis();
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = "comp_" + pagoId + "_" + timestamp + extension;

            // ===== GUARDAR ARCHIVO =====
            Path filepath = Paths.get(UPLOAD_DIR, filename);
            Files.write(filepath, file.getBytes());

            // Ruta relativa para guardar en BD
            String ruta = "uploads/comprobantes/" + filename;
            
            // ===== LOGS =====
            System.out.println("✅ Comprobante subido: " + ruta);
            System.out.println("   - Tamaño: " + file.getSize() + " bytes");
            System.out.println("   - Tipo: " + contentType);
            System.out.println("   - Pago ID: " + pagoId);

            // ===== RESPUESTA =====
            Map<String, String> data = new HashMap<>();
            data.put("ruta", ruta);

            return ResponseEntity.ok(
                new ApiResponse<>(true, data, "Comprobante subido exitosamente")
            );

        } catch (Exception e) {
            System.err.println("❌ Error al subir comprobante: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(
                new ApiResponse<>(false, null, "Error al subir el archivo: " + e.getMessage())
            );
        }
    }
}
```

### **Paso 3: Crear `WebConfig.java` para Archivos Estáticos**

```java
package com.voley.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos estáticos desde public/uploads/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:public/uploads/");
        
        System.out.println("📁 Archivos estáticos configurados: /uploads/ -> public/uploads/");
    }
}
```

### **Paso 4: Crear Directorio**

```bash
mkdir -p public/uploads/comprobantes
```

---

## 🧪 Probar el Endpoint

### **Con cURL (Sin Frontend)**

```bash
curl -X POST http://localhost:8080/api/upload/comprobantes \
  -F "comprobante=@/ruta/a/tu/imagen.jpg" \
  -F "pagoId=11"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "ruta": "uploads/comprobantes/comp_11_1759467978129.jpg"
  },
  "message": "Comprobante subido exitosamente"
}
```

### **Con Postman**

1. Método: `POST`
2. URL: `http://localhost:8080/api/upload/comprobantes`
3. Body → `form-data`:
   - Key: `comprobante` | Type: `File` | Value: [selecciona una imagen]
   - Key: `pagoId` | Type: `Text` | Value: `11`
4. Send

---

## ✅ Verificación

### **1. Archivo guardado**
```bash
ls public/uploads/comprobantes/
# Debería mostrar: comp_11_1759467978129.jpg
```

### **2. Archivo accesible**
Abre en el navegador:
```
http://localhost:8080/uploads/comprobantes/comp_11_1759467978129.jpg
```

Deberías ver la imagen.

### **3. Frontend funciona**
1. Abre `http://localhost:5174`
2. Gestión de Pagos → Ver usuario → Editar pago
3. Sube una imagen
4. Guarda
5. Verifica en el modal de detalle que la imagen se muestra

---

## 🚨 Troubleshooting

### Error: "Cannot find module 'multer'"
```bash
npm install multer
```

### Error: "ENOENT: no such file or directory"
```bash
mkdir -p public/uploads/comprobantes
```

### Error: "Payload Too Large"
**Node.js:**
```javascript
app.use(express.json({ limit: '10mb' }));
```

**Spring Boot:**
```properties
spring.servlet.multipart.max-file-size=10MB
```

### Error: Imagen no carga (404)
Verifica archivos estáticos:

**Node.js:**
```javascript
app.use('/uploads', express.static('public/uploads'));
```

**Spring Boot:**
```java
registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:public/uploads/");
```

---

## 📊 Flujo Final

```
1. Usuario sube imagen desde el frontend
   ↓
2. POST /api/upload/comprobantes (FormData)
   ↓
3. Backend guarda en: public/uploads/comprobantes/comp_11_xxx.jpg
   ↓
4. Backend retorna: { ruta: "uploads/comprobantes/comp_11_xxx.jpg" }
   ↓
5. Frontend procesa pago con la ruta
   ↓
6. POST /api/pagos/11/procesar?comprobante=uploads/...
   ↓
7. Backend guarda ruta en BD (campo comprobante)
   ↓
8. Usuario ve la imagen en el modal de detalle
```

---

## ✅ Checklist

- [ ] Instalar Multer (Node.js) o configurar MultipartFile (Spring)
- [ ] Crear archivo `routes/upload.js` o `UploadController.java`
- [ ] Registrar ruta en `app.js` o crear `WebConfig.java`
- [ ] Crear directorio `public/uploads/comprobantes/`
- [ ] Configurar archivos estáticos (`/uploads`)
- [ ] Probar con cURL o Postman
- [ ] Verificar archivo guardado en FileSystem
- [ ] Verificar imagen accesible en navegador
- [ ] Probar desde el frontend completo

---

**Estado:** Copia este código y el upload funcionará correctamente ✅
