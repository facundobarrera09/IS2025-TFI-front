import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function AuthPage() {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  const handleLogin = async (data) => {
    const result = await login(data.email, data.password);
    
    if (!result.success) {
      setErrorMessage(result.error);
      setErrorModalVisible(true);
      setTimeout(() => setErrorModalVisible(false), 4000);
    }
    // Si es exitoso, el AuthContext redirigirá automáticamente
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
          />

          <ErrorModal 
            visible={errorModalVisible} 
            message={errorMessage} 
            onClose={() => setErrorModalVisible(false)} 
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
        <header className="modal-header">
          <h3>Error de Autenticación</h3>
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
