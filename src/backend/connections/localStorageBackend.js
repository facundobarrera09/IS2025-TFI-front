/**
 * Backend provisional usando localStorage
 * Este archivo simula un servidor local almacenando datos en localStorage
 */

import BaseError from "../../models/base-error.schema";

// Inicializar datos por defecto
const initializeLocalStorage = () => {
  const defaultData = {
    ingresos: [
      {
        id: "1",
        uuid: "uuid-1",
        pacienteUuid: "pac-1",
        medicoUuid: "med-1",
        fecha: new Date().toISOString(),
        estado: "pendiente",
        prioridad: "alta",
        descripcion: "Dolor de pecho",
        paciente: {
          nombre: "Juan García",
          apellido: "López",
          edad: 45,
          documento: "12345678"
        },
        medico: {
          nombre: "Dr. Carlos",
          apellido: "Rodríguez",
          especialidad: "Cardiología"
        }
      }
    ],
    pacientes: [
      {
        uuid: "pac-1",
        nombre: "Juan García",
        apellido: "López",
        edad: 45,
        documento: "12345678",
        email: "juan@example.com",
        telefono: "1234567890",
        domicilio: {
          calle: "Calle Principal",
          numero: "123",
          ciudad: "Buenos Aires",
          provincia: "CABA",
          codigoPostal: "1000"
        }
      }
    ],
    medicos: [
      {
        uuid: "med-1",
        nombre: "Dr. Carlos",
        apellido: "Rodríguez",
        matricula: "12345",
        especialidad: "Cardiología",
        email: "carlos@example.com"
      }
    ],
    usuarios: [
      {
        uuid: "user-1",
        email: "medico@example.com",
        password: "123456", // En producción esto debe ser hasheado
        nombre: "Dr. Carlos",
        apellido: "Rodríguez",
        rol: "medico",
        activo: true
      }
    ]
  };

  // Solo inicializar si no existen datos
  if (!localStorage.getItem("app_data")) {
    localStorage.setItem("app_data", JSON.stringify(defaultData));
  }
};

// Obtener todos los datos
const getAppData = () => {
  initializeLocalStorage();
  return JSON.parse(localStorage.getItem("app_data") || "{}");
};

// Guardar datos
const saveAppData = (data) => {
  localStorage.setItem("app_data", JSON.stringify(data));
};

// Simular delay de red
const simulateNetworkDelay = () => {
  return new Promise((resolve) => setTimeout(resolve, 300));
};

/**
 * Backend mock con localStorage
 */
export const localStorageBackend = {
  // ===== INGRESOS =====
  
  /** Obtener lista de ingresos */
  getIngresos: async () => {
    await simulateNetworkDelay();
    try {
      const data = getAppData();
      return {
        success: true,
        result: {
          data: data.ingresos || [],
          total: data.ingresos?.length || 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error fetching ingresos", {
          context: { message: error.message }
        })
      };
    }
  },

  /** Crear nuevo ingreso */
  crearIngreso: async (ingresoData) => {
    await simulateNetworkDelay();
    try {
      const data = getAppData();
      
      if (!data.ingresos) {
        data.ingresos = [];
      }

      const nuevoIngreso = {
        id: String(Date.now()),
        uuid: `ingreso-${Date.now()}`,
        ...ingresoData,
        fecha: new Date().toISOString(),
        estado: "pendiente"
      };

      data.ingresos.push(nuevoIngreso);
      saveAppData(data);

      return {
        success: true,
        result: nuevoIngreso
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error creating ingreso", {
          context: { message: error.message }
        })
      };
    }
  },

  /** Reclamar próximo paciente */
  reclamarProximoPaciente: async (medicoUuid) => {
    await simulateNetworkDelay();
    try {
      const data = getAppData();
      
      // Buscar ingreso pendiente no reclamado
      const ingresoDisponible = data.ingresos?.find(
        (ing) => ing.estado === "pendiente" && !ing.medicoUuid
      );

      if (!ingresoDisponible) {
        return {
          success: false,
          error: new BaseError("No hay pacientes disponibles", {
            context: { message: "No hay ingresos pendientes" }
          })
        };
      }

      ingresoDisponible.medicoUuid = medicoUuid;
      ingresoDisponible.estado = "reclamado";
      ingresoDisponible.fechaReclamacion = new Date().toISOString();

      saveAppData(data);

      return {
        success: true,
        result: ingresoDisponible
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error reclaiming paciente", {
          context: { message: error.message }
        })
      };
    }
  },

  /** Actualizar estado de ingreso */
  actualizarIngresoEstado: async (ingresoId, nuevoEstado) => {
    await simulateNetworkDelay();
    try {
      const data = getAppData();
      const ingreso = data.ingresos?.find((i) => i.id === ingresoId || i.uuid === ingresoId);

      if (!ingreso) {
        return {
          success: false,
          error: new BaseError("Ingreso no encontrado", {
            context: { message: `No se encontró el ingreso ${ingresoId}` }
          })
        };
      }

      ingreso.estado = nuevoEstado;
      saveAppData(data);

      return {
        success: true,
        result: ingreso
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error updating ingreso", {
          context: { message: error.message }
        })
      };
    }
  },

  // ===== PACIENTES =====

  /** Obtener lista de pacientes */
  getPacientes: async () => {
    await simulateNetworkDelay();
    try {
      const data = getAppData();
      return {
        success: true,
        result: {
          data: data.pacientes || [],
          total: data.pacientes?.length || 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error fetching pacientes", {
          context: { message: error.message }
        })
      };
    }
  },

  /** Crear nuevo paciente */
  crearPaciente: async (pacienteData) => {
    await simulateNetworkDelay();
    try {
      const data = getAppData();

      if (!data.pacientes) {
        data.pacientes = [];
      }

      const nuevoPaciente = {
        uuid: `pac-${Date.now()}`,
        ...pacienteData,
        fechaCreacion: new Date().toISOString()
      };

      data.pacientes.push(nuevoPaciente);
      saveAppData(data);

      return {
        success: true,
        result: nuevoPaciente
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error creating paciente", {
          context: { message: error.message }
        })
      };
    }
  },

  /** Obtener paciente por UUID */
  getPacienteById: async (uuid) => {
    await simulateNetworkDelay();
    try {
      const data = getAppData();
      const paciente = data.pacientes?.find((p) => p.uuid === uuid);

      if (!paciente) {
        return {
          success: false,
          error: new BaseError("Paciente no encontrado", {
            context: { message: `No se encontró el paciente ${uuid}` }
          })
        };
      }

      return {
        success: true,
        result: paciente
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error fetching paciente", {
          context: { message: error.message }
        })
      };
    }
  },

  // ===== AUTENTICACIÓN =====

  /** Login */
  login: async (email, password) => {
    await simulateNetworkDelay();
    try {
      const data = getAppData();
      const usuario = data.usuarios?.find(
        (u) => u.email === email && u.password === password && u.activo
      );

      if (!usuario) {
        return {
          success: false,
          error: new BaseError("Credenciales inválidas", {
            context: { message: "Email o contraseña incorrectos" }
          })
        };
      }

      const token = `token-${Date.now()}-${Math.random()}`;
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      return {
        success: true,
        result: {
          token,
          usuario: {
            uuid: usuario.uuid,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error logging in", {
          context: { message: error.message }
        })
      };
    }
  },

  /** Logout */
  logout: async () => {
    await simulateNetworkDelay();
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      return {
        success: true,
        result: null
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error logging out", {
          context: { message: error.message }
        })
      };
    }
  },

  // ===== UTILIDADES =====

  /** Obtener todos los datos (útil para debugging) */
  getAllData: () => {
    return getAppData();
  },

  /** Resetear todos los datos */
  resetData: () => {
    localStorage.removeItem("app_data");
    initializeLocalStorage();
    return {
      success: true,
      result: "Datos reseteados correctamente"
    };
  },

  /** Exportar datos a JSON */
  exportData: () => {
    const data = getAppData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-${new Date().toISOString()}.json`;
    link.click();
    return {
      success: true,
      result: "Datos exportados"
    };
  },

  /** Importar datos desde JSON */
  importData: async (jsonFile) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          saveAppData(data);
          resolve({
            success: true,
            result: "Datos importados correctamente"
          });
        } catch (error) {
          resolve({
            success: false,
            error: new BaseError("Error importing data", {
              context: { message: error.message }
            })
          });
        }
      };
      reader.readAsText(jsonFile);
    });
  }
};

  // ===== OBRAS SOCIALES =====

  /** Obtener lista de obras sociales disponibles */
  getObrasSociales: async () => {
    await simulateNetworkDelay();
    try {
      // Mock de obras sociales disponibles
      // En producción esto vendría de la base de datos
      const obrasSociales = ["Subsidio de salud"];
      
      return {
        success: true,
        result: { obrasSociales }
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Error fetching obras sociales", {
          context: { message: error.message }
        })
      };
    }
  }
