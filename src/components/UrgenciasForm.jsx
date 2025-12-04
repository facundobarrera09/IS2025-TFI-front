import { useState } from "react";
import { CrearIngreso } from "../models/dto/crear-ingreso.schema";
import { pacientesService } from "../backend/connections/pacientesService";
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';

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
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);

  const niveles = [
    "Critica - Rojo",
    "Emergencia - Naranja",
    "Urgencia - Amarillo",
    "Urgencia Menor - Verde",
    "Sin Urgencia - Azul",
  ];

  // Buscar paciente por CUIT
  const buscarPaciente = async (cuit) => {
    if (!cuit || cuit.length < 11) {
      setPacienteEncontrado(null);
      return;
    }

    setBuscandoPaciente(true);
    const response = await pacientesService.getPacienteByCuit(cuit);
    setBuscandoPaciente(false);

    if (response.success) {
      const paciente = response.result;
      setPacienteEncontrado(paciente);
      
      // Autocompletar formulario
      setForm(prev => ({
        ...prev,
        paciente: {
          cuit: paciente.cuit,
          apellido: paciente.apellido,
          nombre: paciente.nombre,
          domicilio: paciente.domicilio
        }
      }));
    } else {
      setPacienteEncontrado(null);
      setForm(prev => ({
        ...prev,
        paciente: {
          cuit,
          apellido: undefined,
          nombre: undefined,
          domicilio: undefined
        }
      }));
    }
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

    setForm({ ...form, [name]: value });


  };

  const handleTensionChange = () => {
    const sistolica = document.querySelector('input[name="sistolica"]').value;
    const diastolica = document.querySelector('input[name="diastolica"]').value;
    setForm({ ...form, tensionArterial: `${sistolica}/${diastolica}` });
  };

  const submit = async (e) => {
    e.preventDefault();

    const result = CrearIngreso.safeParse(form);

    if (!result.success) {
      // mapear errores a un objeto { 'ruta': 'mensaje' }
      const mapped = {};
      result.error.issues.forEach((err) => {
        const key = (err.path && err.path.length) ? err.path.join('.') : '_form';
        mapped[key] = err.message || 'Valor inválido';
      });

      setErrors(mapped);
      return;
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
        setPacienteEncontrado(null);
      }
    }
    catch (err) {
      // si onSubmit lanza, no reseteamos
      console.error(err);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-lg border-0 medical-card">
            <Card.Header className="bg-primary text-white text-center py-4">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-hospital-user fa-2x me-3"></i>
                <h2 className="mb-0">Admisión de Emergencias</h2>
              </div>
              <p className="mb-0 opacity-75">Registro de ingreso de pacientes a urgencias</p>
            </Card.Header>

            <Card.Body className="p-4">
              <Form onSubmit={submit} noValidate>

                {/* Datos del Paciente */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-user-injured text-primary me-2"></i>
                    <h4 className="mb-0">Datos del Paciente</h4>
                  </div>

                  <Card className="border-primary">
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <i className="fas fa-id-card me-1"></i>
                          CUIT/CUIL del Paciente <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="cuit"
                          placeholder="Ej: 20-12345678-9"
                          isInvalid={!!errors['paciente.cuit']}
                          onChange={(e) => {
                            const cuit = e.target.value;
                            handleChange(e);
                            buscarPaciente(cuit);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors['paciente.cuit']}
                        </Form.Control.Feedback>
                        {buscandoPaciente && (
                          <Form.Text className="text-info">
                            <i className="fas fa-spinner fa-spin me-1"></i>
                            Buscando paciente...
                          </Form.Text>
                        )}
                      </Form.Group>

                      {pacienteEncontrado && (
                        <Alert variant="success" className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-check-circle me-2"></i>
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

                      {!pacienteEncontrado && form.paciente.cuit && !buscandoPaciente && form.paciente.cuit.length >= 11 && (
                        <Alert variant="warning" className="mb-3">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            <div>
                              <strong>Paciente no encontrado</strong>
                              <div className="small">Debe registrar al paciente primero en el módulo de Pacientes</div>
                            </div>
                          </div>
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </div>

                {/* Datos del Ingreso */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-clipboard-list text-success me-2"></i>
                    <h4 className="mb-0">Datos del Ingreso</h4>
                  </div>

                  <Card className="border-success">
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <i className="fas fa-file-alt me-1"></i>
                          Informe <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="informe"
                          placeholder="Describa el motivo del ingreso y síntomas del paciente..."
                          isInvalid={!!errors['informe']}
                          onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors['informe']}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <i className="fas fa-exclamation-triangle me-1"></i>
                          Nivel de Emergencia <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="nivel"
                          isInvalid={!!errors['nivel']}
                          onChange={handleChange}
                        >
                          <option value="">Seleccione nivel de emergencia</option>
                          {niveles.map((n) => (
                            <option key={n} value={n.split(' - ')[0]}>
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
                        <Form.Label className="fw-bold mb-3">
                          <i className="fas fa-heartbeat me-1"></i>
                          Signos Vitales
                        </Form.Label>
                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label className="text-muted">
                                <i className="fas fa-thermometer-half me-1"></i>
                                Temperatura (°C)
                              </Form.Label>
                              <Form.Control
                                type="number"
                                step="0.1"
                                name="temperatura"
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
                              <Form.Label className="text-muted">
                                <i className="fas fa-heart me-1"></i>
                                Frecuencia Cardíaca (lpm)
                              </Form.Label>
                              <Form.Control
                                type="number"
                                step="0.1"
                                name="frecuenciaCardiaca"
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
                              <Form.Label className="text-muted">
                                <i className="fas fa-lungs me-1"></i>
                                Frecuencia Respiratoria (rpm)
                              </Form.Label>
                              <Form.Control
                                type="number"
                                step="0.1"
                                name="frecuenciaRespiratoria"
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
                        <Form.Label className="fw-bold">
                          <i className="fas fa-stethoscope me-1"></i>
                          Tensión Arterial (mmHg) <span className="text-danger">*</span>
                        </Form.Label>
                        <Row>
                          <Col md={6}>
                            <Form.Control
                              type="number"
                              name="sistolica"
                              placeholder="Sistólica (120)"
                              isInvalid={!!errors['tensionArterial']}
                              onChange={(e) => {
                                handleChange(e);
                                handleTensionChange();
                              }}
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Control
                              type="number"
                              name="diastolica"
                              placeholder="Diastólica (80)"
                              isInvalid={!!errors['tensionArterial']}
                              onChange={(e) => {
                                handleChange(e);
                                handleTensionChange();
                              }}
                            />
                          </Col>
                        </Row>
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {errors['tensionArterial']}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
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
                      background: 'linear-gradient(135deg, #007bff, #0056b3)',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(0,123,255,0.3)'
                    }}
                  >
                    <i className="fas fa-save me-2"></i>
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
