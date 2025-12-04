// Mock Backend - Simula el comportamiento del backend usando localStorage
import { USUARIOS_MOCK, PACIENTES_MOCK, INGRESOS_MOCK, ATENCIONES_MOCK, generarId } from './mockData';

// Claves de localStorage
const STORAGE_KEYS = {
  PACIENTES: 'mock_pacientes',
  INGRESOS: 'mock_ingresos',
  ATENCIONES: 'mock_atenciones'
};

// Inicializar datos en localStorage si no existen
const inicializarDatos = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PACIENTES)) {
    localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(PACIENTES_MOCK));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INGRESOS)) {
    localStorage.setItem(STORAGE_KEYS.INGRESOS, JSON.stringify(INGRESOS_MOCK));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATENCIONES)) {
    localStorage.setItem(STORAGE_KEYS.ATENCIONES, JSON.stringify(ATENCIONES_MOCK));
  }
};

// Simular delay de red
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Simular respuesta exitosa
const successResponse = (result) => ({
  success: true,
  result
});

// Simular respuesta de error
const errorResponse = (message) => ({
  success: false,
  error: {
    context: {
      message
    }
  }
});

// ==================== AUTH ====================

export const mockAuthService = {
  login: async (email, password) => {
    await delay(800);
    
    const usuario = USUARIOS_MOCK.find(u => u.email === email);
    
    if (!usuario || usuario.password !== password) {
      return errorResponse("Usuario o contraseña inválidos");
    }
    
    // Generar token mock
    const token = `mock-token-${Date.now()}`;
    
    // Retornar usuario sin password
    const { password: _, ...usuarioSinPassword } = usuario;
    
    return successResponse({
      token,
      usuario: usuarioSinPassword
    });
  }
};

// ==================== PACIENTES ====================

export const mockPacientesService = {
  getPacientes: async () => {
    await delay(300);
    inicializarDatos();
    
    const pacientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACIENTES) || '[]');
    return successResponse(pacientes);
  },
  
  crearPaciente: async (data) => {
    await delay(600);
    inicializarDatos();
    
    const pacientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACIENTES) || '[]');
    
    // Verificar si el CUIT ya existe
    if (pacientes.some(p => p.cuit === data.cuit)) {
      return errorResponse("Ya existe un paciente con ese CUIT");
    }
    
    // Simular validación de obra social
    if (data.afiliado) {
      const obrasSocialesValidas = ['OSDE', 'Swiss Medical', 'Galeno', 'OSECAC', 'OSPEDYC'];
      if (!obrasSocialesValidas.includes(data.afiliado.obraSocial.nombre)) {
        return errorResponse("No se puede registrar al paciente con una obra social inexistente");
      }
      
      // Simular validación de afiliación (50% de probabilidad de error para testing)
      // En producción, esto verificaría contra una base de datos real
      if (Math.random() < 0.1) { // 10% de probabilidad de error
        return errorResponse("No se puede registrar el paciente dado que no está afiliado a la obra social");
      }
    }
    
    const nuevoPaciente = {
      id: generarId('pac'),
      ...data
    };
    
    pacientes.push(nuevoPaciente);
    localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(pacientes));
    
    return successResponse(null);
  },
  
  getPacienteByCuit: async (cuit) => {
    await delay(300);
    inicializarDatos();
    
    const pacientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACIENTES) || '[]');
    const paciente = pacientes.find(p => p.cuit === cuit);
    
    if (!paciente) {
      return errorResponse("Paciente no encontrado");
    }
    
    return successResponse(paciente);
  }
};

// ==================== INGRESOS ====================

export const mockIngresosService = {
  getIngresos: async () => {
    await delay(400);
    inicializarDatos();
    
    const ingresos = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGRESOS) || '[]');
    
    // Filtrar solo ingresos PENDIENTES
    const ingresosPendientes = ingresos.filter(i => i.estado === 'PENDIENTE');
    
    return successResponse({
      listaDeIngresos: ingresosPendientes
    });
  },
  
  crearIngreso: async (data) => {
    await delay(700);
    inicializarDatos();
    
    const ingresos = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGRESOS) || '[]');
    const pacientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACIENTES) || '[]');
    
    // Buscar paciente por CUIT
    const paciente = pacientes.find(p => p.cuit === data.paciente.cuit);
    
    if (!paciente) {
      return errorResponse("Paciente no encontrado. Debe registrar al paciente primero.");
    }
    
    const nuevoIngreso = {
      id: generarId('ing'),
      paciente: paciente,
      enfermera: {
        uuid: data.enfermera.uuid,
        nombre: "María",
        apellido: "González"
      },
      fechaIngreso: new Date(),
      informe: data.informe,
      nivelEmergencia: data.nivel,
      temperatura: parseFloat(data.temperatura),
      frecuenciaCardiaca: parseFloat(data.frecuenciaCardiaca),
      frecuenciaRespiratoria: parseFloat(data.frecuenciaRespiratoria),
      tensionArterial: {
        frecuenciaSistolica: parseInt(data.tensionArterial.split('/')[0]),
        frecuenciaDiastolica: parseInt(data.tensionArterial.split('/')[1])
      },
      estado: 'PENDIENTE'
    };
    
    ingresos.push(nuevoIngreso);
    localStorage.setItem(STORAGE_KEYS.INGRESOS, JSON.stringify(ingresos));
    
    return successResponse(null);
  },
  
  reclamarProximoPaciente: async () => {
    await delay(500);
    inicializarDatos();
    
    const ingresos = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGRESOS) || '[]');
    
    // Filtrar ingresos PENDIENTES
    const ingresosPendientes = ingresos.filter(i => i.estado === 'PENDIENTE');
    
    if (ingresosPendientes.length === 0) {
      return errorResponse("No hay pacientes en la lista de espera");
    }
    
    // Ordenar por prioridad (jerarquía)
    const prioridades = {
      'Critica': 1,
      'Emergencia': 2,
      'Urgencia': 3,
      'Urgencia Menor': 4,
      'Sin Urgencia': 5
    };
    
    ingresosPendientes.sort((a, b) => {
      const prioridadA = prioridades[a.nivelEmergencia] || 999;
      const prioridadB = prioridades[b.nivelEmergencia] || 999;
      return prioridadA - prioridadB;
    });
    
    // Tomar el primero (mayor prioridad)
    const ingresoReclamado = ingresosPendientes[0];
    
    // Cambiar estado a EN_PROCESO
    const index = ingresos.findIndex(i => i.id === ingresoReclamado.id);
    ingresos[index].estado = 'EN_PROCESO';
    localStorage.setItem(STORAGE_KEYS.INGRESOS, JSON.stringify(ingresos));
    
    return successResponse(ingresos[index]);
  }
};

// ==================== ATENCIONES ====================

export const mockAtencionesService = {
  crearAtencion: async (data) => {
    await delay(600);
    inicializarDatos();
    
    const atenciones = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATENCIONES) || '[]');
    const ingresos = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGRESOS) || '[]');
    
    // Buscar el ingreso
    const ingresoIndex = ingresos.findIndex(i => i.id === data.ingresoId);
    
    if (ingresoIndex === -1) {
      return errorResponse("Ingreso no encontrado");
    }
    
    if (ingresos[ingresoIndex].estado !== 'EN_PROCESO') {
      return errorResponse("El ingreso no está en proceso de atención");
    }
    
    // Crear atención
    const nuevaAtencion = {
      id: generarId('ate'),
      ingreso: ingresos[ingresoIndex],
      informe: data.informe,
      medico: {
        uuid: data.medico.uuid,
        nombre: "Juan",
        apellido: "Pérez",
        matricula: "MP12345"
      },
      fechaAtencion: new Date()
    };
    
    atenciones.push(nuevaAtencion);
    localStorage.setItem(STORAGE_KEYS.ATENCIONES, JSON.stringify(atenciones));
    
    // Cambiar estado del ingreso a FINALIZADO
    ingresos[ingresoIndex].estado = 'FINALIZADO';
    localStorage.setItem(STORAGE_KEYS.INGRESOS, JSON.stringify(ingresos));
    
    return successResponse(nuevaAtencion);
  }
};

// Inicializar datos al cargar el módulo
inicializarDatos();
