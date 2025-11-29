import BaseError from "../../models/base-error.schema"

const API_URL = "http://localhost:8080"

export const api = {
    /** @type {import("../../models/service.schema").APIFunction<import("../../models/dto/lista-ingresos.schema").ListaDeIngresos>} */
    get: async (endpoint) => {
        const response = await fetch(`${API_URL}${endpoint}`, { method: 'GET'})

        if (!response.ok) {
            return {
                success: false,
                error: new BaseError('Error fetching data', response.status)
            }
        }
        
        return {
            success: true,
            result: await response.json()
        }
    },

    /** @type {import("../../models/service.schema").APIFunction<null, import("../../models/dto/crear-ingreso.schema").CrearIngresoDTO>} */
    post: async (endpoint, data) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return {
                success: false,
                error: new BaseError('Error posting data', { context: { status: response.status, message: await response.json()} })
            }
        }
        
        return {
            success: true,
            result: null
        }
    }
}