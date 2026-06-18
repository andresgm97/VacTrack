import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { SharedDateFields } from "../components/SharedDateFields";
import { StatusPill } from "../components/StatusPill";
import { evaluateHealthyChildVisit } from "../rules/healthyChildEngine";
import type { ClinicalDataBundle } from "../types";
import { formatMonthCount } from "../utils/format";
import { findSource } from "../utils/sourceUtils";

interface HealthyChildPageProps {
  data: ClinicalDataBundle;
  birthDate: string;
  consultationDate: string;
  onBirthDateChange: (value: string) => void;
  onConsultationDateChange: (value: string) => void;
}

export function HealthyChildPage({
  data,
  birthDate,
  consultationDate,
  onBirthDateChange,
  onConsultationDateChange
}: HealthyChildPageProps) {
  const result = evaluateHealthyChildVisit(
    { birthDate, consultationDate },
    data.healthyChild,
    data.asturiasCalendar
  );

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Revisión niño sano" title="Vista por edad">
        Vacunación esperada por edad desde el calendario Asturias 2025.
      </PageHeader>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <SharedDateFields
          birthDate={birthDate}
          consultationDate={consultationDate}
          onBirthDateChange={onBirthDateChange}
          onConsultationDateChange={onConsultationDateChange}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Edad calculada
            </p>
            <p className="mt-1 text-2xl font-black">
              {formatMonthCount(result.ageMonths)}
            </p>
          </div>
          <StatusPill status={result.status === "ready" ? "LISTO" : "BLOQUEADO"} />
        </div>
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold leading-5">{result.message}</p>
          </div>
        </div>
      </section>

      {result.expectedVaccines.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          No hay vacunas esperadas para esta edad exacta en el calendario
          Asturias 2025 cargado.
        </p>
      ) : (
        <section className="space-y-3">
          {result.expectedVaccines.map((vaccine) => {
            const source = findSource(data.sources, vaccine.sourceId);
            return (
              <article
                className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-emerald-800 dark:bg-slate-900"
                key={vaccine.id}
              >
                <StatusPill status="verified" />
                <h3 className="mt-4 text-lg font-bold">{vaccine.name}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {vaccine.doseNumber === null
                    ? "Vacuna esperada por edad"
                    : `Dosis ${vaccine.doseNumber}`}
                </p>
                {vaccine.notes.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    {vaccine.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-4 text-xs font-semibold text-teal-700 dark:text-teal-300">
                  Fuente oficial: {source?.title ?? vaccine.sourceId}
                </p>
              </article>
            );
          })}
        </section>
      )}

      {result.visits.length === 0
        ? null
        : result.visits.map((visit) => {
            const source = findSource(data.sources, visit.sourceRef);
            return (
              <article
                className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
                key={visit.id}
              >
                <StatusPill status={visit.status} />
                <h3 className="mt-4 text-lg font-bold">{visit.title}</h3>
                <p className="mt-1 text-sm">
                  Ventana provisional: {visit.windowStartMonths}-
                  {visit.windowEndMonths} meses.
                </p>
                <ul className="mt-4 space-y-2">
                  {visit.checks.map((check) => (
                    <li className="flex gap-2 text-sm leading-5" key={check}>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-5">
                  Fuente pendiente: {source?.title ?? visit.sourceRef}. No usar
                  como protocolo clínico.
                </p>
              </article>
            );
          })}
    </div>
  );
}
