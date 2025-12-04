import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: '#fff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            marginBottom: '10px'
          }}>
            🏥 Sistema Hospitalario
          </h1>
          <p style={{ color: '#e5e7eb', fontSize: '1.1rem' }}>
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
  );
}

// Componente de modal de error
function ErrorModal({ visible, message, onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal error-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon" style={{ fontSize: '4rem' }}>
          ❌
        </div>
        
        <header className="modal-header">
          <h3 style={{ color: '#dc2626' }}>Error de Autenticación</h3>
        </header>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <footer className="modal-footer">
          <button className="btn-modern btn-error" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
