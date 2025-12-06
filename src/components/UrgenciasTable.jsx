/**
 * @param {object} props
 * @param {import('../models/ingreso.schema').default[]} props.data 
 */
export default function UrgenciasTable({ data }) {
  if (data.length === 0)
    return <p className="empty">No hay pacientes registrados.</p>;

  // Definir prioridades de los niveles de emergencia (menor número = mayor prioridad)
  const prioridades = {
    'Critica': 1,
    'Emergencia': 2,
    'Urgencia': 3,
    'Urgencia Menor': 4,
    'Sin Urgencia': 5
  };

  // Ordenar los datos por nivel de emergencia (mayor prioridad primero)
  // Si tienen la misma prioridad, ordenar por fecha de ingreso (primero el más antiguo)
  const datosOrdenados = [...data].sort((a, b) => {
    const prioridadA = prioridades[a.nivelEmergencia] || 999;
    const prioridadB = prioridades[b.nivelEmergencia] || 999;
    
    // Comparar por prioridad primero
    if (prioridadA !== prioridadB) {
      return prioridadA - prioridadB;
    }
    
    // Si tienen la misma prioridad, ordenar por fecha de ingreso (más antiguo primero)
    const fechaA = new Date(a.fechaIngreso).getTime();
    const fechaB = new Date(b.fechaIngreso).getTime();
    return fechaA - fechaB;
  });

  const getNivelBadge = (nivel) => {
    const badges = {
      'Critica': { color: '#ffffff', bg: '#dc2626' },
      'Emergencia': { color: '#ffffff', bg: '#ea580c' },
      'Urgencia': { color: '#ffffff', bg: '#f59e0b' },
      'Urgencia Menor': { color: '#ffffff', bg: '#10b981' },
      'Sin Urgencia': { color: '#ffffff', bg: '#6b7280' }
    };

    const config = badges[nivel] || badges['Sin Urgencia'];

    return (
      <span className="nivel-badge" style={{
        background: config.bg,
        color: config.color,
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
      }}>
        {nivel}
      </span>
    );
  };

  return (
    <>
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#718096', fontSize: '0.9rem' }}>
          Total de ingresos: <strong>{data.length}</strong>
        </div>
        <div style={{ 
          color: '#10b981', 
          fontSize: '0.85rem',
          background: '#1a2e1a',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid #10b981'
        }}>
          ↓ Ordenado por prioridad y hora de ingreso
        </div>
      </div>
      
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
          {datosOrdenados.map((ingreso, index) => (
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
