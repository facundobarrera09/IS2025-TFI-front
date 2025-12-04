import type Medico from "../medico.schema";

export interface CrearAtencionDTO {
    ingresoId: string;
    informe: string;
    medico: {
        uuid: string;
    };
}
