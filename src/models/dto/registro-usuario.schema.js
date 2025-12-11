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
    autoridad: z.enum(['médico', 'enfermera'], {
        errorMap: () => ({ message: "Debe seleccionar un rol válido" })
    }),
    // Campos opcionales para médico
    matricula: z.string().optional(),
    // Campos opcionales para enfermera
    nombre: z.string().optional(),
    apellido: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
}).refine((data) => {
    // Validar campos específicos según autoridad
    if (data.autoridad === 'médico') {
        return data.matricula && data.matricula.trim().length > 0;
    }
    return true;
}, {
    message: "La matrícula es obligatoria para médicos",
    path: ["matricula"]
}).refine((data) => {
    // Validar campos específicos según autoridad
    if (data.autoridad === 'enfermera') {
        return data.nombre && data.nombre.trim().length > 0;
    }
    return true;
}, {
    message: "El nombre es obligatorio para enfermeras",
    path: ["nombre"]
}).refine((data) => {
    // Validar campos específicos según autoridad
    if (data.autoridad === 'enfermera') {
        return data.apellido && data.apellido.trim().length > 0;
    }
    return true;
}, {
    message: "El apellido es obligatorio para enfermeras",
    path: ["apellido"]
});

// Schema para login
export const LoginSchema = z.object({
    email: z.string()
        .min(1, "El email es obligatorio")
        .refine((email) => emailRegex.test(email), "El email no tiene un formato válido"),
    password: z.string()
        .min(1, "La contraseña es obligatoria")
});
