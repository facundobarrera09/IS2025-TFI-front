import { api } from "./api";

export const authService = {
  /** @type {import("../../models/service.schema").ServiceFunction<import("../../models/dto/registro-usuario").RegistroUsuarioDTO, import("../../models/dto/registro-usuario").AuthResponse>} */
  registro: async (data) => {
    // Como el endpoint /usuarios no está disponible en el backend actual,
    // usamos una simulación local para demostrar la funcionalidad
    
    // Simular validaciones del backend
    if (!data.email || !data.password || !data.autoridad) {
      return {
        success: false,
        error: {
          context: {
            message: "Todos los campos son obligatorios"
          }
        }
      };
    }

    // Verificar si el email ya existe (simulado)
    const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
    if (usuariosExistentes.some(u => u.email === data.email)) {
      return {
        success: false,
        error: {
          context: {
            message: "El email ya está registrado"
          }
        }
      };
    }

    // Simular registro exitoso
    const nuevoUsuario = {
      email: data.email,
      autoridad: data.autoridad,
      fechaRegistro: new Date().toISOString()
    };

    if (data.autoridad === "médico") {
      nuevoUsuario.matricula = data.matricula;
    } else if (data.autoridad === "enfermera") {
      nuevoUsuario.nombre = data.nombre;
      nuevoUsuario.apellido = data.apellido;
    }

    // Guardar en localStorage (simulando base de datos)
    usuariosExistentes.push(nuevoUsuario);
    localStorage.setItem('usuarios_registrados', JSON.stringify(usuariosExistentes));

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      result: {
        message: "Usuario registrado exitosamente. Nota: Este es un registro simulado ya que el endpoint del backend no está disponible."
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
