import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, Save } from 'lucide-react';
import { ARS_PROVIDERS, formatDateSpanish } from '../../data/mockData';
import { getDoctorById, getSpecialtyById, useMedica } from '../../context/MedicaContext';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export function ProfileHistoryView() {
  const { currentPatient, clinicalRecords, updatePatientProfile } = useMedica();

  const [name, setName] = useState(currentPatient.name);
  const [phone, setPhone] = useState(currentPatient.phone);
  const [arsProvider, setArsProvider] = useState(currentPatient.arsProvider);
  const [arsPolicyNumber, setArsPolicyNumber] = useState(currentPatient.arsPolicyNumber);
  const [bloodType, setBloodType] = useState(currentPatient.bloodType);
  const [allergies, setAllergies] = useState(currentPatient.allergies);
  const [emergencyContact, setEmergencyContact] = useState(currentPatient.emergencyContact);
  const [formError, setFormError] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  const myRecords = clinicalRecords.filter((r) => r.patientId === currentPatient.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setFormError('El nombre del paciente debe contener al menos 3 caracteres.');
      return;
    }
    if (phone.trim().length < 10) {
      setFormError('Ingresa un número telefónico válido.');
      return;
    }
    setFormError('');
    updatePatientProfile(currentPatient.id, {
      name: name.trim(),
      phone: phone.trim(),
      arsProvider,
      arsPolicyNumber: arsPolicyNumber.trim(),
      bloodType,
      allergies: allergies.trim() || 'Ninguna conocida',
      emergencyContact: emergencyContact.trim(),
    });
    setSavedBanner(true);
    window.setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Mi perfil clínico e historial
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Mantén actualizada tu información de contacto, cobertura ARS y consulta tus notas médicas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Editable Clinical Profile Form */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <h2 className="font-display text-base font-semibold text-slate-900">
            Datos personales y cobertura
          </h2>
          <p className="mt-1 font-mono text-xs text-slate-500 tabular-nums">
            Cédula: {currentPatient.cedula} · Correo: {currentPatient.email}
          </p>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div>
              <label htmlFor="prof-name" className="block text-xs font-semibold text-slate-700">
                Nombre completo
              </label>
              <input
                id="prof-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#0D9488]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="prof-phone" className="block text-xs font-semibold text-slate-700">
                  Teléfono
                </label>
                <input
                  id="prof-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 tabular-nums focus:border-[#0D9488]"
                />
              </div>

              <div>
                <label htmlFor="prof-blood" className="block text-xs font-semibold text-slate-700">
                  Tipo de sangre
                </label>
                <select
                  id="prof-blood"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 focus:border-[#0D9488]"
                >
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="prof-ars" className="block text-xs font-semibold text-slate-700">
                  Aseguradora (ARS)
                </label>
                <select
                  id="prof-ars"
                  value={arsProvider}
                  onChange={(e) => setArsProvider(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#0D9488]"
                >
                  {ARS_PROVIDERS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="prof-policy" className="block text-xs font-semibold text-slate-700">
                  Número de afiliado / póliza
                </label>
                <input
                  id="prof-policy"
                  type="text"
                  value={arsPolicyNumber}
                  onChange={(e) => setArsPolicyNumber(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 tabular-nums focus:border-[#0D9488]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="prof-allergies" className="block text-xs font-semibold text-slate-700">
                Alergias o condiciones relevantes
              </label>
              <input
                id="prof-allergies"
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label htmlFor="prof-emergency" className="block text-xs font-semibold text-slate-700">
                Contacto de emergencia
              </label>
              <input
                id="prof-emergency"
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#0D9488]"
              />
            </div>

            {formError && (
              <p role="alert" className="flex items-center gap-1.5 text-xs text-[#B91C1C]">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{formError}</span>
              </p>
            )}

            {savedBanner && (
              <p role="status" className="flex items-center gap-1.5 text-xs font-medium text-[#15803D]">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Cambios guardados en tu perfil clínico.</span>
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#0F3D5E] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0B2E48]"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                <span>Guardar cambios</span>
              </button>
            </div>
          </form>
        </section>

        {/* Clinical History & Prescriptions */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Historial de consultas y recetas
            </h2>
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              {myRecords.length} registros
            </span>
          </div>

          {myRecords.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-800">
                Aún no tienes notas médicas registradas
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Cuando un especialista complete una consulta, el diagnóstico y receta aparecerán
                aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-200">
              {myRecords.map((rec) => {
                const doc = getDoctorById(rec.doctorId);
                const sp = doc ? getSpecialtyById(doc.specialtyId) : undefined;
                return (
                  <article key={rec.id} className="py-4 first:pt-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-sm font-semibold text-slate-900">
                        {rec.diagnosis}
                      </h3>
                      <span className="font-mono text-xs text-slate-500 tabular-nums">
                        {formatDateSpanish(rec.date)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#0D9488]">
                      {doc?.name} · {sp?.name}
                    </p>
                    <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-900">Prescripción:</span>{' '}
                        {rec.prescription}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Notas:</span> {rec.notes}
                      </p>
                    </div>
                    {(rec.bloodPressure || rec.heartRate) && (
                      <p className="mt-2 font-mono text-[11px] text-slate-500 tabular-nums">
                        Signos vitales · PA: {rec.bloodPressure ?? 'N/A'} · FC:{' '}
                        {rec.heartRate ?? 'N/A'}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
