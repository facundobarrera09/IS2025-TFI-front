import { useState } from "react";

/**
 * @param {object} props
 * @param {Function} props.onReclamar - Función para reclamar el próximo paciente
 */
export default function ReclamoPanel({ onReclamar }) {
  const [loading, setLoading] = useState(false);

  const handleReclamar = async () => {
    setLoading(true);
    await onReclamar();
    setLoading(false);
  };

  return (
    <div style={{
      background: '#2d3748',
      border: '2px solid #4a5568',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center'
    }}>
      <h2 style={{ 
        color: '#cbd5e0', 
        fontSize: '1.8rem', 
        marginBottom: '15px',
        fontWeight: '700'
      }}>
        Reclamar Próximo Paciente
      </h2>
      
      <p style={{ 
        color: '#718096', 
        fontSize: '1.05rem', 
        marginBottom: '30px',
        lineHeight: '1.6'
      }}>
        Haga clic en el botón para reclamar el siguiente paciente en la lista de espera según prioridad de emergencia.
      </p>

      <button 
        onClick={handleReclamar}
        disabled={loading}
        style={{
          fontSize: '1.15rem',
          padding: '18px 40px',
          minWidth: '280px',
          position: 'relative',
          background: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? (
          <>
            <span className="loading-spinner" style={{ marginRight: '10px' }}></span>
            Reclamando...
          </>
        ) : (
          'Reclamar Paciente'
        )}
      </button>

      <div style={{
        marginTop: '25px',
        padding: '15px',
        background: '#1a202c',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#cbd5e0',
        border: '1px solid #4a5568'
      }}>
        <strong>Nota:</strong> El paciente reclamado cambiará de estado PENDIENTE a EN_PROCESO y será removido de la lista de espera.
      </div>
    </div>
  );
}
