import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../backend/connections/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const usuarioGuardado = authService.getUsuarioActual();
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
    setCargando(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    
    if (response.success) {
      const { token, usuario } = response.result;
      console.log('Token recibido:', token);
      console.log('Usuario recibido:', usuario);
      authService.guardarSesion(token, usuario);
      setUsuario(usuario);
      return { success: true };
    }
    
    return { 
      success: false, 
      error: response.error?.context?.message?.message || 
             response.error?.context?.message || 
             "Usuario o contraseña inválidos"
    };
  };

  const registro = async (data) => {
    const response = await authService.registro(data);
    
    if (response.success) {
      return { success: true, message: "Usuario registrado exitosamente" };
    }
    
    return { 
      success: false, 
      error: response.error?.context?.message || 
             response.error?.message || 
             "Error al registrar usuario"
    };
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const tienePermiso = (autoridad) => {
    return usuario?.autoridad === autoridad;
  };

  const value = {
    usuario,
    cargando,
    estaAutenticado: !!usuario,
    login,
    registro,
    logout,
    tienePermiso
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
