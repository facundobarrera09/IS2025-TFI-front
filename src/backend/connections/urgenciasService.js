import { apiWithAuth } from "./api";

export const urgenciasService = {
  /** @type {import("../../models/service.schema").ServiceFunction<undefined, import("../../models/dto/lista-ingresos.schema").ListaDeIngresos>} */
  getIngresos: async () => {
    console.log('Solicitando lista de ingresos al backend...');
    const response = await apiWithAuth.get("/ingresos");
    console.log('Respuesta raw del backend para ingresos:', response);
    return response;
  },

  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-ingreso.schema").CrearIngresoDTO, null>} */
  crearIngreso: (data) => {
    console.log('Datos recibidos para crear ingreso:', data);
    
    // Mapear los datos al formato exacto que espera el backend
    const backendData = {
      paciente: {
        cuit: data.paciente.cuit,
        apellido: data.paciente.apellido || "Sin apellido",
        nombre: data.paciente.nombre || "Sin nombre",
        domicilio: {
          calle: data.paciente.domicilio?.calle || "Sin dirección",
          numero: data.paciente.domicilio?.numero || "S/N", 
          localidad: data.paciente.domicilio?.localidad || "Sin localidad"
        }
      },
      enfermera: {
        uuid: data.enfermera.uuid
      },
      informe: data.informe,
      temperatura: data.temperatura ? parseFloat(data.temperatura) : null,
      nivel: data.nivel, // El backend busca por nombre exacto en NivelEmergencia enum
      frecuenciaCardiaca: parseFloat(data.frecuenciaCardiaca),
      frecuenciaRespiratoria: parseFloat(data.frecuenciaRespiratoria),
      tensionArterial: data.tensionArterial // Backend espera string formato "120/80"
    };
    
    console.log('Datos enviados al backend:', JSON.stringify(backendData, null, 2));
    
    // El backend requiere Authorization header y solo acepta ENFERMERO
    return apiWithAuth.post("/ingresos", backendData);
  },

  /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
  reclamarProximoPaciente: () => {
    // El backend usa GET /ingresos/reclamar con Authorization header
    return apiWithAuth.get("/ingresos/reclamar");
  },
};
