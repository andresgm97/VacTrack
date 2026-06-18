import { AlertTriangle, Gauge } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { SharedDateFields } from "../components/SharedDateFields";
import { StatusPill } from "../components/StatusPill";
import { evaluateAcceleratedSchedule } from "../rules/acceleratedEngine";
import type { ClinicalDataBundle } from "../types";
import { formatMonthCount } from "../utils/format";

interface AcceleratedPageProps {
  data: ClinicalDataBundle;
  birthDate: string;
  consultationDate: string;
  knownDosesSummary: string;
  onBirthDateChange: (value: string) => void;
  onConsultationDateChange: (value: string) => void;
  onKnownDosesSummaryChange: (value: string) => void;
}

export function AcceleratedPage({
  data,
  birthDate,
  consultationDate,
  knownDosesSummary,
  onBirthDateChange,
  onConsultationDateChange,
  onKnownDosesSummaryChange
}: AcceleratedPageProps) {
  const result = evaluateAcceleratedSchedule(
    { birthDate, consultationDate, knownDosesSummary },
    data.acceleratedCalendar
  );

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Vacunación acelerada" title="Motor preparado">
        Arquitectura lista, sin cálculo de pautas complejas hasta cargar reglas
        oficiales estructuradas.
      </PageHeader>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <SharedDateFields
          birthDate={birthDate}
          consultationDate={consultationDate}
          onBirthDateChange={onBirthDateChange}
          onConsultationDateChange={onConsultationDateChange}
        />
        <label className="mt-4 block">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Resumen de dosis conocidas
          </span>
          <textarea
            className="focus-ring mt-2 min-h-28 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 shadow-[0_6px_16px_rgba(15,23,42,0.03)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={knownDosesSummary}
            onChange={(event) => onKnownDosesSummaryChange(event.target.value)}
            placeholder="Campo temporal. No se guarda historial ni datos personales."
          />
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Estado del motor
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-teal-700 dark:bg-slate-800 dark:text-teal-300">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold">Preparado para reglas oficiales</h3>
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
              Reglas cargadas actualmente: {result.ruleCount}. El motor bloquea
              respuestas incompletas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
