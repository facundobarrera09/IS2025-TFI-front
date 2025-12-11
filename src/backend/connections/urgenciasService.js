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
  crearIngreso: async (data) => {
    console.log('Datos recibidos para crear ingreso:', data);
    
    // Mapear los datos al formato exacto que espera el backend
    const backendData = {
      paciente: {
        cuit: data.paciente.cuit,
        apellido: data.paciente.apellido,
        nombre: data.paciente.nombre,
        domicilio: {
          calle: data.paciente.domicilio.calle,
          numero: String(data.paciente.domicilio.numero), // Backend espera string
          localidad: data.paciente.domicilio.localidad
        }
        // Nota: afiliado no está en el modelo FindOrCreatePaciente del backend
      },
      enfermera: {
        uuid: data.enfermera.uuid
      },
      informe: data.informe,
      temperatura: parseFloat(data.temperatura),
      nivel: data.nivel, // El backend busca por nombre exacto en NivelEmergencia enum
      frecuenciaCardiaca: parseFloat(data.frecuenciaCardiaca),
      frecuenciaRespiratoria: parseFloat(data.frecuenciaRespiratoria),
      tensionArterial: data.tensionArterial // Backend espera string formato "120/80"
    };
    
    console.log('Datos enviados al backend:', JSON.stringify(backendData, null, 2));
    
    // El backend requiere Authorization header y solo acepta ENFERMERO
    const response = await apiWithAuth.post("/ingresos", backendData);
    
    console.log('Respuesta del backend para crear ingreso:', response);
    
    return response;
  },

  /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
  reclamarProximoPaciente: () => {
    // El backend usa GET /ingresos/reclamar con Authorization header
    return apiWithAuth.get("/ingresos/reclamar");
  },
};
