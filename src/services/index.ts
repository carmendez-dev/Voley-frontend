// ==================== BARREL EXPORTS - SERVICIOS ====================
// Este archivo re-exporta todos los servicios desde sus archivos individuales

// Servicios principales
export { pagoService } from './pagos.service';
export { usuarioService } from './usuarios.service';
export { torneoService } from './torneos.service';
export { categoriaService } from './categorias.service';
export { equipoService } from './equipos.service';
export { uploadService } from './uploads.service';

// Servicios de relaciones
export { torneoCategoriaService, categoriaEquipoService } from './relaciones.service';

// Servicio de inscripciones
export { default as inscripcionesService } from './inscripciones.service';

// Servicio de roster
export { rosterService } from './roster.service';

// Exports por defecto para compatibilidad
import pagoService from './pagos.service';
import usuarioService from './usuarios.service';
import torneoService from './torneos.service';
import categoriaService from './categorias.service';
import equipoService from './equipos.service';
import uploadService from './uploads.service';
import inscripcionesService from './inscripciones.service';
import { torneoCategoriaService, categoriaEquipoService } from './relaciones.service';
import rosterService from './roster.service';

export default {
  pagoService,
  usuarioService,
  torneoService,
  categoriaService,
  equipoService,
  uploadService,
  inscripcionesService,
  torneoCategoriaService,
  categoriaEquipoService,
  rosterService
};
