export default function SuccessModal({ visible, message = "Acción exitosa", onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          ✅
        </div>
        
        <header className="modal-header">
          <h3>¡Éxito!</h3>
        </header>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <footer className="modal-footer">
          <button className="btn-modern btn-success" onClick={onClose}>
            Entendido
          </button>
        </footer>
      </div>
    </div>
  );
}