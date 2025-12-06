export default function SuccessModal({ visible, message = "Acción exitosa", onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal success-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>Éxito</h3>
        </header>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <footer className="modal-footer">
          <button 
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: '#10b981',
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