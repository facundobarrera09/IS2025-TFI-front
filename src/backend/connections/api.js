import BaseError from "../../models/base-error.schema";
import { USE_BACKEND, API_BASE_URL } from "../../config/apiConfig";

// Función para obtener headers con autenticación
const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Función para obtener headers con autenticación (formato que espera el backend)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log('Token desde localStorage:', token);
  
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    // El backend espera Bearer + token (hace substring(7) para quitar "Bearer ")
    headers["Authorization"] = `Bearer ${token}`;
    console.log('Header Authorization:', headers["Authorization"]);
  } else {
    console.log('No hay token disponible');
  }

  return headers;
};


// API con autenticación para endpoints que la requieren
export const apiWithAuth = {
  /** @type {import("../../models/service.schema").APIFunction<any>} */
  get: async (endpoint) => {
    if (!USE_BACKEND) {
      return {
        success: false,
        error: new BaseError("Backend not enabled", {
          context: { message: "USE_BACKEND is false" },
        }),
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: new BaseError("Error fetching data", {
            context: {
              status: response.status,
              message: data.message || data,
            },
          }),
        };
      }

      return {
        success: true,
        result: data,
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Network error", {
          context: { message: error.message },
        }),
      };
    }
  },

  /** @type {import("../../models/service.schema").APIFunction<any, any>} */
  post: async (endpoint, data) => {
    if (!USE_BACKEND) {
      return {
        success: false,
        error: new BaseError("Backend not enabled", {
          context: { message: "USE_BACKEND is false" },
        }),
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.status === 204 || response.status === 200) {
        if (response.headers.get("content-length") === "0" || 
            !response.headers.get("content-type")?.includes("application/json")) {
          return {
            success: true,
            result: null,
          };
        }
      }

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        responseData = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: new BaseError("Error posting data", {
            context: {
              status: response.status,
              message: responseData.message || responseData,
            },
          }),
        };
      }

      return {
        success: true,
        result: responseData,
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Network error", {
          context: { message: error.message },
        }),
      };
    }
  },
};

export const api = {
  /** @type {import("../../models/service.schema").APIFunction<any>} */
  get: async (endpoint) => {
    // Si no usa backend, retornar error para que los servicios usen mock
    if (!USE_BACKEND) {
      return {
        success: false,
        error: new BaseError("Backend not enabled", {
          context: { message: "USE_BACKEND is false" },
        }),
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: getHeaders(),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Si no se puede parsear como JSON, usar el texto de la respuesta
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: new BaseError("Error fetching data", {
            context: {
              status: response.status,
              message: data.message || data,
            },
          }),
        };
      }

      return {
        success: true,
        result: data,
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Network error", {
          context: { message: error.message },
        }),
      };
    }
  },

  /** @type {import("../../models/service.schema").APIFunction<any, any>} */
  post: async (endpoint, data) => {
    // Si no usa backend, retornar error para que los servicios usen mock
    if (!USE_BACKEND) {
      return {
        success: false,
        error: new BaseError("Backend not enabled", {
          context: { message: "USE_BACKEND is false" },
        }),
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      // Manejar respuestas vacías (204 No Content)
      if (response.status === 204 || response.status === 200) {
        if (response.headers.get("content-length") === "0" || 
            !response.headers.get("content-type")?.includes("application/json")) {
          return {
            success: true,
            result: null,
          };
        }
      }

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        // Si no se puede parsear como JSON, usar el texto de la respuesta
        responseData = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: new BaseError("Error posting data", {
            context: {
              status: response.status,
              message: responseData.message || responseData,
            },
          }),
        };
      }

      return {
        success: true,
        result: responseData,
      };
    } catch (error) {
      return {
        success: false,
        error: new BaseError("Network error", {
          context: { message: error.message },
        }),
      };
    }
  },
};