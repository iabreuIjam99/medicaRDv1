import React from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Plus,
  Users,
} from 'lucide-react';
import { formatDateSpanish, formatDop, getTodayIso } from '../../data/mockData';
import {
  getBranchById,
  getDoctorById,
  getSpecialtyById,
  useMedica,
} from '../../context/MedicaContext';
import { SafeImage, StatusIndicator } from '../ui/Primitives';

export function DashboardOverview() {
  const {
    session,
    currentPatient,
    currentDoctor,
    appointments,
    clinicalRecords,
    patients,
    setDashboardTab,
    updateAppointmentStatus,
  } = useMedica();

  const today = getTodayIso();
  const isDoctor = session.role === 'doctor';

  const scopedAppointments = isDoctor
    ? appointments.filter((a) => a.doctorId === currentDoctor.id)
    : appointments.filter((a) => a.patientId === currentPatient.id);

  const upcomingAppointments = scopedAppointments
    .filter((a) => a.status === 'confirmada' || a.status === 'pendiente')
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const nextAppointment = upcomingAppointments[0];
  const completedCount = scopedAppointments.filter((a) => a.status === 'completada').length;
  const pendingCount = scopedAppointments.filter((a) => a.status === 'pendiente').length;
  const todayCount = scopedAppointments.filter(
    (a) => a.date === today && a.status !== 'cancelada'
  ).length;

  const patientRecords = clinicalRecords.filter((r) => r.patientId === currentPatient.id);

  const nextDoctor = nextAppointment ? getDoctorById(nextAppointment.doctorId) : undefined;
  const nextSpecialty = nextAppointment
    ? getSpecialtyById(nextAppointment.specialtyId)
    : undefined;
  const nextBranch = nextAppointment ? getBranchById(nextAppointment.branchId) : undefined;

  return (
    <div className="space-y-8">
      {/* Greeting & context */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-[#0D9488]">
            {isDoctor ? 'Agenda médica · Cardiología' : 'Portal de Paciente · MedicaRD'}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
            {isDoctor ? `Buenos días, ${currentDoctor.name}` : `Hola, ${currentPatient.name}`}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isDoctor
              ? 'Revisa tus consultas programadas, confirma turnos pendientes y registra notas clínicas.'
              : `Aseguradora activa: ${currentPatient.arsProvider} · Póliza ${currentPatient.arsPolicyNumber}.`}
          </p>
        </div>

        {!isDoctor && (
          <button
            type="button"
            onClick={() => setDashboardTab('book')}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-[#0F3D5E] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0B2E48] whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Agendar nueva cita</span>
          </button>
        )}
      </div>

      {/* KPI Strip — single flat surface with internal hairline dividers (no nested cards) */}
      <section
        aria-label="Indicadores principales"
        className="grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x"
      >
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            {isDoctor ? 'Citas programadas hoy' : 'Próximas citas activas'}
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold text-[#0F3D5E] tabular-nums">
            {isDoctor ? todayCount : upcomingAppointments.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isDoctor ? 'Turnos en Torre Piantini' : 'Confirmadas y pendientes'}
          </p>
        </div>

        <div className="p-5 sm:border-l sm:border-slate-200 lg:border-l-0">
          <p className="text-xs font-medium text-slate-500">Pendientes por confirmar</p>
          <p className="mt-2 font-mono text-3xl font-semibold text-[#B45309] tabular-nums">
            {pendingCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isDoctor ? 'Requieren validación médica' : 'En revisión de recepción'}
          </p>
        </div>

        <div className="p-5 sm:border-t sm:border-slate-200 lg:border-t-0">
          <p className="text-xs font-medium text-slate-500">Consultas completadas</p>
          <p className="mt-2 font-mono text-3xl font-semibold text-[#0D9488] tabular-nums">
            {completedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Con historial registrado</p>
        </div>

        <div className="p-5 sm:border-t sm:border-l sm:border-slate-200 lg:border-t-0 lg:border-l-0">
          <p className="text-xs font-medium text-slate-500">
            {isDoctor ? 'Pacientes registrados' : 'Notas y recetas clínicas'}
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold text-slate-900 tabular-nums">
            {isDoctor ? patients.length : patientRecords.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isDoctor ? 'Expedientes activos en red' : 'Disponibles para consulta'}
          </p>
        </div>
      </section>

      {/* Main 2-column split: Next Appointment Spotlight + Quick Actions/Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Next Appointment Spotlight */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              {isDoctor ? 'Siguiente paciente en agenda' : 'Tu próxima cita médica'}
            </h2>
            <button
              type="button"
              onClick={() => setDashboardTab('appointments')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F3D5E] hover:text-[#0D9488]"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {nextAppointment ? (
            <div className="mt-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <SafeImage
                      src={isDoctor ? undefined : nextDoctor?.imageUrl}
                      alt={isDoctor ? nextAppointment.patientName : nextDoctor?.name ?? 'Especialista'}
                      fallbackInitials={
                        isDoctor
                          ? nextAppointment.patientName
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                          : nextDoctor?.initials
                      }
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-slate-500 tabular-nums">
                      {nextAppointment.code} · {nextAppointment.mode}
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-semibold text-slate-900">
                      {isDoctor ? nextAppointment.patientName : nextDoctor?.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {nextSpecialty?.name} · {nextBranch?.city} ({nextBranch?.name})
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusIndicator status={nextAppointment.status} />
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-4 border-y border-slate-200 py-4 text-sm sm:grid-cols-3">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Calendar className="h-4 w-4 shrink-0 text-[#0D9488]" aria-hidden="true" />
                  <span className="font-mono text-xs font-medium tabular-nums">
                    {formatDateSpanish(nextAppointment.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Clock className="h-4 w-4 shrink-0 text-[#0D9488]" aria-hidden="true" />
                  <span className="font-mono text-xs font-medium tabular-nums">
                    {nextAppointment.time} hrs
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <MapPin className="h-4 w-4 shrink-0 text-[#0D9488]" aria-hidden="true" />
                  <span className="text-xs font-medium">
                    {nextAppointment.arsUsed} · {formatDop(nextAppointment.copayDop)}
                  </span>
                </div>
              </dl>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Motivo:</span>{' '}
                {nextAppointment.reason}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {isDoctor && nextAppointment.status === 'pendiente' && (
                  <button
                    type="button"
                    onClick={() => updateAppointmentStatus(nextAppointment.id, 'confirmada')}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F766E]"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Confirmar turno</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setDashboardTab('appointments')}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0F3D5E] hover:text-[#0F3D5E]"
                >
                  <span>{isDoctor ? 'Gestionar en agenda' : 'Reprogramar o ver detalle'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-800">
                No tienes citas activas programadas en este momento.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Puedes reservar una nueva consulta o revisar tus atenciones anteriores.
              </p>
              {!isDoctor && (
                <button
                  type="button"
                  onClick={() => setDashboardTab('book')}
                  className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#0F3D5E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B2E48]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Agendar primera cita</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Secondary Column: Upcoming List / Recent Clinical Summary */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              {isDoctor ? 'Resumen rápido de consulta' : 'Historial clínico reciente'}
            </h2>
            <button
              type="button"
              onClick={() => setDashboardTab(isDoctor ? 'patients' : 'profile')}
              className="text-xs font-semibold text-[#0F3D5E] hover:text-[#0D9488]"
            >
              {isDoctor ? 'Ver pacientes' : 'Ver historial'}
            </button>
          </div>

          {isDoctor ? (
            <div className="mt-4 divide-y divide-slate-200">
              {upcomingAppointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {apt.patientName}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-slate-500 tabular-nums">
                      {formatDateSpanish(apt.date)} · {apt.time} · {apt.mode}
                    </p>
                  </div>
                  <StatusIndicator status={apt.status} />
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <p className="py-8 text-center text-xs text-slate-500">
                  No hay pacientes pendientes en tu agenda.
                </p>
              )}

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setDashboardTab('patients')}
                  className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0D9488] hover:text-[#0F3D5E]"
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <span>Abrir directorio de pacientes ({patients.length})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-200">
              {patientRecords.slice(0, 3).map((rec) => {
                const doctor = getDoctorById(rec.doctorId);
                return (
                  <div key={rec.id} className="py-3.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{doctor?.name}</span>
                      <span className="font-mono tabular-nums">
                        {formatDateSpanish(rec.date)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-900">{rec.diagnosis}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {rec.prescription}
                    </p>
                  </div>
                );
              })}

              {patientRecords.length === 0 && (
                <p className="py-8 text-center text-xs text-slate-500">
                  Aún no hay notas clínicas registradas en tu expediente.
                </p>
              )}

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setDashboardTab('profile')}
                  className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0D9488] hover:text-[#0F3D5E]"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>Ver perfil médico completo</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
