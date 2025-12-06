/**
 * Servicio para gestionar obras sociales
 */

import { mockObrasSocialesService } from "../../mock/mockBackend";
import { USE_BACKEND } from "../../config/apiConfig";

class ObrasSocialesService {
  async getObrasSociales() {
    if (!USE_BACKEND) {
      // Usar mock backend
      return await mockObrasSocialesService.getObrasSociales();
    }
    
    // TODO: Implementar llamada a API real cuando esté disponible
    // return await api.get(API_ENDPOINTS.OBRAS_SOCIALES.BASE);
    
    throw new Error("Backend real no implementado aún");
  }
}

export const obrasSocialesService = new ObrasSocialesService();
