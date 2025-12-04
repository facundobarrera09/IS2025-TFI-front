import { api } from "./api";
import { mockIngresosService } from "../../mock/mockBackend";

// Configuración: usar mock o API real
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

export const urgenciasService = {
    /** @type {import("../../models/service.schema").ServiceFunction<undefined, import("../../models/dto/lista-ingresos.schema").ListaDeIngresos>} */
    getIngresos: () => USE_MOCK ? mockIngresosService.getIngresos() : api.get("/ingresos"),

    /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-ingreso.schema").CrearIngresoDTO, null>} */
    crearIngreso: (data) => USE_MOCK ? mockIngresosService.crearIngreso(data) : api.post("/ingresos", data),

    /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
    reclamarProximoPaciente: () => USE_MOCK ? mockIngresosService.reclamarProximoPaciente() : api.post("/ingresos/reclamar", {})
};
