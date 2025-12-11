import { api } from "./api";
import { mockPacientesService } from "../../mock/mockBackend";
import { USE_BACKEND } from "../../config/apiConfig";

import { urgenciasService } from "./urgenciasService";

export const pacientesService = {
  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-paciente").CrearPacienteDTO, null>} */
  crearPaciente: async (data) => {
    // NOTA: El backend no tiene endpoint específico para crear pacientes.
    // Los pacientes se crean automáticamente cuando se registra un ingreso de urgencia.
    // Este método es solo para compatibilidad con el formulario.
    
    return {
      success: true,
      result: data
    };
  },

  /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
  getPacientes: async () => {
    // NOTA: El backend no tiene endpoint específico para listar pacientes.
    // Obtenemos los pacientes extrayéndolos de la lista de ingresos del backend.
    
    console.log('🔍 Solicitando pacientes desde el backend...');
    
    try {
      const ingresosResponse = await urgenciasService.getIngresos();
      
      console.log('📋 Respuesta de ingresos para pacientes:', ingresosResponse);
      
      if (!ingresosResponse.success) {
        console.log('❌ Error al obtener ingresos:', ingresosResponse.error);
        return {
          success: false,
          error: {
            context: {
              message: "Error al obtener ingresos del backend"
            }
          }
        };
      }

      // Extraer pacientes únicos de los ingresos
      const pacientesMap = new Map();
      
      console.log('🔍 Estructura de respuesta del backend:', JSON.stringify(ingresosResponse.result, null, 2));
      
      // El backend devuelve { fechaDeConsulta, listaDeIngresos }
      if (ingresosResponse.result && ingresosResponse.result.listaDeIngresos) {
        console.log('📝 Procesando lista de ingresos, cantidad:', ingresosResponse.result.listaDeIngresos.length);
        
        ingresosResponse.result.listaDeIngresos.forEach((ingreso, index) => {
          console.log(`🏥 Procesando ingreso ${index + 1}:`, ingreso);
          
          if (ingreso.paciente && ingreso.paciente.cuit) {
            const cuit = ingreso.paciente.cuit;
            if (!pacientesMap.has(cuit)) {
              // Mapear la estructura del backend al frontend
              const paciente = {
                cuit: ingreso.paciente.cuit,
                nombre: ingreso.paciente.nombre,
                apellido: ingreso.paciente.apellido,
                domicilio: ingreso.paciente.domicilio,
                fechaRegistro: ingreso.fechaIngreso || new Date().toISOString()
              };
              
              // Si tiene afiliación, agregarla
              if (ingreso.paciente.afiliacion) {
                paciente.afiliado = {
                  obraSocial: {
                    nombre: ingreso.paciente.afiliacion.obraSocial.nombre
                  },
                  numeroAfiliado: ingreso.paciente.afiliacion.numeroAfiliado
                };
              }
              
              console.log('👤 Paciente extraído:', paciente);
              pacientesMap.set(cuit, paciente);
            }
          } else {
            console.log('⚠️ Ingreso sin paciente válido:', ingreso);
          }
        });
      } else {
        console.log('⚠️ No se encontró listaDeIngresos en la respuesta');
      }
      
      const pacientes = Array.from(pacientesMap.values());
      console.log('✅ Pacientes finales extraídos:', pacientes);
      
      return {
        success: true,
        result: pacientes
      };
    } catch (error) {
      console.log('❌ Error en getPacientes:', error);
      return {
        success: false,
        error: {
          context: {
            message: "Error al obtener los pacientes del backend"
          }
        }
      };
    }
  },

  /** @type {import("../../models/service.schema").ServiceFunction<string, any>} */
  getPacienteByCuit: async (cuit) => {
    // NOTA: El backend no tiene endpoint específico para buscar pacientes por CUIT.
    // El backend maneja esto automáticamente en el endpoint de ingresos.
    // Siempre retornamos "no encontrado" para que se muestre el formulario.
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Siempre retornar "no encontrado" para que aparezca el formulario de registro
      return {
        success: false,
        error: {
          context: {
            message: "El backend maneja la búsqueda/creación de pacientes automáticamente en el registro de ingresos"
          }
        }
      };
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
