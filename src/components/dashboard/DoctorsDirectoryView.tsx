import React, { useMemo, useState } from 'react';
import { Calendar, MapPin, Search } from 'lucide-react';
import { DOCTORS, formatDop, SPECIALTIES } from '../../data/mockData';
import { getBranchById, getSpecialtyById, useMedica } from '../../context/MedicaContext';
import { SafeImage } from '../ui/Primitives';

export function DoctorsDirectoryView() {
  const { session, setBookingPrefill, setDashboardTab } = useMedica();
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  const isDoctor = session.role === 'doctor';

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      if (specialtyFilter !== 'all' && doc.specialtyId !== specialtyFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const sp = getSpecialtyById(doc.specialtyId);
        const br = getBranchById(doc.branchId);
        return (
          doc.name.toLowerCase().includes(q) ||
          (sp?.name.toLowerCase().includes(q) ?? false) ||
          (br?.city.toLowerCase().includes(q) ?? false) ||
          doc.exequatur.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, specialtyFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Directorio de especialistas
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Consulta credenciales, sedes y cobertura de ARS de nuestro cuadro médico en MedicaRD.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar médico, especialidad o ciudad..."
            aria-label="Buscar especialistas"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-xs text-slate-900 focus:border-[#0D9488]"
          />
        </div>

        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          aria-label="Filtrar por especialidad"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700 focus:border-[#0D9488]"
        >
          <option value="all">Todas las especialidades ({SPECIALTIES.length})</option>
          {SPECIALTIES.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </select>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-sm font-semibold text-slate-800">
            No encontramos especialistas que coincidan con tu búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSpecialtyFilter('all');
            }}
            className="mt-4 min-h-[38px] rounded-lg border border-slate-300 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Mostrar todos los especialistas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredDoctors.map((doc) => {
            const sp = getSpecialtyById(doc.specialtyId);
            const br = getBranchById(doc.branchId);
            return (
              <article
                key={doc.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <SafeImage
                      src={doc.imageUrl}
                      alt={`Fotografía de ${doc.name}`}
                      fallbackInitials={doc.initials}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-base font-semibold text-slate-900">
                      {doc.name}
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-[#0D9488]">
                      {sp?.name} · {doc.experienceYears} años de experiencia
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                      {doc.exequatur} · Idiomas: {doc.languages.join(', ')}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{doc.bio}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span>
                        {br?.city} · {br?.name}
                      </span>
                    </span>
                    <span className="font-mono font-semibold text-[#0F3D5E] tabular-nums">
                      Copago {formatDop(doc.arsCopayDop)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ARS: {doc.acceptedArs.join(' · ')}
                  </p>
                </div>

                {!isDoctor && (
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <span className="font-mono text-xs text-slate-600 tabular-nums">
                      Próximo: {doc.nextSlotLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingPrefill({
                          doctorId: doc.id,
                          specialtyId: doc.specialtyId,
                          branchId: doc.branchId,
                        });
                        setDashboardTab('book');
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#0F3D5E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#0B2E48]"
                    >
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Agendar cita</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
