import * as z from "zod"

const error = "Se debe ingresar un valor"

export const CrearIngreso = z.object({
    paciente: z.object({
        cuit: z.string().regex(/^\d\d-\d{8}-\d$/, "CUIT debe tener formato XX-12345678-X"),
        apellido: z.string().min(1, error).optional(),
        nombre: z.string().min(1, error).optional(),
        domicilio: z.object({
            calle: z.string(error).min(1, error),
            numero: z.union([z.string().min(1, error), z.number().positive(error)]),
            localidad: z.string(error).min(1, error)
        }).optional()
    }),
    enfermera: z.object({
        uuid: z.uuid()
    }),
    informe: z.string().min(1, error),
    nivel: z.string().min(1, error),
    temperatura: z.string().min(1, error).transform(v => Number(v)).refine(v => v > 0, "La temperatura debe ser mayor a 0"),
    frecuenciaCardiaca: z.string().min(1, error).transform(v => Number(v)).refine(v => v > 0, "La frecuencia cardíaca debe ser mayor a 0"),
    frecuenciaRespiratoria: z.string().min(1, error).transform(v => Number(v)).refine(v => v > 0, "La frecuencia respiratoria debe ser mayor a 0"),
    tensionArterial: z.string()
        .min(1, error)
        .regex(/\d+(?=\/)/, "La frecuencia sistólica debe ser un número postivo")
        .regex(/(?<=\/)\d+/, "La frecuencia diastólica debe ser un número postivo")
})