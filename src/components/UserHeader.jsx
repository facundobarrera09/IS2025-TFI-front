import { useAuth } from "../context/AuthContext";

export default function UserHeader() {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const getRolBadge = (autoridad) => {
    if (autoridad === 'MEDICO') {
      return {
        emoji: '👨‍⚕️',
        texto: 'Médico',
        bg: '#dbeafe',
        color: '#1e40af'
      };
    }
    return {
      emoji: '👩‍⚕️',
      texto: 'Enfermera',
      bg: '#dcfce7',
      color: '#166534'
    };
  };

  const rol = getRolBadge(usuario.autoridad);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          background: rol.bg,
          color: rol.color,
          padding: '8px 16px',
          borderRadius: '10px',
          fontWeight: '600',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>{rol.emoji}</span>
          {rol.texto}
        </div>
        
        <div style={{ color: '#fff' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Usuario:</div>
          <div style={{ fontWeight: '600' }}>{usuario.email}</div>
        </div>
      </div>

      <button
        onClick={logout}
        style={{
          background: 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(220, 38, 38, 0.9)'}
        onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.9)'}
      >
        🚪 Cerrar Sesión
      </button>
    </div>
  );
}
