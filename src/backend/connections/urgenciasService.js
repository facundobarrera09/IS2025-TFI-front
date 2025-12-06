import { api } from "./api";
import { mockIngresosService } from "../../mock/mockBackend";
import { USE_BACKEND } from "../../config/apiConfig";

export const urgenciasService = {
  /** @type {import("../../models/service.schema").ServiceFunction<undefined, import("../../models/dto/lista-ingresos.schema").ListaDeIngresos>} */
  getIngresos: () =>
    USE_BACKEND ? api.get("/ingresos") : mockIngresosService.getIngresos(),

  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-ingreso.schema").CrearIngresoDTO, null>} */
  crearIngreso: (data) =>
    USE_BACKEND
      ? api.post("/ingresos", data)
      : mockIngresosService.crearIngreso(data),

  /** @type {import("../../models/service.schema").ServiceFunction<undefined, any>} */
  reclamarProximoPaciente: () => {
    if (USE_BACKEND) {
      // Obtener el UUID del médico actual del localStorage
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      return api.post("/ingresos/reclamar", { medicoUuid: usuario.uuid });
    }
    return mockIngresosService.reclamarProximoPaciente();
  },
};
