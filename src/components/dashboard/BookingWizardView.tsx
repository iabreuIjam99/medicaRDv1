import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Video,
} from 'lucide-react';
import {
  ARS_PROVIDERS,
  BRANCHES,
  DOCTORS,
  formatDateSpanish,
  formatDop,
  getTodayIso,
  SPECIALTIES,
} from '../../data/mockData';
import { getBranchById, getDoctorById, getSpecialtyById, useMedica } from '../../context/MedicaContext';
import { Appointment, ConsultationMode } from '../../types/medical';
import { Modal, SafeImage } from '../ui/Primitives';

export function BookingWizardView() {
  const {
    currentPatient,
    bookingPrefill,
    isSlotTaken,
    createAppointment,
    setDashboardTab,
  } = useMedica();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [specialtyId, setSpecialtyId] = useState(
    bookingPrefill.specialtyId || SPECIALTIES[0].id
  );
  const [branchId, setBranchId] = useState(bookingPrefill.branchId || 'all');
  const [mode, setMode] = useState<ConsultationMode>('Presencial');
  const [doctorId, setDoctorId] = useState(bookingPrefill.doctorId || '');
  const [date, setDate] = useState(bookingPrefill.date || getTodayIso());
  const [time, setTime] = useState('');
  const [arsUsed, setArsUsed] = useState(currentPatient.arsProvider);
  const [reason, setReason] = useState('');
  const [stepError, setStepError] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  const matchingDoctors = useMemo(() => {
    const exact = DOCTORS.filter(
      (d) =>
        d.specialtyId === specialtyId &&
        (branchId === 'all' || d.branchId === branchId)
    );
    if (exact.length > 0) return exact;
    return DOCTORS.filter((d) => d.specialtyId === specialtyId);
  }, [specialtyId, branchId]);

  useEffect(() => {
    if (
      !doctorId ||
      !matchingDoctors.some((d) => d.id === doctorId)
    ) {
      setDoctorId(matchingDoctors[0]?.id ?? DOCTORS[0].id);
      setTime('');
    }
  }, [matchingDoctors, doctorId]);

  const selectedDoctor = getDoctorById(doctorId) ?? matchingDoctors[0] ?? DOCTORS[0];
  const selectedSpecialty = getSpecialtyById(specialtyId);
  const effectiveBranch = getBranchById(selectedDoctor.branchId) ?? BRANCHES[0];

  const isPrivate = arsUsed.toLowerCase().includes('privada');
  const estimatedCopay = isPrivate ? selectedDoctor.feeDop : selectedDoctor.arsCopayDop;

  const handleNextFromStep1 = () => {
    setStepError('');
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!date) {
      setStepError('Selecciona una fecha válida para tu consulta.');
      return;
    }
    if (!time) {
      setStepError('Selecciona un bloque horario disponible antes de continuar.');
      return;
    }
    setStepError('');
    setStep(3);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      setStepError('Describe brevemente tu motivo de consulta (mínimo 10 caracteres).');
      return;
    }
    setStepError('');

    const created = createAppointment({
      patientId: currentPatient.id,
      doctorId: selectedDoctor.id,
      specialtyId: selectedDoctor.specialtyId,
      branchId: selectedDoctor.branchId,
      date,
      time,
      mode,
      reason,
      arsUsed,
      copayDop: estimatedCopay,
    });

    if (created) {
      setCreatedAppointment(created);
    }
  };

  const steps = [
    { num: 1, title: '01. Especialidad y modalidad' },
    { num: 2, title: '02. Especialista y horario' },
    { num: 3, title: '03. Motivo y confirmación' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Agendar nueva cita médica
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Completa los tres pasos para reservar tu consulta con validación horaria inmediata.
        </p>
      </div>

      {/* Step progress indicator */}
      <nav
        aria-label="Progreso de reserva"
        className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-3"
      >
        {steps.map((s) => {
          const isCurrent = step === s.num;
          const isCompleted = step > s.num;
          return (
            <button
              key={s.num}
              type="button"
              disabled={s.num > step}
              onClick={() => {
                if (s.num < step) {
                  setStep(s.num as 1 | 2 | 3);
                  setStepError('');
                }
              }}
              className={`flex min-h-[42px] items-center justify-between rounded-lg px-4 py-2 text-left text-xs font-semibold transition-colors ${
                isCurrent
                  ? 'bg-[#0F3D5E] text-white'
                  : isCompleted
                    ? 'bg-[#F1F5F9] text-[#0D9488] hover:bg-slate-200/70'
                    : 'cursor-not-allowed text-slate-400'
              }`}
            >
              <span>{s.title}</span>
              {isCompleted && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Step Canvas */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Selecciona especialidad clínica
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SPECIALTIES.map((sp) => {
                    const active = specialtyId === sp.id;
                    return (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() => {
                          setSpecialtyId(sp.id);
                          setTime('');
                        }}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          active
                            ? 'border-[#0D9488] bg-[#F0FDFA]/60'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-sm font-semibold text-slate-900">
                            {sp.name}
                          </span>
                          <span className="font-mono text-xs text-slate-500 tabular-nums">
                            {sp.avgDurationMin} min
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                          {sp.shortDescription}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="book-branch" className="block text-xs font-semibold text-slate-700">
                    Sede preferida
                  </label>
                  <select
                    id="book-branch"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-[#0D9488]"
                  >
                    <option value="all">Cualquier sede disponible</option>
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.city} · {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700">
                    Modalidad de atención
                  </span>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(['Presencial', 'Teleconsulta'] as ConsultationMode[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setMode(option)}
                        className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          mode === option
                            ? 'border-[#0F3D5E] bg-[#0F3D5E] text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {option === 'Presencial' ? (
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Video className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0F3D5E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B2E48]"
                >
                  <span>Continuar a horarios</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Elige especialista y fecha
                </h2>
                <div className="mt-3 space-y-3">
                  {matchingDoctors.map((doc) => {
                    const active = selectedDoctor.id === doc.id;
                    const docBranch = getBranchById(doc.branchId);
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setDoctorId(doc.id);
                          setTime('');
                        }}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                          active
                            ? 'border-[#0D9488] bg-[#F0FDFA]/60'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                          <SafeImage
                            src={doc.imageUrl}
                            alt={doc.name}
                            fallbackInitials={doc.initials}
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-sm font-semibold text-slate-900">
                            {doc.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-600">
                            {docBranch?.city} · {docBranch?.name} · {doc.exequatur}
                          </p>
                          <p className="mt-1 font-mono text-xs text-slate-500 tabular-nums">
                            Copago ARS {formatDop(doc.arsCopayDop)} · Privado {formatDop(doc.feeDop)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 border-t border-slate-200 pt-5 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <label htmlFor="book-date" className="block text-xs font-semibold text-slate-700">
                    Fecha de consulta
                  </label>
                  <input
                    id="book-date"
                    type="date"
                    min={getTodayIso()}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTime('');
                      setStepError('');
                    }}
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 font-mono text-sm text-slate-900 tabular-nums focus:border-[#0D9488]"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Los horarios tachados ya tienen otro paciente confirmado.
                  </p>
                </div>

                <div className="sm:col-span-7">
                  <span className="block text-xs font-semibold text-slate-700">
                    Bloques disponibles ({formatDateSpanish(date)})
                  </span>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {selectedDoctor.availableTimes.map((slot) => {
                      const taken = isSlotTaken(selectedDoctor.id, date, slot);
                      const selected = time === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={taken}
                          onClick={() => {
                            setTime(slot);
                            setStepError('');
                          }}
                          className={`min-h-[42px] rounded-lg border font-mono text-xs font-semibold tabular-nums transition-colors ${
                            taken
                              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through'
                              : selected
                                ? 'border-[#0D9488] bg-[#0D9488] text-white'
                                : 'border-slate-300 bg-white text-slate-800 hover:border-[#0D9488]'
                          }`}
                        >
                          {taken ? `${slot} Ocup.` : slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {stepError && (
                <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-[#B91C1C]">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{stepError}</span>
                </p>
              )}

              <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setStepError('');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0F3D5E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B2E48]"
                >
                  <span>Revisar y confirmar</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleConfirmBooking} className="space-y-5">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Detalles clínicos y cobertura ARS
              </h2>

              <div>
                <label htmlFor="book-ars" className="block text-xs font-semibold text-slate-700">
                  Cobertura a utilizar
                </label>
                <select
                  id="book-ars"
                  value={arsUsed}
                  onChange={(e) => setArsUsed(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-[#0D9488]"
                >
                  {ARS_PROVIDERS.map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="book-reason" className="block text-xs font-semibold text-slate-700">
                  Motivo de la consulta o síntomas principales
                </label>
                <textarea
                  id="book-reason"
                  rows={4}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (stepError) setStepError('');
                  }}
                  placeholder="Describe brevemente el motivo de tu visita para que el especialista revise tu contexto antes de la consulta."
                  aria-invalid={Boolean(stepError)}
                  className={`mt-1.5 w-full rounded-lg border bg-white p-3.5 text-sm text-slate-900 ${
                    stepError ? 'border-[#B91C1C]' : 'border-slate-300 focus:border-[#0D9488]'
                  }`}
                />
                {stepError && (
                  <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{stepError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setStepError('');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Cambiar horario</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0D9488] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F766E]"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>Confirmar cita médica</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Live Summary Sidebar */}
        <aside className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-4 lg:self-start">
          <h3 className="font-display text-sm font-semibold text-slate-900">
            Resumen de tu reserva
          </h3>
          <dl className="mt-4 space-y-3.5 border-t border-slate-200 pt-4 text-xs">
            <div>
              <dt className="text-slate-500">Paciente</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{currentPatient.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Especialidad</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {selectedSpecialty?.name}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Especialista</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{selectedDoctor.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Sede y modalidad</dt>
              <dd className="mt-0.5 text-slate-800">
                {effectiveBranch.city} ({effectiveBranch.name}) · {mode}
              </dd>
            </div>
            <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-slate-800 tabular-nums">
                <Calendar className="h-3.5 w-3.5 text-[#0D9488]" aria-hidden="true" />
                {formatDateSpanish(date)}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-slate-800 tabular-nums">
                <Clock className="h-3.5 w-3.5 text-[#0D9488]" aria-hidden="true" />
                {time || 'Por elegir'}
              </span>
            </div>
          </dl>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-baseline justify-between text-xs text-slate-600">
              <span>{isPrivate ? 'Tarifa privada' : `Copago estimado (${arsUsed})`}</span>
              <span className="font-mono text-base font-semibold text-[#0F3D5E] tabular-nums">
                {formatDop(estimatedCopay)}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
              El copago final se valida en recepción con tu carnet de ARS el día de la consulta.
            </p>
          </div>
        </aside>
      </div>

      {/* Confirmation Receipt Modal */}
      <Modal
        open={Boolean(createdAppointment)}
        onClose={() => {
          setCreatedAppointment(null);
          setDashboardTab('appointments');
        }}
        title="Cita médica registrada"
        subtitle="Tu solicitud quedó guardada en el sistema"
        footer={
          <button
            type="button"
            onClick={() => {
              setCreatedAppointment(null);
              setDashboardTab('appointments');
            }}
            className="min-h-[40px] rounded-lg bg-[#0F3D5E] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0B2E48]"
          >
            Ir a Mis Citas
          </button>
        }
      >
        {createdAppointment && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-[#15803D]/25 bg-[#F0FDF4] p-4">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-[#15803D]" aria-hidden="true" />
              <div>
                <p className="text-xs text-slate-600">Código de confirmación</p>
                <p className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                  {createdAppointment.code}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-slate-500">Especialista</dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  {getDoctorById(createdAppointment.doctorId)?.name}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Fecha y hora</dt>
                <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
                  {formatDateSpanish(createdAppointment.date)} · {createdAppointment.time}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Sede</dt>
                <dd className="mt-0.5 text-slate-800">
                  {getBranchById(createdAppointment.branchId)?.name} ({createdAppointment.mode})
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Copago estimado</dt>
                <dd className="mt-0.5 font-mono font-semibold text-[#0F3D5E] tabular-nums">
                  {formatDop(createdAppointment.copayDop)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
