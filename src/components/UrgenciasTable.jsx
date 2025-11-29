/**
 * @param {object} props
 * @param {import('../models/ingreso.schema').default[]} props.data 
 */
export default function UrgenciasTable({ data }) {
  if (data.length === 0)
    return <p className="empty">No hay pacientes registrados.</p>;

  return (
    <table className="table-modern">
      <thead>
        <tr>
          <th>CUIT</th>
          <th>Informe</th>
          <th>Nivel</th>
          <th>Temp</th>
          <th>FC</th>
          <th>FR</th>
          <th>TA</th>
          <th>Enfermera</th>
        </tr>
      </thead>

      <tbody>
        {data.map((ingreso, index) => (
          <tr key={index}>
            <td>{ingreso.paciente.cuit}</td>
            <td>
              <div className="shorten-text">
                {ingreso.informe}
              </div>
            </td>
            <td>{ingreso.nivelEmergencia.nombre}</td>
            <td>{ingreso.temperatura}</td>
            <td>{ingreso.frecuenciaCardiaca}</td>
            <td>{ingreso.frecuenciaRespiratoria}</td>
            <td>{ingreso.tensionArterial.frecuenciaSistolica}/{ingreso.tensionArterial.frecuenciaDiastolica}</td>
            <td>{ingreso.enfermera.apellido}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
