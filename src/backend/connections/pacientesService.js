import { api } from "./api";
import { mockPacientesService } from "../../mock/mockBackend";

// Configuración: usar mock o API real
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

export const pacientesService = {
    /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-paciente").CrearPacienteDTO, null>} */
    crearPaciente: (data) => USE_MOCK ? mockPacientesService.crearPaciente(data) : api.post("/pacientes", data),

    /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
    getPacientes: () => USE_MOCK ? mockPacientesService.getPacientes() : api.get("/pacientes"),

    /** @type {import("../../models/service.schema").ServiceFunction<string, any>} */
    getPacienteByCuit: (cuit) => USE_MOCK ? mockPacientesService.getPacienteByCuit(cuit) : api.get(`/pacientes/${cuit}`)
};
