export default function SuccessModal({ visible, message = "Acción exitosa", onClose, type = "success" }) {
  if (!visible) return null;

  const isError = type === "error" || message.toLowerCase().includes("error");
  
  const styles = {
    success: {
      headerBg: '#10b981',
      buttonBg: '#10b981',
      title: 'Éxito'
    },
    error: {
      headerBg: '#ef4444',
      buttonBg: '#ef4444', 
      title: 'Error'
    }
  };

  const currentStyle = isError ? styles.error : styles.success;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal success-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header" style={{ background: currentStyle.headerBg }}>
          <h3 style={{ color: '#ffffff' }}>{currentStyle.title}</h3>
        </header>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <footer className="modal-footer">
          <button 
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: currentStyle.buttonBg,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Entendido
          </button>
        </footer>
      </div>
    </div>
  );
}