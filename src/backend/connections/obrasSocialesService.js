/**
 * Servicio para gestionar obras sociales
 */

class ObrasSocialesService {
  async getObrasSociales() {
    // El backend actual no tiene endpoint de obras sociales
    return {
      success: false,
      error: {
        context: {
          message: "Endpoint de obras sociales no implementado en el backend"
        }
      }
    };
  }
}

export const obrasSocialesService = new ObrasSocialesService();
