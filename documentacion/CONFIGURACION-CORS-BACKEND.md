# Configuración de CORS en el Backend

## 📋 Problema

Error en el frontend:
```
Access to XMLHttpRequest at 'http://localhost:8080/api/pagos/11/procesar' from origin 'http://localhost:5174' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🔧 Solución

### Paso 1: Instalar CORS

En el directorio del **backend**, ejecuta:

```bash
npm install cors
```

### Paso 2: Configurar CORS

En tu archivo principal del backend (`app.js`, `server.js` o `index.js`), agrega la configuración de CORS **ANTES** de definir tus rutas:

#### Opción 1: Configuración Específica (Recomendada para Producción)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// ===== CONFIGURACIÓN DE CORS =====
// IMPORTANTE: Debe ir ANTES de las rutas
app.use(cors({
  origin: 'http://localhost:5174',  // URL del frontend en desarrollo
  credentials: true,                 // Permitir cookies y credenciales
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// ===== RESTO DE MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración para archivos estáticos (si usas upload de imágenes)
app.use('/uploads', express.static('public/uploads'));

// ===== RUTAS =====
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/pagos', require('./routes/pagos'));
app.use('/api/upload', require('./routes/upload')); // Si implementaste upload

// ===== SERVIDOR =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✅ CORS habilitado para http://localhost:5174`);
});
```

#### Opción 2: Configuración Permisiva (Solo para Desarrollo)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// CORS permisivo - permite TODAS las orígenes
app.use(cors());

// Resto de tu configuración...
app.use(express.json());
// ...
```

⚠️ **Advertencia**: La opción 2 es menos segura. Úsala solo en desarrollo local.

### Paso 3: Configuración para Múltiples Orígenes (Opcional)

Si necesitas permitir múltiples orígenes (ej: desarrollo y producción):

```javascript
const allowedOrigins = [
  'http://localhost:5174',     // Frontend en desarrollo
  'http://localhost:3000',     // Otro puerto si lo usas
  'https://tu-app.com'         // Producción (cuando despliegues)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El origen CORS ' + origin + ' no está permitido.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🧪 Verificación

Después de configurar CORS:

### 1. Reinicia el servidor backend

```bash
# Detén el servidor (Ctrl+C) y vuelve a iniciarlo
npm start
# o
node app.js
```

### 2. Verifica en la consola del backend

Deberías ver algo como:
```
✅ Servidor corriendo en http://localhost:8080
✅ CORS habilitado para http://localhost:5174
```

### 3. Prueba desde el frontend

1. Abre `http://localhost:5174` en tu navegador
2. Abre la consola de desarrollador (F12)
3. Ve a la pestaña "Gestión de Pagos"
4. Intenta editar un pago
5. **NO deberías ver el error de CORS**

### 4. Verifica los headers en Network

En la pestaña "Network" del navegador:
1. Haz una petición al backend
2. Ve los Response Headers
3. Deberías ver:
   ```
   Access-Control-Allow-Origin: http://localhost:5174
   Access-Control-Allow-Credentials: true
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   ```

## 🔍 Troubleshooting

### Problema 1: Sigue sin funcionar

**Solución**: Asegúrate de que:
- El middleware de CORS está **ANTES** de tus rutas
- Reiniciaste el servidor backend después de los cambios
- El puerto del frontend es exactamente `5174`

### Problema 2: Error solo con ciertos métodos (POST, PUT, DELETE)

**Solución**: Agrega el manejo de preflight requests:

```javascript
app.options('*', cors()); // Habilitar preflight para todas las rutas
```

### Problema 3: Error con FormData (upload de archivos)

**Solución**: Asegúrate de incluir estos headers:

```javascript
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data']
}));
```

## 📦 Código Completo de Ejemplo

Archivo `app.js` del backend completo:

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ===== 1. CORS (PRIMERO) =====
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===== 2. MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (para las imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ===== 3. RUTAS =====
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/pagos', require('./routes/pagos'));
app.use('/api/upload', require('./routes/upload'));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente', cors: 'habilitado' });
});

// ===== 4. MANEJO DE ERRORES =====
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Error interno del servidor' 
  });
});

// ===== 5. INICIAR SERVIDOR =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`✅ CORS habilitado para http://localhost:5174`);
  console.log(`📁 Archivos estáticos en /uploads`);
});

module.exports = app;
```

## ✅ Checklist de Implementación

- [ ] Instalar `cors`: `npm install cors`
- [ ] Importar cors en el archivo principal
- [ ] Agregar `app.use(cors({...}))` ANTES de las rutas
- [ ] Configurar `origin: 'http://localhost:5174'`
- [ ] Configurar métodos permitidos
- [ ] Reiniciar servidor backend
- [ ] Probar desde el frontend
- [ ] Verificar que no aparezca el error de CORS
- [ ] Verificar headers en Network tab

## 🚀 Próximos Pasos

Una vez que CORS esté configurado:

1. **Prueba el endpoint de procesar pago**: Debería funcionar sin errores
2. **Implementa el upload de comprobantes**: Sigue `GUIA-BACKEND-UPLOAD.md`
3. **Integra el código del frontend**: Usa `CODIGO-INTEGRACION-FINAL.md`

## 📚 Referencias

- [Documentación oficial de CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS)
- [npm: cors package](https://www.npmjs.com/package/cors)
- [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors.html)
