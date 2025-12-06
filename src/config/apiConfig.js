/**
 * Configuración de URLs del Backend
 * 
 * IMPORTANTE: Este archivo contiene todas las URLs del backend.
 * Cuando el backend esté listo, solo cambia USE_BACKEND a true.
 */

// ⚙️ CONFIGURACIÓN PRINCIPAL
export const USE_BACKEND = false; // Cambiar a true cuando el backend esté listo

// 🌐 URL BASE DEL BACKEND
export const API_BASE_URL = "http://localhost:8080";

// 📋 ENDPOINTS DEL BACKEND
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: "/auth/login",
    REGISTRO: "/auth/registro",
  },

  // Pacientes
  PACIENTES: {
    BASE: "/pacientes",
    BY_CUIT: (cuit) => `/pacientes/cuit/${cuit}`,
  },

  // Ingresos (Urgencias)
  INGRESOS: {
    BASE: "/ingresos",
    RECLAMAR: "/ingresos/reclamar",
    PENDIENTES: "/ingresos/pendientes",
  },

  // Atenciones
  ATENCIONES: {
    BASE: "/atenciones",
  },

  // Obras Sociales
  OBRAS_SOCIALES: {
    BASE: "/obras-sociales",
  },
};

// 🔐 CONFIGURACIÓN DE AUTENTICACIÓN
export const AUTH_CONFIG = {
  TOKEN_KEY: "token",
  USER_KEY: "usuario",
  TOKEN_HEADER: "Authorization",
  TOKEN_PREFIX: "Bearer",
};

// 💾 CONFIGURACIÓN DE ALMACENAMIENTO LOCAL
export const STORAGE_KEYS = {
  PACIENTES: "hospital_pacientes",
  INGRESOS: "hospital_ingresos",
  ATENCIONES: "hospital_atenciones",
  OBRAS_SOCIALES: "hospital_obras_sociales",
  USUARIOS: "hospital_usuarios",
};

// ⏱️ CONFIGURACIÓN DE DELAYS (para simular latencia de red)
export const MOCK_CONFIG = {
  MIN_DELAY: 300, // ms
  MAX_DELAY: 800, // ms
};

// 🎯 DATOS INICIALES (solo para modo mock)
export const INITIAL_DATA = {
  USUARIOS: [
    {
      uuid: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      email: "medico@hospital.com",
      password: "password123", // En producción esto estaría hasheado
      autoridad: "MEDICO",
      nombre: "Juan",
      apellido: "Pérez",
      matricula: "MP12345",
    },
    {
      uuid: "4c300fec-ed8f-4365-ac77-3d5b70a4e990",
      email: "enfermera@hospital.com",
      password: "password123", // En producción esto estaría hasheado
      autoridad: "ENFERMERA",
      apellido: "González",
    },
  ],

  OBRAS_SOCIALES: [
    { uuid: "os-1", nombre: "OSDE" },
    { uuid: "os-2", nombre: "Swiss Medical" },
    { uuid: "os-3", nombre: "PAMI" },
    { uuid: "os-4", nombre: "OSECAC" },
  ],
};

// 📝 NOTAS PARA MIGRACIÓN AL BACKEND:
/*
1. Cambiar USE_BACKEND a true
2. Verificar que el backend esté corriendo en API_BASE_URL
3. Los servicios automáticamente usarán las URLs reales
4. Los datos de localStorage se ignorarán
5. El backend debe devolver las mismas estructuras de datos
*/
