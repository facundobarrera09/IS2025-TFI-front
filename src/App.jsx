import { useEffect, useState } from "react";
import "./App.css";
import UrgenciasForm from "./components/UrgenciasForm";
import UrgenciasTable from "./components/UrgenciasTable";
import SuccessModal from "./components/SuccessModal";
import { urgenciasService } from "./backend/connections/urgenciasService";

function App() {
  const [tab, setTab] = useState("form");
  const [ingresos, setIngresos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const agregarIngresos = async (data) => {
    const response = await urgenciasService.crearIngreso(data)

    if (!response.success) {
      console.log('No se pudo crear el ingreso:', response.error.context)
      return false
    }

    // Mostrar modal de éxito
    setModalMessage("Ingreso creado correctamente");
    setModalVisible(true);

    // Actualizar lista
    fetchIngresos();

    // Auto cerrar después de 3 segundos
    setTimeout(() => setModalVisible(false), 3000);

    return true
  };

  const fetchIngresos = async () => {
      const response = await urgenciasService.getIngresos()

      if (response.success) {
        console.log(response.result.listaDeIngresos)
        setIngresos(response.result.listaDeIngresos)
      }
      else {
        setIngresos([])
        console.log("Error al obtener los ingresos:", response.error);
      }
  }

  useEffect(() => {
    if (tab === "list") {
      fetchIngresos();
    }
  }, [tab])

  return (
    <div className="container">
      <h1 className="title">Módulo de Urgencias</h1>

      {/* ---- Tabs ---- */}
      <div className="tabs">
        <button
          className={tab === "form" ? "tab active" : "tab"}
          onClick={() => setTab("form")}
        >
          ➕ Ingreso
        </button>

        <button
          className={tab === "list" ? "tab active" : "tab"}
          onClick={() => setTab("list")}
        >
          📋 Lista de espera
        </button>
      </div>

      {/* ---- Contenido ---- */}
      <div className="card-modern">
        {tab === "form" && <UrgenciasForm onSubmit={agregarIngresos} />}
        {tab === "list" && <UrgenciasTable data={ingresos} />}
        <SuccessModal visible={modalVisible} message={modalMessage} onClose={() => setModalVisible(false)} />
      </div>
    </div>
  );
}

export default App;
