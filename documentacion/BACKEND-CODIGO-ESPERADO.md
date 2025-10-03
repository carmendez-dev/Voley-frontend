# 🔧 Backend - Código Esperado (Spring Boot)

## 📋 Endpoint Requerido

El frontend ahora envía el request de esta forma:

```
POST /api/pagos/{id}/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia
Content-Type: multipart/form-data

FormData:
  comprobante: [archivo.jpg]
```

## ✅ Controller Completo

```java
package com.voley.backend.controller;

import com.voley.backend.dto.ApiResponse;
import com.voley.backend.model.Pago;
import com.voley.backend.service.PagoService;
import com.voley.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "http://localhost:5174") // Puerto de Vite
public class PagoController {

    @Autowired
    private PagoService pagoService;
    
    @Autowired
    private FileUploadService fileUploadService;

    /**
     * Endpoint para procesar pago con comprobante
     * 
     * Request:
     *   POST /api/pagos/{id}/procesar?usuarioId=5&monto=150&...
     *   FormData: comprobante=[FILE]
     * 
     * Response:
     *   {
     *     "success": true,
     *     "message": "Pago procesado correctamente",
     *     "data": {
     *       "ruta": "uploads/comprobantes/comp_32_xyz.jpg",
     *       "pagoId": 32
     *     }
     *   }
     */
    @PostMapping("/{id}/procesar")
    public ResponseEntity<?> procesarPago(
            // Path variable
            @PathVariable Long id,
            
            // Query params (@RequestParam)
            @RequestParam Long usuarioId,
            @RequestParam Double monto,
            @RequestParam Integer periodoMes,
            @RequestParam Integer periodoAnio,
            @RequestParam String estado,
            @RequestParam String metodoPago,
            @RequestParam(required = false) String observaciones,
            
            // Archivo en FormData (@RequestPart)
            @RequestPart("comprobante") MultipartFile comprobante
    ) {
        try {
            // 1. Validar que el pago existe
            Pago pago = pagoService.findById(id);
            if (pago == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Pago no encontrado", null)
                );
            }

            // 2. Validar que el archivo no esté vacío
            if (comprobante.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "El comprobante no puede estar vacío", null)
                );
            }

            // 3. Validar tipo de archivo (solo imágenes)
            String contentType = comprobante.getContentType();
            if (!contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "El comprobante debe ser una imagen", null)
                );
            }

            // 4. Guardar archivo en disco
            String rutaArchivo = fileUploadService.guardarComprobante(comprobante, id);
            
            // 5. Actualizar pago con los nuevos datos
            pago.setComprobante(rutaArchivo);
            pago.setEstado(estado);
            pago.setMetodoPago(metodoPago);
            if (observaciones != null) {
                pago.setObservaciones(observaciones);
            }
            
            // 6. Guardar en base de datos
            Pago pagoActualizado = pagoService.save(pago);

            // 7. Preparar respuesta
            Map<String, Object> data = new HashMap<>();
            data.put("ruta", rutaArchivo);
            data.put("pagoId", pagoActualizado.getId());

            return ResponseEntity.ok(
                new ApiResponse(true, "Pago procesado correctamente", data)
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                new ApiResponse(false, "Error al procesar el pago: " + e.getMessage(), null)
            );
        }
    }
}
```

## 📁 Service para Guardar Archivos

```java
package com.voley.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class FileUploadService {

    // Directorio donde se guardarán los comprobantes
    private final String UPLOAD_DIR = "uploads/comprobantes/";

    /**
     * Guarda el comprobante en el disco
     * 
     * @param archivo MultipartFile del comprobante
     * @param pagoId ID del pago
     * @return Ruta relativa del archivo guardado
     */
    public String guardarComprobante(MultipartFile archivo, Long pagoId) throws IOException {
        // Crear directorio si no existe
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Obtener extensión del archivo original
        String originalFilename = archivo.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Generar nombre único: comp_<pagoId>_<timestamp>.<ext>
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String nuevoNombre = String.format("comp_%d_%s%s", pagoId, timestamp, extension);

        // Ruta completa del archivo
        Path rutaCompleta = uploadPath.resolve(nuevoNombre);

        // Guardar archivo
        Files.copy(archivo.getInputStream(), rutaCompleta, StandardCopyOption.REPLACE_EXISTING);

        // Retornar ruta relativa
        return UPLOAD_DIR + nuevoNombre;
    }

    /**
     * Elimina un comprobante del disco
     * 
     * @param rutaArchivo Ruta del archivo a eliminar
     * @return true si se eliminó, false si no
     */
    public boolean eliminarComprobante(String rutaArchivo) {
        try {
            if (rutaArchivo != null && !rutaArchivo.isEmpty()) {
                Path path = Paths.get(rutaArchivo);
                return Files.deleteIfExists(path);
            }
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
```

## 🗃️ Modelo de Datos

```java
package com.voley.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pagos")
public class Pago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    
    @Column(nullable = false)
    private Double monto;
    
    @Column(name = "periodo_mes", nullable = false)
    private Integer periodoMes;
    
    @Column(name = "periodo_anio", nullable = false)
    private Integer periodoAnio;
    
    @Column(nullable = false)
    private String estado; // "pendiente" o "pagado"
    
    @Column(name = "metodo_pago")
    private String metodoPago; // "efectivo", "transferencia", etc.
    
    @Column
    private String comprobante; // Ruta del archivo
    
    @Column(length = 500)
    private String observaciones;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
```

## 📦 DTO para Respuesta

```java
package com.voley.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;
}
```

## ⚙️ Configuración (application.properties)

```properties
# Configuración de archivos multipart
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB

# Directorio de uploads (opcional)
app.upload.dir=uploads/comprobantes/
```

## 🔒 Configuración CORS (si es necesaria)

```java
package com.voley.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5174", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 📂 Estructura de Archivos Guardados

```
backend/
├── uploads/
│   └── comprobantes/
│       ├── comp_32_20251003_150050.jpg
│       ├── comp_33_20251003_151230.png
│       └── comp_34_20251003_152445.jpg
├── src/
│   └── main/
│       └── java/
│           └── com/voley/backend/
│               ├── controller/
│               │   └── PagoController.java
│               ├── service/
│               │   ├── PagoService.java
│               │   └── FileUploadService.java
│               ├── model/
│               │   └── Pago.java
│               └── dto/
│                   └── ApiResponse.java
└── application.properties
```

## 🧪 Testing con Postman/Insomnia

```
POST http://localhost:8080/api/pagos/32/procesar?usuarioId=5&monto=150&periodoMes=10&periodoAnio=2025&estado=pagado&metodoPago=transferencia

Headers:
  Content-Type: multipart/form-data

Body (form-data):
  Key: comprobante
  Type: File
  Value: [Seleccionar archivo recibo.jpg]

Expected Response (200 OK):
{
  "success": true,
  "message": "Pago procesado correctamente",
  "data": {
    "ruta": "uploads/comprobantes/comp_32_20251003_150050.jpg",
    "pagoId": 32
  }
}
```

## ⚠️ Validaciones Importantes

1. ✅ Validar que el pago existe (`pagoService.findById(id)`)
2. ✅ Validar que el archivo no esté vacío (`comprobante.isEmpty()`)
3. ✅ Validar tipo MIME (`contentType.startsWith("image/")`)
4. ✅ Validar tamaño de archivo (configurado en `application.properties`)
5. ✅ Crear directorio si no existe (`Files.createDirectories()`)
6. ✅ Generar nombre único para evitar sobrescribir archivos
7. ✅ Manejar excepciones de I/O

## 🎯 Puntos Clave

- **@RequestParam** → Recibe parámetros de query string
- **@RequestPart** → Recibe archivos en multipart/form-data
- **@PathVariable** → Recibe ID de la URL
- Guardar archivo con nombre único: `comp_{pagoId}_{timestamp}.{ext}`
- Retornar ruta relativa para guardar en BD
- Configurar CORS si frontend y backend están en puertos diferentes

---

**Implementa este código en tu backend y el frontend funcionará correctamente** ✅
