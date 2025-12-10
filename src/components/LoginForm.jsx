import { useState } from "react";
import { LoginSchema } from "../models/dto/registro-usuario.schema";

export default function LoginForm({ onSubmit, onCambiarARegistro }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = LoginSchema.safeParse(form);

    if (!result.success) {
      const mapped = {};
      result.error.issues.forEach((err) => {
        const key = (err.path && err.path.length) ? err.path.join('.') : '_form';
        mapped[key] = err.message || 'Valor inválido';
      });
      setErrors(mapped);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await onSubmit(form);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#2d3748',
      border: '2px solid #4a5568',
      borderRadius: '12px',
      padding: '40px',
      maxWidth: '450px',
      margin: '0 auto',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#cbd5e0', 
          fontSize: '2rem', 
          margin: '0 0 10px 0',
          fontWeight: '700'
        }}>
          Iniciar Sesión
        </h2>
        <p style={{ color: '#718096', margin: 0 }}>
          Ingrese sus credenciales para acceder
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-modern">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={errors['email'] ? 'input-error' : ''}
            autoComplete="email"
          />
          {errors['email'] && <div className="field-error">{errors['email']}</div>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className={errors['password'] ? 'input-error' : ''}
            autoComplete="current-password"
          />
          {errors['password'] && <div className="field-error">{errors['password']}</div>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '15px',
            background: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.05rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <>
              <span className="loading-spinner" style={{ marginRight: '10px' }}></span>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <div style={{
        marginTop: '25px',
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #4a5568'
      }}>
        <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0 0 10px 0' }}>
          ¿No tienes una cuenta?
        </p>
        <button
          type="button"
          onClick={onCambiarARegistro}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginBottom: '20px'
          }}
        >
          Registro no disponible (usar usuarios de prueba)
        </button>

        <div style={{
          background: '#1a202c',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#cbd5e0',
          border: '1px solid #4a5568'
        }}>
          <strong>Usuarios de prueba (Backend):</strong><br/>
          <strong>Médico:</strong> med@mail.com<br/>
          <strong>Enfermera:</strong> enf@mail.com<br/>
          <strong>Contraseña:</strong> password
        </div>
      </div>
    </div>
  );
}
