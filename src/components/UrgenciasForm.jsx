import { useEffect, useState } from "react";
import { CrearIngreso } from "../models/dto/crear-ingreso.schema";
import * as z from "zod"

export default function UrgenciasForm({ onSubmit }) {
  /** @type {[import("../models/dto/crear-ingreso.schema").CrearIngresoDTO, any]} */
  const initialForm = {
    paciente: {
      cuit: "",
      apellido: undefined,
      nombre: undefined,
      domicilio: undefined
    },
    enfermera: {
      uuid: "4c300fec-ed8f-4365-ac77-3d5b70a4e990"
    },
    informe: "",
    nivel: "",
    temperatura: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    tensionArterial: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const niveles = [
    "Critica - Rojo",
    "Emergencia - Naranja",
    "Urgencia - Amarillo",
    "Urgencia Menor - Verde",
    "Sin Urgencia - Azul",
  ];

  const handleChange = (e) => {
    // limpiar errores del campo editado y sus sub-campos
    const fieldName = e.target.name;
    setErrors(prev => {
      const updated = { ...prev };
      // Elimina errores que comiencen con el nombre del campo
      Object.keys(updated).forEach(key => {
        if (key === fieldName || key.startsWith(fieldName + '.')) {
          delete updated[key];
        }
      });
      return updated;
    });
    setForm({ ...form, [fieldName]: e.target.value });
  }

  const submit = async (e) => {
    e.preventDefault();

    const result = CrearIngreso.safeParse(form)

    if (!result.success) {
      // mapear errores a un objeto { 'ruta': 'mensaje' }
      const mapped = {};
      result.error.issues.forEach((err) => {
        const key = (err.path && err.path.length) ? err.path.join('.') : '_form';
        mapped[key] = err.message || 'Valor inválido';
      });

      setErrors(mapped);

      return
    }
    // validación OK -> limpiar errores
    setErrors({});

    // Espera el resultado de onSubmit para resetear solo si fue exitoso
    try {
      const result = await onSubmit(form);
      if (result) {
        // reset del formulario DOM y del estado interno
        e.target.reset();
        setForm(initialForm);
      }
    }
    catch (err) {
      // si onSubmit lanza, no reseteamos
      console.error(err);
    }
  };

  return (
    <form onSubmit={submit} className="form-modern" autoComplete="off">
      <fieldset name="paciente" className="form-modern" onChange={() => {
        const cuit = document.querySelector('input[name="cuit"]').value;
        const apellido = document.querySelector('input[name="apellido"]').value || undefined;
        const nombre = document.querySelector('input[name="nombre"]').value || undefined;
        const calle = document.querySelector('input[name="calle"]').value || undefined;
        const numero = document.querySelector('input[name="numero"]').value || undefined;
        const localidad = document.querySelector('input[name="localidad"]').value || undefined;

        setForm({ ...form, paciente: {
          cuit,
          apellido,
          nombre,
          domicilio: (calle || numero || localidad) ? {
            calle,
            numero,
            localidad
          } : undefined
        }})
      }}>
        <legend>Datos del paciente</legend>
        
        <input 
          name="cuit" 
          type="text" 
          placeholder="CUIT/CUIL (*)" 
          className={errors['paciente.cuit'] ? 'input-error' : ''}
          onChange={handleChange}
        />
        {errors['paciente.cuit'] && <div className="field-error">{errors['paciente.cuit']}</div>}

        <div className="grid-2">
          <div>
            <input name="apellido" type="text" placeholder="Apellido" className={errors['paciente.apellido'] ? 'input-error' : ''} onChange={handleChange} />
            {errors['paciente.apellido'] && <div className="field-error">{errors['paciente.apellido']}</div>}
          </div>
          <div>
            <input name="nombre" type="text" placeholder="Nombre" className={errors['paciente.nombre'] ? 'input-error' : ''} onChange={handleChange} />
            {errors['paciente.nombre'] && <div className="field-error">{errors['paciente.nombre']}</div>}
          </div>
        </div>

        <fieldset name="domicilio" className="form-modern">
          <legend>Domicilio</legend>
          <div className="grid-3">
            <div>
              <input name="calle" type="text" placeholder="Calle" className={errors['paciente.domicilio.calle'] ? 'input-error' : ''} onChange={handleChange} />
              {errors['paciente.domicilio.calle'] && <div className="field-error">{errors['paciente.domicilio.calle']}</div>}
            </div>
            <div>
              <input name="numero" type="text" placeholder="Número" className={errors['paciente.domicilio.numero'] ? 'input-error' : ''} onChange={handleChange} />
              {errors['paciente.domicilio.numero'] && <div className="field-error">{errors['paciente.domicilio.numero']}</div>}
            </div>
            <div>
              <input name="localidad" type="text" placeholder="Localidad" className={errors['paciente.domicilio.localidad'] ? 'input-error' : ''} onChange={handleChange} />
              {errors['paciente.domicilio.localidad'] && <div className="field-error">{errors['paciente.domicilio.localidad']}</div>}
            </div>
          </div>
        </fieldset>
      </fieldset>

      <fieldset className="form-modern">
        <legend>Datos del ingreso</legend>

        <textarea name="informe" placeholder="Informe" onChange={handleChange} className={errors['informe'] ? 'input-error' : ''} />
        {errors['informe'] && <div className="field-error">{errors['informe']}</div>}
        
        <select name="nivel" onChange={handleChange} className={errors['nivel'] ? 'input-error' : ''}>
          <option value="">Nivel de emergencia</option>
          {niveles.map((n) => (
            <option key={n} value={n.split(' - ').at(0)}>{n}</option>
          ))}
        </select>
        {errors['nivel'] && <div className="field-error">{errors['nivel']}</div>}

        <div className="grid-2">
          <div>
            <input name="temperatura" type="number" step=".01" placeholder="Temperatura °C" onChange={handleChange} className={errors['temperatura'] ? 'input-error' : ''} />
            {errors['temperatura'] && <div className="field-error">{errors['temperatura']}</div>}
          </div>
          <div>
            <input name="frecuenciaCardiaca" type="number" step=".01" placeholder="Frecuencia cardíaca" onChange={handleChange} className={errors['frecuenciaCardiaca'] ? 'input-error' : ''} />
            {errors['frecuenciaCardiaca'] && <div className="field-error">{errors['frecuenciaCardiaca']}</div>}
          </div>
        </div>

        <input name="frecuenciaRespiratoria" type="number" step=".01" placeholder="Respiración" onChange={handleChange} className={errors['frecuenciaRespiratoria'] ? 'input-error' : ''} />
        {errors['frecuenciaRespiratoria'] && <div className="field-error">{errors['frecuenciaRespiratoria']}</div>}

        <div className="grid-2" onChange={() => {
          const sistolica = document.querySelector('input[name="sistolica"]').value;
          const diastolica = document.querySelector('input[name="diastolica"]').value;
          setForm({ ...form, tensionArterial: `${sistolica}/${diastolica}` });
        }}>
          <div>
            <input name="sistolica" type="number" placeholder="Sistólica" className={errors['tensionArterial'] ? 'input-error' : ''} />
          </div>
          <div>
            <input name="diastolica" type="number" placeholder="Diastólica" className={errors['tensionArterial'] ? 'input-error' : ''} />
          </div>
        </div>
        {errors['tensionArterial'] && <div className="field-error">{errors['tensionArterial']}</div>}
      </fieldset>

      <button type="submit" className="btn-modern">Registrar ingreso</button>
    </form>
  );
}
