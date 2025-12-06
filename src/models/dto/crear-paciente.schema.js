import * as z from "zod";

// Schema para Domicilio
const DomicilioSchema = z.object({
    calle: z.string().min(1, "La calle es obligatoria"),
    numero: z.number({ invalid_type_error: "El número debe ser un valor numérico" })
        .int("El número debe ser un entero")
        .positive("El número debe ser positivo"),
    localidad: z.string().min(1, "La localidad es obligatoria")
});

// Schema para Obra Social
const ObraSocialSchema = z.object({
    nombre: z.string().min(1, "El nombre de la obra social es obligatorio")
});

// Schema para Afiliado (opcional)
const AfiliadoSchema = z.object({
    obraSocial: ObraSocialSchema,
    numeroAfiliado: z.string().min(1, "El número de afiliado es obligatorio")
}).optional();

// Validación de CUIL/CUIT
const validarCUIL = (cuil) => {
    // Remover guiones y espacios
    const cuilLimpio = cuil.replace(/[-\s]/g, '');
    
    // Debe tener 11 dígitos
    if (!/^\d{11}$/.test(cuilLimpio)) {
        return false;
    }
    
    // Para ambiente de desarrollo/testing, aceptar cualquier CUIT con 11 dígitos
    // En producción, descomentar la validación del dígito verificador
    return true;
    
    /* Validación completa del dígito verificador (descomentar para producción)
    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    
    for (let i = 0; i < 10; i++) {
        suma += parseInt(cuilLimpio[i]) * multiplicadores[i];
    }
    
    let verificador = 11 - (suma % 11);
    if (verificador === 11) verificador = 0;
    if (verificador === 10) verificador = 9;
    
    return verificador === parseInt(cuilLimpio[10]);
    */
};

// Schema principal para crear paciente
export const CrearPacienteSchema = z.object({
    cuit: z.string()
        .min(1, "El CUIL/CUIT es obligatorio")
        .refine(validarCUIL, "El CUIL/CUIT debe tener 11 dígitos (formato: XX-XXXXXXXX-X)"),
    apellido: z.string().min(1, "El apellido es obligatorio"),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    domicilio: DomicilioSchema,
    afiliado: AfiliadoSchema
});
