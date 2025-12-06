import { api } from "./api";
import { mockPacientesService } from "../../mock/mockBackend";
import { USE_BACKEND } from "../../config/apiConfig";

export const pacientesService = {
  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-paciente").CrearPacienteDTO, null>} */
  crearPaciente: (data) =>
    USE_BACKEND
      ? api.post("/pacientes", data)
      : mockPacientesService.crearPaciente(data),

  /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
  getPacientes: () =>
    USE_BACKEND ? api.get("/pacientes") : mockPacientesService.getPacientes(),

  /** @type {import("../../models/service.schema").ServiceFunction<string, any>} */
  getPacienteByCuit: (cuit) =>
    USE_BACKEND
      ? api.get(`/pacientes/cuit/${cuit}`)
      : mockPacientesService.getPacienteByCuit(cuit),
};
