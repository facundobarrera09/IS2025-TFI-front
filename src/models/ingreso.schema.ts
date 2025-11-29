import type Enfermera from "./enfermera.schema";
import type Paciente from "./paciente.schema";

export default interface Ingreso {
    paciente: Paciente;
    enfermera: Enfermera;
    fechaIngreso: Date;
    informe: string;
    nivelEmergencia: { nombre: string, jerarquia: number, tiempoMaximoDeEsperaEnSeg: number };
    temperatura: number;
    frecuenciaCardiaca: number;
    frecuenciaRespiratoria: number;
    tensionArterial: {
        frecuenciaDiastolica: number;
        frecuenciaSistolica: number;
    };
}