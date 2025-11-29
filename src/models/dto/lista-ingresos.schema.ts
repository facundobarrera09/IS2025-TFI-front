import type Ingreso from "../ingreso.schema";

export default interface ListaDeIngresos {
    fechaDeConsulta: Date;
    listaDeIngresos: Ingreso[]; 
}