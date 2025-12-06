import { api } from "./api";
import { mockAuthService } from "../../mock/mockBackend";
import { USE_BACKEND } from "../../config/apiConfig";

export const authService = {
  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/registro-usuario").RegistroUsuarioDTO, import("../../models/dto/registro-usuario").AuthResponse>} */
  registro: async (data) => {
    if (!USE_BACKEND) {
      return mockAuthService.registro(data);
    }

    // Remover confirmPassword antes de enviar al backend
    const { confirmPassword, ...dataToSend } = data;

    // Mapear 'password' a 'contraseña' para el backend
    const backendData = {
      email: dataToSend.email,
      contraseña: dataToSend.password,
      autoridad: dataToSend.autoridad,
    };

    return api.post("/auth/registro", backendData);
  },

  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/registro-usuario").LoginDTO, import("../../models/dto/registro-usuario").AuthResponse>} */
  login: async (data) => {
    if (!USE_BACKEND) {
      return mockAuthService.login(data.email, data.password);
    }

    // Mapear 'password' a 'contraseña' para el backend
    const backendData = {
      email: data.email,
      contraseña: data.password,
    };

    return api.post("/auth/login", backendData);
  },

  /** @type {() => void} */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },

  /** @type {() => import("../../models/usuario.schema").default | null} */
  getUsuarioActual: () => {
    const usuarioStr = localStorage.getItem("usuario");
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  /** @type {() => string | null} */
  getToken: () => {
    return localStorage.getItem("token");
  },

  /** @type {(token: string, usuario: any) => void} */
  guardarSesion: (token, usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
  },

  /** @type {() => boolean} */
  estaAutenticado: () => {
    return !!localStorage.getItem("token");
  },
};
