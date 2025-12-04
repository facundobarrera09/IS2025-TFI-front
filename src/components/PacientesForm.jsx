import { useState } from "react";
import { CrearPacienteSchema } from "../models/dto/crear-paciente.schema";

export default function PacientesForm({ onSubmit }) {
  const initialForm = {
    cuit: "",
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
  const [errors, setErrors] = useState({});
  const [tieneObraSocial, setTieneObraSocial] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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
      const field = name.split('.')[1];
      if (field === 'obraSocial.nombre') {
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
      } else {
        setForm(prev => ({
          ...prev,
          afiliado: {
            ...prev.afiliado,
            obraSocial: prev.afiliado?.obraSocial || { nombre: "" },
            [field]: value
          }
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

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
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#374151' }}>
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
              <input 
                name="afiliado.obraSocial.nombre" 
                type="text" 
                placeholder="Nombre de la Obra Social (*)" 
                value={form.afiliado?.obraSocial?.nombre || ""}
                onChange={handleChange}
                className={errors['afiliado.obraSocial.nombre'] ? 'input-error' : ''}
              />
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

      <button type="submit" className="btn-modern">
        👤 Registrar Paciente
      </button>
    </form>
  );
}
