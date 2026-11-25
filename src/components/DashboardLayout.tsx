import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  CalendarPlus,
  LayoutDashboard,
  LogOut,
  Menu,
  RotateCcw,
  Stethoscope,
  User,
  Users,
  X,
} from 'lucide-react';
import { useMedica } from '../context/MedicaContext';
import { DashboardTab } from '../types/medical';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { AppointmentsView } from './dashboard/AppointmentsView';
import { BookingWizardView } from './dashboard/BookingWizardView';
import { DoctorsDirectoryView } from './dashboard/DoctorsDirectoryView';
import { ProfileHistoryView } from './dashboard/ProfileHistoryView';
import { PatientsListView } from './dashboard/PatientsListView';

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ReactNode;
}

export function DashboardLayout() {
  const {
    session,
    currentPatient,
    currentDoctor,
    dashboardTab,
    setDashboardTab,
    switchRole,
    logout,
    setView,
    openGuide,
    resetDemoData,
  } = useMedica();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isDoctor = session.role === 'doctor';

  const navItems: NavItem[] = isDoctor
    ? [
        { id: 'overview', label: 'Resumen clínico', icon: <LayoutDashboard className="h-4 w-4" /> },
        { id: 'appointments', label: 'Agenda de citas', icon: <Calendar className="h-4 w-4" /> },
        { id: 'patients', label: 'Pacientes', icon: <Users className="h-4 w-4" /> },
        { id: 'doctors', label: 'Cuadro médico', icon: <Stethoscope className="h-4 w-4" /> },
      ]
    : [
        { id: 'overview', label: 'Resumen', icon: <LayoutDashboard className="h-4 w-4" /> },
        { id: 'appointments', label: 'Mis citas', icon: <Calendar className="h-4 w-4" /> },
        { id: 'book', label: 'Agendar cita', icon: <CalendarPlus className="h-4 w-4" /> },
        { id: 'doctors', label: 'Especialistas', icon: <Stethoscope className="h-4 w-4" /> },
        { id: 'profile', label: 'Perfil e historial', icon: <User className="h-4 w-4" /> },
      ];

  const currentTabLabel =
    navItems.find((item) => item.id === dashboardTab)?.label ?? 'Resumen';

  const handleSelectTab = (tab: DashboardTab) => {
    setDashboardTab(tab);
    setMobileSidebarOpen(false);
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-white">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <button
            type="button"
            onClick={() => setView('landing')}
            className="font-display text-lg font-bold tracking-tight text-[#0F3D5E]"
          >
            MedicaRD
          </button>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Cerrar menú lateral"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Active User Block */}
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-[11px] font-semibold text-[#0D9488]">
            {isDoctor ? 'Sesión médica activa' : 'Sesión de paciente'}
          </p>
          <p className="mt-0.5 truncate font-display text-sm font-semibold text-slate-900">
            {isDoctor ? currentDoctor.name : currentPatient.name}
          </p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500 tabular-nums">
            {isDoctor ? currentDoctor.exequatur : currentPatient.cedula}
          </p>
        </div>

        {/* Primary Sidebar Navigation */}
        <nav aria-label="Menú del panel" className="space-y-1 p-3">
          {navItems.map((item) => {
            const active = dashboardTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[42px] w-full items-center gap-3 rounded-lg px-3.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#0F3D5E] text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span aria-hidden="true" className={active ? 'text-[#5EEAD4]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Controls */}
      <div className="space-y-1 border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={() => setView('landing')}
          className="flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <span>Ir a la página de inicio</span>
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3.5 text-xs font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEF2F2]"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Persistent Desktop Sidebar (260px) */}
      <aside className="hidden w-[260px] shrink-0 border-r border-slate-200 lg:block">
        <div className="sticky top-0 h-screen">{renderSidebarContent()}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación móvil"
        >
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[1px]"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-xl">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Column: Top Header + Main Content + Compact Footer */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Contextual Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Abrir menú lateral"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <nav aria-label="Ubicación actual" className="flex min-w-0 items-center gap-2 text-xs sm:text-sm">
              <span className="hidden text-slate-500 sm:inline">
                {isDoctor ? 'Vista Médica' : 'Portal de Paciente'}
              </span>
              <span aria-hidden="true" className="hidden text-slate-300 sm:inline">
                /
              </span>
              <span className="truncate font-semibold text-slate-900">{currentTabLabel}</span>
            </nav>
          </div>

          {/* Interactive Role Switcher (Paciente | Médico) */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              role="group"
              aria-label="Cambiar perspectiva de demostración"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1"
            >
              <button
                type="button"
                onClick={() => switchRole('patient')}
                className={`min-h-[32px] rounded-md px-2.5 text-xs font-semibold transition-colors whitespace-nowrap sm:px-3 ${
                  !isDoctor
                    ? 'bg-white text-[#0F3D5E] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paciente
              </button>
              <button
                type="button"
                onClick={() => switchRole('doctor')}
                className={`min-h-[32px] rounded-md px-2.5 text-xs font-semibold transition-colors whitespace-nowrap sm:px-3 ${
                  isDoctor
                    ? 'bg-white text-[#0F3D5E] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Médico
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace Viewport */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <motion.div
            key={`${session.role}-${dashboardTab}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {dashboardTab === 'overview' && <DashboardOverview />}
            {dashboardTab === 'appointments' && <AppointmentsView />}
            {dashboardTab === 'book' && <BookingWizardView />}
            {dashboardTab === 'doctors' && <DoctorsDirectoryView />}
            {dashboardTab === 'profile' && <ProfileHistoryView />}
            {dashboardTab === 'patients' && <PatientsListView />}
          </motion.div>
        </main>

        {/* Compact Dashboard Footer with discreet Prototype Guide access */}
        <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>© 2026 MedicaRD · Entorno interactivo de citas médicas</p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={resetDemoData}
                className="inline-flex items-center gap-1.5 text-slate-600 transition-colors hover:text-[#0F3D5E]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Restablecer datos demo</span>
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                type="button"
                onClick={openGuide}
                className="font-medium text-slate-600 transition-colors hover:text-[#0F3D5E] hover:underline"
              >
                Guía del prototipo (Modelo y Estilos)
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
