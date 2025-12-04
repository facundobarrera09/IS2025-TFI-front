import * as z from "zod";

// Schema para crear atención
export const CrearAtencionSchema = z.object({
    ingresoId: z.string().min(1, "El ID del ingreso es obligatorio"),
    informe: z.string()
        .min(1, "El informe es obligatorio")
        .min(10, "El informe debe tener al menos 10 caracteres"),
    medico: z.object({
        uuid: z.string().min(1, "El UUID del médico es obligatorio")
    })
});
