# Sistema de Registro de Usuarios

## 🎯 Funcionalidad Implementada

Se ha agregado la funcionalidad completa de registro de usuarios al sistema, permitiendo crear cuentas para médicos y enfermeras.

## 📋 Características

### ✅ Registro de Usuarios
- **Tipos de usuario**: Médico y Enfermera
- **Validaciones**: Email válido, contraseña mínimo 8 caracteres
- **Confirmación**: Verificación de contraseña
- **Almacenamiento**: LocalStorage (modo mock)
- **Login automático**: Después del registro exitoso

### ✅ Validaciones Implementadas
- **Email**: Formato válido requerido
- **Contraseña**: Mínimo 8 caracteres
- **Confirmación**: Las contraseñas deben coincidir
- **Autoridad**: Debe seleccionar Médico o Enfermera
- **Email único**: No permite emails duplicados

### ✅ Interfaz de Usuario
- **Formulario de registro**: Campos validados en tiempo real
- **Cambio de modo**: Alternar entre login y registro
- **Mensajes de error**: Feedback claro al usuario
- **Mensajes de éxito**: Confirmación de registro exitoso
- **Diseño responsivo**: Adaptado al tema del sistema

## 🔧 Cómo Usar

### Para Registrar un Nuevo Usuario:

1. **Acceder al sistema**: Abrir `http://localhost:5173`
2. **Cambiar a registro**: Hacer clic en "Registrarse aquí"
3. **Completar formulario**:
   - Email válido (ej: `nuevo.medico@hospital.com`)
   - Seleccionar rol (Médico o Enfermera)
   - Contraseña (mínimo 8 caracteres)
   - Confirmar contraseña
4. **Enviar**: Hacer clic en "Crear Cuenta"
5. **Login automático**: El usuario queda logueado automáticamente

### Datos de Ejemplo para Registro:

```json
{
  "email": "nuevo.medico@hospital.com",
  "autoridad": "MEDICO",
  "password": "password123",
  "confirmPassword": "password123"
}
```

```json
{
  "email": "nueva.enfermera@hospital.com", 
  "autoridad": "ENFERMERA",
  "password": "enfermera123",
  "confirmPassword": "enfermera123"
}
```

## 🔒 Seguridad

### En Modo Mock (Actual)
- Contraseñas almacenadas en texto plano en localStorage
- Solo para desarrollo y testing
- Validación de email único

### En Modo Backend (Futuro)
- Contraseñas hasheadas con Argon2id/Bcrypt
- Validación en servidor
- JWT tokens seguros
- Base de datos persistente

## 📊 Flujo de Registro

```
1. Usuario completa formulario
   ↓
2. Validación frontend (Zod schema)
   ↓
3. Verificación email único
   ↓
4. Creación de usuario en localStorage
   ↓
5. Generación de token mock
   ↓
6. Login automático
   ↓
7. Redirección a dashboard
```

## 🎨 Componentes Actualizados

### `AuthPage.jsx`
- Modo dual: login/registro
- Manejo de estados de error y éxito
- Integración con AuthContext

### `RegistroForm.jsx`
- Formulario completo de registro
- Validaciones en tiempo real
- Diseño consistente con el sistema

### `LoginForm.jsx`
- Opción para cambiar a registro
- Usuarios de prueba documentados

### `mockBackend.js`
- Servicio de registro implementado
- Validación de email único
- Almacenamiento en localStorage

## 🧪 Testing

### Casos de Prueba Cubiertos:
- ✅ Registro exitoso con datos válidos
- ✅ Error con email duplicado
- ✅ Error con email inválido
- ✅ Error con contraseña corta
- ✅ Error con contraseñas no coincidentes
- ✅ Error sin seleccionar autoridad
- ✅ Login automático después del registro

### Para Probar:
1. Registrar usuario nuevo → Debe funcionar
2. Intentar mismo email → Debe mostrar error
3. Email inválido → Debe mostrar error
4. Contraseña < 8 chars → Debe mostrar error
5. Contraseñas diferentes → Debe mostrar error

## 📝 Usuarios Existentes (Mock)

### Predefinidos:
- **medico@hospital.com** / password123 (MEDICO)
- **enfermera@hospital.com** / password123 (ENFERMERA)

### Registrados Dinámicamente:
- Se almacenan en `localStorage.mock_usuarios`
- Persisten entre sesiones del navegador
- Se pueden ver en DevTools → Application → Local Storage

## 🚀 Próximos Pasos

1. **Migrar a backend real** cuando esté disponible
2. **Implementar roles avanzados** (admin, supervisor, etc.)
3. **Agregar campos adicionales** (nombre, apellido, matrícula)
4. **Implementar recuperación de contraseña**
5. **Agregar validación de matrícula médica**

## 🔄 Estado Actual

- ✅ **Registro**: Completamente funcional con mocks
- ✅ **Login**: Funcional con usuarios registrados
- ✅ **Validaciones**: Implementadas y probadas
- ✅ **UI/UX**: Diseño consistente y responsivo
- ✅ **Persistencia**: LocalStorage para desarrollo
- 🔄 **Backend**: Listo para migrar cuando esté disponible