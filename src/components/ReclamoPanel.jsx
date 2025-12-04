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
      background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      border: '2px solid #3b82f6',
      borderRadius: '16px',
      padding: '30px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
        🩺
      </div>
      
      <h2 style={{ 
        color: '#1e40af', 
        fontSize: '1.8rem', 
        marginBottom: '15px',
        fontWeight: '700'
      }}>
        Reclamar Próximo Paciente
      </h2>
      
      <p style={{ 
        color: '#475569', 
        fontSize: '1.05rem', 
        marginBottom: '30px',
        lineHeight: '1.6'
      }}>
        Haga clic en el botón para reclamar el siguiente paciente en la lista de espera según prioridad de emergencia.
      </p>

      <button 
        className="btn-modern"
        onClick={handleReclamar}
        disabled={loading}
        style={{
          fontSize: '1.15rem',
          padding: '18px 40px',
          minWidth: '280px',
          position: 'relative'
        }}
      >
        {loading ? (
          <>
            <span className="loading-spinner" style={{ marginRight: '10px' }}></span>
            Reclamando...
          </>
        ) : (
          <>
            🔔 Reclamar Paciente
          </>
        )}
      </button>

      <div style={{
        marginTop: '25px',
        padding: '15px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '10px',
        fontSize: '0.9rem',
        color: '#1e40af'
      }}>
        <strong>ℹ️ Nota:</strong> El paciente reclamado cambiará de estado PENDIENTE a EN_PROCESO y será removido de la lista de espera.
      </div>
    </div>
  );
}
