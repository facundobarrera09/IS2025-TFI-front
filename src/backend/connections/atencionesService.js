import { api } from "./api";
import { mockAtencionesService } from "../../mock/mockBackend";

// Configuración: usar mock o API real
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

export const atencionesService = {
    /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-atencion").CrearAtencionDTO, null>} */
    crearAtencion: (data) => USE_MOCK ? mockAtencionesService.crearAtencion(data) : api.post("/atenciones", data)
};
