import { useState } from "react";
import AtencionForm from "./AtencionForm";

/**
 * @param {object} props
 * @param {any} props.ingreso - Ingreso reclamado
 * @param {Function} props.onRegistrarAtencion - Función para registrar la atención
 * @param {Function} props.onCancelar - Función para cancelar sin atender
 */
export default function PacienteReclamado({ ingreso, onRegistrarAtencion, onCancelar }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  if (!ingreso) return null;

  const getNivelColor = (nivel) => {
    const colores = {
      'Critica': { bg: '#4a5568', color: '#e2e8f0' },
      'Emergencia': { bg: '#4a5568', color: '#e2e8f0' },
      'Urgencia': { bg: '#4a5568', color: '#e2e8f0' },
      'Urgencia Menor': { bg: '#4a5568', color: '#e2e8f0' },
      'Sin Urgencia': { bg: '#4a5568', color: '#e2e8f0' }
    };
    return colores[nivel] || colores['Sin Urgencia'];
  };

  const nivelColor = getNivelColor(ingreso.nivelEmergencia);

  return (
    <div style={{
      background: '#2d3748',
      border: '2px solid #4a5568',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      animation: 'cardFadeIn 0.6s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: '2px solid #4a5568'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            <h2 style={{ 
              color: '#cbd5e0', 
              fontSize: '1.8rem', 
              margin: '0 0 5px 0',
              fontWeight: '700'
            }}>
              Paciente en Atención
            </h2>
            <span style={{
              background: '#4a5568',
              color: '#e2e8f0',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              EN PROCESO
            </span>
          </div>
        </div>
        
        {!mostrarFormulario && (
          <button 
            onClick={() => setMostrarFormulario(true)}
            style={{ 
              fontSize: '1rem', 
              padding: '12px 24px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Registrar Atención
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* Datos del Paciente */}
        <div style={{
          background: '#1a202c',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #4a5568'
        }}>
          <h3 style={{ 
            color: '#cbd5e0', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Datos del Paciente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <strong style={{ color: '#718096', fontSize: '0.85rem' }}>Nombre:</strong>
              <div style={{ color: '#e2e8f0', fontSize: '1.05rem', fontWeight: '600' }}>
                {ingreso.paciente.nombre} {ingreso.paciente.apellido}
              </div>
            </div>
            <div>
              <strong style={{ color: '#718096', fontSize: '0.85rem' }}>CUIT:</strong>
              <div style={{ color: '#e2e8f0', fontSize: '1rem' }}>
                {ingreso.paciente.cuit}
              </div>
            </div>
          </div>
        </div>

        {/* Nivel de Emergencia */}
        <div style={{
          background: nivelColor.bg,
          padding: '20px',
          borderRadius: '12px',
          border: `2px solid ${nivelColor.color}`
        }}>
          <h3 style={{ 
            color: '#cbd5e0', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Nivel de Emergencia
          </h3>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: nivelColor.color,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {ingreso.nivelEmergencia}
          </div>
        </div>

        {/* Signos Vitales */}
        <div style={{
          background: '#1a202c',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #4a5568'
        }}>
          <h3 style={{ 
            color: '#cbd5e0', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Signos Vitales
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: '#718096' }}>Temp:</strong>
              <div style={{ color: '#e2e8f0', fontWeight: '600' }}>{ingreso.temperatura}°C</div>
            </div>
            <div>
              <strong style={{ color: '#718096' }}>FC:</strong>
              <div style={{ color: '#e2e8f0', fontWeight: '600' }}>{ingreso.frecuenciaCardiaca} lpm</div>
            </div>
            <div>
              <strong style={{ color: '#718096' }}>FR:</strong>
              <div style={{ color: '#e2e8f0', fontWeight: '600' }}>{ingreso.frecuenciaRespiratoria} rpm</div>
            </div>
            <div>
              <strong style={{ color: '#718096' }}>TA:</strong>
              <div style={{ color: '#e2e8f0', fontWeight: '600' }}>
                {ingreso.tensionArterial.frecuenciaSistolica}/{ingreso.tensionArterial.frecuenciaDiastolica} mmHg
              </div>
            </div>
          </div>
        </div>

        {/* Informe */}
        <div style={{
          background: '#1a202c',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #4a5568',
          gridColumn: 'span 2'
        }}>
          <h3 style={{ 
            color: '#cbd5e0', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Informe de Ingreso
          </h3>
          <div style={{ 
            color: '#e2e8f0', 
            lineHeight: '1.6',
            fontSize: '0.95rem'
          }}>
            {ingreso.informe}
          </div>
        </div>

        {/* Enfermera */}
        <div style={{
          background: '#1a202c',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #4a5568'
        }}>
          <h3 style={{ 
            color: '#cbd5e0', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Enfermera de Ingreso
          </h3>
          <div style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: '600' }}>
            {ingreso.enfermera.apellido}
          </div>
        </div>
      </div>

      {/* Formulario de atención */}
      {mostrarFormulario && (
        <AtencionForm 
          ingreso={ingreso}
          onSubmit={onRegistrarAtencion}
          onCancel={() => setMostrarFormulario(false)}
        />
      )}
    </div>
  );
}
