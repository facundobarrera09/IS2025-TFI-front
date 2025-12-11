/**
 * Servicio para gestionar obras sociales
 */

class ObrasSocialesService {
  async getObrasSociales() {
    // Datos mock temporales hasta que se implemente el endpoint en el backend
    const obrasSocialesMock = [
      "OSDE",
      "Swiss Medical",
      "Galeno",
      "Medicus",
      "IOMA",
      "PAMI",
      "Obra Social Unión Personal",
      "OSECAC",
      "OSPRERA",
      "OSPLAD",
      "OSDEPYM",
      "OSUTHGRA",
      "OSPATCA",
      "OSPJN"
    ];

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        result: {
          obrasSociales: obrasSocialesMock
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          context: {
            message: "Error al obtener obras sociales"
          }
        }
      };
    }
  }
}

export const obrasSocialesService = new ObrasSocialesService();
