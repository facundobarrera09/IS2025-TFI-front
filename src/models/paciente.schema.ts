import type Domicilio from "./domicilio.schema";

export default interface Paciente {
    cuit: string;
    nombre: string;
    apellido: string;
    domicilio: Domicilio;
}