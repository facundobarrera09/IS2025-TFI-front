# Guía de Inicio - Sistema de Urgencias

## 🚀 Cómo ejecutar el sistema completo

### 1. Iniciar el Backend (Spring Boot)

```bash
cd "TFI DE SOFTWARE/IS2025-TFI"
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 2. Iniciar el Frontend (React + Vite)

```bash
cd "TFI-SW/IS2025-TFI-front"
npm install  # Solo la primera vez
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🔧 Configuración Actual

- **Backend**: Spring Boot en puerto 8080
- **Frontend**: React + Vite en puerto 5173
- **CORS**: Configurado en el backend
- **Integración**: Urgencias usa backend real, otros servicios usan mocks

## 📋 Funcionalidades Disponibles

### ✅ Con Backend Real
- **Crear Ingresos**: Formulario de urgencias conectado al backend
- **Listar Ingresos**: Tabla de espera con datos del backend
- **Validaciones**: El backend valida datos y devuelve errores apropiados

### 🔄 Con Mocks (LocalStorage)
- **Autenticación**: Login/registro usando datos mock
- **Pacientes**: Gestión de pacientes en localStorage
- **Atenciones**: Registro de atenciones en localStorage

## 🧪 Datos de Prueba

### Para Login (Mock)
- **Email**: `enfermera@hospital.com`
- **Password**: `password123`

### Para Crear Ingresos
- **CUIT**: Cualquier CUIT válido (formato: XX-XXXXXXXX-X)
- **Enfermera UUID**: `4c300fec-ed8f-4365-ac77-3d5b70a4e990` (ya configurado)
- **Niveles**: Critica, Emergencia, Urgencia, Urgencia Menor, Sin Urgencia

## 🐛 Troubleshooting

### Backend no inicia
- Verificar que Java 23 esté instalado
- Verificar que Maven esté instalado
- Verificar que el puerto 8080 esté libre

### Frontend no conecta al Backend
- Verificar que el backend esté ejecutándose en `http://localhost:8080`
- Verificar la consola del navegador para errores CORS
- Verificar que `USE_BACKEND = true` en `src/config/apiConfig.js`

### Errores de CORS
- El backend ya tiene CORS configurado para permitir todas las conexiones
- Si persisten problemas, reiniciar ambos servicios

## 📝 Logs Útiles

### Backend
Los logs aparecen en la consola donde ejecutaste `mvn spring-boot:run`

### Frontend
- Abrir DevTools del navegador (F12)
- Ver la pestaña Console para logs de JavaScript
- Ver la pestaña Network para requests HTTP

## 🔄 Flujo de Trabajo Recomendado

1. Iniciar backend primero
2. Esperar a que aparezca "Started Main in X seconds"
3. Iniciar frontend
4. Hacer login con credenciales mock
5. Probar crear ingresos (usa backend real)
6. Verificar que aparezcan en la lista de espera