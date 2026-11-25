import React, { useMemo, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { formatDateSpanish } from '../../data/mockData';
import { getDoctorById, useMedica } from '../../context/MedicaContext';
import { Patient } from '../../types/medical';
import { Modal } from '../ui/Primitives';

export function PatientsListView() {
  const { patients, appointments, clinicalRecords } = useMedica();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.trim().toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.cedula.toLowerCase().includes(q) ||
        p.arsProvider.toLowerCase().includes(q)
    );
  }, [patients, search]);

  const selectedRecords = selectedPatient
    ? clinicalRecords.filter((r) => r.patientId === selectedPatient.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Expedientes de pacientes
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Consulta información clínica básica, alergias registradas e historial de atenciones.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar paciente por nombre, cédula o ARS..."
            aria-label="Buscar pacientes"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-xs text-slate-900 focus:border-[#0D9488]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="px-5 py-3.5">Paciente y Cédula</th>
                <th className="px-5 py-3.5">ARS y Póliza</th>
                <th className="px-5 py-3.5">Grupo Sanguíneo / Alergias</th>
                <th className="px-5 py-3.5 text-right">Citas</th>
                <th className="px-5 py-3.5 text-right">Expediente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPatients.map((patient) => {
                const visitCount = appointments.filter(
                  (a) => a.patientId === patient.id
                ).length;

                return (
                  <tr key={patient.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{patient.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-500 tabular-nums">
                        {patient.cedula} · {patient.phone}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-slate-800">{patient.arsProvider}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-500 tabular-nums">
                        {patient.arsPolicyNumber}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs font-semibold text-[#0F3D5E] tabular-nums">
                        Tipo {patient.bloodType}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">{patient.allergies}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums">
                      {visitCount}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0F3D5E] transition-colors hover:border-[#0F3D5E]"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Ver ficha</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={Boolean(selectedPatient)}
        onClose={() => setSelectedPatient(null)}
        title={selectedPatient ? `Expediente clínico · ${selectedPatient.name}` : ''}
        subtitle={
          selectedPatient
            ? `Cédula ${selectedPatient.cedula} · Tipo sanguíneo ${selectedPatient.bloodType}`
            : undefined
        }
        footer={
          <button
            type="button"
            onClick={() => setSelectedPatient(null)}
            className="min-h-[40px] rounded-lg bg-[#0F3D5E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B2E48]"
          >
            Cerrar expediente
          </button>
        }
      >
        {selectedPatient && (
          <div className="space-y-5 text-sm">
            <dl className="grid grid-cols-1 gap-3 border-b border-slate-200 pb-4 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Aseguradora (ARS)</dt>
                <dd className="mt-0.5 font-medium text-slate-900">
                  {selectedPatient.arsProvider} ({selectedPatient.arsPolicyNumber})
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Alergias registradas</dt>
                <dd className="mt-0.5 font-medium text-[#B91C1C]">
                  {selectedPatient.allergies}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Teléfono y correo</dt>
                <dd className="mt-0.5 text-slate-800">
                  {selectedPatient.phone} · {selectedPatient.email}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Contacto de emergencia</dt>
                <dd className="mt-0.5 text-slate-800">{selectedPatient.emergencyContact}</dd>
              </div>
            </dl>

            <div>
              <h3 className="font-display text-xs font-semibold text-slate-700">
                Notas clínicas previas ({selectedRecords.length})
              </h3>
              {selectedRecords.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">
                  No existen notas clínicas previas registradas para este paciente.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-slate-200">
                  {selectedRecords.map((rec) => (
                    <div key={rec.id} className="py-3 first:pt-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">{rec.diagnosis}</span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {formatDateSpanish(rec.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{rec.prescription}</p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Atendido por {getDoctorById(rec.doctorId)?.name} · PA: {rec.bloodPressure} ·
                        FC: {rec.heartRate}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
