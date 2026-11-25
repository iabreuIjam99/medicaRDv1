import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Stethoscope,
  User,
} from 'lucide-react';
import { ARS_PROVIDERS } from '../data/mockData';
import { useMedica } from '../context/MedicaContext';

type AuthMode = 'login' | 'register';

interface FormErrors {
  name?: string;
  cedula?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CEDULA_REGEX = /^\d{3}-?\d{7}-?\d{1}$/;
const PHONE_REGEX = /^[\d\s()+-]{10,16}$/;

export function AuthView() {
  const { setView, loginAsDemo, registerPatient, openGuide } = useMedica();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [cedula, setCedula] = useState('');
  const [phone, setPhone] = useState('');
  const [arsProvider, setArsProvider] = useState(ARS_PROVIDERS[0]);
  const [email, setEmail] = useState('camila.morales@correo.do');
  const [password, setPassword] = useState('Medica2026*');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrors({});
    if (nextMode === 'register') {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setEmail('camila.morales@correo.do');
      setPassword('Medica2026*');
    }
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (mode === 'register') {
      if (name.trim().length < 3) {
        nextErrors.name = 'Ingresa tu nombre y apellido completo (mínimo 3 caracteres).';
      }
      if (!CEDULA_REGEX.test(cedula.trim())) {
        nextErrors.cedula = 'Formato válido requerido: 000-0000000-0 (11 dígitos).';
      }
      if (!PHONE_REGEX.test(phone.trim())) {
        nextErrors.phone = 'Ingresa un teléfono dominicano válido (ej. 809-555-0192).';
      }
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico con formato válido.';
    }

    if (password.length < 6) {
      nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (mode === 'register' && password !== confirmPassword) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'login') {
        const isDoctorEmail = email.toLowerCase().includes('dra.') || email.toLowerCase().includes('doctor');
        loginAsDemo(isDoctorEmail ? 'doctor' : 'patient', email.trim());
      } else {
        registerPatient({
          name,
          cedula,
          email,
          phone,
          arsProvider,
        });
      }
    }, 350);
  };

  const passwordStrength =
    password.length >= 10
      ? { label: 'Segura', color: 'text-[#15803D]' }
      : password.length >= 6
        ? { label: 'Aceptable', color: 'text-[#B45309]' }
        : { label: 'Corta', color: 'text-[#B91C1C]' };

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:grid lg:grid-cols-12">
      {/* Left Clinical Brand Panel */}
      <aside className="flex flex-col justify-between bg-[#0F3D5E] px-6 py-8 text-white sm:px-10 lg:col-span-5 lg:px-12 lg:py-12">
        <div>
          <button
            type="button"
            onClick={() => setView('landing')}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Volver al inicio</span>
          </button>

          <p className="mt-10 font-display text-2xl font-bold tracking-tight">MedicaRD</p>
          <h1 className="mt-4 font-display text-2xl font-bold leading-snug tracking-tight text-balance sm:text-3xl">
            Tu historial clínico y tus citas médicas, siempre a tu alcance.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            Accede como paciente para agendar o reprogramar consultas con cobertura ARS, o cambia a
            la vista médica para administrar tu agenda clínica diaria.
          </p>

          <div className="mt-10 space-y-4 border-t border-white/15 pt-8 text-sm text-slate-100">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#5EEAD4]" aria-hidden="true" />
              <p className="leading-relaxed">
                Validación inmediata de disponibilidad horaria para evitar conflictos de turno.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5EEAD4]" aria-hidden="true" />
              <p className="leading-relaxed">
                Diseño accesible conforme a estándares WCAG AA de contraste y navegación por teclado.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-xs text-slate-300">
          <p>¿Presentando el prototipo en vivo?</p>
          <button
            type="button"
            onClick={openGuide}
            className="mt-1 font-semibold text-white underline underline-offset-4 hover:text-[#5EEAD4]"
          >
            Abrir Guía del Prototipo (ER y Estilos)
          </button>
        </div>
      </aside>

      {/* Right Interactive Auth Form */}
      <main className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:col-span-7 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Interactive Segmented Control: Login / Register */}
          <div
            role="tablist"
            aria-label="Modo de autenticación"
            className="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-100 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => switchMode('login')}
              className={`min-h-[40px] rounded-md text-sm font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-white text-[#0F3D5E] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => switchMode('register')}
              className={`min-h-[40px] rounded-md text-sm font-semibold transition-colors ${
                mode === 'register'
                  ? 'bg-white text-[#0F3D5E] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <div className="mt-7">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {mode === 'login' ? 'Accede a tu portal clínico' : 'Registra tu perfil de paciente'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              {mode === 'login'
                ? 'Ingresa tus credenciales o utiliza un acceso de demostración directa.'
                : 'Completa tus datos básicos para agendar citas y registrar tu ARS.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700">
                    Nombre completo
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Laura Pérez Castillo"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'err-name' : undefined}
                    className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 transition-colors ${
                      errors.name ? 'border-[#B91C1C]' : 'border-slate-300 focus:border-[#0D9488]'
                    }`}
                  />
                  {errors.name && (
                    <p id="err-name" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="auth-cedula" className="block text-xs font-semibold text-slate-700">
                      Cédula de identidad
                    </label>
                    <input
                      id="auth-cedula"
                      type="text"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      placeholder="402-0000000-0"
                      aria-invalid={Boolean(errors.cedula)}
                      aria-describedby={errors.cedula ? 'err-cedula' : undefined}
                      className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 font-mono text-sm text-slate-900 tabular-nums transition-colors ${
                        errors.cedula ? 'border-[#B91C1C]' : 'border-slate-300 focus:border-[#0D9488]'
                      }`}
                    />
                    {errors.cedula && (
                      <p id="err-cedula" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.cedula}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="auth-phone" className="block text-xs font-semibold text-slate-700">
                      Teléfono
                    </label>
                    <input
                      id="auth-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(809) 555-0192"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'err-phone' : undefined}
                      className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 font-mono text-sm text-slate-900 tabular-nums transition-colors ${
                        errors.phone ? 'border-[#B91C1C]' : 'border-slate-300 focus:border-[#0D9488]'
                      }`}
                    />
                    {errors.phone && (
                      <p id="err-phone" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="auth-ars" className="block text-xs font-semibold text-slate-700">
                    Aseguradora (ARS)
                  </label>
                  <select
                    id="auth-ars"
                    value={arsProvider}
                    onChange={(e) => setArsProvider(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-[#0D9488]"
                  >
                    {ARS_PROVIDERS.map((ars) => (
                      <option key={ars} value={ars}>
                        {ars}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700">
                Correo electrónico
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.do"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'err-email' : undefined}
                className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 transition-colors ${
                  errors.email ? 'border-[#B91C1C]' : 'border-slate-300 focus:border-[#0D9488]'
                }`}
              />
              {errors.email && (
                <p id="err-email" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700">
                  Contraseña
                </label>
                {mode === 'register' && password.length > 0 && (
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    Seguridad: {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative mt-1.5">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'err-password' : undefined}
                  className={`h-11 w-full rounded-lg border bg-white pr-11 pl-3.5 text-sm text-slate-900 transition-colors ${
                    errors.password ? 'border-[#B91C1C]' : 'border-slate-300 focus:border-[#0D9488]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="err-password" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label
                  htmlFor="auth-confirm-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Confirmar contraseña
                </label>
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={errors.confirmPassword ? 'err-confirm' : undefined}
                  className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 transition-colors ${
                    errors.confirmPassword
                      ? 'border-[#B91C1C]'
                      : 'border-slate-300 focus:border-[#0D9488]'
                  }`}
                />
                {errors.confirmPassword && (
                  <p id="err-confirm" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B91C1C]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0F3D5E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0B2E48] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Validando acceso...'
                : mode === 'login'
                  ? 'Iniciar sesión'
                  : 'Crear cuenta y entrar'}
            </button>
          </form>

          {/* 1-Click Demo Access for Live Presentation */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-xs font-semibold text-slate-500">
              Accesos rápidos para demostración en vivo
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => loginAsDemo('patient')}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0D9488] hover:text-[#0F3D5E]"
              >
                <User className="h-4 w-4 text-[#0D9488]" aria-hidden="true" />
                <span>Entrar como Paciente</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('doctor')}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0F3D5E] hover:text-[#0F3D5E]"
              >
                <Stethoscope className="h-4 w-4 text-[#0F3D5E]" aria-hidden="true" />
                <span>Entrar como Médico</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
