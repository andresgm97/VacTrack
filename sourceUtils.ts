import { Plane, ShieldAlert } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { PENDING_OFFICIAL_SOURCE } from "../types";

export function InternationalPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Vacunación internacional"
        title="Módulo reservado para V1.1"
      >
        Sin recomendaciones activas hasta cargar fuentes y reglas oficiales
        estructuradas.
      </PageHeader>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-teal-700 dark:bg-slate-800 dark:text-teal-300">
          <Plane className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-black">Sin contenido clínico activo</h2>
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold leading-5">
              {PENDING_OFFICIAL_SOURCE}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
