import { useEffect, useState } from "react";
import PacientesForm from "../components/PacientesForm";
import PacientesTable from "../components/PacientesTable";
import SuccessModal from "../components/SuccessModal";
import { pacientesService } from "../backend/connections/pacientesService";

export default function PacientesPage() {
  const [tab, setTab] = useState("form");
  const [pacientes, setPacientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const agregarPaciente = async (data) => {
    const response = await pacientesService.crearPaciente(data);

    if (!response.success) {
      console.log('No se pudo crear el paciente:', response.error);
      
      // Mostrar modal de error
      const errorMsg = response.error.context?.message?.message || 
                       response.error.context?.message || 
                       "Error al registrar el paciente";
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
      
      setTimeout(() => setErrorModalVisible(false), 5000);
      
      return false;
    }

    // Mostrar modal de éxito
    setModalMessage("Paciente registrado correctamente");
    setModalVisible(true);

    // Actualizar lista
    fetchPacientes();

    // Auto cerrar después de 3 segundos
    setTimeout(() => setModalVisible(false), 3000);

    return true;
  };

  const fetchPacientes = async () => {
    const response = await pacientesService.getPacientes();

    if (response.success) {
      setPacientes(response.result || []);
    } else {
      setPacientes([]);
      console.log("Error al obtener los pacientes:", response.error);
    }
  };

  useEffect(() => {
    if (tab === "list") {
      fetchPacientes();
    }
  }, [tab]);

  return (
    <div className="container">
      <h1 className="title">Registro de Pacientes</h1>

      {/* ---- Tabs ---- */}
      <div className="tabs">
        <button
          className={tab === "form" ? "tab active" : "tab"}
          onClick={() => setTab("form")}
          style={{ 
             
              background: '#1ea3a3ff',
              color: '#ffffff'
            }}
        >
          Registrar Paciente
        </button>

        <button
          className={tab === "list" ? "tab active" : "tab"}
          onClick={() => setTab("list")}
           style={{ 
             
              background: '#1ea3a3ff',
              color: '#ffffff'
            }}
        >
          Lista de Pacientes
        </button>
      </div>

      {/* ---- Contenido ---- */}
      <div className="card-modern">
        {tab === "form" && <PacientesForm onSubmit={agregarPaciente} />}
        {tab === "list" && <PacientesTable data={pacientes} />}
        
        <SuccessModal 
          visible={modalVisible} 
          message={modalMessage} 
          onClose={() => setModalVisible(false)} 
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
        <header className="modal-header">
          <h3 style={{ color: '#ef4444' }}>Error</h3>
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
