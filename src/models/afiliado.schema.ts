import type ObraSocial from "./obra-social.schema";

export default interface Afiliado {
    obraSocial: ObraSocial;
    numeroAfiliado: string;
}
