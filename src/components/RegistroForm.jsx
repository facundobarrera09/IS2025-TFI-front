import { useState } from "react";
import { RegistroUsuarioSchema } from "../models/dto/registro-usuario.schema";

export default function RegistroForm({ onSubmit, onCambiarALogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    autoridad: ""
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

    const result = RegistroUsuarioSchema.safeParse(form);

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
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '450px',
      margin: '0 auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#cbd5e0', 
          fontSize: '2rem', 
          margin: '0 0 10px 0',
          fontWeight: '700'
        }}>
          Crear Cuenta
        </h2>
        <p style={{ color: '#718096', margin: 0 }}>
          Complete el formulario para registrarse
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-modern">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email (*)"
            value={form.email}
            onChange={handleChange}
            className={errors['email'] ? 'input-error' : ''}
            autoComplete="email"
          />
          {errors['email'] && <div className="field-error">{errors['email']}</div>}
        </div>

        <div>
          <select
            name="autoridad"
            value={form.autoridad}
            onChange={handleChange}
            className={errors['autoridad'] ? 'input-error' : ''}
          >
            <option value="">Seleccione su rol (*)</option>
            <option value="MEDICO">Médico</option>
            <option value="ENFERMERA">Enfermera</option>
          </select>
          {errors['autoridad'] && <div className="field-error">{errors['autoridad']}</div>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña (*)"
            value={form.password}
            onChange={handleChange}
            className={errors['password'] ? 'input-error' : ''}
            autoComplete="new-password"
          />
          {errors['password'] && <div className="field-error">{errors['password']}</div>}
          <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '5px' }}>
            Mínimo 8 caracteres
          </div>
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña (*)"
            value={form.confirmPassword}
            onChange={handleChange}
            className={errors['confirmPassword'] ? 'input-error' : ''}
            autoComplete="new-password"
          />
          {errors['confirmPassword'] && <div className="field-error">{errors['confirmPassword']}</div>}
        </div>

        <div style={{
          background: '#1a202c',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#cbd5e0',
          border: '1px solid #4a5568'
        }}>
          <strong>Seguridad:</strong> Su contraseña será hasheada con algoritmos seguros (Argon2id/Bcrypt)
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '15px',
            background: '#10b981',
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
              Registrando...
            </>
          ) : (
            'Crear Cuenta'
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
          ¿Ya tienes una cuenta?
        </p>
        <button
          onClick={onCambiarALogin}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#3b82f6',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Iniciar sesión aquí
        </button>
      </div>
    </div>
  );
}
