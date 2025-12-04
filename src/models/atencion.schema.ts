import type Ingreso from "./ingreso.schema";
import type Medico from "./medico.schema";

export default interface Atencion {
    ingreso: Ingreso;
    informe: string;
    medico: Medico;
    fechaAtencion: Date;
}
