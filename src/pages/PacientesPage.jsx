import { useEffect, useState } from "react";
import PacientesTable from "../components/PacientesTable";
import { pacientesService } from "../backend/connections/pacientesService";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);

  const fetchPacientes = async () => {
    console.log('🏥 PacientesPage: Iniciando fetchPacientes...');
    
    const response = await pacientesService.getPacientes();
    
    console.log('🏥 PacientesPage: Respuesta del servicio:', response);

    if (response.success) {
      console.log('✅ PacientesPage: Pacientes obtenidos:', response.result);
      setPacientes(response.result || []);
    } else {
      console.log('❌ PacientesPage: Error al obtener pacientes:', response.error);
      setPacientes([]);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Lista de Pacientes</h1>

      {/* ---- Contenido ---- */}
      <div className="card-modern">
        <PacientesTable data={pacientes} />
      </div>
    </div>
  );
}


