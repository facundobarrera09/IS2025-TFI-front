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
      
      // Mostrar error al usuario
      const errorMessage = response.error.context?.message || 'Error al crear el ingreso';
      setModalMessage(`Error: ${errorMessage}`);
      setModalVisible(true);
      
      // Auto cerrar después de 5 segundos para errores
      setTimeout(() => setModalVisible(false), 5000);
      
      return false;
    }

    // Los pacientes se crean automáticamente en el backend cuando se registra el ingreso
    // No necesitamos hacer nada adicional aquí

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
      console.log('Respuesta completa del backend:', response.result);
      
      let todosIngresos = [];
      
      // Manejar diferentes formatos de respuesta del backend
      if (response.result) {
        if (response.result.listaDeIngresos) {
          // Formato: { listaDeIngresos: PriorityQueue }
          const listaDeIngresos = response.result.listaDeIngresos;
          console.log('Lista de ingresos raw:', listaDeIngresos);
          
          if (Array.isArray(listaDeIngresos)) {
            todosIngresos = listaDeIngresos;
          } else if (listaDeIngresos && typeof listaDeIngresos === 'object') {
            // PriorityQueue se serializa de diferentes maneras
            // Intentar convertir a array
            try {
              // Si tiene propiedades numéricas (índices)
              const keys = Object.keys(listaDeIngresos);
              if (keys.length > 0 && keys.every(key => !isNaN(key))) {
                todosIngresos = Object.values(listaDeIngresos);
              } else {
                // Buscar propiedades que contengan arrays o elementos válidos
                todosIngresos = Object.values(listaDeIngresos).filter(item => 
                  item && typeof item === 'object' && item.paciente
                );
              }
            } catch (e) {
              console.warn('Error procesando PriorityQueue:', e);
              todosIngresos = [];
            }
          }
        } else if (Array.isArray(response.result)) {
          // Formato directo: Array de ingresos
          todosIngresos = response.result;
        } else if (response.result.paciente) {
          // Formato: Un solo ingreso
          todosIngresos = [response.result];
        }
      }
      
      console.log('Ingresos procesados:', todosIngresos);
      console.log('Cantidad de ingresos:', todosIngresos.length);
      
      // Filtrar por estado usando los enums del backend
      const pendientes = todosIngresos.filter(ing => 
        !ing.estado || ing.estado === 'PENDIENTE'
      );
      const finalizados = todosIngresos.filter(ing => 
        ing.estado === 'FINALIZADO'
      );
      
      console.log('Pendientes filtrados:', pendientes.length);
      console.log('Finalizados filtrados:', finalizados.length);
      
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
