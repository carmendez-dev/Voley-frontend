# Sistema de Gestión de Pagos - Voleibol Frontend

Sistema web para la gestión de usuarios y pagos mensuales de un club de voleibol. Desarrollado con React, TypeScript y Vite.

## Descripción

Aplicación frontend que permite administrar jugadores, registrar pagos mensuales, subir comprobantes de pago y generar reportes. Incluye funcionalidades de visualización de estado de pagos, filtrado por período y gestión completa de usuarios.

## Tecnologías

- **React 19.1.1** - Biblioteca de UI
- **TypeScript 5.8.3** - Tipado estático
- **Vite 7.1.12** - Build tool y dev server
- **Tailwind CSS 3.4.17** - Framework de CSS
- **Axios 1.7.9** - Cliente HTTP
- **Lucide React** - Iconos

## Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/carmendez-dev/Voley-frontend.git
cd Voley-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:8080/api
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

## Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Compila para producción
npm run preview      # Previsualiza la build de producción
npm run lint         # Ejecuta ESLint
```

## Estructura del Proyecto

```
voley-frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── modals/         # Modales (Crear Pago, Editar Estado, etc.)
│   │   ├── GestionUsuarios.tsx
│   │   ├── GestionPagos.tsx
│   │   ├── Reportes.tsx
│   │   └── Navigation.tsx
│   ├── services/           # Servicios API
│   │   └── api.ts
│   ├── types/              # Definiciones TypeScript
│   │   └── index.ts
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos
└── package.json
```

## Funcionalidades Principales

### Gestión de Usuarios
- Listado de jugadores registrados
- Información de contacto y estado de membresía
- Ver historial de pagos por usuario

### Gestión de Pagos
- **Crear pago con comprobante** (flujo unificado)
  - Selección de usuario y período
  - Monto y método de pago
  - Upload opcional de comprobante (imágenes, máx 5MB)
  - Preview de imagen antes de enviar
- Editar estado de pagos
- Filtrar por período (mes/año)
- Visualizar comprobantes subidos
- Estados: Pendiente, Pagado, Atraso, Rechazado

### Reportes
- Resumen de pagos por período
- Estadísticas de ingresos
- Exportación de datos

## Características Técnicas

### Upload de Comprobantes
- **Flujo unificado**: Crear pago + subir comprobante en una sola acción
- **Validaciones**: 
  - Solo archivos de imagen (JPG, PNG, GIF, etc.)
  - Tamaño máximo: 5MB
  - Preview antes de enviar
- **Endpoint**: `POST /api/pagos` (multipart/form-data)

### Comunicación con Backend
- Servicio centralizado en `api.ts`
- Interceptores para manejo de errores
- Tipado completo con TypeScript

## Componentes Principales

### Modales
- **CrearPagoModal**: Crear pago con upload integrado de comprobante
- **EditarEstadoModal**: Cambiar estado de un pago
- **VerPagosUsuarioModal**: Ver historial de pagos de un usuario
- **VerDetallePagoModal**: Ver detalles completos de un pago

### Servicios API

```typescript
// Ejemplo de uso del servicio
import { pagoService } from './services/api';

// Crear pago con comprobante
const pago = await pagoService.crearPagoConComprobante(
  {
    usuarioId: 1,
    periodoMes: 3,
    periodoAnio: 2025,
    monto: 100,
    metodoPago: 'Transferencia',
    estado: 'pagado',
    observaciones: 'Pago mensual'
  },
  archivoComprobante // File | null
);
```

## Configuración del Backend

El frontend espera que el backend esté disponible en `http://localhost:8080/api` con los siguientes endpoints:

- `GET /usuarios` - Lista de usuarios
- `POST /pagos` - Crear pago (multipart/form-data)
- `GET /pagos` - Lista de pagos
- `PUT /pagos/{id}` - Actualizar pago
- `GET /pagos/usuario/{id}` - Pagos de un usuario

## Documentación Adicional

Para más información sobre la implementación del flujo de comprobantes, consulta:
- `FLUJO-UNIFICADO-IMPLEMENTADO.md` - Guía completa del flujo unificado
- `README-SISTEMA.md` - Documentación completa del sistema

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## Autor

**Carmen Méndez** - [@carmendez-dev](https://github.com/carmendez-dev)

## Licencia

Este proyecto es parte de un trabajo universitario - Taller de Desarrollo de Software 2025.

---

**Universidad Católica Boliviana** - 2025
