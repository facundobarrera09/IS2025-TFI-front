/**
 * Selector de backend
 * Cambia USE_LOCAL_BACKEND a true para usar localStorage
 * Cambia a false para usar el servidor real
 */

import { api } from "./api";
import { localStorageBackend } from "./connections/localStorageBackend";

// 🔧 CAMBIAR ESTO PARA USAR BACKEND LOCAL O REAL
const USE_LOCAL_BACKEND = true;

// Seleccionar backend activo
const activeBackend = USE_LOCAL_BACKEND ? localStorageBackend : {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete
};

export const backendService = {
  // Proxy de funciones del backend activo
  getIngresos: (args) => activeBackend.getIngresos?.(args),
  crearIngreso: (data) => activeBackend.crearIngreso?.(data),
  reclamarProximoPaciente: (uuid) => activeBackend.reclamarProximoPaciente?.(uuid),
  actualizarIngresoEstado: (id, estado) => activeBackend.actualizarIngresoEstado?.(id, estado),
  
  getPacientes: () => activeBackend.getPacientes?.(),
  crearPaciente: (data) => activeBackend.crearPaciente?.(data),
  getPacienteById: (uuid) => activeBackend.getPacienteById?.(uuid),
  
  getObrasSociales: () => activeBackend.getObrasSociales?.(),
  
  login: (email, password) => activeBackend.login?.(email, password),
  logout: () => activeBackend.logout?.(),
  
  // Utilidades
  getAllData: () => activeBackend.getAllData?.(),
  resetData: () => activeBackend.resetData?.(),
  exportData: () => activeBackend.exportData?.(),
  importData: (file) => activeBackend.importData?.(file),
  
  // Helper para obtener estado del backend
  isUsingLocalBackend: () => USE_LOCAL_BACKEND,
  getBackendInfo: () => ({
    type: USE_LOCAL_BACKEND ? "localStorage" : "API Remote",
    url: USE_LOCAL_BACKEND ? "localStorage" : "http://localhost:8080"
  })
};
