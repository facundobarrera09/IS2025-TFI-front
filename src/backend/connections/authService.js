import { api } from "./api";
import { mockAuthService } from "../../mock/mockBackend";

// Configuración: usar mock o API real
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

export const authService = {
    /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/registro-usuario").RegistroUsuarioDTO, import("../../models/dto/registro-usuario").AuthResponse>} */
    registro: async (data) => {
        // Remover confirmPassword antes de enviar al backend
        const { confirmPassword, ...dataToSend } = data;
        return api.post("/auth/registro", dataToSend);
    },

    /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/registro-usuario").LoginDTO, import("../../models/dto/registro-usuario").AuthResponse>} */
    login: (data) => USE_MOCK ? mockAuthService.login(data.email, data.password) : api.post("/auth/login", data),

    /** @type {() => void} */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    },

    /** @type {() => import("../../models/usuario.schema").default | null} */
    getUsuarioActual: () => {
        const usuarioStr = localStorage.getItem('usuario');
        return usuarioStr ? JSON.parse(usuarioStr) : null;
    },

    /** @type {() => string | null} */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /** @type {(token: string, usuario: any) => void} */
    guardarSesion: (token, usuario) => {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
    },

    /** @type {() => boolean} */
    estaAutenticado: () => {
        return !!localStorage.getItem('token');
    }
};
