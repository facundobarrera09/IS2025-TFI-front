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
      apellido: "",
      nombre: "",
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
    "Critica",
    "Emergencia", 
    "Urgencia",
    "Urgencia Menor",
    "Sin Urgencia",
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
    
    try {
      // Llamar al servicio para buscar el paciente en el backend
      // Enviar el CUIT sin guiones al backend
      const response = await pacientesService.getPacienteByCuit(cuitSinGuiones);
      
      if (response.success && response.result) {
        // Paciente encontrado - mapear los datos del backend al formato del frontend
        const pacienteBackend = response.result;
        const pacienteEncontrado = {
          cuit: pacienteBackend.cuit || cuit,
          nombre: pacienteBackend.nombre || "",
          apellido: pacienteBackend.apellido || "",
          domicilio: pacienteBackend.domicilio ? {
            calle: pacienteBackend.domicilio.calle || "",
            numero: pacienteBackend.domicilio.numero || "",
            localidad: pacienteBackend.domicilio.localidad || ""
          } : {
            calle: "",
            numero: "",
            localidad: ""
          },
          afiliado: pacienteBackend.afiliacion ? {
            obraSocial: {
              nombre: pacienteBackend.afiliacion.obraSocial?.nombre || ""
            },
            numeroAfiliado: pacienteBackend.afiliacion.numeroAfiliado || ""
          } : undefined
        };
        
        setPacienteEncontrado(pacienteEncontrado);
        
        // Actualizar el formulario con los datos del paciente encontrado
        setForm(prev => ({
          ...prev,
          paciente: {
            ...pacienteEncontrado,
            cuit: cuit // Mantener el formato con guiones
          }
        }));
      } else {
        // Paciente no encontrado - mostrar formulario para registro
        setPacienteEncontrado(null);
        setForm(prev => ({
          ...prev,
          paciente: {
            cuit,
            apellido: "",
            nombre: "",
            domicilio: {
              calle: "",
              numero: "",
              localidad: ""
            },
            afiliado: undefined
          }
        }));
      }
    } catch (error) {
      console.error('Error al buscar paciente:', error);
      setPacienteEncontrado(null);
      setForm(prev => ({
        ...prev,
        paciente: {
          cuit,
          apellido: "",
          nombre: "",
          domicilio: {
            calle: "",
            numero: "",
            localidad: ""
          },
          afiliado: undefined
        }
      }));
    } finally {
      setBuscandoPaciente(false);
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

    console.log('🚀 UrgenciasForm SUBMIT: Formulario enviado:', form);
    console.log('🚀 UrgenciasForm SUBMIT: Formulario JSON:', JSON.stringify(form, null, 2));
    console.log('🚀 UrgenciasForm SUBMIT: Paciente encontrado:', pacienteEncontrado);

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
                            Verificando CUIT...
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
                          onPacienteDataChange={(pacienteData) => {
                            // console.log('🎯 UrgenciasForm: Recibiendo datos del paciente:', pacienteData);
                            
                            // Actualizar el formulario con los datos del paciente en tiempo real
                            setForm(prev => {
                              const nuevoForm = {
                                ...prev,
                                paciente: {
                                  ...prev.paciente,
                                  ...pacienteData,
                                  cuit: prev.paciente.cuit // Mantener el CUIT original
                                }
                              };
                              // console.log('🎯 UrgenciasForm: Formulario actualizado:', nuevoForm);
                              return nuevoForm;
                            });
                          }}
                          onPacienteCreado={(pacienteData) => {
                            console.log('🎯 UrgenciasForm: Paciente completado:', pacienteData);
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
                            <option key={n} value={n} style={{ background: '#2d3748', padding: '8px' }}>
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
function PacienteRegistroFormWrapper({ cuit, onPacienteDataChange, onPacienteCreado }) {
  const [showForm, setShowForm] = useState(true); // Mostrar directamente el formulario

  const handlePacienteSubmit = async (pacienteData) => {
    console.log('🏥 PacienteRegistroFormWrapper: Datos recibidos del PacientesForm:', pacienteData);
    
    // Agregar el CUIT al paciente
    const pacienteConCuit = {
      ...pacienteData,
      cuit: cuit
    };

    console.log('🏥 PacienteRegistroFormWrapper: Datos con CUIT agregado:', pacienteConCuit);

    // Registrar el paciente temporalmente en el frontend
    // El backend se encargará de buscar/crear cuando se envíe el ingreso
    const response = await pacientesService.crearPaciente(pacienteConCuit);
    
    if (response.success) {
      console.log('✅ PacienteRegistroFormWrapper: Notificando al padre con datos:', pacienteConCuit);
      // Notificar al componente padre que el paciente fue completado
      onPacienteCreado(pacienteConCuit);
      return true;
    } else {
      console.error("❌ PacienteRegistroFormWrapper: Error al procesar paciente:", response.error);
      return false;
    }
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid rgba(255, 255, 255, 0.1)', 
      borderRadius: '12px', 
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div className="mb-3">
        <h6 style={{ color: '#90cdf4', margin: 0 }}>Datos del Paciente</h6>
      </div>
      
      <Alert variant="info" style={{ background: '#2b6cb0', border: '1px solid #3182ce', color: '#ffffff' }}>
        <small>
          <strong>CUIT:</strong> {cuit} - Complete los datos del paciente. El sistema verificará automáticamente si ya existe al registrar el ingreso.
        </small>
      </Alert>
      
      <PacientesFormFields 
        onSubmit={handlePacienteSubmit}
        onDataChange={onPacienteDataChange}
        cuitPredefinido={cuit}
      />
    </div>
  );
}

// Componente de campos de paciente sin form wrapper (para evitar forms anidados)
function PacientesFormFields({ onSubmit, onDataChange, cuitPredefinido }) {
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
  const [errors, setErrors] = useState({});
  const [tieneObraSocial, setTieneObraSocial] = useState(false);
  const [obrasSociales, setObrasSociales] = useState([]);

  // Actualizar el CUIT cuando cambie el prop
  useEffect(() => {
    if (cuitPredefinido) {
      setForm(prev => ({
        ...prev,
        cuit: cuitPredefinido
      }));
    }
  }, [cuitPredefinido]);

  // Notificar cambios de datos al componente padre
  useEffect(() => {
    if (onDataChange) {
      onDataChange(form);
    }
  }, [form, onDataChange]);

  useEffect(() => {
    // Obtener obras sociales desde la API
    const fetchObrasSociales = async () => {
      const { obrasSocialesService } = await import("../backend/connections/obrasSocialesService");
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
      if (name === 'afiliado.obraSocial.nombre') {
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
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleObraSocialToggle = (e) => {
    const checked = e.target.checked;
    setTieneObraSocial(checked);
    
    if (!checked) {
      setForm(prev => ({ ...prev, afiliado: undefined }));
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

  const handleSubmit = async () => {
    const { CrearPacienteSchema } = await import("../models/dto/crear-paciente.schema");
    const result = CrearPacienteSchema.safeParse(form);

    if (!result.success) {
      const mapped = {};
      result.error.issues.forEach((err) => {
        const key = (err.path && err.path.length) ? err.path.join('.') : '_form';
        mapped[key] = err.message || 'Valor inválido';
      });
      setErrors(mapped);
      return false;
    }

    setErrors({});

    try {
      const success = await onSubmit(form);
      if (success) {
        setForm(initialForm);
        setTieneObraSocial(false);
      }
      return success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <div className="form-modern" style={{ marginTop: '20px' }}>
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
        type="button"
        onClick={handleSubmit}
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
          transition: 'all 0.3s ease',
          marginTop: '20px'
        }}
      >
        Completar Datos del Paciente
      </button>
    </div>
  );
}