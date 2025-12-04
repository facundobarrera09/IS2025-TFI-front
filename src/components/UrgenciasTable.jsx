/**
 * @param {object} props
 * @param {import('../models/ingreso.schema').default[]} props.data 
 */
export default function UrgenciasTable({ data }) {
  if (data.length === 0)
    return <p className="empty">No hay pacientes registrados.</p>;

  const getNivelBadge = (nivel) => {
    const badges = {
      'Critica': { color: '#dc2626', bg: '#fee2e2', emoji: '🔴' },
      'Emergencia': { color: '#ea580c', bg: '#ffedd5', emoji: '🟠' },
      'Urgencia': { color: '#ca8a04', bg: '#fef9c3', emoji: '🟡' },
      'Urgencia Menor': { color: '#16a34a', bg: '#dcfce7', emoji: '🟢' },
      'Sin Urgencia': { color: '#2563eb', bg: '#dbeafe', emoji: '🔵' }
    };

    const config = badges[nivel] || badges['Sin Urgencia'];

    return (
      <span className="nivel-badge" style={{
        background: config.bg,
        color: config.color,
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}>
        {config.emoji} {nivel}
      </span>
    );
  };

  return (
    <>
      <div style={{ marginBottom: '15px', color: '#6b7280', fontSize: '0.9rem' }}>
        📊 Total de ingresos: <strong>{data.length}</strong>
      </div>
      
      <table className="table-modern">
        <thead>
          <tr>
            <th>CUIT</th>
            <th>Informe</th>
            <th>Nivel</th>
            <th>🌡️ Temp</th>
            <th>❤️ FC</th>
            <th>🫁 FR</th>
            <th>🩺 TA</th>
            <th>Enfermera</th>
          </tr>
        </thead>

        <tbody>
          {data.map((ingreso, index) => (
            <tr key={index}>
              <td style={{ fontWeight: '600' }}>{ingreso.paciente.cuit}</td>
              <td>
                <div className="shorten-text">
                  {ingreso.informe}
                </div>
              </td>
              <td>{getNivelBadge(ingreso.nivelEmergencia)}</td>
              <td>{ingreso.temperatura}°C</td>
              <td>{ingreso.frecuenciaCardiaca}</td>
              <td>{ingreso.frecuenciaRespiratoria}</td>
              <td>{ingreso.tensionArterial.frecuenciaSistolica}/{ingreso.tensionArterial.frecuenciaDiastolica}</td>
              <td>{ingreso.enfermera.apellido}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
