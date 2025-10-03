# 🚀 MANUAL DE INSTALACIÓN Y CONFIGURACIÓN

## 📋 PRERREQUISITOS DEL SISTEMA

### **Software Required**
- ✅ **Node.js 18.0+** - Runtime de JavaScript
- ✅ **npm 9.0+** - Gestor de paquetes
- ✅ **Git** - Control de versiones (opcional)
- ✅ **Editor de código** - VS Code recomendado

### **Hardware Recomendado**
- **RAM**: 4GB mínimo, 8GB recomendado
- **Almacenamiento**: 500MB para dependencias
- **Procesador**: Dual-core 2GHz+

### **Navegadores Soportados**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🔧 INSTALACIÓN PASO A PASO

### **Paso 1: Verificar Prerrequisitos**

```bash
# Verificar Node.js
node --version
# Debe mostrar: v18.0.0 o superior

# Verificar npm
npm --version
# Debe mostrar: 9.0.0 o superior

# Si no tienes Node.js, descárgalo desde:
# https://nodejs.org/
```

### **Paso 2: Obtener Código Fuente**

**Opción A: Desde Git (si aplica)**
```bash
git clone <repository-url>
cd voley-frontend
```

**Opción B: Desde Archivo ZIP**
```bash
# Descomprimir el archivo
# Navegar a la carpeta del proyecto
cd voley-frontend
```

### **Paso 3: Instalar Dependencias**

```bash
# Navegar al directorio del proyecto
cd voley-frontend

# Limpiar caché de npm (opcional, si hay problemas)
npm cache clean --force

# Instalar todas las dependencias
npm install

# Verificar que la instalación fue exitosa
npm list --depth=0
```

### **Paso 4: Configurar Variables de Entorno**

```bash
# Crear archivo .env en la raíz del proyecto
touch .env

# Agregar configuraciones (opcional)
echo "VITE_API_BASE_URL=http://localhost:8080/api" >> .env
echo "VITE_APP_TITLE=Sistema de Gestión de Pagos" >> .env
```

### **Paso 5: Verificar Backend API**

```bash
# Asegúrate de que el backend esté corriendo en:
# http://localhost:8080

# Puedes probar con:
curl http://localhost:8080/api/pagos
# o visita la URL en tu navegador
```

### **Paso 6: Iniciar Aplicación**

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en:
# http://localhost:5173

# Presiona Ctrl+C para detener el servidor
```

---

## ⚙️ CONFIGURACIÓN AVANZADA

### **Configurar Puerto Personalizado**

```bash
# Opción 1: Variable de entorno
export PORT=3000
npm run dev

# Opción 2: Modificar vite.config.ts
# server: {
#   port: 3000
# }
```

### **Configurar Proxy para API**

```typescript
// En vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### **Configurar HTTPS Local**

```bash
# Instalar mkcert para certificados locales
npm install -g mkcert
mkcert create-ca
mkcert create-cert

# Configurar en vite.config.ts
# server: {
#   https: true,
#   key: './cert/key.pem',
#   cert: './cert/cert.pem'
# }
```

---

## 🏗️ COMPILACIÓN PARA PRODUCCIÓN

### **Build de Producción**

```bash
# Compilar aplicación para producción
npm run build

# Los archivos compilados estarán en la carpeta 'dist/'
ls -la dist/

# Previsualizar build de producción localmente
npm run preview
```

### **Optimizaciones de Build**

```typescript
// En vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false, // Solo para development
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'lucide-react']
        }
      }
    }
  }
})
```

### **Análisis de Bundle**

```bash
# Instalar analizador de bundle
npm install --save-dev rollup-plugin-visualizer

# Agregar al vite.config.ts y ejecutar build
npm run build

# Se generará un archivo stats.html
```

---

## 🐳 DESPLIEGUE CON DOCKER

### **Dockerfile**

```dockerfile
# Multi-stage build
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **docker-compose.yml**

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api
    depends_on:
      - backend
  
  backend:
    image: your-backend-image
    ports:
      - "8080:8080"
```

### **Comandos Docker**

```bash
# Construir imagen
docker build -t voley-frontend .

# Ejecutar contenedor
docker run -p 3000:80 voley-frontend

# Con docker-compose
docker-compose up -d
```

---

## 🔧 TROUBLESHOOTING

### **Problemas Comunes y Soluciones**

#### **Error: "Command not found: npm"**
```bash
# Instalar Node.js desde https://nodejs.org/
# O usando un gestor de versiones como nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
nvm install node
```

#### **Error: "Module not found"**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### **Error: "Port 5173 is already in use"**
```bash
# Encontrar proceso usando el puerto
lsof -ti:5173
kill -9 <PID>

# O usar un puerto diferente
npm run dev -- --port 3000
```

#### **Error: "Network Error" al conectar con API**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8080/api/pagos

# Verificar configuración CORS en el backend
# Verificar firewall/antivirus
```

#### **Error de permisos en Windows**
```bash
# Ejecutar como administrador
# O cambiar política de ejecución de PowerShell:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **Problemas de Performance**
```bash
# Incrementar límite de memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

### **Logs de Debug**

```bash
# Habilitar logs detallados
DEBUG=vite:* npm run dev

# Logs de la aplicación
# Se muestran en la consola del navegador (F12)
```

---

## 📦 GESTIÓN DE DEPENDENCIAS

### **Dependencias Principales**
```json
{
  "react": "^19.1.1",           // Biblioteca UI principal
  "react-dom": "^19.1.1",      // DOM renderer para React
  "typescript": "~5.8.3",       // Tipado estático
  "vite": "7.1.12",            // Build tool
  "tailwindcss": "^3.4.17",    // CSS framework
  "axios": "^1.12.2",          // Cliente HTTP
  "lucide-react": "^0.544.0"   // Iconos
}
```

### **Actualizar Dependencias**

```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias menores
npm update

# Actualizar dependencias mayores (cuidado con breaking changes)
npm install react@latest react-dom@latest

# Auditar seguridad
npm audit
npm audit fix
```

### **Gestión de Versiones**

```bash
# Instalar versión específica
npm install react@18.2.0

# Usar rangos de versiones en package.json
# "^1.2.3" = >=1.2.3 <2.0.0 (compatible)
# "~1.2.3" = >=1.2.3 <1.3.0 (aproximadamente equivalente)
# "1.2.3" = exactamente 1.2.3
```

---

## 🔒 SEGURIDAD

### **Configuraciones de Seguridad**

```typescript
// En vite.config.ts
export default defineConfig({
  define: {
    __RUNTIME_ENV__: JSON.stringify(process.env.NODE_ENV)
  },
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block'
    }
  }
})
```

### **Variables de Entorno Seguras**

```bash
# Solo variables que inicien con VITE_ son expuestas al cliente
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Sistema de Gestión de Pagos

# Variables del servidor (NO expuestas al cliente)
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

### **Content Security Policy**

```html
<!-- En index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

---

## 📊 MONITOREO Y MÉTRICAS

### **Performance Monitoring**

```bash
# Instalar herramientas de análisis
npm install --save-dev lighthouse
npm install --save-dev webpack-bundle-analyzer

# Ejecutar análisis de performance
npx lighthouse http://localhost:5173 --output html
```

### **Error Tracking**

```typescript
// Error boundary para capturar errores de React
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado:', error, errorInfo);
    // Enviar a servicio de tracking (ej: Sentry)
  }
}
```

### **Analytics**

```typescript
// Google Analytics 4 (opcional)
// gtag('config', 'GA_MEASUREMENT_ID');
// gtag('event', 'page_view');
```

---

## 🚀 OPTIMIZACIÓN PARA PRODUCCIÓN

### **Optimizaciones de Código**

```typescript
// Lazy loading de componentes
const Reportes = React.lazy(() => import('./components/Reportes'));

// Memoización de componentes costosos
const PagosList = React.memo(({ pagos }) => {
  return <div>{/* render pagos */}</div>;
});

// useCallback para funciones estables
const handleClick = useCallback(() => {
  // handle click
}, [dependency]);
```

### **Optimizaciones de Bundle**

```typescript
// Code splitting automático por rutas
const routes = [
  {
    path: '/pagos',
    component: React.lazy(() => import('./pages/Pagos'))
  }
];
```

### **Caching Strategies**

```typescript
// Service Worker para cache (PWA)
// sw.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Cache API responses
    event.respondWith(cacheFirst(event.request));
  }
});
```

---

*Esta guía cubre todos los aspectos de instalación, configuración y despliegue del sistema. Para soporte adicional, consultar la documentación técnica y logs del sistema.*