import { api } from "./api";
import { mockPacientesService } from "../../mock/mockBackend";
import { USE_BACKEND } from "../../config/apiConfig";

// Almacenamiento temporal en memoria para los pacientes
let pacientesStorage = [];

export const pacientesService = {
  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-paciente").CrearPacienteDTO, null>} */
  crearPaciente: async (data) => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar si ya existe un paciente con el mismo CUIT
      const existePaciente = pacientesStorage.find(p => p.cuit === data.cuit);
      if (existePaciente) {
        return {
          success: false,
          error: {
            context: {
              message: "Ya existe un paciente registrado con ese CUIT"
            }
          }
        };
      }
      
      // Agregar el paciente al almacenamiento
      const nuevoPaciente = {
        ...data,
        id: Date.now(), // ID temporal
        fechaRegistro: new Date().toISOString()
      };
      
      pacientesStorage.push(nuevoPaciente);
      
      return {
        success: true,
        result: nuevoPaciente
      };
    } catch (error) {
      return {
        success: false,
        error: {
          context: {
            message: "Error al registrar el paciente"
          }
        }
      };
    }
  },

  /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
  getPacientes: async () => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        result: pacientesStorage
      };
    } catch (error) {
      return {
        success: false,
        error: {
          context: {
            message: "Error al obtener los pacientes"
          }
        }
      };
    }
  },

  /** @type {import("../../models/service.schema").ServiceFunction<string, any>} */
  getPacienteByCuit: async (cuit) => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const paciente = pacientesStorage.find(p => p.cuit === cuit);
      
      if (paciente) {
        return {
          success: true,
          result: paciente
        };
      } else {
        return {
          success: false,
          error: {
            context: {
              message: "Paciente no encontrado"
            }
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          context: {
            message: "Error al buscar el paciente"
          }
        }
      };
    }
  },
};
