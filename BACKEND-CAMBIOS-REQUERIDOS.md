# ⚠️ BACKEND: Cambios Necesarios para Soporte de Comprobante

**Fecha**: 3 de Octubre de 2025  
**Destinatario**: Equipo Backend

---

## 🎯 Cambio Requerido

El frontend ahora envía el comprobante **en la misma request** que crea el pago.

El endpoint `POST /api/pagos` debe actualizarse para soportar **dos formatos**:

1. **JSON** (cuando NO hay comprobante)
2. **FormData** (cuando SÍ hay comprobante)

---

## 📊 Formato de Requests

### Caso 1: Pago SIN Comprobante

```http
POST /api/pagos HTTP/1.1
Content-Type: application/json

{
  "usuario": {
    "id": 8
  },
  "periodoMes": 10,
  "periodoAnio": 2025,
  "monto": 80,
  "estado": "pendiente",
  "observaciones": "Pago pendiente"
}
```

**Este formato ya existe y NO cambia** ✅

---

### Caso 2: Pago CON Comprobante (NUEVO)

```http
POST /api/pagos HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

------WebKitFormBoundary...
Content-Disposition: form-data; name="comprobante"; filename="comprobante.jpg"
Content-Type: image/jpeg

[binary file data]
------WebKitFormBoundary...
Content-Disposition: form-data; name="pago"

{
  "usuario": {
    "id": 8
  },
  "periodoMes": 10,
  "periodoAnio": 2025,
  "monto": 100,
  "estado": "pagado",
  "metodoPago": "TRANSFERENCIA_BANCARIA",
  "observaciones": "Pago de octubre"
}
------WebKitFormBoundary...--
```

**Este formato es NUEVO** ⚠️

---

## 🔧 Implementación Sugerida (Spring Boot)

### Opción 1: Endpoint Único (Recomendado)

```java
package com.voley.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.voley.dto.PagoDTO;
import com.voley.entity.Pago;
import com.voley.service.PagoService;
import com.voley.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "http://localhost:5174")
public class PagoController {

    @Autowired
    private PagoService pagoService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<?> crearPago(
        HttpServletRequest request,
        @RequestBody(required = false) PagoDTO pagoDTO,
        @RequestPart(value = "pago", required = false) String pagoJson,
        @RequestPart(value = "comprobante", required = false) MultipartFile comprobante
    ) {
        try {
            // Detectar el Content-Type
            String contentType = request.getContentType();
            
            // Caso 1: FormData (viene con archivo)
            if (contentType != null && contentType.contains("multipart/form-data")) {
                // Parsear el JSON del campo "pago"
                if (pagoJson == null || pagoJson.isEmpty()) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "El campo 'pago' es requerido cuando se envía un archivo"));
                }
                
                pagoDTO = objectMapper.readValue(pagoJson, PagoDTO.class);
                
                // Validar que venga el archivo
                if (comprobante == null || comprobante.isEmpty()) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "El comprobante es requerido en este formato"));
                }
                
                // Crear el pago
                Pago pago = pagoService.crearPago(pagoDTO);
                
                // Guardar el archivo
                String rutaComprobante = fileStorageService.guardarComprobante(
                    comprobante, 
                    pago.getId()
                );
                
                // Actualizar el pago con la ruta del comprobante
                pago.setComprobante(rutaComprobante);
                pagoService.actualizarComprobante(pago.getId(), rutaComprobante);
                
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "success", true,
                        "message", "Pago creado exitosamente con comprobante",
                        "data", pago
                    ));
            }
            
            // Caso 2: JSON (sin archivo)
            else {
                if (pagoDTO == null) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Los datos del pago son requeridos"));
                }
                
                // Crear el pago sin comprobante
                Pago pago = pagoService.crearPago(pagoDTO);
                
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "success", true,
                        "message", "Pago creado exitosamente",
                        "data", pago
                    ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
```

---

### Servicio de Almacenamiento de Archivos

```java
package com.voley.service;

import org.springframework.beans.factory.annotation.Value;
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
public class FileStorageService {

    @Value("${file.upload-dir:uploads/comprobantes}")
    private String uploadDir;

    public String guardarComprobante(MultipartFile archivo, Long pagoId) throws IOException {
        // Crear directorio si no existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generar nombre único
        String timestamp = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String extension = getFileExtension(archivo.getOriginalFilename());
        String fileName = String.format("comp_%d_%s%s", pagoId, timestamp, extension);

        // Guardar archivo
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(archivo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Retornar ruta relativa
        return uploadDir + "/" + fileName;
    }

    private String getFileExtension(String filename) {
        if (filename == null) return "";
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot) : "";
    }

    public void eliminarComprobante(String ruta) throws IOException {
        if (ruta != null && !ruta.isEmpty()) {
            Path filePath = Paths.get(ruta);
            Files.deleteIfExists(filePath);
        }
    }
}
```

---

### DTO del Pago

```java
package com.voley.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PagoDTO {
    
    @JsonProperty("usuario")
    private UsuarioIdDTO usuario;
    
    @JsonProperty("periodoMes")
    private Integer periodoMes;
    
    @JsonProperty("periodoAnio")
    private Integer periodoAnio;
    
    @JsonProperty("monto")
    private Double monto;
    
    @JsonProperty("estado")
    private String estado;
    
    @JsonProperty("metodoPago")
    private String metodoPago;
    
    @JsonProperty("observaciones")
    private String observaciones;
    
    // Clase interna para el usuario
    @Data
    public static class UsuarioIdDTO {
        @JsonProperty("id")
        private Long id;
    }
}
```

---

### Actualización en PagoService

```java
package com.voley.service;

import com.voley.dto.PagoDTO;
import com.voley.entity.Pago;
import com.voley.entity.Usuario;
import com.voley.repository.PagoRepository;
import com.voley.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Pago crearPago(PagoDTO pagoDTO) {
        // Validar usuario existe
        Usuario usuario = usuarioRepository.findById(pagoDTO.getUsuario().getId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear entidad Pago
        Pago pago = new Pago();
        pago.setUsuario(usuario);
        pago.setPeriodoMes(pagoDTO.getPeriodoMes());
        pago.setPeriodoAnio(pagoDTO.getPeriodoAnio());
        pago.setMonto(pagoDTO.getMonto());
        pago.setEstado(pagoDTO.getEstado());
        pago.setMetodoPago(pagoDTO.getMetodoPago());
        pago.setObservaciones(pagoDTO.getObservaciones());
        pago.setFechaCreacion(LocalDateTime.now());
        pago.setFechaActualizacion(LocalDateTime.now());

        // Guardar
        return pagoRepository.save(pago);
    }

    @Transactional
    public void actualizarComprobante(Long pagoId, String rutaComprobante) {
        Pago pago = pagoRepository.findById(pagoId)
            .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        
        pago.setComprobante(rutaComprobante);
        pago.setFechaActualizacion(LocalDateTime.now());
        
        pagoRepository.save(pago);
    }
}
```

---

## 📝 Configuración Necesaria

### application.properties

```properties
# Configuración de upload de archivos
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
file.upload-dir=uploads/comprobantes

# CORS (si es necesario)
allowed.origins=http://localhost:5174
```

---

## 🧪 Pruebas Sugeridas

### Prueba 1: Pago SIN Comprobante (JSON)

```bash
curl -X POST http://localhost:8080/api/pagos \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": {"id": 8},
    "periodoMes": 10,
    "periodoAnio": 2025,
    "monto": 80,
    "estado": "pendiente",
    "observaciones": "Pago pendiente"
  }'
```

**Respuesta esperada**: 201 Created con el pago creado

---

### Prueba 2: Pago CON Comprobante (FormData)

```bash
curl -X POST http://localhost:8080/api/pagos \
  -F 'comprobante=@comprobante.jpg' \
  -F 'pago={"usuario":{"id":8},"periodoMes":10,"periodoAnio":2025,"monto":100,"estado":"pagado","metodoPago":"TRANSFERENCIA_BANCARIA"}'
```

**Respuesta esperada**: 201 Created con el pago creado y comprobante guardado

---

## ⚠️ Validaciones Importantes

### Backend debe validar:

1. ✅ **Usuario existe**: Verificar que `usuario.id` existe en la BD
2. ✅ **Tipo de archivo**: Solo imágenes (JPG, PNG, GIF, WebP)
3. ✅ **Tamaño de archivo**: Máximo 5MB
4. ✅ **Campos requeridos**: usuario, periodoMes, periodoAnio, monto, estado
5. ✅ **Estado "pagado"**: Si estado es "pagado", debe tener metodoPago
6. ✅ **Nombre de archivo**: Sanitizar para evitar path traversal

---

## 🔒 Seguridad

### Implementar:

1. **Validación de tipo MIME**: No solo extensión
   ```java
   String contentType = archivo.getContentType();
   if (!contentType.startsWith("image/")) {
       throw new IllegalArgumentException("Solo se permiten imágenes");
   }
   ```

2. **Sanitización de nombres**:
   ```java
   String safeName = fileName.replaceAll("[^a-zA-Z0-9._-]", "");
   ```

3. **Límite de tamaño**: Ya configurado en `application.properties`

4. **Autenticación**: Verificar que el usuario tiene permiso para crear pagos

---

## 📊 Diferencias Clave

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Requests | 2 separadas | 1 unificada |
| Endpoint crear | POST /api/pagos (JSON) | POST /api/pagos (JSON o FormData) |
| Endpoint upload | POST /api/upload/comprobantes | ❌ Ya no necesario |
| Content-Type | application/json | application/json O multipart/form-data |
| pagoId en upload | Requerido | ❌ No aplica (se crea junto) |

---

## ✅ Checklist de Implementación

- [ ] Actualizar endpoint `POST /api/pagos` para aceptar FormData
- [ ] Agregar `@RequestPart` para archivo y JSON
- [ ] Implementar lógica de detección de Content-Type
- [ ] Implementar `FileStorageService`
- [ ] Actualizar `PagoService` con método `actualizarComprobante`
- [ ] Configurar `application.properties`
- [ ] Agregar validaciones de seguridad
- [ ] Probar con Postman/curl ambos formatos
- [ ] Documentar en Swagger/OpenAPI
- [ ] Probar integración con frontend

---

## 🚀 Despliegue

1. ✅ Actualizar código backend
2. ✅ Probar localmente
3. ✅ Crear directorio `uploads/comprobantes` en servidor
4. ✅ Configurar permisos de escritura
5. ✅ Desplegar backend
6. ✅ Probar con frontend
7. ✅ Verificar que archivos se guardan correctamente

---

## 📞 Contacto

Si hay dudas sobre la implementación, contactar al equipo frontend.

---

**Fecha**: 3 de Octubre de 2025  
**Estado**: ⚠️ PENDIENTE DE IMPLEMENTACIÓN EN BACKEND
