// Datos mock para pruebas sin backend
// Simula una base de datos en memoria

// Usuarios predefinidos
export const USUARIOS_MOCK = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "medico@hospital.com",
    password: "password123", // En producción estaría hasheada
    autoridad: "MEDICO",
    nombre: "Juan",
    apellido: "Pérez",
    matricula: "MP12345"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "enfermera@hospital.com",
    password: "password123", // En producción estaría hasheada
    autoridad: "ENFERMERA",
    nombre: "María",
    apellido: "González"
  }
];

// Pacientes de ejemplo
export const PACIENTES_MOCK = [
  {
    id: "pac-001",
    cuit: "20-12345678-9",
    nombre: "Carlos",
    apellido: "Rodríguez",
    domicilio: {
      calle: "San Martín",
      numero: 1234,
      localidad: "San Miguel de Tucumán"
    },
    afiliado: {
      obraSocial: {
        nombre: "OSDE"
      },
      numeroAfiliado: "123456789"
    }
  },
  {
    id: "pac-002",
    cuit: "27-98765432-1",
    nombre: "Ana",
    apellido: "Martínez",
    domicilio: {
      calle: "Belgrano",
      numero: 567,
      localidad: "Yerba Buena"
    }
  },
  {
    id: "pac-003",
    cuit: "23-45678901-2",
    nombre: "Roberto",
    apellido: "Gómez",
    domicilio: {
      calle: "Avenida Mate de Luna",
      numero: 2500,
      localidad: "San Miguel de Tucumán"
    },
    afiliado: {
      obraSocial: {
        nombre: "Swiss Medical"
      },
      numeroAfiliado: "987654321"
    }
  },
  {
    id: "pac-004",
    cuit: "20-11223344-5",
    nombre: "Laura",
    apellido: "Fernández",
    domicilio: {
      calle: "25 de Mayo",
      numero: 890,
      localidad: "Tafí Viejo"
    },
    afiliado: {
      obraSocial: {
        nombre: "Galeno"
      },
      numeroAfiliado: "456789123"
    }
  },
  {
    id: "pac-005",
    cuit: "27-55667788-9",
    nombre: "Sofía",
    apellido: "López",
    domicilio: {
      calle: "Congreso",
      numero: 345,
      localidad: "San Miguel de Tucumán"
    }
  },
  {
    id: "pac-006",
    cuit: "20-99887766-5",
    nombre: "Miguel",
    apellido: "Sánchez",
    domicilio: {
      calle: "Laprida",
      numero: 678,
      localidad: "Banda del Río Salí"
    },
    afiliado: {
      obraSocial: {
        nombre: "OSECAC"
      },
      numeroAfiliado: "789456123"
    }
  },
  {
    id: "pac-007",
    cuit: "27-33445566-7",
    nombre: "Valentina",
    apellido: "Díaz",
    domicilio: {
      calle: "Junín",
      numero: 1567,
      localidad: "San Miguel de Tucumán"
    },
    afiliado: {
      obraSocial: {
        nombre: "OSPEDYC"
      },
      numeroAfiliado: "321654987"
    }
  },
  {
    id: "pac-008",
    cuit: "20-77889900-1",
    nombre: "Diego",
    apellido: "Ramírez",
    domicilio: {
      calle: "Avenida Aconquija",
      numero: 3456,
      localidad: "Yerba Buena"
    }
  }
];

// Ingresos de ejemplo
export const INGRESOS_MOCK = [
  {
    id: "ing-001",
    paciente: PACIENTES_MOCK[0],
    enfermera: {
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      nombre: "María",
      apellido: "González"
    },
    fechaIngreso: new Date("2024-12-03T10:30:00"),
    informe: "Paciente presenta dolor abdominal agudo en cuadrante inferior derecho. Refiere náuseas y vómitos. Temperatura elevada.",
    nivelEmergencia: "Urgencia",
    temperatura: 38.5,
    frecuenciaCardiaca: 95,
    frecuenciaRespiratoria: 22,
    tensionArterial: {
      frecuenciaSistolica: 130,
      frecuenciaDiastolica: 85
    },
    estado: "PENDIENTE"
  },
  {
    id: "ing-002",
    paciente: PACIENTES_MOCK[1],
    enfermera: {
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      nombre: "María",
      apellido: "González"
    },
    fechaIngreso: new Date("2024-12-03T11:15:00"),
    informe: "Paciente con fractura en antebrazo derecho tras caída. Dolor intenso, inflamación visible. Consciente y orientada.",
    nivelEmergencia: "Emergencia",
    temperatura: 36.8,
    frecuenciaCardiaca: 88,
    frecuenciaRespiratoria: 18,
    tensionArterial: {
      frecuenciaSistolica: 125,
      frecuenciaDiastolica: 80
    },
    estado: "PENDIENTE"
  },
  {
    id: "ing-003",
    paciente: PACIENTES_MOCK[2],
    enfermera: {
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      nombre: "María",
      apellido: "González"
    },
    fechaIngreso: new Date("2024-12-03T09:45:00"),
    informe: "Paciente con dificultad respiratoria severa, cianosis periférica. Antecedentes de asma. Requiere atención inmediata.",
    nivelEmergencia: "Critica",
    temperatura: 37.2,
    frecuenciaCardiaca: 110,
    frecuenciaRespiratoria: 32,
    tensionArterial: {
      frecuenciaSistolica: 140,
      frecuenciaDiastolica: 90
    },
    estado: "PENDIENTE"
  },
  {
    id: "ing-004",
    paciente: PACIENTES_MOCK[3],
    enfermera: {
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      nombre: "María",
      apellido: "González"
    },
    fechaIngreso: new Date("2024-12-03T12:00:00"),
    informe: "Paciente con cefalea intensa, fotofobia y rigidez de nuca. Sospecha de meningitis. Requiere evaluación neurológica urgente.",
    nivelEmergencia: "Emergencia",
    temperatura: 39.2,
    frecuenciaCardiaca: 105,
    frecuenciaRespiratoria: 24,
    tensionArterial: {
      frecuenciaSistolica: 135,
      frecuenciaDiastolica: 88
    },
    estado: "PENDIENTE"
  },
  {
    id: "ing-005",
    paciente: PACIENTES_MOCK[4],
    enfermera: {
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      nombre: "María",
      apellido: "González"
    },
    fechaIngreso: new Date("2024-12-03T13:20:00"),
    informe: "Paciente con esguince de tobillo tras actividad deportiva. Dolor moderado, inflamación leve. Puede caminar con dificultad.",
    nivelEmergencia: "Urgencia Menor",
    temperatura: 36.5,
    frecuenciaCardiaca: 75,
    frecuenciaRespiratoria: 16,
    tensionArterial: {
      frecuenciaSistolica: 118,
      frecuenciaDiastolica: 75
    },
    estado: "PENDIENTE"
  }
];

// Atenciones de ejemplo
export const ATENCIONES_MOCK = [];

// Función para generar ID único
export const generarId = (prefijo = 'id') => {
  return `${prefijo}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
