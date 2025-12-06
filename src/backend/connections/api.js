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

      const data = await response.json();

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

      const responseData = await response.json();

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