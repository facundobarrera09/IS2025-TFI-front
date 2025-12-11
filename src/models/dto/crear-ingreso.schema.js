import * as z from "zod"

const error = "Se debe ingresar un valor"

export const CrearIngreso = z.object({
    paciente: z.object({
        cuit: z.string().regex(/^\d\d-\d{8}-\d$/, "CUIT debe tener formato XX-12345678-X"),
        apellido: z.string()
            .refine(val => val && val.trim().length > 0, "El apellido es obligatorio"),
        nombre: z.string()
            .refine(val => val && val.trim().length > 0, "El nombre es obligatorio"),
        domicilio: z.object({
            calle: z.string()
                .refine(val => val && val.trim().length > 0, "La calle es obligatoria"),
            numero: z.union([
                z.string().refine(val => val && val.trim().length > 0, "El número es obligatorio"), 
                z.number().positive("El número debe ser positivo")
            ]),
            localidad: z.string()
                .refine(val => val && val.trim().length > 0, "La localidad es obligatoria")
        }),
        afiliado: z.object({
            obraSocial: z.object({
                nombre: z.string().min(1, "El nombre de la obra social es obligatorio")
            }),
            numeroAfiliado: z.string().min(1, "El número de afiliado es obligatorio")
        }).optional()
    }),
    enfermera: z.object({
        uuid: z.uuid()
    }),
    informe: z.string().min(1, error),
    nivel: z.enum(["Critica", "Emergencia", "Urgencia", "Urgencia Menor", "Sin Urgencia"], {
        errorMap: () => ({ message: "Debe seleccionar un nivel de emergencia válido" })
    }),
    temperatura: z.string().min(1, error).transform(v => Number(v)).refine(v => !isNaN(v) && v > 0, "La temperatura debe ser mayor a 0"),
    frecuenciaCardiaca: z.string().min(1, error).transform(v => Number(v)).refine(v => !isNaN(v) && v > 0, "La frecuencia cardíaca debe ser mayor a 0"),
    frecuenciaRespiratoria: z.string().min(1, error).transform(v => Number(v)).refine(v => !isNaN(v) && v > 0, "La frecuencia respiratoria debe ser mayor a 0"),
    tensionArterial: z.string()
        .min(1, error)
        .regex(/\d+(?=\/)/, "La frecuencia sistólica debe ser un número positivo")
        .regex(/(?<=\/)\d+/, "La frecuencia diastólica debe ser un número positivo")
})