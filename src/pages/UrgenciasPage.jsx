import { useEffect, useState } from "react";
import UrgenciasForm from "../components/UrgenciasForm";
import UrgenciasTable from "../components/UrgenciasTable";
import SuccessModal from "../components/SuccessModal";
import { urgenciasService } from "../backend/connections/urgenciasService";

export default function UrgenciasPage() {
  const [tab, setTab] = useState("form");
  const [ingresos, setIngresos] = useState([]);
  const [ingresosFinalizados, setIngresosFinalizados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const agregarIngresos = async (data) => {
    const response = await urgenciasService.crearIngreso(data);

    if (!response.success) {
      console.log('No se pudo crear el ingreso:', response.error.context);
      return false;
    }

    // Mostrar modal de éxito
    setModalMessage("Ingreso creado correctamente");
    setModalVisible(true);

    // Actualizar lista
    fetchIngresos();

    // Auto cerrar después de 3 segundos
    setTimeout(() => setModalVisible(false), 3000);

    return true;
  };

  const fetchIngresos = async () => {
    const response = await urgenciasService.getIngresos();

    if (response.success) {
      console.log(response.result.listaDeIngresos);
      const todosIngresos = response.result.listaDeIngresos;
      
      // Separar pendientes y finalizados
      const pendientes = todosIngresos.filter(ing => ing.estado === 'PENDIENTE');
      const finalizados = todosIngresos.filter(ing => ing.estado === 'FINALIZADO');
      
      setIngresos(pendientes);
      setIngresosFinalizados(finalizados);
    } else {
      setIngresos([]);
      setIngresosFinalizados([]);
      console.log("Error al obtener los ingresos:", response.error);
    }
  };

  useEffect(() => {
    if (tab === "list" || tab === "finalizados") {
      fetchIngresos();
    }
  }, [tab]);

  return (
    <div className="container">
      <h1 className="title">Módulo de Urgencias</h1>

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
          Ingreso
        </button>

        <button
          className={tab === "list" ? "tab active" : "tab"}
          onClick={() => setTab("list")}
           style={{ 
             
              background: '#1ea3a3ff',
              color: '#ffffff'
            }}
        >
          Lista de espera
        </button>

        <button
          className={tab === "finalizados" ? "tab active" : "tab"}
          onClick={() => setTab("finalizados")}
           style={{ 
             
              background: '#1ea3a3ff',
              color: '#ffffff'
            }}
        >
          Finalizados
        </button>
      </div>

      {/* ---- Contenido ---- */}
      <div className="card-modern">
        {tab === "form" && <UrgenciasForm onSubmit={agregarIngresos} />}
        {tab === "list" && <UrgenciasTable data={ingresos} />}
        {tab === "finalizados" && (
          <>
            <div style={{ 
              padding: '15px', 
              background: '#fef3c7', 
              border: '1px solid #fbbf24',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#92400e',
              fontSize: '0.9rem'
            }}>
              <strong>Nota:</strong> A modo de demostrar que cambia el estado, implementamos esto.
            </div>
            <UrgenciasTable data={ingresosFinalizados} />
          </>
        )}
        <SuccessModal visible={modalVisible} message={modalMessage} onClose={() => setModalVisible(false)} />
      </div>
    </div>
  );
}
