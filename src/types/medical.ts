export type UserRole = 'patient' | 'doctor';

export type AppointmentStatus = 'confirmada' | 'pendiente' | 'completada' | 'cancelada';

export type ConsultationMode = 'Presencial' | 'Teleconsulta';

export type AppView = 'landing' | 'auth' | 'dashboard' | 'guide';

export type DashboardTab =
  | 'overview'
  | 'appointments'
  | 'book'
  | 'doctors'
  | 'profile'
  | 'patients';

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
}

export interface Specialty {
  id: string;
  name: string;
  shortDescription: string;
  avgDurationMin: number;
  baseFeeDop: number;
  featured?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  branchId: string;
  exequatur: string;
  experienceYears: number;
  feeDop: number;
  arsCopayDop: number;
  nextSlotLabel: string;
  bio: string;
  languages: string[];
  acceptedArs: string[];
  availableTimes: string[];
  imageUrl?: string;
  initials: string;
}

export interface Patient {
  id: string;
  name: string;
  cedula: string;
  email: string;
  phone: string;
  birthDate: string;
  bloodType: string;
  arsProvider: string;
  arsPolicyNumber: string;
  allergies: string;
  emergencyContact: string;
}

export interface ClinicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  bloodPressure?: string;
  heartRate?: string;
}

export interface Appointment {
  id: string;
  code: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  specialtyId: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mode: ConsultationMode;
  reason: string;
  arsUsed: string;
  copayDop: number;
  status: AppointmentStatus;
  cancellationReason?: string;
  createdAt: string;
}

export interface BookingPrefill {
  specialtyId?: string;
  branchId?: string;
  doctorId?: string;
  date?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

export interface UserSession {
  authenticated: boolean;
  role: UserRole;
  patientId: string;
  doctorId: string;
}
