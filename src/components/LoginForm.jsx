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
      background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
      border: '2px solid #3b82f6',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '450px',
      margin: '0 auto',
      boxShadow: '0 20px 60px rgba(59, 130, 246, 0.2)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🔐</div>
        <h2 style={{ 
          color: '#1e40af', 
          fontSize: '2rem', 
          margin: '0 0 10px 0',
          fontWeight: '700'
        }}>
          Iniciar Sesión
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
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
          className="btn-modern"
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <span className="loading-spinner" style={{ marginRight: '10px' }}></span>
              Iniciando sesión...
            </>
          ) : (
            '🔓 Iniciar Sesión'
          )}
        </button>
      </form>

      <div style={{
        marginTop: '25px',
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          background: '#f0f9ff',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '0.85rem',
          color: '#1e40af',
          border: '1px solid #bfdbfe'
        }}>
          <strong>👨‍⚕️ Médico:</strong> medico@hospital.com<br/>
          <strong>👩‍⚕️ Enfermera:</strong> enfermera@hospital.com<br/>
          <strong>🔑 Contraseña:</strong> password123
        </div>
      </div>
    </div>
  );
}
