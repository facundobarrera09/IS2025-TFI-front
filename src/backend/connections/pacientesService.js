import { api } from "./api";
import { mockPacientesService } from "../../mock/mockBackend";
import { USE_BACKEND } from "../../config/apiConfig";

export const pacientesService = {
  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-paciente").CrearPacienteDTO, null>} */
  crearPaciente: (data) => {
    // El backend actual no tiene endpoint de pacientes
    return Promise.resolve({
      success: false,
      error: {
        context: {
          message: "Endpoint de pacientes no implementado en el backend"
        }
      }
    });
  },

  /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
  getPacientes: () => {
    // El backend actual no tiene endpoint de pacientes
    return Promise.resolve({
      success: false,
      error: {
        context: {
          message: "Endpoint de pacientes no implementado en el backend"
        }
      }
    });
  },

  /** @type {import("../../models/service.schema").ServiceFunction<string, any>} */
  getPacienteByCuit: (cuit) => {
    // El backend actual no tiene endpoint de pacientes
    return Promise.resolve({
      success: false,
      error: {
        context: {
          message: "Endpoint de pacientes no implementado en el backend"
        }
      }
    });
  },
};
