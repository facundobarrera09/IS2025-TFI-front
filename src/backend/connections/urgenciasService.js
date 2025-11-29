import { api } from "./api";

export const urgenciasService = {
    /** @type {import("../../models/service.schema").ServiceFunction<undefined, import("../../models/dto/lista-ingresos.schema").ListaDeIngresos>} */
    getIngresos: () => api.get("/ingresos"),

    /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/crear-ingreso.schema").CrearIngresoDTO, null>} */
    crearIngreso: (data) => api.post("/ingresos", data)

//   crearPaciente: (data) => api.post("urgencias/pacientes", data),

//   actualizarPaciente: (id, data) =>
//     api.put(`urgencias/pacientes/${id}`, data),

//   eliminarPaciente: (id) =>
//     api.delete(`urgencias/pacientes/${id}`),
};
