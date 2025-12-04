import type { Autoridad } from "../usuario.schema";

export interface RegistroUsuarioDTO {
    email: string;
    password: string;
    confirmPassword: string;
    autoridad: Autoridad;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    usuario: {
        id: string;
        email: string;
        autoridad: Autoridad;
        nombre?: string;
        apellido?: string;
    };
}
