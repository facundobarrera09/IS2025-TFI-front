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
    // Para la lista de espera, usar el endpoint que devuelve solo pendientes
    const responseListaEspera = await urgenciasService.getIngresos();
    
    // Para los finalizados, usar el endpoint que devuelve todos los ingresos
    const responseTodos = await urgenciasService.getTodosLosIngresos();

    if (responseListaEspera.success) {
      console.log('Respuesta completa del backend para lista de espera:', responseListaEspera.result);
      
      let ingresosPendientes = [];
      
      // Manejar diferentes formatos de respuesta del backend
      if (responseListaEspera.result) {
        if (responseListaEspera.result.listaDeIngresos) {
          // Formato: { listaDeIngresos: PriorityQueue }
          const listaDeIngresos = responseListaEspera.result.listaDeIngresos;
          console.log('Lista de ingresos raw:', listaDeIngresos);
          
          if (Array.isArray(listaDeIngresos)) {
            ingresosPendientes = listaDeIngresos;
          } else if (listaDeIngresos && typeof listaDeIngresos === 'object') {
            // PriorityQueue se serializa de diferentes maneras
            // Intentar convertir a array
            try {
              // Si tiene propiedades numéricas (índices)
              const keys = Object.keys(listaDeIngresos);
              if (keys.length > 0 && keys.every(key => !isNaN(key))) {
                ingresosPendientes = Object.values(listaDeIngresos);
              } else {
                // Buscar propiedades que contengan arrays o elementos válidos
                ingresosPendientes = Object.values(listaDeIngresos).filter(item => 
                  item && typeof item === 'object' && item.paciente
                );
              }
            } catch (e) {
              console.warn('Error procesando PriorityQueue:', e);
              ingresosPendientes = [];
            }
          }
        } else if (Array.isArray(responseListaEspera.result)) {
          // Formato directo: Array de ingresos
          ingresosPendientes = responseListaEspera.result;
        } else if (responseListaEspera.result.paciente) {
          // Formato: Un solo ingreso
          ingresosPendientes = [responseListaEspera.result];
        }
      }
      
      console.log('Ingresos pendientes procesados:', ingresosPendientes);
      setIngresos(ingresosPendientes);
    } else {
      setIngresos([]);
      console.log("Error al obtener los ingresos pendientes:", responseListaEspera.error);
    }

    // Procesar todos los ingresos para obtener los finalizados
    if (responseTodos.success && Array.isArray(responseTodos.result)) {
      console.log('Todos los ingresos recibidos:', responseTodos.result);
      
      // Filtrar solo los finalizados
      const finalizados = responseTodos.result.filter(ing => 
        ing.estado === 'FINALIZADO'
      );
      
      console.log('Finalizados filtrados:', finalizados.length);
      setIngresosFinalizados(finalizados);
    } else {
      setIngresosFinalizados([]);
      console.log("Error al obtener todos los ingresos:", responseTodos.error);
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
            {/*<div style={{ 
              padding: '15px', 
              background: '#fef3c7', 
              border: '1px solid #fbbf24',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#92400e',
              fontSize: '0.9rem'
            }}>
              <strong>Nota:</strong> A modo de demostrar que cambia el estado, implementamos esto.
            </div>*/}
            <UrgenciasTable data={ingresosFinalizados} />
          </>
        )}
        <SuccessModal visible={modalVisible} message={modalMessage} onClose={() => setModalVisible(false)} />
      </div>
    </div>
  );
}

