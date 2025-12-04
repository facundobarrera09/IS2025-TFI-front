export type Autoridad = 'MEDICO' | 'ENFERMERA';

export default interface Usuario {
    id: string;
    email: string;
    autoridad: Autoridad;
    nombre?: string;
    apellido?: string;
}
