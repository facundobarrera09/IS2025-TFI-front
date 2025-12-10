import { api } from "./api";

export const authService = {
  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/registro-usuario").RegistroUsuarioDTO, import("../../models/dto/registro-usuario").AuthResponse>} */
  registro: async () => {
    // El backend actual no tiene endpoint de registro
    return {
      success: false,
      error: {
        context: {
          message: "Registro no disponible. Use usuarios de prueba existentes."
        }
      }
    };
  },

  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/registro-usuario").LoginDTO, import("../../models/dto/registro-usuario").AuthResponse>} */
  login: async (data) => {
    // Mapear 'password' a 'contraseña' para el backend
    const backendData = {
      email: data.email,
      contraseña: data.password,
    };
    
    const response = await api.post("/login", backendData);
    
    // El backend devuelve { token: "..." }, necesitamos crear el usuario
    if (response.success && response.result && response.result.token) {
      // Determinar autoridad basado en el email (backend usa ENFERMERO, no ENFERMERA)
      let autoridad = "MEDICO";
      if (data.email.includes("enf")) {
        autoridad = "ENFERMERO"; // Backend usa ENFERMERO
      }
      
      return {
        success: true,
        result: {
          token: response.result.token,
          usuario: {
            email: data.email,
            autoridad: autoridad,
            uuid: `user-${Date.now()}`
          }
        }
      };
    }
    
    return response;
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
