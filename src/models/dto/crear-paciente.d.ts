import type Domicilio from "../domicilio.schema";
import type Afiliado from "../afiliado.schema";

export interface CrearPacienteDTO {
    cuit: string;
    apellido: string;
    nombre: string;
    domicilio: Domicilio;
    afiliado?: Afiliado;
}
