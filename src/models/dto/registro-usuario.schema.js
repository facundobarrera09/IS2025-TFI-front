import * as z from "zod";

// Validación de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schema para registro de usuario
export const RegistroUsuarioSchema = z.object({
    email: z.string()
        .min(1, "El email es obligatorio")
        .refine((email) => emailRegex.test(email), "El email no tiene un formato válido"),
    password: z.string()
        .min(1, "La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string()
        .min(1, "Debe confirmar la contraseña"),
    autoridad: z.enum(['MEDICO', 'ENFERMERA'], {
        errorMap: () => ({ message: "Debe seleccionar un rol válido" })
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});

// Schema para login
export const LoginSchema = z.object({
    email: z.string()
        .min(1, "El email es obligatorio")
        .refine((email) => emailRegex.test(email), "El email no tiene un formato válido"),
    password: z.string()
        .min(1, "La contraseña es obligatoria")
});
