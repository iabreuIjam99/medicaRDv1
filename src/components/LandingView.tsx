import React, { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Menu, Search, X } from 'lucide-react';
import {
  ARS_PROVIDERS,
  BRANCHES,
  DOCTORS,
  formatDop,
  getTodayIso,
  HERO_CLINIC_IMAGE,
  SPECIALTIES,
} from '../data/mockData';
import { getBranchById, getSpecialtyById, useMedica } from '../context/MedicaContext';
import { SafeImage } from './ui/Primitives';

export function LandingView() {
  const { setView, openGuide, startQuickBooking, session, setDashboardTab } = useMedica();
  const [selectedSpecialty, setSelectedSpecialty] = useState(SPECIALTIES[0].id);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].id);
  const [selectedDate, setSelectedDate] = useState(getTodayIso());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featuredDoctors = DOCTORS.slice(0, 4);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startQuickBooking({
      specialtyId: selectedSpecialty,
      branchId: selectedBranch,
      date: selectedDate,
    });
  };

  const handleHeaderAction = () => {
    if (session.authenticated) {
      setDashboardTab('overview');
      setView('dashboard');
    } else {
      setView('auth');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Top Bar Contract: exact 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand wordmark (single text element, no subtitle) */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-xl font-bold tracking-tight text-[#0F3D5E] whitespace-nowrap shrink-0"
          >
            MedicaRD
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#especialidades"
              className="transition-colors hover:text-[#0F3D5E] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Especialidades
            </a>
            <a
              href="#medicos"
              className="transition-colors hover:text-[#0F3D5E] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Médicos
            </a>
            <a
              href="#como-funciona"
              className="transition-colors hover:text-[#0F3D5E] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Cómo funciona
            </a>
            <a
              href="#sedes"
              className="transition-colors hover:text-[#0F3D5E] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Sedes
            </a>
          </nav>

          {/* Zone 3: 1 primary action (+ mobile menu toggle on small screens) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleHeaderAction}
              className="rounded-lg bg-[#0F3D5E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B2E48] whitespace-nowrap shrink-0"
            >
              {session.authenticated ? 'Ir a mi panel' : 'Ingresar'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              <a
                href="#especialidades"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 hover:bg-slate-50"
              >
                Especialidades
              </a>
              <a
                href="#medicos"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 hover:bg-slate-50"
              >
                Médicos
              </a>
              <a
                href="#como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 hover:bg-slate-50"
              >
                Cómo funciona
              </a>
              <a
                href="#sedes"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 hover:bg-slate-50"
              >
                Sedes
              </a>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Split Section — 2-column items-stretch with balanced height */}
        <section className="mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-sm font-medium text-[#0D9488]">
                Red médica ambulatoria · Santo Domingo, Santiago y Punta Cana
              </p>

              <h1
                className="mt-4 font-display font-bold tracking-tight text-slate-900 text-balance"
                style={{ fontSize: 'clamp(2.25rem, 3.8vw, 3.4rem)', lineHeight: 1.12 }}
              >
                Agenda tu consulta médica sin filas ni llamadas en espera.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                Elige especialidad, médico certificado y horario disponible en tiempo real. Gestiona
                tus citas presenciales o por teleconsulta, revisa tu historial y utiliza tu seguro
                ARS desde un mismo portal.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => startQuickBooking({ specialtyId: SPECIALTIES[0].id })}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0F3D5E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B2E48] whitespace-nowrap"
                >
                  <span>Reservar consulta ahora</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setView('auth')}
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 whitespace-nowrap"
                >
                  Acceso pacientes y médicos
                </button>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500">
                <span className="font-medium text-slate-700">ARS aceptadas:</span>{' '}
                {ARS_PROVIDERS.slice(0, 4).join(' · ')}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-72 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-96 lg:h-full lg:min-h-[430px]">
                <SafeImage
                  src={HERO_CLINIC_IMAGE}
                  alt="Consultorio médico moderno de MedicaRD con iluminación natural"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Full-width Quick Availability Search Bar below hero split */}
          <form
            onSubmit={handleQuickSearchSubmit}
            aria-label="Buscador rápido de citas médicas"
            className="mt-10 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
              <div className="md:col-span-4">
                <label
                  htmlFor="hero-specialty"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Especialidad médica
                </label>
                <select
                  id="hero-specialty"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 transition-colors focus:border-[#0D9488]"
                >
                  {SPECIALTIES.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="hero-branch" className="block text-xs font-semibold text-slate-700">
                  Sede clínica
                </label>
                <select
                  id="hero-branch"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 transition-colors focus:border-[#0D9488]"
                >
                  {BRANCHES.map((br) => (
                    <option key={br.id} value={br.id}>
                      {br.city} · {br.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="hero-date" className="block text-xs font-semibold text-slate-700">
                  Fecha preferida
                </label>
                <input
                  id="hero-date"
                  type="date"
                  min={getTodayIso()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 font-mono text-sm text-slate-900 tabular-nums transition-colors focus:border-[#0D9488]"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0F766E] whitespace-nowrap"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>Ver horarios</span>
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Specialties Asymmetric Bento Grid */}
        <section
          id="especialidades"
          className="border-t border-slate-200 bg-white py-16 lg:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
                  Especialidades con agenda directa
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Selecciona el área clínica que necesitas para consultar disponibilidad inmediata
                  con nuestros especialistas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => startQuickBooking({})}
                className="self-start text-sm font-semibold text-[#0F3D5E] hover:text-[#0D9488] hover:underline hover:underline-offset-4 whitespace-nowrap sm:self-auto"
              >
                Ver todas las disponibilidades
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-6">
              {SPECIALTIES.map((specialty, index) => {
                const isWide = index < 2;
                return (
                  <button
                    key={specialty.id}
                    type="button"
                    onClick={() => startQuickBooking({ specialtyId: specialty.id })}
                    className={`group flex flex-col justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 text-left transition-colors hover:border-[#0D9488] hover:bg-white ${
                      isWide ? 'md:col-span-3' : 'md:col-span-3 lg:col-span-3'
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-[#0F3D5E]">
                          {specialty.name}
                        </h3>
                        <span className="font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                          {specialty.avgDurationMin} min
                        </span>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                        {specialty.shortDescription}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4 text-xs text-slate-600">
                      <span className="font-mono tabular-nums">
                        Tarifa base {formatDop(specialty.baseFeeDop)} · Copago ARS disponible
                      </span>
                      <span className="font-semibold text-[#0D9488] group-hover:underline">
                        Agendar
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Specialists */}
        <section id="medicos" className="border-t border-slate-200 bg-[#F8FAFC] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
                Equipo médico certificado
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                Todos los especialistas cuentan con exequátur verificado y agenda sincronizada en
                tiempo real con el portal del paciente.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredDoctors.map((doctor) => {
                const specialty = getSpecialtyById(doctor.specialtyId);
                const branch = getBranchById(doctor.branchId);
                return (
                  <article
                    key={doctor.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-slate-100">
                      <SafeImage
                        src={doctor.imageUrl}
                        alt={`Retrato de ${doctor.name}`}
                        fallbackInitials={doctor.initials}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-base font-semibold text-slate-900">
                        {doctor.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        {specialty?.name} · {branch?.city}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                        {doctor.exequatur} · {doctor.experienceYears} años exp.
                      </p>

                      <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>Próximo turno</span>
                          <span className="font-mono font-medium text-[#0F3D5E] tabular-nums">
                            {doctor.nextSlotLabel}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span>Copago ARS desde</span>
                          <span className="font-mono font-medium text-slate-900 tabular-nums">
                            {formatDop(doctor.arsCopayDop)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          startQuickBooking({
                            doctorId: doctor.id,
                            specialtyId: doctor.specialtyId,
                            branchId: doctor.branchId,
                          })
                        }
                        className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center rounded-lg border border-[#0F3D5E] bg-white px-4 py-2 text-xs font-semibold text-[#0F3D5E] transition-colors hover:bg-[#0F3D5E] hover:text-white whitespace-nowrap"
                      >
                        Agendar con especialista
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works + Quantitative Clinical Proof */}
        <section
          id="como-funciona"
          className="border-t border-slate-200 bg-white py-16 lg:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
                  Atención ambulatoria clara de principio a fin
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Diseñamos cada paso para reducir la incertidumbre del paciente y evitar solapes en
                  la agenda médica.
                </p>

                {/* Quantitative proof metrics directly adjacent to the claim */}
                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-slate-200 pt-8">
                  <div>
                    <dt className="text-xs text-slate-500">Espera promedio en sala</dt>
                    <dd className="mt-1 font-mono text-2xl font-semibold text-[#0F3D5E] tabular-nums">
                      11 min
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Sedes activas en RD</dt>
                    <dd className="mt-1 font-mono text-2xl font-semibold text-[#0F3D5E] tabular-nums">
                      3 centros
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Confirmación de turno</dt>
                    <dd className="mt-1 font-mono text-2xl font-semibold text-[#0D9488] tabular-nums">
                      Inmediata
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Modalidades</dt>
                    <dd className="mt-1 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                      Presencial / Virtual
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-7">
                <div className="py-6">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    01. Selecciona especialidad, sede y especialista
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Consulta la disponibilidad real por médico y fecha. Los horarios ya ocupados se
                    bloquean automáticamente para evitar duplicidad de citas.
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    02. Indica tu ARS y motivo de consulta
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Calculamos el estimado de copago en pesos dominicanos (RD$) antes de confirmar y
                    generamos un código de cita verificable al instante.
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    03. Gestiona reprogramaciones e historial clínico
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Reprograma horarios desde tu panel de paciente y consulta tus diagnósticos y
                    recetas emitidas por tu médico especialista.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Branches section */}
        <section id="sedes" className="border-t border-slate-200 bg-[#F8FAFC] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Nuestras sedes médicas
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {BRANCHES.map((branch) => (
                <div
                  key={branch.id}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0D9488]">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{branch.city}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold text-slate-900">
                    {branch.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{branch.address}</p>
                  <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <p className="font-mono tabular-nums text-slate-700">{branch.phone}</p>
                    <p>{branch.hours}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startQuickBooking({ branchId: branch.id })}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3D5E] hover:text-[#0D9488]"
                  >
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Agendar en esta sede</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Institutional Footer with discreet Prototype Guide link */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="font-display text-base font-bold tracking-tight text-[#0F3D5E]">
              MedicaRD
            </p>
            <p className="mt-1 text-xs text-slate-500">
              © 2026 MedicaRD · Plataforma de gestión de citas médicas · República Dominicana.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => setView('auth')}
              className="hover:text-[#0F3D5E] hover:underline"
            >
              Portal de pacientes
            </button>
            <button
              type="button"
              onClick={() => startQuickBooking({})}
              className="hover:text-[#0F3D5E] hover:underline"
            >
              Agendar cita
            </button>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <button
              type="button"
              onClick={openGuide}
              className="font-medium text-slate-500 transition-colors hover:text-[#0F3D5E] hover:underline"
            >
              Guía del prototipo (Modelo y Estilos)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
