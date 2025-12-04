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
      'Critica': { bg: '#fee2e2', color: '#dc2626', emoji: '🔴' },
      'Emergencia': { bg: '#ffedd5', color: '#ea580c', emoji: '🟠' },
      'Urgencia': { bg: '#fef9c3', color: '#ca8a04', emoji: '🟡' },
      'Urgencia Menor': { bg: '#dcfce7', color: '#16a34a', emoji: '🟢' },
      'Sin Urgencia': { bg: '#dbeafe', color: '#2563eb', emoji: '🔵' }
    };
    return colores[nivel] || colores['Sin Urgencia'];
  };

  const nivelColor = getNivelColor(ingreso.nivelEmergencia);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
      border: '3px solid #10b981',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(16, 185, 129, 0.2)',
      animation: 'cardFadeIn 0.6s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '3rem' }}>👤</div>
          <div>
            <h2 style={{ 
              color: '#10b981', 
              fontSize: '1.8rem', 
              margin: '0 0 5px 0',
              fontWeight: '700'
            }}>
              Paciente en Atención
            </h2>
            <span style={{
              background: '#d1fae5',
              color: '#065f46',
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
            className="btn-modern btn-success"
            onClick={() => setMostrarFormulario(true)}
            style={{ fontSize: '1rem', padding: '12px 24px' }}
          >
            📝 Registrar Atención
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
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            color: '#374151', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            📋 Datos del Paciente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Nombre:</strong>
              <div style={{ color: '#1f2937', fontSize: '1.05rem', fontWeight: '600' }}>
                {ingreso.paciente.nombre} {ingreso.paciente.apellido}
              </div>
            </div>
            <div>
              <strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>CUIT:</strong>
              <div style={{ color: '#1f2937', fontSize: '1rem' }}>
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
            color: '#374151', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            🚨 Nivel de Emergencia
          </h3>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: nivelColor.color,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {nivelColor.emoji} {ingreso.nivelEmergencia}
          </div>
        </div>

        {/* Signos Vitales */}
        <div style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            color: '#374151', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            💓 Signos Vitales
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: '#6b7280' }}>🌡️ Temp:</strong>
              <div style={{ color: '#1f2937', fontWeight: '600' }}>{ingreso.temperatura}°C</div>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>❤️ FC:</strong>
              <div style={{ color: '#1f2937', fontWeight: '600' }}>{ingreso.frecuenciaCardiaca} lpm</div>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>🫁 FR:</strong>
              <div style={{ color: '#1f2937', fontWeight: '600' }}>{ingreso.frecuenciaRespiratoria} rpm</div>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>🩺 TA:</strong>
              <div style={{ color: '#1f2937', fontWeight: '600' }}>
                {ingreso.tensionArterial.frecuenciaSistolica}/{ingreso.tensionArterial.frecuenciaDiastolica} mmHg
              </div>
            </div>
          </div>
        </div>

        {/* Informe */}
        <div style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          gridColumn: 'span 2'
        }}>
          <h3 style={{ 
            color: '#374151', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            📝 Informe de Ingreso
          </h3>
          <div style={{ 
            color: '#1f2937', 
            lineHeight: '1.6',
            fontSize: '0.95rem'
          }}>
            {ingreso.informe}
          </div>
        </div>

        {/* Enfermera */}
        <div style={{
          background: '#f0f9ff',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #bfdbfe'
        }}>
          <h3 style={{ 
            color: '#374151', 
            fontSize: '1.1rem', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            👩‍⚕️ Enfermera de Ingreso
          </h3>
          <div style={{ color: '#1f2937', fontSize: '1rem', fontWeight: '600' }}>
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
