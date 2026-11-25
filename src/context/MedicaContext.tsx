import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BRANCHES,
  createInitialAppointments,
  createInitialClinicalRecords,
  DOCTORS,
  INITIAL_PATIENTS,
  SPECIALTIES,
} from '../data/mockData';
import {
  Appointment,
  AppointmentStatus,
  AppView,
  BookingPrefill,
  ClinicalRecord,
  ConsultationMode,
  DashboardTab,
  Patient,
  ToastMessage,
  UserRole,
  UserSession,
} from '../types/medical';

const STORAGE_KEY = 'medicard_mockup_state_v1';

interface PersistedState {
  appointments: Appointment[];
  patients: Patient[];
  clinicalRecords: ClinicalRecord[];
}

interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  specialtyId: string;
  branchId: string;
  date: string;
  time: string;
  mode: ConsultationMode;
  reason: string;
  arsUsed: string;
  copayDop: number;
}

interface RegisterPatientInput {
  name: string;
  cedula: string;
  email: string;
  phone: string;
  arsProvider: string;
}

interface MedicaContextValue {
  view: AppView;
  previousView: AppView;
  setView: (view: AppView) => void;
  openGuide: () => void;
  closeGuide: () => void;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  session: UserSession;
  currentPatient: Patient;
  currentDoctor: (typeof DOCTORS)[number];
  appointments: Appointment[];
  patients: Patient[];
  clinicalRecords: ClinicalRecord[];
  bookingPrefill: BookingPrefill;
  setBookingPrefill: (prefill: BookingPrefill) => void;
  startQuickBooking: (prefill: BookingPrefill) => void;
  loginAsDemo: (role: UserRole, customEmail?: string) => void;
  registerPatient: (input: RegisterPatientInput) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isSlotTaken: (doctorId: string, date: string, time: string, excludeAppointmentId?: string) => boolean;
  createAppointment: (input: CreateAppointmentInput) => Appointment | null;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => boolean;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
    options?: {
      cancellationReason?: string;
      diagnosis?: string;
      prescription?: string;
      notes?: string;
      bloodPressure?: string;
      heartRate?: string;
    }
  ) => void;
  updatePatientProfile: (patientId: string, updates: Partial<Patient>) => void;
  resetDemoData: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const MedicaContext = createContext<MedicaContextValue | null>(null);

function loadPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (
        Array.isArray(parsed.appointments) &&
        Array.isArray(parsed.patients) &&
        Array.isArray(parsed.clinicalRecords) &&
        parsed.patients.length > 0
      ) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed storage and fall back to defaults
  }
  return {
    appointments: createInitialAppointments(),
    patients: INITIAL_PATIENTS,
    clinicalRecords: createInitialClinicalRecords(),
  };
}

export function MedicaProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(() => loadPersistedState());
  const [view, setViewState] = useState<AppView>('landing');
  const [previousView, setPreviousView] = useState<AppView>('landing');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill>({});
  const [pendingBookingAfterAuth, setPendingBookingAfterAuth] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [session, setSession] = useState<UserSession>({
    authenticated: false,
    role: 'patient',
    patientId: 'pat-camila',
    doctorId: 'doc-elena',
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage quota errors in sandboxed iframes
    }
  }, [persisted]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const setView = (nextView: AppView) => {
    setViewState((current) => {
      if (current !== 'guide') {
        setPreviousView(current);
      }
      return nextView;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openGuide = () => {
    setViewState((current) => {
      if (current !== 'guide') {
        setPreviousView(current);
      }
      return 'guide';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeGuide = () => {
    setViewState(previousView === 'guide' ? 'landing' : previousView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startQuickBooking = (prefill: BookingPrefill) => {
    setBookingPrefill(prefill);
    if (session.authenticated) {
      setSession((prev) => ({ ...prev, role: 'patient' }));
      setDashboardTab('book');
      setView('dashboard');
    } else {
      setPendingBookingAfterAuth(true);
      setView('auth');
      addToast({
        type: 'info',
        title: 'Inicia sesión para completar tu reserva',
        description: 'Conservamos tu selección de especialidad y sede.',
      });
    }
  };

  const loginAsDemo = (role: UserRole, customEmail?: string) => {
    const matchedPatient = customEmail
      ? persisted.patients.find((p) => p.email.toLowerCase() === customEmail.toLowerCase())
      : undefined;

    const targetPatientId = matchedPatient?.id ?? 'pat-camila';

    setSession({
      authenticated: true,
      role,
      patientId: targetPatientId,
      doctorId: 'doc-elena',
    });

    if (role === 'patient' && pendingBookingAfterAuth) {
      setDashboardTab('book');
      setPendingBookingAfterAuth(false);
    } else {
      setDashboardTab('overview');
      setPendingBookingAfterAuth(false);
    }

    setView('dashboard');
    addToast({
      type: 'success',
      title:
        role === 'patient'
          ? `Bienvenido a MedicaRD, ${matchedPatient?.name ?? 'Camila Morales'}`
          : 'Sesión clínica iniciada · Dra. Elena Vargas',
      description:
        role === 'patient'
          ? 'Accediste al Portal de Paciente.'
          : 'Accediste a la Agenda Médica de Cardiología.',
    });
  };

  const registerPatient = (input: RegisterPatientInput) => {
    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      name: input.name.trim(),
      cedula: input.cedula.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      birthDate: '1995-01-15',
      bloodType: 'O+',
      arsProvider: input.arsProvider,
      arsPolicyNumber: `POL-${Math.floor(1000000 + Math.random() * 9000000)}`,
      allergies: 'Sin alergias registradas',
      emergencyContact: 'Pendiente de completar',
    };

    setPersisted((prev) => ({
      ...prev,
      patients: [newPatient, ...prev.patients],
    }));

    setSession({
      authenticated: true,
      role: 'patient',
      patientId: newPatient.id,
      doctorId: 'doc-elena',
    });

    setDashboardTab(pendingBookingAfterAuth ? 'book' : 'overview');
    setPendingBookingAfterAuth(false);
    setView('dashboard');

    addToast({
      type: 'success',
      title: 'Cuenta registrada correctamente',
      description: `Hola ${newPatient.name}, tu perfil clínico ya está activo.`,
    });
  };

  const logout = () => {
    setSession((prev) => ({ ...prev, authenticated: false }));
    setPendingBookingAfterAuth(false);
    setView('landing');
    addToast({
      type: 'info',
      title: 'Sesión cerrada',
      description: 'Has salido de forma segura de tu cuenta en MedicaRD.',
    });
  };

  const switchRole = (role: UserRole) => {
    setSession((prev) => ({ ...prev, role }));
    setDashboardTab((current) => {
      if (role === 'doctor' && (current === 'book' || current === 'profile')) {
        return 'overview';
      }
      if (role === 'patient' && current === 'patients') {
        return 'overview';
      }
      return current;
    });
    addToast({
      type: 'info',
      title: role === 'doctor' ? 'Cambiaste a Vista Médica' : 'Cambiaste a Portal de Paciente',
      description:
        role === 'doctor'
          ? 'Ahora visualizas la agenda clínica de la Dra. Elena Vargas.'
          : `Ahora visualizas las citas y expedientes de ${currentPatient.name}.`,
    });
  };

  const isSlotTaken = (
    doctorId: string,
    date: string,
    time: string,
    excludeAppointmentId?: string
  ) => {
    return persisted.appointments.some(
      (apt) =>
        apt.id !== excludeAppointmentId &&
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.time === time &&
        apt.status !== 'cancelada'
    );
  };

  const createAppointment = (input: CreateAppointmentInput): Appointment | null => {
    if (isSlotTaken(input.doctorId, input.date, input.time)) {
      addToast({
        type: 'error',
        title: 'Horario no disponible',
        description: 'Ese bloque horario ya fue reservado. Selecciona otra hora.',
      });
      return null;
    }

    const patient = persisted.patients.find((p) => p.id === input.patientId) ?? persisted.patients[0];
    const nextCodeNumber = 1060 + persisted.appointments.length;
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      code: `MED-2026-${nextCodeNumber}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: input.doctorId,
      specialtyId: input.specialtyId,
      branchId: input.branchId,
      date: input.date,
      time: input.time,
      mode: input.mode,
      reason: input.reason.trim(),
      arsUsed: input.arsUsed,
      copayDop: input.copayDop,
      status: 'pendiente',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setPersisted((prev) => ({
      ...prev,
      appointments: [newAppointment, ...prev.appointments],
    }));

    setBookingPrefill({});

    addToast({
      type: 'success',
      title: `Cita ${newAppointment.code} agendada`,
      description: 'La cita fue registrada y ya aparece en el panel del paciente y la agenda médica.',
    });

    return newAppointment;
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string): boolean => {
    const target = persisted.appointments.find((a) => a.id === id);
    if (!target) return false;

    if (isSlotTaken(target.doctorId, newDate, newTime, id)) {
      addToast({
        type: 'error',
        title: 'Conflicto de horario',
        description: 'El especialista ya tiene una consulta programada en esa fecha y hora.',
      });
      return false;
    }

    setPersisted((prev) => ({
      ...prev,
      appointments: prev.appointments.map((apt) =>
        apt.id === id
          ? { ...apt, date: newDate, time: newTime, status: 'confirmada' }
          : apt
      ),
    }));

    addToast({
      type: 'success',
      title: 'Cita reprogramada',
      description: `Nuevo horario confirmado: ${newDate} a las ${newTime}.`,
    });
    return true;
  };

  const updateAppointmentStatus = (
    id: string,
    status: AppointmentStatus,
    options?: {
      cancellationReason?: string;
      diagnosis?: string;
      prescription?: string;
      notes?: string;
      bloodPressure?: string;
      heartRate?: string;
    }
  ) => {
    const target = persisted.appointments.find((a) => a.id === id);
    if (!target) return;

    setPersisted((prev) => {
      const updatedAppointments = prev.appointments.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status,
              cancellationReason:
                status === 'cancelada'
                  ? options?.cancellationReason?.trim() || 'Cancelada por el usuario'
                  : apt.cancellationReason,
            }
          : apt
      );

      let updatedRecords = prev.clinicalRecords;
      if (status === 'completada' && options?.diagnosis) {
        const newRecord: ClinicalRecord = {
          id: `rec-${Date.now()}`,
          appointmentId: target.id,
          patientId: target.patientId,
          doctorId: target.doctorId,
          date: target.date,
          diagnosis: options.diagnosis.trim(),
          prescription: options.prescription?.trim() || 'Seguimiento clínico estándar.',
          notes: options.notes?.trim() || 'Consulta finalizada sin complicaciones.',
          bloodPressure: options.bloodPressure?.trim() || '120/80 mmHg',
          heartRate: options.heartRate?.trim() || '72 lpm',
        };
        updatedRecords = [newRecord, ...prev.clinicalRecords];
      }

      return {
        ...prev,
        appointments: updatedAppointments,
        clinicalRecords: updatedRecords,
      };
    });

    const statusCopy: Record<AppointmentStatus, string> = {
      confirmada: 'Cita confirmada en agenda.',
      pendiente: 'Cita marcada como pendiente.',
      completada: 'Consulta completada y nota clínica guardada en el historial.',
      cancelada: 'La cita ha sido cancelada y el horario quedó liberado.',
    };

    addToast({
      type: status === 'cancelada' ? 'info' : 'success',
      title: `Cita ${target.code} actualizada`,
      description: statusCopy[status],
    });
  };

  const updatePatientProfile = (patientId: string, updates: Partial<Patient>) => {
    setPersisted((prev) => ({
      ...prev,
      patients: prev.patients.map((p) => (p.id === patientId ? { ...p, ...updates } : p)),
      appointments: updates.name
        ? prev.appointments.map((a) =>
            a.patientId === patientId ? { ...a, patientName: updates.name! } : a
          )
        : prev.appointments,
    }));

    addToast({
      type: 'success',
      title: 'Perfil clínico actualizado',
      description: 'Los cambios se guardaron correctamente en el expediente simulado.',
    });
  };

  const resetDemoData = () => {
    const fresh: PersistedState = {
      appointments: createInitialAppointments(),
      patients: INITIAL_PATIENTS,
      clinicalRecords: createInitialClinicalRecords(),
    };
    setPersisted(fresh);
    setSession((prev) => ({
      ...prev,
      patientId: 'pat-camila',
      doctorId: 'doc-elena',
    }));
    addToast({
      type: 'info',
      title: 'Datos de demostración restablecidos',
      description: 'Se restauraron todas las citas, expedientes y pacientes iniciales.',
    });
  };

  const currentPatient =
    persisted.patients.find((p) => p.id === session.patientId) ?? persisted.patients[0];
  const currentDoctor = DOCTORS.find((d) => d.id === session.doctorId) ?? DOCTORS[0];

  return (
    <MedicaContext.Provider
      value={{
        view,
        previousView,
        setView,
        openGuide,
        closeGuide,
        dashboardTab,
        setDashboardTab,
        session,
        currentPatient,
        currentDoctor,
        appointments: persisted.appointments,
        patients: persisted.patients,
        clinicalRecords: persisted.clinicalRecords,
        bookingPrefill,
        setBookingPrefill,
        startQuickBooking,
        loginAsDemo,
        registerPatient,
        logout,
        switchRole,
        isSlotTaken,
        createAppointment,
        rescheduleAppointment,
        updateAppointmentStatus,
        updatePatientProfile,
        resetDemoData,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </MedicaContext.Provider>
  );
}

export function useMedica() {
  const ctx = useContext(MedicaContext);
  if (!ctx) {
    throw new Error('useMedica debe usarse dentro de MedicaProvider');
  }
  return ctx;
}

export function getDoctorById(doctorId: string) {
  return DOCTORS.find((d) => d.id === doctorId);
}

export function getSpecialtyById(specialtyId: string) {
  return SPECIALTIES.find((s) => s.id === specialtyId);
}

export function getBranchById(branchId: string) {
  return BRANCHES.find((b) => b.id === branchId);
}
