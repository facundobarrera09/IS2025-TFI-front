import { useState } from "react";
import ReclamoPanel from "../components/ReclamoPanel";
import PacienteReclamado from "../components/PacienteReclamado";
import SuccessModal from "../components/SuccessModal";
import { urgenciasService } from "../backend/connections/urgenciasService";
import { atencionesService } from "../backend/connections/atencionesService";

export default function ReclamoPage() {
  const [pacienteActual, setPacienteActual] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const reclamarPaciente = async () => {
    const response = await urgenciasService.reclamarProximoPaciente();

    if (!response.success) {
      console.log('No se pudo reclamar el paciente:', response.error);
      
      // Mostrar modal de error
      const errorMsg = response.error.context?.message?.message || 
                       response.error.context?.message || 
                       "No hay pacientes en la lista de espera";
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
      
      setTimeout(() => setErrorModalVisible(false), 4000);
      
      return;
    }

    // Guardar el paciente reclamado
    setPacienteActual(response.result);

    // Mostrar modal de éxito
    setModalMessage("Paciente reclamado correctamente");
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 3000);
  };

  const registrarAtencion = async (data) => {
    const response = await atencionesService.crearAtencion(data);

    if (!response.success) {
      console.log('No se pudo registrar la atención:', response.error);
      
      // Mostrar modal de error
      const errorMsg = response.error.context?.message?.message || 
                       response.error.context?.message || 
                       "Error al registrar la atención";
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
      
      setTimeout(() => setErrorModalVisible(false), 5000);
      
      return false;
    }

    // Limpiar paciente actual
    setPacienteActual(null);

    // Mostrar modal de éxito
    setModalMessage("Atención registrada correctamente. El ingreso ha sido finalizado.");
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 4000);

    return true;
  };

  const cancelarAtencion = () => {
    setPacienteActual(null);
    setModalMessage("Atención cancelada");
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 2000);
  };

  return (
    <div className="container">
      <h1 className="title">Módulo de Reclamo de Pacientes</h1>

      <div className="card-modern">
        {!pacienteActual ? (
          <ReclamoPanel onReclamar={reclamarPaciente} />
        ) : (
          <PacienteReclamado 
            ingreso={pacienteActual} 
            onRegistrarAtencion={registrarAtencion}
            onCancelar={cancelarAtencion}
          />
        )}

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
        <div className="modal-icon" style={{ fontSize: '4rem' }}>
          ⚠️
        </div>
        
        <header className="modal-header">
          <h3 style={{ color: '#dc2626' }}>Lista de Espera Vacía</h3>
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
