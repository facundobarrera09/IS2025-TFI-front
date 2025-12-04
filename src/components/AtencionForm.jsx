import { useState } from "react";
import { CrearAtencionSchema } from "../models/dto/crear-atencion.schema";

/**
 * @param {object} props
 * @param {any} props.ingreso - Ingreso a atender
 * @param {Function} props.onSubmit - Función para enviar la atención
 * @param {Function} props.onCancel - Función para cancelar
 */
export default function AtencionForm({ ingreso, onSubmit, onCancel }) {
  const [informe, setInforme] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Médico hardcodeado (en producción vendría de autenticación)
  const medicoActual = {
    uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    nombre: "Juan",
    apellido: "Pérez",
    matricula: "MP12345"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      ingresoId: ingreso.id || "temp-id", // En producción vendría del backend
      informe: informe,
      medico: {
        uuid: medicoActual.uuid
      }
    };

    const result = CrearAtencionSchema.safeParse(formData);

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
      const success = await onSubmit(formData);
      if (success) {
        setInforme("");
      }
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
      padding: '30px',
      marginTop: '20px',
      boxShadow: '0 10px 40px rgba(59, 130, 246, 0.15)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '2.5rem' }}>📝</div>
          <div>
            <h2 style={{ 
              color: '#1e40af', 
              fontSize: '1.6rem', 
              margin: '0 0 5px 0',
              fontWeight: '700'
            }}>
              Registrar Atención Médica
            </h2>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              Complete el informe de atención del paciente
            </p>
          </div>
        </div>
      </div>

      {/* Info del médico */}
      <div style={{
        background: '#f0f9ff',
        padding: '15px 20px',
        borderRadius: '12px',
        marginBottom: '25px',
        border: '1px solid #bfdbfe'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>👨‍⚕️</span>
          <div>
            <strong style={{ color: '#1e40af', fontSize: '0.85rem' }}>Médico:</strong>
            <div style={{ color: '#1f2937', fontWeight: '600' }}>
              Dr. {medicoActual.nombre} {medicoActual.apellido}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
              Matrícula: {medicoActual.matricula}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-modern">
        <div>
          <label style={{
            display: 'block',
            color: '#374151',
            fontWeight: '600',
            marginBottom: '10px',
            fontSize: '1rem'
          }}>
            Informe de Atención (*)
          </label>
          <textarea
            value={informe}
            onChange={(e) => {
              setInforme(e.target.value);
              if (errors['informe']) {
                setErrors(prev => {
                  const updated = { ...prev };
                  delete updated['informe'];
                  return updated;
                });
              }
            }}
            placeholder="Describa detalladamente la atención brindada al paciente, diagnóstico, tratamiento indicado, medicación prescrita, etc."
            className={errors['informe'] ? 'input-error' : ''}
            style={{
              minHeight: '200px',
              resize: 'vertical',
              width: '100%'
            }}
          />
          {errors['informe'] && <div className="field-error">{errors['informe']}</div>}
          
          <div style={{
            marginTop: '8px',
            fontSize: '0.85rem',
            color: '#6b7280'
          }}>
            Mínimo 10 caracteres. Caracteres actuales: {informe.length}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          marginTop: '25px'
        }}>
          <button 
            type="submit" 
            className="btn-modern"
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? (
              <>
                <span className="loading-spinner" style={{ marginRight: '10px' }}></span>
                Guardando...
              </>
            ) : (
              <>
                ✅ Finalizar y Guardar Atención
              </>
            )}
          </button>
          
          <button 
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '15px 24px',
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#ffffff',
              minWidth: '150px'
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '10px',
        fontSize: '0.85rem',
        color: '#dc2626',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      }}>
        <strong>⚠️ Importante:</strong> Al finalizar la atención, el estado del ingreso cambiará a FINALIZADO y el paciente saldrá del sistema de urgencias.
      </div>
    </div>
  );
}
