import { useEffect, useState } from "react";
import PacientesTable from "../components/PacientesTable";
import { pacientesService } from "../backend/connections/pacientesService";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);

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


