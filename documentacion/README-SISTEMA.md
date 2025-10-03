# Sistema de Gestión de Pagos - Frontend

Frontend desarrollado con React, TypeScript, Vite y Tailwind CSS para el sistema de gestión de pagos de voleibol.

## 🚀 Tecnologías Utilizadas

- **React 19.1.1** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## 🎨 Paleta de Colores

- **Primary (#384B70)** - Azul oscuro principal
- **Secondary (#507687)** - Azul grisáceo
- **Background (#FCFAEE)** - Crema/beige claro
- **Accent (#B8001F)** - Rojo para acciones importantes

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── modals/          # Modales
│   ├── EstadoBadge.tsx  # Badge de estados
│   ├── GestionPagos.tsx # Gestión de pagos
│   ├── GestionUsuarios.tsx # Gestión de usuarios
│   ├── Navigation.tsx   # Navegación principal
│   └── Reportes.tsx     # Reportes y estadísticas
├── services/            # Servicios API
│   └── api.ts          # Cliente API y servicios
├── types/              # Tipos TypeScript
│   └── index.ts        # Definiciones de tipos
├── App.tsx             # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🔌 Configuración de API

El frontend se conecta al backend en `http://localhost:8080/api`.

## 📋 Funcionalidades

### 💳 Gestión de Pagos
- ✅ Crear pagos con validaciones
- ✅ Listar pagos con filtros
- ✅ Editar estado de pagos
- ✅ Eliminar pagos
- ✅ Ver pagos por usuario
- ✅ Estadísticas de pagos

### 👥 Gestión de Usuarios
- ✅ Listar usuarios
- ✅ Buscar usuarios
- ✅ Estadísticas de usuarios

### 📊 Reportes
- ✅ Estadísticas generales
- ✅ Filtros por período
- ✅ Métodos de pago
- ✅ Resumen financiero

## 🎯 Endpoints del Backend

- `POST /api/pagos` - Crear pago
- `GET /api/pagos` - Listar pagos
- `PUT /api/pagos/{id}/estado` - Actualizar estado
- `DELETE /api/pagos/{id}` - Eliminar pago
- `GET /api/pagos/usuario/{usuarioId}` - Pagos por usuario
- `GET /api/usuarios` - Listar usuarios

## 📱 Responsive Design

Diseño completamente responsive con Tailwind CSS:
- Mobile First
- Grid adaptativo
- Navegación responsive
- Tablas responsivas

## 🚀 Servidor de Desarrollo

El frontend está corriendo en: **http://localhost:5173/**
Asegúrate de que el backend esté en: **http://localhost:8080/**