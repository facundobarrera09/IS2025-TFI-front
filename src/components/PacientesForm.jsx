import { useState, useEffect } from "react";
import { CrearPacienteSchema } from "../models/dto/crear-paciente.schema";
import { obrasSocialesService } from "../backend/connections/obrasSocialesService";

export default function PacientesForm({ onSubmit, cuitPredefinido }) {
  const initialForm = {
    cuit: cuitPredefinido || "",
    apellido: "",
    nombre: "",
    domicilio: {
      calle: "",
      numero: "",
      localidad: ""
    },
    afiliado: undefined
  };

  const [form, setForm] = useState(initialForm);

  // Actualizar el CUIT cuando cambie el prop
  useEffect(() => {
    if (cuitPredefinido) {
      setForm(prev => ({
        ...prev,
        cuit: cuitPredefinido
      }));
    }
  }, [cuitPredefinido]);
  const [errors, setErrors] = useState({});
  const [tieneObraSocial, setTieneObraSocial] = useState(false);
  const [obrasSociales, setObrasSociales] = useState([]);

  // Función para formatear CUIT automáticamente
  const formatCUIT = (value) => {
    // Remover todo excepto números
    const numbers = value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos
    const limited = numbers.slice(0, 11);
    
    // Aplicar formato XX-XXXXXXXX-X
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 10) {
      return `${limited.slice(0, 2)}-${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}-${limited.slice(2, 10)}-${limited.slice(10)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear CUIT automáticamente
    let processedValue = value;
    if (name === 'cuit') {
      processedValue = formatCUIT(value);
    }
    
    // Limpiar errores del campo editado
    setErrors(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (key === name || key.startsWith(name + '.')) {
          delete updated[key];
        }
      });
      return updated;
    });

    // Actualizar el formulario según el campo
    if (name.startsWith('domicilio.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        domicilio: {
          ...prev.domicilio,
          [field]: field === 'numero' ? (value ? parseInt(value) : "") : value
        }
      }));
    } else if (name.startsWith('afiliado.')) {
      const parts = name.split('.');
      
      if (name === 'afiliado.obraSocial.nombre') {
        // Actualizar obra social
        setForm(prev => ({
          ...prev,
          afiliado: {
            ...prev.afiliado,
            obraSocial: {
              nombre: value
            },
            numeroAfiliado: prev.afiliado?.numeroAfiliado || ""
          }
        }));
      } else if (name === 'afiliado.numeroAfiliado') {
        // Actualizar número de afiliado
        setForm(prev => ({
          ...prev,
          afiliado: {
            ...prev.afiliado,
            obraSocial: prev.afiliado?.obraSocial || { nombre: "" },
            numeroAfiliado: value
          }
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: processedValue }));
    }
  };

  useEffect(() => {
    // Obtener obras sociales desde la API
    const fetchObrasSociales = async () => {
      const response = await obrasSocialesService.getObrasSociales();
      
      if (response.success) {
        setObrasSociales(response.result.obrasSociales);
      } else {
        console.error("Error al obtener obras sociales:", response.error);
        setObrasSociales([]);
      }
    };

    fetchObrasSociales();
  }, []);

  const handleObraSocialToggle = (e) => {
    const checked = e.target.checked;
    setTieneObraSocial(checked);
    
    if (!checked) {
      setForm(prev => ({ ...prev, afiliado: undefined }));
      // Limpiar errores de obra social
      setErrors(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (key.startsWith('afiliado.')) {
            delete updated[key];
          }
        });
        return updated;
      });
    } else {
      setForm(prev => ({
        ...prev,
        afiliado: {
          obraSocial: { nombre: "" },
          numeroAfiliado: ""
        }
      }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const result = CrearPacienteSchema.safeParse(form);

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

    try {
      const success = await onSubmit(form);
      if (success) {
        e.target.reset();
        setForm(initialForm);
        setTieneObraSocial(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={submit} className="form-modern" autoComplete="off">
      <fieldset className="form-modern">
        <legend>Datos Personales</legend>
        
        <input 
          name="cuit" 
          type="text" 
          placeholder="CUIL/CUIT (*) - Ej: 20-12345678-9" 
          value={form.cuit}
          onChange={handleChange}
          className={errors['cuit'] ? 'input-error' : ''}
          maxLength={13}
          readOnly={!!cuitPredefinido}
          style={cuitPredefinido ? { 
            backgroundColor: '#4a5568', 
            color: '#cbd5e0',
            cursor: 'not-allowed'
          } : {}}
        />
        {errors['cuit'] && <div className="field-error">{errors['cuit']}</div>}

        <div className="grid-2">
          <div>
            <input 
              name="apellido" 
              type="text" 
              placeholder="Apellido (*)" 
              value={form.apellido}
              onChange={handleChange}
              className={errors['apellido'] ? 'input-error' : ''}
            />
            {errors['apellido'] && <div className="field-error">{errors['apellido']}</div>}
          </div>
          <div>
            <input 
              name="nombre" 
              type="text" 
              placeholder="Nombre (*)" 
              value={form.nombre}
              onChange={handleChange}
              className={errors['nombre'] ? 'input-error' : ''}
            />
            {errors['nombre'] && <div className="field-error">{errors['nombre']}</div>}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-modern">
        <legend>Domicilio</legend>
        <div className="grid-3">
          <div>
            <input 
              name="domicilio.calle" 
              type="text" 
              placeholder="Calle (*)" 
              value={form.domicilio.calle}
              onChange={handleChange}
              className={errors['domicilio.calle'] ? 'input-error' : ''}
            />
            {errors['domicilio.calle'] && <div className="field-error">{errors['domicilio.calle']}</div>}
          </div>
          <div>
            <input 
              name="domicilio.numero" 
              type="number" 
              placeholder="Número (*)" 
              value={form.domicilio.numero}
              onChange={handleChange}
              className={errors['domicilio.numero'] ? 'input-error' : ''}
            />
            {errors['domicilio.numero'] && <div className="field-error">{errors['domicilio.numero']}</div>}
          </div>
          <div>
            <input 
              name="domicilio.localidad" 
              type="text" 
              placeholder="Localidad (*)" 
              value={form.domicilio.localidad}
              onChange={handleChange}
              className={errors['domicilio.localidad'] ? 'input-error' : ''}
            />
            {errors['domicilio.localidad'] && <div className="field-error">{errors['domicilio.localidad']}</div>}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-modern">
        <legend>Obra Social (Opcional)</legend>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#cbd5e0' }}>
            <input 
              type="checkbox" 
              checked={tieneObraSocial}
              onChange={handleObraSocialToggle}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: '500' }}>El paciente tiene obra social</span>
          </label>
        </div>

        {tieneObraSocial && (
          <div className="grid-2">
            <div>
              <select 
                name="afiliado.obraSocial.nombre" 
                value={form.afiliado?.obraSocial?.nombre || ""}
                onChange={handleChange}
                className={errors['afiliado.obraSocial.nombre'] ? 'input-error' : ''}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#2d3748',
                  color: '#e2e8f0',
                  border: '1px solid #4a5568',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">Seleccione una Obra Social (*)</option>
                {obrasSociales.map((obra, index) => (
                  <option key={index} value={obra}>
                    {obra}
                  </option>
                ))}
              </select>
              {errors['afiliado.obraSocial.nombre'] && <div className="field-error">{errors['afiliado.obraSocial.nombre']}</div>}
            </div>
            <div>
              <input 
                name="afiliado.numeroAfiliado" 
                type="text" 
                placeholder="Número de Afiliado (*)" 
                value={form.afiliado?.numeroAfiliado || ""}
                onChange={handleChange}
                className={errors['afiliado.numeroAfiliado'] ? 'input-error' : ''}
              />
              {errors['afiliado.numeroAfiliado'] && <div className="field-error">{errors['afiliado.numeroAfiliado']}</div>}
            </div>
          </div>
        )}
      </fieldset>

      <button 
        type="submit" 
        style={{
          width: '100%',
          padding: '15px',
          background: '#10b981',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.05rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        Registrar Paciente
      </button>
    </form>
  );
}
