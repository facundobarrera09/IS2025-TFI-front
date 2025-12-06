import { useAuth } from "../context/AuthContext";
import '../styles/components/UserHeader.css';

export default function UserHeader() {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const getRolTexto = (autoridad) => {
    return autoridad === 'MEDICO' ? 'Médico' : 'Enfermera';
  };

  return (
    <div className="user-header">
      <div className="user-header-info">
        <div className="user-header-badge">
          {getRolTexto(usuario.autoridad)}
        </div>
        
        <div className="user-header-user">
          <div className="user-header-user-label">Usuario:</div>
          <div className="user-header-user-email">{usuario.email}</div>
        </div>
      </div>

      <button onClick={logout} className="user-header-logout-btn">
        Cerrar Sesión
      </button>
    </div>
  );
}
