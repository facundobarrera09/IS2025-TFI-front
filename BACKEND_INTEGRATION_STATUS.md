# Estado de Integración con Backend

Este documento describe el estado actual de la integración entre el frontend y el backend.

## ✅ Servicios Integrados con Backend Real

### Urgencias/Ingresos
- **GET /ingresos** - ✅ Integrado
- **POST /ingresos** - ✅ Integrado

Los servicios de urgencias ahora usan el backend real de Spring Boot que corre en `http://localhost:8080`.

## 🔄 Servicios que Siguen Usando Mocks

### Autenticación
- **POST /auth/login** - 🔄 Mock (backend no implementado aún)
- **POST /auth/registro** - 🔄 Mock (backend no implementado aún)

### Pacientes
- **GET /pacientes** - 🔄 Mock (backend no implementado aún)
- **POST /pacientes** - 🔄 Mock (backend no implementado aún)
- **GET /pacientes/cuit/{cuit}** - 🔄 Mock (backend no implementado aún)

### Atenciones
- **POST /atenciones** - 🔄 Mock (backend no implementado aún)

### Obras Sociales
- **GET /obras-sociales** - 🔄 Mock (backend no implementado aún)

## 🔧 Configuración

- **USE_BACKEND**: `true` en `src/config/apiConfig.js`
- **API_BASE_URL**: `http://localhost:8080`
- **CORS**: Configurado en el backend

## 📝 Notas de Implementación

### Mapeo de Datos para Ingresos

El frontend mapea los datos al formato esperado por el backend:

```javascript
const backendData = {
  paciente: {
    cuit: data.paciente.cuit,
    apellido: data.paciente.apellido,
    nombre: data.paciente.nombre,
    domicilio: data.paciente.domicilio
  },
  enfermera: {
    uuid: data.enfermera.uuid
  },
  informe: data.informe,
  temperatura: parseFloat(data.temperatura) || null,
  nivel: data.nivel,
  frecuenciaCardiaca: parseFloat(data.frecuenciaCardiaca),
  frecuenciaRespiratoria: parseFloat(data.frecuenciaRespiratoria),
  tensionArterial: data.tensionArterial
};
```

### Manejo de Respuestas

- El backend devuelve `200 OK` con cuerpo vacío para POST exitosos
- GET `/ingresos` devuelve `ResListaDeIngresos` con `PriorityQueue<Ingreso>`
- Los errores se manejan con códigos HTTP apropiados

## 🚀 Próximos Pasos

1. Implementar endpoints de autenticación en el backend
2. Implementar endpoints de pacientes en el backend
3. Implementar endpoints de atenciones en el backend
4. Implementar endpoints de obras sociales en el backend
5. Migrar servicios restantes del mock al backend real

## 🧪 Testing

Para probar la integración:

1. Iniciar el backend: `mvn spring-boot:run` en la carpeta del backend
2. Iniciar el frontend: `npm run dev` en la carpeta del frontend
3. El backend debe estar disponible en `http://localhost:8080`
4. El frontend debe estar disponible en `http://localhost:5173`

### Datos de Prueba

Usar estos datos para probar:

**Enfermera UUID**: `4c300fec-ed8f-4365-ac77-3d5b70a4e990`

**Niveles de Emergencia**:
- Critica
- Emergencia  
- Urgencia
- Urgencia Menor
- Sin Urgencia