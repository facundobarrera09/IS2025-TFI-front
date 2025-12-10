import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegistroForm from "../components/RegistroForm";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function AuthPage() {
  const [modo, setModo] = useState("login"); // "login" o "registro"
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login, registro } = useAuth();

  const handleLogin = async (data) => {
    const result = await login(data.email, data.password);
    
    if (!result.success) {
      setErrorMessage(result.error);
      setErrorModalVisible(true);
      setTimeout(() => setErrorModalVisible(false), 4000);
    }
    // Si es exitoso, el AuthContext redirigirá automáticamente
  };

  const handleRegistro = async (data) => {
    // El registro no está implementado en el backend
    setErrorMessage("Registro no disponible. Use los usuarios de prueba del backend.");
    setErrorModalVisible(true);
    setTimeout(() => setErrorModalVisible(false), 4000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              color: '#cbd5e0',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              marginBottom: '10px'
            }}>
              Sistema Hospitalario
            </h1>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>
              Gestión de Urgencias y Pacientes
            </p>
          </div>

          <LoginForm 
            onSubmit={handleLogin}
            onCambiarARegistro={() => {
              setErrorMessage("Registro no disponible. Use los usuarios de prueba del backend.");
              setErrorModalVisible(true);
              setTimeout(() => setErrorModalVisible(false), 4000);
            }}
          />

          <ErrorModal 
            visible={errorModalVisible} 
            message={errorMessage} 
            onClose={() => setErrorModalVisible(false)} 
          />

          <SuccessModal 
            visible={successModalVisible} 
            message={successMessage} 
            onClose={() => setSuccessModalVisible(false)} 
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Componente de modal de error
function ErrorModal({ visible, message, onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal error-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header" style={{ background: '#ef4444' }}>
          <h3 style={{ color: '#ffffff' }}>Error de Autenticación</h3>
        </header>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <footer className="modal-footer">
          <button 
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}

// Componente de modal de éxito
function SuccessModal({ visible, message, onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal success-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header" style={{ background: '#10b981' }}>
          <h3 style={{ color: '#ffffff' }}>Registro Exitoso</h3>
        </header>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <footer className="modal-footer">
          <button 
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Continuar
          </button>
        </footer>
      </div>
    </div>
  );
}
