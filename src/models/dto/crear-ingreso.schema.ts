export interface CrearIngresoDTO {
    paciente: {
        cuit: string;
        nombre?: string;
        apellido?: string;
        domicilio?: {
            calle: string;
            numero: string;
            localidad: string;
        }
    },
    enfermera: {
        cuit: string;
    },
    informe: string;
    nivel: string;
    temperatura: number;
    frecuenciaCardiaca: number;
    frecuenciaRespiratoria: number;
    tensionArterial: {
        frecuenciaSistolica: number;
        frecuenciaDiastolica: number;
    }
}