import { useEffect, useState } from "react";

export default function UrgenciasForm({ onSubmit }) {
  /** @type {[import("../models/dto/crear-ingreso.schema").CrearIngresoDTO, any]} */
  const initialForm = {
    informe: "",
    nivel: "",
    temperatura: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    tensionArterial: "",
    enfermera: {
      uuid: "4c300fec-ed8f-4365-ac77-3d5b70a4e990"
    },
  };

  const [form, setForm] = useState(initialForm);

  const niveles = [
    "Critica - Rojo",
    "Emergencia - Naranja",
    "Urgencia - Amarillo",
    "Urgencia Menor - Verde",
    "Sin Urgencia - Azul",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const submit = async (e) => {
    e.preventDefault();
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
        const apellido = document.querySelector('input[name="apellido"]').value;
        const nombre = document.querySelector('input[name="nombre"]').value;
        const calle = document.querySelector('input[name="calle"]').value;
        const numero = document.querySelector('input[name="numero"]').value;
        const localidad = document.querySelector('input[name="localidad"]').value;
      
        setForm({ ...form, paciente: {
          cuit,
          apellido,
          nombre,
          domicilio: {
            calle,
            numero,
            localidad
          }
        }})
      }}>
        <legend>Datos del paciente</legend>
        
        <input name="cuit" type="text" placeholder="CUIT/CUIL (*)" onChange={handleChange} required />

        <div className="grid-2">
          <input name="apellido" type="text" placeholder="Apellido" onChange={handleChange} />
          <input name="nombre" type="text" placeholder="Nombre" onChange={handleChange} />
        </div>

        <fieldset name="domicilio" className="form-modern">
          <legend>Domicilio</legend>
          <div className="grid-3">
            <input name="calle" type="text" placeholder="Calle" onChange={handleChange} />
            <input name="numero" type="text" placeholder="Número" onChange={handleChange} />
            <input name="localidad" type="text" placeholder="Localidad" onChange={handleChange} />
          </div>
        </fieldset>
      </fieldset>

      <fieldset className="form-modern">
        <legend>Datos del ingreso</legend>

        <textarea name="informe" placeholder="Informe" onChange={handleChange} required />
        
        <select name="nivel" onChange={handleChange} required>
          <option value="">Nivel de emergencia</option>
          {niveles.map((n) => (
            <option key={n} value={n.split(' - ').at(0)}>{n}</option>
          ))}
        </select>

        <div className="grid-2">
          <input name="temperatura" type="number" step=".01" placeholder="Temperatura °C" onChange={handleChange} />
          <input name="frecuenciaCardiaca" type="number" step=".01" placeholder="Frecuencia cardíaca" onChange={handleChange} required />
        </div>

        <input name="frecuenciaRespiratoria" type="number" step=".01" placeholder="Respiración" onChange={handleChange} required />

        <div className="grid-2" onChange={() => {
          const sistolica = document.querySelector('input[name="sistolica"]').value;
          const diastolica = document.querySelector('input[name="diastolica"]').value;
          setForm({ ...form, tensionArterial: `${sistolica}/${diastolica}` });
        }}>
          <input name="sistolica" type="number" placeholder="Sistólica" required />
          <input name="diastolica" type="number" placeholder="Diastólica" required />
        </div>
      </fieldset>

      <button type="submit" className="btn-modern">Registrar ingreso</button>
    </form>
  );
}
