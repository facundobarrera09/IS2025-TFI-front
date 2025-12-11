import { useState, useEffect } from "react";
import { CrearIngreso } from "../models/dto/crear-ingreso.schema";
import { pacientesService } from "../backend/connections/pacientesService";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import PacientesForm from "./PacientesForm";

export default function UrgenciasForm({ onSubmit }) {
  const { usuario } = useAuth();
  
  // UUID de la enfermera del backend - por ahora hardcodeado ya que el backend no lo proporciona en el login
  const getEnfermeraUuid = () => {
    if (usuario?.autoridad === "ENFERMERO") {
      // Este es el UUID de la enfermera en el backend (enf@mail.com)
      return "4c300fec-ed8f-4365-ac77-3d5b70a4e990";
    }
    return "4c300fec-ed8f-4365-ac77-3d5b70a4e990"; // Fallback
  };

  /** @type {[import("../models/dto/crear-ingreso.schema").CrearIngresoDTO, any]} */
  const initialForm = {
    paciente: {
      cuit: "",
      apellido: undefined,
      nombre: undefined,
      domicilio: {
        calle: "",
        numero: "",
        localidad: ""
      },
      afiliado: undefined
    },
    enfermera: {
      uuid: getEnfermeraUuid()
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
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);

  const niveles = [
    "Critica - Rojo",
    "Emergencia - Naranja", 
    "Urgencia - Amarillo",
    "Urgencia Menor - Verde",
    "Sin Urgencia - Azul",
  ];

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

  // Buscar paciente por CUIT
  const buscarPaciente = async (cuit) => {
    // Remover guiones para la validación de longitud
    const cuitSinGuiones = cuit.replace(/-/g, '');
    if (!cuit || cuitSinGuiones.length < 11) {
      setPacienteEncontrado(null);
      return;
    }

    setBuscandoPaciente(true);
    const response = await pacientesService.getPacienteByCuit(cuit);
    setBuscandoPaciente(false);

    // Como el backend no tiene endpoint de pacientes, siempre será false
    // Permitir que el usuario complete manualmente los datos
    setPacienteEncontrado(null);
    setForm(prev => ({
      ...prev,
      paciente: {
        cuit,
        apellido: undefined,
        nombre: undefined,
        domicilio: {
          calle: "",
          numero: "",
          localidad: ""
        },
        afiliado: undefined
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // limpiar errores del campo editado y sus sub-campos
    setErrors(prev => {
      const updated = { ...prev };
      // Elimina errores que comiencen con el nombre del campo
      Object.keys(updated).forEach(key => {
        if (key === name || key.startsWith(name + '.')) {
          delete updated[key];
        }
      });
      return updated;
    });

    // Manejar campos anidados
    if (name === 'cuit') {
      setForm(prev => ({
        ...prev,
        paciente: {
          ...prev.paciente,
          cuit: value
        }
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Estado separado para sistólica y diastólica
  const [sistolica, setSistolica] = useState("");
  const [diastolica, setDiastolica] = useState("");

  const handleTensionChange = (tipo, valor) => {
    if (tipo === 'sistolica') {
      setSistolica(valor);
      setForm(prev => ({ ...prev, tensionArterial: `${valor}/${diastolica}` }));
    } else {
      setDiastolica(valor);
      setForm(prev => ({ ...prev, tensionArterial: `${sistolica}/${valor}` }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    console.log('Formulario enviado:', form);
    console.log('Formulario JSON:', JSON.stringify(form, null, 2));

    const result = CrearIngreso.safeParse(form);

    if (!result.success) {
      console.log('Errores de validación:', result.error.issues);
      
      // mapear errores a un objeto { 'ruta': 'mensaje' }
      const mapped = {};
      result.error.issues.forEach((err) => {
        const key = (err.path && err.path.length) ? err.path.join('.') : '_form';
        mapped[key] = err.message || 'Valor inválido';
        console.log(`Error en campo "${key}": ${err.message}`, 'Valor recibido:', err.received);
      });

      console.log('Errores mapeados:', mapped);
      console.log('Todos los errores:', JSON.stringify(mapped, null, 2));
      setErrors(mapped);
      return;
    }
    
    console.log('Validación exitosa, enviando datos...');
    
    // validación OK -> limpiar errores
    setErrors({});

    // Espera el resultado de onSubmit para resetear solo si fue exitoso
    try {
      const result = await onSubmit(form);
      console.log('Resultado de onSubmit:', result);
      
      if (result) {
        // reset del formulario DOM y del estado interno
        e.target.reset();
        setForm(initialForm);
        setPacienteEncontrado(null);
        setSistolica("");
        setDiastolica("");
      }
    }
    catch (err) {
      // si onSubmit lanza, no reseteamos
      console.error('Error en onSubmit:', err);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-lg border-0" style={{ background: '#2d3748', border: '2px solid #4a5568' }}>
            <Card.Header style={{ background: '#1a202c', borderBottom: '2px solid #4a5568' }} className="text-center py-4">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <h2 className="mb-0" style={{ color: '#cbd5e0' }}>Admisión de Emergencias</h2>
              </div>
              <p className="mb-0" style={{ color: '#718096' }}>Registro de ingreso de pacientes a urgencias</p>
            </Card.Header>

            <Card.Body className="p-4">
              <Form onSubmit={submit} noValidate>

                {/* Datos del Paciente */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <h4 className="mb-0" style={{ color: '#cbd5e0' }}>Datos del Paciente</h4>
                  </div>

                  <Card style={{ background: '#1a202c', border: '1px solid #4a5568' }}>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ color: '#cbd5e0' }}>
                          CUIT/CUIL del Paciente <span style={{ color: '#ef4444' }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="cuit"
                          placeholder="Ej: 20-12345678-9"
                          value={form.paciente.cuit}
                          isInvalid={!!errors['paciente.cuit']}
                          maxLength={13}
                          onChange={(e) => {
                            const formattedCuit = formatCUIT(e.target.value);
                            
                            // Actualizar el estado directamente
                            setForm(prev => ({
                              ...prev,
                              paciente: {
                                ...prev.paciente,
                                cuit: formattedCuit
                              }
                            }));
                            
                            // Limpiar errores
                            setErrors(prev => {
                              const updated = { ...prev };
                              delete updated['paciente.cuit'];
                              return updated;
                            });
                            
                            // Buscar paciente
                            buscarPaciente(formattedCuit);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors['paciente.cuit']}
                        </Form.Control.Feedback>
                        {buscandoPaciente && (
                          <Form.Text style={{ color: '#718096' }}>
                            Buscando paciente...
                          </Form.Text>
                        )}
                      </Form.Group>

                      {pacienteEncontrado && (
                        <Alert style={{ background: '#4a5568', border: '1px solid #718096', color: '#e2e8f0' }} className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <strong>Paciente Encontrado</strong>
                          </div>
                          <div className="ms-4">
                            <div><strong>Nombre:</strong> {pacienteEncontrado.nombre} {pacienteEncontrado.apellido}</div>
                            <div><strong>Domicilio:</strong> {pacienteEncontrado.domicilio?.calle} {pacienteEncontrado.domicilio?.numero}, {pacienteEncontrado.domicilio?.localidad}</div>
                            {pacienteEncontrado.afiliado && (
                              <div><strong>Obra Social:</strong> {pacienteEncontrado.afiliado.obraSocial.nombre} - N° {pacienteEncontrado.afiliado.numeroAfiliado}</div>
                            )}
                          </div>
                        </Alert>
                      )}

                      {!pacienteEncontrado && form.paciente.cuit && !buscandoPaciente && form.paciente.cuit.replace(/-/g, '').length >= 11 && (
                        <PacienteRegistroFormWrapper 
                          cuit={form.paciente.cuit}
                          onPacienteCreado={(pacienteData) => {
                            // Actualizar el formulario con los datos del paciente creado
                            setForm(prev => ({
                              ...prev,
                              paciente: {
                                ...prev.paciente,
                                ...pacienteData
                              }
                            }));
                            setPacienteEncontrado(pacienteData);
                          }}
                        />
                      )}
                    </Card.Body>
                  </Card>
                </div>

                {/* Datos del Ingreso */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <h4 className="mb-0" style={{ color: '#cbd5e0' }}>Datos del Ingreso</h4>
                  </div>

                  <Card style={{ background: '#1a202c', border: '1px solid #4a5568' }}>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ color: '#cbd5e0' }}>
                          Informe <span style={{ color: '#ef4444' }}>*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="informe"
                          value={form.informe}
                          placeholder="Describa el motivo del ingreso y síntomas del paciente..."
                          isInvalid={!!errors['informe']}
                          onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors['informe']}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ color: '#cbd5e0' }}>
                          Nivel de Emergencia <span style={{ color: '#ef4444' }}>*</span>
                        </Form.Label>
                        <Form.Select
                          name="nivel"
                          value={form.nivel}
                          isInvalid={!!errors['nivel']}
                          onChange={handleChange}
                          style={{
                            background: '#2d3748',
                            color: '#e2e8f0',
                            border: '1px solid #4a5568',
                            padding: '10px',
                            fontSize: '1rem'
                          }}
                        >
                          <option value="" style={{ background: '#2d3748' }}>Seleccione nivel de emergencia</option>
                          {niveles.map((n) => (
                            <option key={n} value={n.split(' - ')[0]} style={{ background: '#2d3748', padding: '8px' }}>
                              {n}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors['nivel']}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Signos Vitales */}
                      <div className="mb-3">
                        <Form.Label className="fw-bold mb-3" style={{ color: '#cbd5e0' }}>
                          Signos Vitales
                        </Form.Label>
                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label style={{ color: '#718096' }}>
                                Temperatura (°C)
                              </Form.Label>
                              <Form.Control
                                type="number"
                                step="0.1"
                                min="0"
                                name="temperatura"
                                value={form.temperatura}
                                placeholder="36.5"
                                isInvalid={!!errors['temperatura']}
                                onChange={handleChange}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors['temperatura']}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label style={{ color: '#718096' }}>
                                Frecuencia Cardíaca (lpm)
                              </Form.Label>
                              <Form.Control
                                type="number"
                                step="0.1"
                                min="0"
                                name="frecuenciaCardiaca"
                                value={form.frecuenciaCardiaca}
                                placeholder="70"
                                isInvalid={!!errors['frecuenciaCardiaca']}
                                onChange={handleChange}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors['frecuenciaCardiaca']}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label style={{ color: '#718096' }}>
                                Frecuencia Respiratoria (rpm)
                              </Form.Label>
                              <Form.Control
                                type="number"
                                step="0.1"
                                min="0"
                                name="frecuenciaRespiratoria"
                                value={form.frecuenciaRespiratoria}
                                placeholder="16"
                                isInvalid={!!errors['frecuenciaRespiratoria']}
                                onChange={handleChange}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors['frecuenciaRespiratoria']}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      {/* Tensión Arterial */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ color: '#cbd5e0' }}>
                          Tensión Arterial (mmHg) <span style={{ color: '#ef4444' }}>*</span>
                        </Form.Label>
                        <Row>
                          <Col md={6}>
                            <Form.Control
                              type="number"
                              min="0"
                              name="sistolica"
                              value={sistolica}
                              placeholder="Sistólica (120)"
                              isInvalid={!!errors['tensionArterial']}
                              onChange={(e) => {
                                handleTensionChange('sistolica', e.target.value);
                              }}
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Control
                              type="number"
                              min="0"
                              name="diastolica"
                              value={diastolica}
                              placeholder="Diastólica (80)"
                              isInvalid={!!errors['tensionArterial']}
                              onChange={(e) => {
                                handleTensionChange('diastolica', e.target.value);
                              }}
                            />
                          </Col>
                        </Row>
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {errors['tensionArterial']}
                        </Form.Control.Feedback>
                        <Form.Text style={{ color: '#718096' }}>
                          Formato: Sistólica/Diastólica (ej: 120/80)
                        </Form.Text>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </div>

                {/* Botón de envío */}
                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="px-5 py-3 fw-bold"
                    style={{
                      background: '#10b981',
                      border: 'none',
                      color: '#ffffff',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Registrar Ingreso de Emergencia
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Componente wrapper para usar PacientesForm en el contexto de urgencias
function PacienteRegistroFormWrapper({ cuit, onPacienteCreado }) {
  const [showForm, setShowForm] = useState(false);

  const handlePacienteSubmit = async (pacienteData) => {
    // Agregar el CUIT al paciente
    const pacienteConCuit = {
      ...pacienteData,
      cuit: cuit
    };

    // Registrar el paciente
    const response = await pacientesService.crearPaciente(pacienteConCuit);
    
    if (response.success) {
      // Notificar al componente padre que el paciente fue creado
      onPacienteCreado(pacienteConCuit);
      setShowForm(false);
      return true;
    } else {
      console.error("Error al crear paciente:", response.error);
      return false;
    }
  };

  if (!showForm) {
    return (
      <Alert style={{ background: '#4a5568', border: '1px solid #718096', color: '#e2e8f0' }} className="mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <strong>Paciente no encontrado</strong>
            <div className="small">El paciente con CUIT {cuit} no está registrado.</div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            style={{
              background: '#3182ce',
              border: 'none',
              padding: '8px 16px'
            }}
          >
            Registrar Paciente
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid rgba(255, 255, 255, 0.1)', 
      borderRadius: '12px', 
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 style={{ color: '#90cdf4', margin: 0 }}>Registrar Nuevo Paciente</h6>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setShowForm(false)}
          style={{
            color: '#cbd5e0',
            borderColor: '#4a5568'
          }}
        >
          Cancelar
        </Button>
      </div>
      
      <Alert variant="info" style={{ background: '#2b6cb0', border: '1px solid #3182ce', color: '#ffffff' }}>
        <small>
          <strong>CUIT:</strong> {cuit} - Complete los datos del paciente para registrarlo automáticamente.
        </small>
      </Alert>
      
      <PacientesForm 
        onSubmit={handlePacienteSubmit}
        cuitPredefinido={cuit}
      />
    </div>
  );
}

