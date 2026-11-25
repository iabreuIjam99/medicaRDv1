import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Plus,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';
import { BRANCHES, formatDateSpanish, formatDop, getTodayIso } from '../../data/mockData';
import {
  getBranchById,
  getDoctorById,
  getSpecialtyById,
  useMedica,
} from '../../context/MedicaContext';
import { Appointment, AppointmentStatus } from '../../types/medical';
import { Modal, SkeletonRows, StatusIndicator } from '../ui/Primitives';

type StatusFilter = 'todas' | AppointmentStatus;

export function AppointmentsView() {
  const {
    session,
    currentPatient,
    currentDoctor,
    appointments,
    clinicalRecords,
    setDashboardTab,
    isSlotTaken,
    rescheduleAppointment,
    updateAppointmentStatus,
  } = useMedica();

  const isDoctor = session.role === 'doctor';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  // Modal states
  const [detailModalApt, setDetailModalApt] = useState<Appointment | null>(null);
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [completeModalApt, setCompleteModalApt] = useState<Appointment | null>(null);

  // Reschedule form state
  const [newDate, setNewDate] = useState(getTodayIso());
  const [newTime, setNewTime] = useState('');

  // Cancel form state
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Complete consultation (doctor) form state
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [bloodPressure, setBloodPressure] = useState('120/78 mmHg');
  const [heartRate, setHeartRate] = useState('70 lpm');
  const [completeError, setCompleteError] = useState('');

  const scopedAppointments = useMemo(() => {
    const base = isDoctor
      ? appointments.filter((a) => a.doctorId === currentDoctor.id)
      : appointments.filter((a) => a.patientId === currentPatient.id);

    return base
      .filter((apt) => {
        if (statusFilter !== 'todas' && apt.status !== statusFilter) return false;
        if (branchFilter !== 'all' && apt.branchId !== branchFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const doc = getDoctorById(apt.doctorId);
          const sp = getSpecialtyById(apt.specialtyId);
          const match =
            apt.code.toLowerCase().includes(q) ||
            apt.patientName.toLowerCase().includes(q) ||
            (doc?.name.toLowerCase().includes(q) ?? false) ||
            (sp?.name.toLowerCase().includes(q) ?? false) ||
            apt.reason.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }, [
    appointments,
    branchFilter,
    currentDoctor.id,
    currentPatient.id,
    isDoctor,
    searchQuery,
    statusFilter,
  ]);

  const triggerSimulatedRefresh = () => {
    setIsSimulatingLoad(true);
    window.setTimeout(() => setIsSimulatingLoad(false), 550);
  };

  const openRescheduleModal = (apt: Appointment) => {
    setRescheduleModalApt(apt);
    setNewDate(apt.date >= getTodayIso() ? apt.date : getTodayIso());
    setNewTime('');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalApt || !newDate || !newTime) return;
    const ok = rescheduleAppointment(rescheduleModalApt.id, newDate, newTime);
    if (ok) {
      setRescheduleModalApt(null);
    }
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalApt) return;
    if (cancelReason.trim().length < 5) {
      setCancelError('Indica brevemente el motivo de cancelación (mínimo 5 caracteres).');
      return;
    }
    updateAppointmentStatus(cancelModalApt.id, 'cancelada', {
      cancellationReason: cancelReason,
    });
    setCancelReason('');
    setCancelError('');
    setCancelModalApt(null);
  };

  const handleConfirmComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeModalApt) return;
    if (diagnosis.trim().length < 5) {
      setCompleteError('El diagnóstico clínico es obligatorio para cerrar la consulta.');
      return;
    }
    updateAppointmentStatus(completeModalApt.id, 'completada', {
      diagnosis,
      prescription,
      notes: clinicalNotes,
      bloodPressure,
      heartRate,
    });
    setDiagnosis('');
    setPrescription('');
    setClinicalNotes('');
    setCompleteError('');
    setCompleteModalApt(null);
  };

  const statusTabs: { value: StatusFilter; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
  ];

  const rescheduleDoctor = rescheduleModalApt
    ? getDoctorById(rescheduleModalApt.doctorId)
    : undefined;

  const detailRecord = detailModalApt
    ? clinicalRecords.find((r) => r.appointmentId === detailModalApt.id)
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            {isDoctor ? 'Agenda de citas médicas' : 'Mis citas médicas'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isDoctor
              ? 'Confirma turnos, completa consultas con nota clínica o reprograma horarios.'
              : 'Consulta tus próximas citas, reprograma horarios o revisa el detalle de tus visitas.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerSimulatedRefresh}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isSimulatingLoad ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Actualizar</span>
          </button>

          {!isDoctor && (
            <button
              type="button"
              onClick={() => setDashboardTab('book')}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#0F3D5E] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0B2E48] whitespace-nowrap"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Nueva cita</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Segmented status filter */}
          <div
            role="group"
            aria-label="Filtrar citas por estado"
            className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`min-h-[34px] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  statusFilter === tab.value
                    ? 'bg-white text-[#0F3D5E] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar código, médico o motivo..."
                aria-label="Buscar citas médicas"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-xs text-slate-900 focus:border-[#0D9488]"
              />
            </div>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              aria-label="Filtrar por sede"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700 focus:border-[#0D9488]"
            >
              <option value="all">Todas las sedes</option>
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.city} · {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {isSimulatingLoad ? (
          <SkeletonRows count={5} />
        ) : scopedAppointments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Calendar className="mx-auto h-9 w-9 text-slate-300" aria-hidden="true" />
            <h2 className="mt-3 font-display text-base font-semibold text-slate-900">
              No se encontraron citas con estos filtros
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Prueba cambiando el estado seleccionado o limpiando el término de búsqueda.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('todas');
                  setBranchFilter('all');
                }}
                className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Limpiar filtros
              </button>
              {!isDoctor && (
                <button
                  type="button"
                  onClick={() => setDashboardTab('book')}
                  className="min-h-[40px] rounded-lg bg-[#0F3D5E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B2E48]"
                >
                  Agendar cita nueva
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                    <th className="px-5 py-3.5">Código y Fecha</th>
                    <th className="px-5 py-3.5">{isDoctor ? 'Paciente' : 'Especialista'}</th>
                    <th className="px-5 py-3.5">Sede y Modalidad</th>
                    <th className="px-5 py-3.5 text-right">Copago</th>
                    <th className="px-5 py-3.5">Estado</th>
                    <th className="px-5 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scopedAppointments.map((apt) => {
                    const doc = getDoctorById(apt.doctorId);
                    const sp = getSpecialtyById(apt.specialtyId);
                    const br = getBranchById(apt.branchId);
                    const isActive = apt.status === 'confirmada' || apt.status === 'pendiente';

                    return (
                      <tr key={apt.id} className="transition-colors hover:bg-slate-50/80">
                        <td className="px-5 py-3.5 align-middle">
                          <p className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                            {apt.code}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-slate-500 tabular-nums">
                            {formatDateSpanish(apt.date)} · {apt.time}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 align-middle">
                          <p className="font-medium text-slate-900">
                            {isDoctor ? apt.patientName : doc?.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">{sp?.name}</p>
                        </td>
                        <td className="px-5 py-3.5 align-middle">
                          <p className="text-xs font-medium text-slate-800">{br?.city}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {apt.mode} · {apt.arsUsed}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-right align-middle font-mono text-xs font-medium text-slate-900 tabular-nums">
                          {formatDop(apt.copayDop)}
                        </td>
                        <td className="px-5 py-3.5 align-middle">
                          <StatusIndicator status={apt.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right align-middle">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDetailModalApt(apt)}
                              title="Ver detalle"
                              className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Ver</span>
                            </button>

                            {isDoctor && apt.status === 'pendiente' && (
                              <button
                                type="button"
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmada')}
                                className="inline-flex h-8 items-center gap-1 rounded-md bg-[#0D9488] px-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0F766E]"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Confirmar</span>
                              </button>
                            )}

                            {isDoctor && isActive && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCompleteModalApt(apt);
                                  setCompleteError('');
                                }}
                                className="inline-flex h-8 items-center gap-1 rounded-md bg-[#0F3D5E] px-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0B2E48]"
                              >
                                <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Atender</span>
                              </button>
                            )}

                            {!isDoctor && isActive && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openRescheduleModal(apt)}
                                  className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-[#0F3D5E] transition-colors hover:border-[#0F3D5E]"
                                >
                                  Reprogramar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCancelModalApt(apt);
                                    setCancelReason('');
                                    setCancelError('');
                                  }}
                                  className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-[#B91C1C] transition-colors hover:border-[#B91C1C]"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="divide-y divide-slate-200 md:hidden">
              {scopedAppointments.map((apt) => {
                const doc = getDoctorById(apt.doctorId);
                const sp = getSpecialtyById(apt.specialtyId);
                const br = getBranchById(apt.branchId);
                const isActive = apt.status === 'confirmada' || apt.status === 'pendiente';

                return (
                  <div key={apt.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs text-slate-500 tabular-nums">
                          {apt.code} · {formatDateSpanish(apt.date)} · {apt.time}
                        </p>
                        <p className="mt-0.5 font-display text-sm font-semibold text-slate-900">
                          {isDoctor ? apt.patientName : doc?.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          {sp?.name} · {br?.city} · {apt.mode}
                        </p>
                      </div>
                      <StatusIndicator status={apt.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setDetailModalApt(apt)}
                        className="min-h-[38px] rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700"
                      >
                        Ver detalle
                      </button>

                      {isDoctor && apt.status === 'pendiente' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, 'confirmada')}
                          className="min-h-[38px] rounded-lg bg-[#0D9488] px-3 text-xs font-semibold text-white"
                        >
                          Confirmar
                        </button>
                      )}

                      {isDoctor && isActive && (
                        <button
                          type="button"
                          onClick={() => {
                            setCompleteModalApt(apt);
                            setCompleteError('');
                          }}
                          className="min-h-[38px] rounded-lg bg-[#0F3D5E] px-3 text-xs font-semibold text-white"
                        >
                          Atender
                        </button>
                      )}

                      {!isDoctor && isActive && (
                        <>
                          <button
                            type="button"
                            onClick={() => openRescheduleModal(apt)}
                            className="min-h-[38px] rounded-lg border border-[#0F3D5E] bg-white px-3 text-xs font-semibold text-[#0F3D5E]"
                          >
                            Reprogramar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCancelModalApt(apt);
                              setCancelReason('');
                              setCancelError('');
                            }}
                            className="min-h-[38px] rounded-lg border border-[#B91C1C]/40 bg-white px-3 text-xs font-semibold text-[#B91C1C]"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal 1: Appointment Details */}
      <Modal
        open={Boolean(detailModalApt)}
        onClose={() => setDetailModalApt(null)}
        title={detailModalApt ? `Detalle de cita ${detailModalApt.code}` : ''}
        subtitle={
          detailModalApt
            ? `${formatDateSpanish(detailModalApt.date)} · ${detailModalApt.time} hrs`
            : undefined
        }
        footer={
          <button
            type="button"
            onClick={() => setDetailModalApt(null)}
            className="min-h-[40px] rounded-lg bg-[#0F3D5E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B2E48]"
          >
            Cerrar
          </button>
        }
      >
        {detailModalApt && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-medium text-slate-500">Estado actual</span>
              <StatusIndicator status={detailModalApt.status} />
            </div>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Paciente</dt>
                <dd className="mt-0.5 font-medium text-slate-900">{detailModalApt.patientName}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Especialista</dt>
                <dd className="mt-0.5 font-medium text-slate-900">
                  {getDoctorById(detailModalApt.doctorId)?.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Especialidad</dt>
                <dd className="mt-0.5 text-slate-800">
                  {getSpecialtyById(detailModalApt.specialtyId)?.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Sede y modalidad</dt>
                <dd className="mt-0.5 text-slate-800">
                  {getBranchById(detailModalApt.branchId)?.name} · {detailModalApt.mode}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Cobertura ARS</dt>
                <dd className="mt-0.5 text-slate-800">{detailModalApt.arsUsed}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Copago estimado</dt>
                <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
                  {formatDop(detailModalApt.copayDop)}
                </dd>
              </div>
            </dl>

            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-semibold text-slate-500">Motivo de consulta</p>
              <p className="mt-1 leading-relaxed text-slate-700">{detailModalApt.reason}</p>
            </div>

            {detailModalApt.cancellationReason && (
              <div className="rounded-lg border border-[#B91C1C]/20 bg-[#FEF2F2] p-3.5 text-xs text-[#991B1B]">
                <p className="font-semibold">Motivo de cancelación</p>
                <p className="mt-1">{detailModalApt.cancellationReason}</p>
              </div>
            )}

            {detailRecord && (
              <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 space-y-2">
                <p className="text-xs font-semibold text-[#0F3D5E]">Nota clínica registrada</p>
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Diagnóstico:</span> {detailRecord.diagnosis}
                </p>
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Prescripción:</span> {detailRecord.prescription}
                </p>
                <p className="font-mono text-xs text-slate-500 tabular-nums">
                  PA: {detailRecord.bloodPressure} · FC: {detailRecord.heartRate}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal 2: Reschedule Appointment */}
      <Modal
        open={Boolean(rescheduleModalApt)}
        onClose={() => setRescheduleModalApt(null)}
        title="Reprogramar cita médica"
        subtitle={
          rescheduleModalApt
            ? `${rescheduleModalApt.code} · ${rescheduleDoctor?.name}`
            : undefined
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => setRescheduleModalApt(null)}
              className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="reschedule-form"
              disabled={!newTime}
              className="min-h-[40px] rounded-lg bg-[#0F3D5E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B2E48] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar nuevo horario
            </button>
          </>
        }
      >
        {rescheduleModalApt && rescheduleDoctor && (
          <form id="reschedule-form" onSubmit={handleConfirmReschedule} className="space-y-4">
            <div>
              <label htmlFor="reschedule-date" className="block text-xs font-semibold text-slate-700">
                Nueva fecha
              </label>
              <input
                id="reschedule-date"
                type="date"
                min={getTodayIso()}
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  setNewTime('');
                }}
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 font-mono text-sm text-slate-900 tabular-nums focus:border-[#0D9488]"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700">
                Horarios disponibles para {rescheduleDoctor.name}
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {rescheduleDoctor.availableTimes.map((time) => {
                  const taken = isSlotTaken(
                    rescheduleDoctor.id,
                    newDate,
                    time,
                    rescheduleModalApt.id
                  );
                  const selected = newTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={taken}
                      onClick={() => setNewTime(time)}
                      className={`min-h-[40px] rounded-lg border font-mono text-xs font-medium tabular-nums transition-colors ${
                        taken
                          ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through'
                          : selected
                            ? 'border-[#0D9488] bg-[#0D9488] text-white'
                            : 'border-slate-300 bg-white text-slate-800 hover:border-[#0D9488]'
                      }`}
                    >
                      {taken ? `${time} Ocup.` : time}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal 3: Cancel Appointment */}
      <Modal
        open={Boolean(cancelModalApt)}
        onClose={() => setCancelModalApt(null)}
        title="Confirmar cancelación de cita"
        subtitle={cancelModalApt ? `${cancelModalApt.code} · Liberar espacio en agenda` : undefined}
        footer={
          <>
            <button
              type="button"
              onClick={() => setCancelModalApt(null)}
              className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Mantener cita
            </button>
            <button
              type="submit"
              form="cancel-form"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#B91C1C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#991B1B]"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              <span>Cancelar cita</span>
            </button>
          </>
        }
      >
        <form id="cancel-form" onSubmit={handleConfirmCancel} className="space-y-4">
          <p className="text-sm text-slate-600">
            Al cancelar esta consulta, el bloque horario volverá a quedar disponible para otros
            pacientes de MedicaRD.
          </p>
          <div>
            <label htmlFor="cancel-reason" className="block text-xs font-semibold text-slate-700">
              Motivo de cancelación
            </label>
            <textarea
              id="cancel-reason"
              rows={3}
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                if (cancelError) setCancelError('');
              }}
              placeholder="Ej. Imprevisto laboral, reagendaré para la próxima semana."
              className={`mt-1.5 w-full rounded-lg border bg-white p-3 text-sm text-slate-900 ${
                cancelError ? 'border-[#B91C1C]' : 'border-slate-300 focus:border-[#0D9488]'
              }`}
            />
            {cancelError && (
              <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{cancelError}</span>
              </p>
            )}
          </div>
        </form>
      </Modal>

      {/* Modal 4: Doctor Complete Consultation */}
      <Modal
        open={Boolean(completeModalApt)}
        onClose={() => setCompleteModalApt(null)}
        title="Registrar atención y nota clínica"
        subtitle={
          completeModalApt
            ? `Paciente: ${completeModalApt.patientName} · ${completeModalApt.code}`
            : undefined
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => setCompleteModalApt(null)}
              className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="complete-form"
              className="min-h-[40px] rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F766E]"
            >
              Finalizar consulta y guardar nota
            </button>
          </>
        }
      >
        <form id="complete-form" onSubmit={handleConfirmComplete} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="vital-bp" className="block text-xs font-semibold text-slate-700">
                Presión arterial
              </label>
              <input
                id="vital-bp"
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-xs text-slate-900 tabular-nums"
              />
            </div>
            <div>
              <label htmlFor="vital-hr" className="block text-xs font-semibold text-slate-700">
                Frecuencia cardíaca
              </label>
              <input
                id="vital-hr"
                type="text"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-xs text-slate-900 tabular-nums"
              />
            </div>
          </div>

          <div>
            <label htmlFor="clinical-dx" className="block text-xs font-semibold text-slate-700">
              Diagnóstico clínico
            </label>
            <input
              id="clinical-dx"
              type="text"
              value={diagnosis}
              onChange={(e) => {
                setDiagnosis(e.target.value);
                if (completeError) setCompleteError('');
              }}
              placeholder="Ej. Evolución cardiovascular estable sin hallazgos agudos"
              className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm text-slate-900 ${
                completeError ? 'border-[#B91C1C]' : 'border-slate-300 focus:border-[#0D9488]'
              }`}
            />
            {completeError && (
              <p role="alert" className="mt-1 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{completeError}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="clinical-rx" className="block text-xs font-semibold text-slate-700">
              Indicaciones y prescripción
            </label>
            <textarea
              id="clinical-rx"
              rows={2}
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Medicamentos, dosis o estudios recomendados..."
              className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:border-[#0D9488]"
            />
          </div>

          <div>
            <label htmlFor="clinical-notes" className="block text-xs font-semibold text-slate-700">
              Observaciones adicionales
            </label>
            <textarea
              id="clinical-notes"
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Seguimiento en 6 meses..."
              className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:border-[#0D9488]"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
