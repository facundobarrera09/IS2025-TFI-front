import { api } from "./api";
import { mockAtencionesService } from "../../mock/mockBackend";
import { USE_BACKEND } from "../../config/apiConfig";

export const atencionesService = {
  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-atencion").CrearAtencionDTO, null>} */
  crearAtencion: (data) =>
    USE_BACKEND
      ? api.post("/atenciones", data)
      : mockAtencionesService.crearAtencion(data),
};
