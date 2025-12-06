/**
 * @param {object} props
 * @param {any[]} props.data 
 */
export default function PacientesTable({ data }) {
  if (data.length === 0)
    return <p className="empty">No hay pacientes registrados.</p>;

  return (
    <>
      <div style={{ marginBottom: '15px', color: '#718096', fontSize: '0.9rem' }}>
        Total de pacientes: <strong>{data.length}</strong>
      </div>
      
      <table className="table-modern">
        <thead>
          <tr>
            <th>CUIT</th>
            <th>Apellido y Nombre</th>
            <th>Domicilio</th>
            <th>Obra Social</th>
            <th>N° Afiliado</th>
          </tr>
        </thead>

        <tbody>
          {data.map((paciente, index) => (
            <tr key={index}>
              <td style={{ fontWeight: '600' }}>{paciente.cuit}</td>
              <td>{paciente.apellido}, {paciente.nombre}</td>
              <td>
                {paciente.domicilio.calle} {paciente.domicilio.numero}, {paciente.domicilio.localidad}
              </td>
              <td>
                {paciente.afiliado ? (
                  <span style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {paciente.afiliado.obraSocial.nombre}
                  </span>
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Sin obra social</span>
                )}
              </td>
              <td>
                {paciente.afiliado ? paciente.afiliado.numeroAfiliado : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
