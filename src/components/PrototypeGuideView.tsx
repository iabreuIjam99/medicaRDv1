import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  Palette,
  RotateCcw,
  Route,
} from 'lucide-react';
import { BRANCHES, DOCTORS, SPECIALTIES } from '../data/mockData';
import { useMedica } from '../context/MedicaContext';
import { StatusIndicator } from './ui/Primitives';

type GuideTab = 'model' | 'design' | 'navigation';

export function PrototypeGuideView() {
  const {
    closeGuide,
    appointments,
    patients,
    clinicalRecords,
    resetDemoData,
    setView,
    loginAsDemo,
    setDashboardTab,
    addToast,
  } = useMedica();

  const [activeTab, setActiveTab] = useState<GuideTab>('model');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      addToast({
        type: 'success',
        title: 'Enlace copiado',
        description: 'El enlace al prototipo interactivo está listo para compartir.',
      });
      window.setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      addToast({
        type: 'info',
        title: 'Enlace actual del prototipo',
        description: window.location.href,
      });
    }
  };

  const colorTokens = [
    {
      role: '60% Lienzo neutro',
      name: 'Clinical Canvas',
      hex: '#F8FAFC',
      usage: 'Fondo principal de pantallas y espacio de trabajo',
      textClass: 'text-slate-900',
    },
    {
      role: '30% Superficie',
      name: 'Pure Clinical White',
      hex: '#FFFFFF',
      usage: 'Contenedores, formularios y tablas con borde 1px (#E2E8F0)',
      textClass: 'text-slate-900',
    },
    {
      role: '10% Acento primario',
      name: 'Deep Clinical Navy',
      hex: '#0F3D5E',
      usage: 'Identidad, botones primarios y estados de navegación activos (Contraste > 11:1)',
      textClass: 'text-white',
    },
    {
      role: '10% Acento clínico',
      name: 'Medical Teal',
      hex: '#0D9488',
      usage: 'Selección de horarios, foco accesible y confirmaciones médicas',
      textClass: 'text-white',
    },
    {
      role: 'Semántico · Confirmada',
      name: 'Clinical Green',
      hex: '#15803D',
      usage: 'Citas confirmadas y validaciones exitosas (siempre con ícono + texto)',
      textClass: 'text-white',
    },
    {
      role: 'Semántico · Error / Cancelación',
      name: 'Clinical Crimson',
      hex: '#B91C1C',
      usage: 'Validaciones de formulario y cancelaciones irreversibles',
      textClass: 'text-white',
    },
  ];

  const demoWalkthrough = [
    {
      step: '01',
      rubric: 'Vistas esenciales y Jerarquía visual (Puntos 1 y 2)',
      action:
        'Presenta la Página de Inicio de MedicaRD (Header de 3 zonas, Hero con buscador rápido, Especialidades, Médicos y Footer) y navega a la pantalla de Inicio de Sesión / Registro.',
      jumpLabel: 'Abrir Página de Inicio',
      onJump: () => setView('landing'),
    },
    {
      step: '02',
      rubric: 'Validaciones de formularios y estados de error (Puntos 4 y 8)',
      action:
        'En Registro, prueba enviar un campo vacío o una cédula inválida para mostrar mensajes de error accesibles (role="alert") y luego entra con un clic como Paciente Demo.',
      jumpLabel: 'Abrir Login / Registro',
      onJump: () => setView('auth'),
    },
    {
      step: '03',
      rubric: 'Simulación CRUD y validación de conflictos horarios (Puntos 5 y 8)',
      action:
        'Desde "Agendar cita", selecciona Cardiología y Dra. Elena Vargas: observa cómo los horarios ya reservados aparecen bloqueados, crea una nueva cita y visualiza el pop-up con código MED-2026.',
      jumpLabel: 'Ir al Asistente de Cita',
      onJump: () => {
        loginAsDemo('patient');
        setDashboardTab('book');
      },
    },
    {
      step: '04',
      rubric: 'Tablas, filtros, pop-ups y cambio de rol en vivo (Puntos 3, 4 y 5)',
      action:
        'En "Mis citas" usa los filtros segmentados, reprograma o cancela una cita. Luego cambia el selector superior de "Paciente" a "Médico" para confirmar o atender la cita recién creada con nota clínica.',
      jumpLabel: 'Entrar en Vista Médica',
      onJump: () => {
        loginAsDemo('doctor');
        setDashboardTab('appointments');
      },
    },
    {
      step: '05',
      rubric: 'Accesibilidad, Consistencia Visual y Exportación (Puntos 6, 7 y 9)',
      action:
        'Reduce el ancho del navegador para mostrar el menú adaptable móvil (targets táctiles ≥ 44px) y usa las pestañas de esta guía para explicar el diagrama ER, paleta 60-30-10 y enlace compartible.',
      jumpLabel: 'Copiar enlace del prototipo',
      onJump: handleCopyLink,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={closeGuide}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Volver a MedicaRD</span>
            </button>
            <span className="hidden font-display text-sm font-bold text-[#0F3D5E] sm:inline">
              Guía del Prototipo Interactivo
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex min-h-[38px] items-center gap-2 rounded-lg bg-[#0F3D5E] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#0B2E48]"
          >
            {copiedUrl ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{copiedUrl ? 'Enlace copiado' : 'Copiar enlace'}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold text-[#0D9488]">
            Documentación viva de apoyo para demostración · MedicaRD
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Modelo de datos, sistema visual y guía de navegación
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Referencia estructurada para presentar en vivo la arquitectura de datos simulada, la
            consistencia de estilos clínicos (UI/UX Pro Max) y el recorrido recomendado del mockup.
          </p>
        </div>

        {/* Segmented Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Secciones de la guía del prototipo"
          className="mt-7 inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'model'}
            onClick={() => setActiveTab('model')}
            className={`inline-flex min-h-[38px] items-center gap-2 rounded-md px-4 text-xs font-semibold transition-colors ${
              activeTab === 'model'
                ? 'bg-white text-[#0F3D5E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
            <span>01. Modelo de Datos</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'design'}
            onClick={() => setActiveTab('design')}
            className={`inline-flex min-h-[38px] items-center gap-2 rounded-md px-4 text-xs font-semibold transition-colors ${
              activeTab === 'design'
                ? 'bg-white text-[#0F3D5E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="h-3.5 w-3.5" aria-hidden="true" />
            <span>02. Sistema de Diseño</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'navigation'}
            onClick={() => setActiveTab('navigation')}
            className={`inline-flex min-h-[38px] items-center gap-2 rounded-md px-4 text-xs font-semibold transition-colors ${
              activeTab === 'navigation'
                ? 'bg-white text-[#0F3D5E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Route className="h-3.5 w-3.5" aria-hidden="true" />
            <span>03. Guía de Navegación</span>
          </button>
        </div>

        {/* Tab 1: Data Model & Live Counts */}
        {activeTab === 'model' && (
          <div className="mt-6 space-y-6">
            {/* Live entity counts synced with prototype state */}
            <section className="grid grid-cols-2 divide-x divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
              {[
                { label: 'Pacientes', value: patients.length },
                { label: 'Médicos', value: DOCTORS.length },
                { label: 'Especialidades', value: SPECIALTIES.length },
                { label: 'Sedes', value: BRANCHES.length },
                { label: 'Citas Médicas', value: appointments.length },
                { label: 'Notas Clínicas', value: clinicalRecords.length },
              ].map((stat) => (
                <div key={stat.label} className="p-4">
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-[#0F3D5E] tabular-nums">
                    {stat.value}
                  </p>
                </div>
              ))}
            </section>

            {/* Entity-Relationship Diagram */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    Diagrama Entidad-Relación (Datos simulados en memoria + localStorage)
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Todas las altas, reprogramaciones y notas clínicas actualizan estas entidades en
                    tiempo real.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetDemoData}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Restablecer datos iniciales</span>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
                  <p className="font-display text-sm font-bold text-[#0F3D5E]">Paciente (1)</p>
                  <ul className="mt-2.5 space-y-1 font-mono text-xs text-slate-700">
                    <li>PK id: string</li>
                    <li>nombre, cédula, email</li>
                    <li>teléfono, tipoSangre</li>
                    <li>arsProvider, arsPolicyNumber</li>
                    <li>alergias, contactoEmergencia</li>
                  </ul>
                  <p className="mt-3 border-t border-slate-200 pt-2 text-[11px] text-slate-500">
                    Relación: 1 Paciente → N CitasMédicas · N HistorialClínico
                  </p>
                </div>

                <div className="rounded-lg border border-[#0D9488] bg-[#F0FDFA]/50 p-4">
                  <p className="font-display text-sm font-bold text-[#0F3D5E]">CitaMédica (N)</p>
                  <ul className="mt-2.5 space-y-1 font-mono text-xs text-slate-700">
                    <li>PK id · UK código (MED-2026-*)</li>
                    <li>FK patientId, doctorId</li>
                    <li>FK specialtyId, branchId</li>
                    <li>fecha, hora, modalidad</li>
                    <li>arsUsed, copayDop, estado</li>
                  </ul>
                  <p className="mt-3 border-t border-[#0D9488]/20 pt-2 text-[11px] text-slate-600">
                    Regla de integridad: Unicidad (doctorId + fecha + hora) en citas activas.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
                  <p className="font-display text-sm font-bold text-[#0F3D5E]">Médico (1)</p>
                  <ul className="mt-2.5 space-y-1 font-mono text-xs text-slate-700">
                    <li>PK id: string</li>
                    <li>nombre, exequátur</li>
                    <li>FK specialtyId, branchId</li>
                    <li>feeDop, arsCopayDop</li>
                    <li>availableTimes[], acceptedArs[]</li>
                  </ul>
                  <p className="mt-3 border-t border-slate-200 pt-2 text-[11px] text-slate-500">
                    Relación: N Médicos → 1 Especialidad · 1 Sede
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
                  <p className="font-display text-sm font-bold text-[#0F3D5E]">Especialidad (1)</p>
                  <ul className="mt-2.5 space-y-1 font-mono text-xs text-slate-700">
                    <li>PK id: string</li>
                    <li>nombre, descripción</li>
                    <li>avgDurationMin, baseFeeDop</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
                  <p className="font-display text-sm font-bold text-[#0F3D5E]">Sede / Clínica (1)</p>
                  <ul className="mt-2.5 space-y-1 font-mono text-xs text-slate-700">
                    <li>PK id: string</li>
                    <li>ciudad, nombre, dirección</li>
                    <li>teléfono, horario</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
                  <p className="font-display text-sm font-bold text-[#0F3D5E]">
                    HistorialClínico (0..1)
                  </p>
                  <ul className="mt-2.5 space-y-1 font-mono text-xs text-slate-700">
                    <li>PK id · FK appointmentId</li>
                    <li>FK patientId, doctorId</li>
                    <li>diagnóstico, prescripción</li>
                    <li>bloodPressure, heartRate, notas</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Design System Specimen */}
        {activeTab === 'design' && (
          <div className="mt-6 space-y-6">
            {/* Color Palette */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-display text-base font-semibold text-slate-900">
                Paleta clínica 60-30-10 (Azul Profundo y Teal)
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Diseñada para transmitir confianza hospitalaria, reducir fatiga visual y cumplir
                ratios de contraste WCAG AA (≥ 4.5:1 en texto).
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {colorTokens.map((token) => (
                  <div
                    key={token.hex}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    <div
                      className={`flex h-20 items-end justify-between p-3.5 ${token.textClass}`}
                      style={{ backgroundColor: token.hex }}
                    >
                      <span className="text-xs font-semibold">{token.name}</span>
                      <span className="font-mono text-xs tabular-nums">{token.hex}</span>
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs font-semibold text-slate-800">{token.role}</p>
                      <p className="mt-1 text-xs text-slate-600">{token.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Typography & Interactive States */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Sistema tipográfico (2 + 1 familias)
                </h2>
                <div className="mt-5 space-y-5 divide-y divide-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Display y Encabezados · Plus Jakarta Sans</p>
                    <p className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
                      Agenda tu consulta médica
                    </p>
                  </div>
                  <div className="pt-4">
                    <p className="text-xs text-slate-500">Cuerpo y Formularios · DM Sans (15–16px)</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      Lectura clínica limpia con interlineado holgado (1.6) para indicaciones
                      médicas, motivos de consulta y confirmaciones de seguro ARS.
                    </p>
                  </div>
                  <div className="pt-4">
                    <p className="text-xs text-slate-500">
                      Datos, Códigos y Tarifas · JetBrains Mono (tabular-nums)
                    </p>
                    <p className="mt-1 font-mono text-sm font-medium text-[#0F3D5E] tabular-nums">
                      MED-2026-1042 · 09:30 hrs · RD$ 850 · PA 118/76 mmHg
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Estados de interacción e indicadores inclusivos
                </h2>
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Botones y estados</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        className="min-h-[40px] rounded-lg bg-[#0F3D5E] px-4 text-xs font-semibold text-white hover:bg-[#0B2E48]"
                      >
                        Primario
                      </button>
                      <button
                        type="button"
                        className="min-h-[40px] rounded-lg bg-[#0D9488] px-4 text-xs font-semibold text-white hover:bg-[#0F766E]"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Secundario
                      </button>
                      <button
                        type="button"
                        disabled
                        className="min-h-[40px] cursor-not-allowed rounded-lg bg-slate-200 px-4 text-xs font-semibold text-slate-500"
                      >
                        Deshabilitado
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Indicadores de estado (ícono + texto, nunca solo color)
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-5">
                      <StatusIndicator status="confirmada" />
                      <StatusIndicator status="pendiente" />
                      <StatusIndicator status="completada" />
                      <StatusIndicator status="cancelada" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Input en error</p>
                      <input
                        type="text"
                        readOnly
                        value="correo-invalido"
                        aria-invalid="true"
                        className="mt-1 h-10 w-full rounded-lg border border-[#B91C1C] bg-white px-3 text-xs text-slate-900"
                      />
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#B91C1C]">
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Formato de correo inválido</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Input validado</p>
                      <input
                        type="text"
                        readOnly
                        value="402-2189456-7"
                        className="mt-1 h-10 w-full rounded-lg border border-[#15803D] bg-white px-3 font-mono text-xs text-slate-900 tabular-nums"
                      />
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#15803D]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Cédula verificada</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Tab 3: Live Demo Navigation Guide */}
        {activeTab === 'navigation' && (
          <div className="mt-6 space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    Guía de navegación sugerida para la demostración en vivo
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Recorrido ordenado para cubrir los 9 puntos de la Parte IV en menos de 5
                    minutos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copiar enlace interactivo</span>
                </button>
              </div>

              <div className="mt-4 divide-y divide-slate-200">
                {demoWalkthrough.map((item) => (
                  <div
                    key={item.step}
                    className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="max-w-2xl">
                      <p className="font-mono text-xs font-semibold text-[#0D9488] tabular-nums">
                        Paso {item.step} · {item.rubric}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.action}</p>
                    </div>
                    <button
                      type="button"
                      onClick={item.onJump}
                      className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-lg border border-[#0F3D5E] bg-white px-3.5 text-xs font-semibold text-[#0F3D5E] transition-colors hover:bg-[#0F3D5E] hover:text-white self-start sm:self-auto"
                    >
                      <span>{item.jumpLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
