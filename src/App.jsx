import { useState, useEffect } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import UrgenciasPage from "./pages/UrgenciasPage";
import PacientesPage from "./pages/PacientesPage";
import ReclamoPage from "./pages/ReclamoPage";
import UserHeader from "./components/UserHeader";
import Footer from "./components/Footer";

function AppContent() {
  const { usuario, estaAutenticado, cargando } = useAuth();
  const [modulo, setModulo] = useState(null);

  // Establecer módulo inicial según el rol
  useEffect(() => {
    if (usuario && !modulo) {
      if (usuario.autoridad === 'MEDICO') {
        setModulo("reclamo");
      } else if (usuario.autoridad === 'ENFERMERA' || usuario.autoridad === 'ENFERMERO') {
        setModulo("pacientes");
      }
    }
  }, [usuario, modulo]);

  // Verificar si el usuario tiene permiso para ver el módulo
  const tienePermiso = (moduloNombre) => {
    if (!usuario) return false;
    
    if (usuario.autoridad === 'MEDICO') {
      return ['reclamo'].includes(moduloNombre);
    }
    
    if (usuario.autoridad === 'ENFERMERA' || usuario.autoridad === 'ENFERMERO') {
      return ['pacientes', 'urgencias'].includes(moduloNombre);
    }
    
    return false;
  };

  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div className="loading-spinner" style={{ 
            width: '60px', 
            height: '60px',
            borderWidth: '6px',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.2rem' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <AuthPage />;
  }

  return (
    <>
      {/* ---- Header de usuario ---- */}
      <UserHeader />

      {/* ---- Navegación principal ---- */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '15px 0',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container">
          <div className="tabs" style={{ marginBottom: 0 }}>
            {tienePermiso('pacientes') && (
              <button
                className={modulo === "pacientes" ? "tab active" : "tab"}
                onClick={() => setModulo("pacientes")}
                style={{ 
             
              background: '#0044ffff',
              color: '#ffffff'
            }}
              >
                Pacientes
                
              </button>
            )}
            {tienePermiso('urgencias') && (
              <button
                className={modulo === "urgencias" ? "tab active" : "tab"}
                onClick={() => setModulo("urgencias")}
                style={{ 
             
              background: '#0044ffff',
              color: '#ffffff'
            }}
              >
                Urgencias
              </button>
            )}
            {tienePermiso('reclamo') && (
              <button
                className={modulo === "reclamo" ? "tab active" : "tab"}
                onClick={() => setModulo("reclamo")}
                  style={{ 
             
              background: '#1ea3a3ff',
              color: '#ffffff'
            }}
              >
                Reclamo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---- Contenido del módulo ---- */}
      {modulo === "urgencias" && tienePermiso('urgencias') && <UrgenciasPage />}
      {modulo === "pacientes" && tienePermiso('pacientes') && <PacientesPage />}
      {modulo === "reclamo" && tienePermiso('reclamo') && <ReclamoPage />}

      {/* ---- Footer ---- */}
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
