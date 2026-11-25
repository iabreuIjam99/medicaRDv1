import {
  Appointment,
  Branch,
  ClinicalRecord,
  Doctor,
  Patient,
  Specialty,
} from '../types/medical';

export const HERO_CLINIC_IMAGE =
  './src/assets/images/hero_clinic_consultation_1795649195251.jpg';

export const ARS_PROVIDERS = [
  'ARS Humano',
  'Seguros Reservas',
  'ARS Universal',
  'SeNaSa Contributivo',
  'Consulta Privada (Sin ARS)',
];

export const BRANCHES: Branch[] = [
  {
    id: 'br-sdq',
    name: 'Torre Piantini',
    city: 'Santo Domingo',
    address: 'Av. Abraham Lincoln 452, Ensanche Piantini',
    phone: '(809) 541-2800',
    hours: 'Lun–Sáb · 7:00 a. m. – 7:00 p. m.',
  },
  {
    id: 'br-sti',
    name: 'Centro Los Jardines',
    city: 'Santiago',
    address: 'Av. 27 de Febrero 84, Los Jardines Metropolitanos',
    phone: '(809) 582-4100',
    hours: 'Lun–Sáb · 7:30 a. m. – 6:30 p. m.',
  },
  {
    id: 'br-puj',
    name: 'Clínica Bávaro',
    city: 'Punta Cana',
    address: 'Blvd. Turístico del Este, Km 12, Bávaro',
    phone: '(809) 552-1950',
    hours: 'Lun–Sáb · 8:00 a. m. – 6:00 p. m.',
  },
];

export const SPECIALTIES: Specialty[] = [
  {
    id: 'sp-cardio',
    name: 'Cardiología',
    shortDescription:
      'Evaluación cardiovascular integral, electrocardiogramas, control de hipertensión y chequeos preventivos.',
    avgDurationMin: 30,
    baseFeeDop: 3500,
    featured: true,
  },
  {
    id: 'sp-pedia',
    name: 'Pediatría',
    shortDescription:
      'Seguimiento de crecimiento infantil, esquemas de vacunación y atención respiratoria oportuna.',
    avgDurationMin: 25,
    baseFeeDop: 2800,
    featured: true,
  },
  {
    id: 'sp-derma',
    name: 'Dermatología',
    shortDescription:
      'Diagnóstico dermatoscópico, cuidado de piel sensible y tratamiento clínico de afecciones cutáneas.',
    avgDurationMin: 25,
    baseFeeDop: 3200,
  },
  {
    id: 'sp-orto',
    name: 'Ortopedia y Traumatología',
    shortDescription:
      'Manejo de lesiones articulares, columna vertebral, medicina deportiva y rehabilitación guiada.',
    avgDurationMin: 30,
    baseFeeDop: 3500,
  },
  {
    id: 'sp-interna',
    name: 'Medicina Interna',
    shortDescription:
      'Control de enfermedades crónicas, medicina preventiva del adulto y evaluación preoperatoria.',
    avgDurationMin: 30,
    baseFeeDop: 2600,
  },
  {
    id: 'sp-gineco',
    name: 'Ginecología y Obstetricia',
    shortDescription:
      'Control prenatal, salud femenina preventiva, sonografía obstétrica y planificación clínica.',
    avgDurationMin: 30,
    baseFeeDop: 3200,
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-elena',
    name: 'Dra. Elena Vargas',
    specialtyId: 'sp-cardio',
    branchId: 'br-sdq',
    exequatur: 'EXQ-4821-15',
    experienceYears: 12,
    feeDop: 3500,
    arsCopayDop: 850,
    nextSlotLabel: 'Hoy · 10:30',
    bio: 'Cardióloga clínica egresada de INTEC con subespecialidad en ecocardiografía y prevención cardiovascular en Madrid.',
    languages: ['Español', 'Inglés'],
    acceptedArs: ['ARS Humano', 'Seguros Reservas', 'ARS Universal', 'SeNaSa Contributivo'],
    availableTimes: ['08:30', '09:30', '10:30', '11:30', '14:30', '15:30', '16:30'],
    imageUrl: './src/assets/images/doctor_cardiology_female_1795649195096.jpg',
    initials: 'EV',
  },
  {
    id: 'doc-andres',
    name: 'Dr. Andrés Ramírez',
    specialtyId: 'sp-pedia',
    branchId: 'br-sdq',
    exequatur: 'EXQ-3910-12',
    experienceYears: 14,
    feeDop: 2800,
    arsCopayDop: 650,
    nextSlotLabel: 'Hoy · 14:00',
    bio: 'Pediatra puericultor con enfoque en desarrollo temprano, inmunización y acompañamiento cercano a familias.',
    languages: ['Español', 'Inglés'],
    acceptedArs: ['ARS Humano', 'Seguros Reservas', 'ARS Universal', 'SeNaSa Contributivo'],
    availableTimes: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    imageUrl: './src/assets/images/doctor_pediatrics_male_1795649198245.jpg',
    initials: 'AR',
  },
  {
    id: 'doc-alana',
    name: 'Dra. Alana Rodríguez',
    specialtyId: 'sp-derma',
    branchId: 'br-sti',
    exequatur: 'EXQ-5614-18',
    experienceYears: 9,
    feeDop: 3200,
    arsCopayDop: 750,
    nextSlotLabel: 'Mañana · 09:00',
    bio: 'Dermatóloga clínica certificada especializada en dermatoscopia digital, dermatitis atópica y fotoprotección tropical.',
    languages: ['Español', 'Inglés', 'Francés'],
    acceptedArs: ['ARS Humano', 'ARS Universal', 'Seguros Reservas'],
    availableTimes: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:30'],
    imageUrl: './src/assets/images/doctor_dermatology_female_1795649197577.jpg',
    initials: 'AR',
  },
  {
    id: 'doc-alejandro',
    name: 'Dr. Alejandro Vargas',
    specialtyId: 'sp-orto',
    branchId: 'br-sdq',
    exequatur: 'EXQ-3204-09',
    experienceYears: 17,
    feeDop: 3500,
    arsCopayDop: 900,
    nextSlotLabel: 'Mañana · 11:00',
    bio: 'Cirujano ortopeda y traumatólogo enfocado en artroscopia de rodilla, hombro y recuperación funcional conservadora.',
    languages: ['Español', 'Inglés'],
    acceptedArs: ['ARS Humano', 'Seguros Reservas', 'ARS Universal', 'SeNaSa Contributivo'],
    availableTimes: ['08:30', '09:30', '11:00', '14:30', '16:00'],
    imageUrl: './src/assets/images/doctor_orthopedics_male_1795649198100.jpg',
    initials: 'AV',
  },
  {
    id: 'doc-sofia',
    name: 'Dra. Sofía Méndez',
    specialtyId: 'sp-interna',
    branchId: 'br-puj',
    exequatur: 'EXQ-5109-16',
    experienceYears: 11,
    feeDop: 2600,
    arsCopayDop: 600,
    nextSlotLabel: 'Hoy · 15:00',
    bio: 'Médico internista dedicada al manejo integral de diabetes, metabolismo tiroideo y chequeos ejecutivos anuales.',
    languages: ['Español', 'Inglés'],
    acceptedArs: ['ARS Humano', 'Seguros Reservas', 'SeNaSa Contributivo'],
    availableTimes: ['08:30', '09:30', '10:30', '15:00', '16:00'],
    initials: 'SM',
  },
  {
    id: 'doc-carlos',
    name: 'Dr. Carlos Peña',
    specialtyId: 'sp-gineco',
    branchId: 'br-sti',
    exequatur: 'EXQ-4472-14',
    experienceYears: 13,
    feeDop: 3200,
    arsCopayDop: 750,
    nextSlotLabel: 'Mañana · 10:00',
    bio: 'Ginecólogo obstetra con amplia trayectoria en control prenatal de bajo y alto riesgo y salud integral femenina.',
    languages: ['Español'],
    acceptedArs: ['ARS Humano', 'ARS Universal', 'SeNaSa Contributivo'],
    availableTimes: ['09:00', '10:00', '11:30', '14:30', '15:30'],
    initials: 'CP',
  },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-camila',
    name: 'Camila Morales',
    cedula: '402-2189456-7',
    email: 'camila.morales@correo.do',
    phone: '(809) 624-8812',
    birthDate: '1994-05-18',
    bloodType: 'O+',
    arsProvider: 'ARS Humano',
    arsPolicyNumber: 'HUM-8841209',
    allergies: 'Penicilina (rash leve)',
    emergencyContact: 'Luis Morales · (809) 712-4490',
  },
  {
    id: 'pat-mateo',
    name: 'Mateo Alcántara',
    cedula: '001-1458290-3',
    email: 'mateo.alcantara@correo.do',
    phone: '(829) 410-2219',
    birthDate: '1978-11-02',
    bloodType: 'A+',
    arsProvider: 'Seguros Reservas',
    arsPolicyNumber: 'RES-3391042',
    allergies: 'Ninguna conocida',
    emergencyContact: 'Rosa Alcántara · (809) 519-0831',
  },
  {
    id: 'pat-valeria',
    name: 'Valeria Guzmán',
    cedula: '031-0589123-4',
    email: 'valeria.guzman@correo.do',
    phone: '(849) 288-5140',
    birthDate: '1989-08-27',
    bloodType: 'B+',
    arsProvider: 'ARS Universal',
    arsPolicyNumber: 'UNI-5521908',
    allergies: 'Ibuprofeno',
    emergencyContact: 'Pedro Guzmán · (809) 340-1120',
  },
  {
    id: 'pat-jorge',
    name: 'Jorge Castillo',
    cedula: '001-1923411-8',
    email: 'jorge.castillo@correo.do',
    phone: '(809) 851-7703',
    birthDate: '1965-03-14',
    bloodType: 'O-',
    arsProvider: 'SeNaSa Contributivo',
    arsPolicyNumber: 'SEN-7701294',
    allergies: 'Sulfamidas',
    emergencyContact: 'Elena Castillo · (809) 851-7704',
  },
];

// Generate dates relative to today so the live demo always shows realistic upcoming and past dates
function offsetDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createInitialAppointments(): Appointment[] {
  return [
    {
      id: 'apt-101',
      code: 'MED-2026-1042',
      patientId: 'pat-camila',
      patientName: 'Camila Morales',
      doctorId: 'doc-elena',
      specialtyId: 'sp-cardio',
      branchId: 'br-sdq',
      date: offsetDate(0),
      time: '09:30',
      mode: 'Presencial',
      reason: 'Chequeo cardiovascular anual y revisión de resultados de perfil lipídico.',
      arsUsed: 'ARS Humano',
      copayDop: 850,
      status: 'confirmada',
      createdAt: offsetDate(-4),
    },
    {
      id: 'apt-102',
      code: 'MED-2026-1048',
      patientId: 'pat-camila',
      patientName: 'Camila Morales',
      doctorId: 'doc-alana',
      specialtyId: 'sp-derma',
      branchId: 'br-sti',
      date: offsetDate(3),
      time: '10:00',
      mode: 'Teleconsulta',
      reason: 'Seguimiento de dermatitis por contacto y ajuste de protector solar dermatológico.',
      arsUsed: 'ARS Humano',
      copayDop: 750,
      status: 'pendiente',
      createdAt: offsetDate(-1),
    },
    {
      id: 'apt-103',
      code: 'MED-2026-1051',
      patientId: 'pat-mateo',
      patientName: 'Mateo Alcántara',
      doctorId: 'doc-elena',
      specialtyId: 'sp-cardio',
      branchId: 'br-sdq',
      date: offsetDate(0),
      time: '11:30',
      mode: 'Presencial',
      reason: 'Control de presión arterial y lectura de Holter de 24 horas.',
      arsUsed: 'Seguros Reservas',
      copayDop: 850,
      status: 'pendiente',
      createdAt: offsetDate(-2),
    },
    {
      id: 'apt-104',
      code: 'MED-2026-1055',
      patientId: 'pat-jorge',
      patientName: 'Jorge Castillo',
      doctorId: 'doc-elena',
      specialtyId: 'sp-cardio',
      branchId: 'br-sdq',
      date: offsetDate(0),
      time: '14:30',
      mode: 'Presencial',
      reason: 'Evaluación preoperatoria cardiovascular para cirugía menor programada.',
      arsUsed: 'SeNaSa Contributivo',
      copayDop: 850,
      status: 'confirmada',
      createdAt: offsetDate(-5),
    },
    {
      id: 'apt-105',
      code: 'MED-2026-0987',
      patientId: 'pat-camila',
      patientName: 'Camila Morales',
      doctorId: 'doc-sofia',
      specialtyId: 'sp-interna',
      branchId: 'br-puj',
      date: offsetDate(-14),
      time: '09:30',
      mode: 'Presencial',
      reason: 'Consulta preventiva de medicina interna y analítica general.',
      arsUsed: 'ARS Humano',
      copayDop: 600,
      status: 'completada',
      createdAt: offsetDate(-21),
    },
    {
      id: 'apt-106',
      code: 'MED-2026-0962',
      patientId: 'pat-camila',
      patientName: 'Camila Morales',
      doctorId: 'doc-alejandro',
      specialtyId: 'sp-orto',
      branchId: 'br-sdq',
      date: offsetDate(-32),
      time: '16:00',
      mode: 'Presencial',
      reason: 'Molestia leve en rodilla izquierda tras entrenamiento de carrera.',
      arsUsed: 'ARS Humano',
      copayDop: 900,
      status: 'completada',
      createdAt: offsetDate(-38),
    },
    {
      id: 'apt-107',
      code: 'MED-2026-1019',
      patientId: 'pat-valeria',
      patientName: 'Valeria Guzmán',
      doctorId: 'doc-elena',
      specialtyId: 'sp-cardio',
      branchId: 'br-sdq',
      date: offsetDate(1),
      time: '15:30',
      mode: 'Teleconsulta',
      reason: 'Palpitaciones ocasionales relacionadas con estrés laboral.',
      arsUsed: 'ARS Universal',
      copayDop: 850,
      status: 'cancelada',
      cancellationReason: 'Reprogramación solicitada por viaje laboral.',
      createdAt: offsetDate(-6),
    },
  ];
}

export function createInitialClinicalRecords(): ClinicalRecord[] {
  return [
    {
      id: 'rec-201',
      appointmentId: 'apt-105',
      patientId: 'pat-camila',
      doctorId: 'doc-sofia',
      date: offsetDate(-14),
      diagnosis: 'Evaluación preventiva satisfactoria · Vitamina D ligeramente disminuida',
      prescription: 'Colecalciferol 2,000 UI una vez al día con el desayuno durante 60 días.',
      notes: 'Hemograma y glucosa en ayunas dentro de rangos óptimos. Control anual recomendado.',
      bloodPressure: '116/74 mmHg',
      heartRate: '68 lpm',
    },
    {
      id: 'rec-202',
      appointmentId: 'apt-106',
      patientId: 'pat-camila',
      doctorId: 'doc-alejandro',
      date: offsetDate(-32),
      diagnosis: 'Tendinitis rotuliana leve por sobrecarga deportiva',
      prescription: 'Fisioterapia de fortalecimiento de cuádriceps (6 sesiones) y compresas frías locales.',
      notes: 'Sin signos de lesión meniscal. Retomar carrera progresivamente en 2 semanas.',
      bloodPressure: '118/76 mmHg',
      heartRate: '66 lpm',
    },
    {
      id: 'rec-203',
      appointmentId: 'apt-104',
      patientId: 'pat-jorge',
      doctorId: 'doc-elena',
      date: offsetDate(-45),
      diagnosis: 'Hipertensión arterial estadio 1 controlada',
      prescription: 'Losartán 50 mg cada 24 horas en la mañana. Mantener dieta baja en sodio.',
      notes: 'Buena adherencia terapéutica. Electrocardiograma en ritmo sinusal normal.',
      bloodPressure: '128/80 mmHg',
      heartRate: '72 lpm',
    },
  ];
}

export function formatDop(amount: number): string {
  return `RD$ ${amount.toLocaleString('es-DO')}`;
}

export function formatDateSpanish(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getTodayIso(): string {
  return offsetDate(0);
}
