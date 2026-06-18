import {
  ArrowRight,
  BookOpen,
  Gauge,
  HeartPulse,
  Plane,
  Search
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatusPill } from "../components/StatusPill";
import type { ClinicalDataBundle } from "../types";
import type { ModuleKey } from "../types/navigation";

interface HomePageProps {
  data: ClinicalDataBundle;
  onNavigate: (module: ModuleKey) => void;
}

const modules: Array<{
  key: ModuleKey;
  title: string;
  description: string;
  icon: typeof Search;
}> = [
  {
    key: "quick",
    title: "Consulta rápida",
    description: "Vacunas esperadas por edad en calendario Asturias 2025.",
    icon: Search
  },
  {
    key: "healthy",
    title: "Revisión niño sano",
    description: "Vista clínica por edad con fuentes oficiales visibles.",
    icon: HeartPulse
  },
  {
    key: "accelerated",
    title: "Vacunación acelerada",
    description: "Preparado para reglas oficiales, aún sin pauta de rescate.",
    icon: Gauge
  },
  {
    key: "library",
    title: "Biblioteca",
    description: "Fuentes, estado de verificación y documentos oficiales.",
    icon: BookOpen
  },
  {
    key: "international",
    title: "Vacunación internacional",
    description: "Módulo reservado para una versión posterior.",
    icon: Plane
  }
];

export function HomePage({ data, onNavigate }: HomePageProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <img
          className="h-auto w-48 max-w-full dark:rounded-2xl dark:bg-white dark:p-2"
          src="brand/vactrack-horizontal.svg"
          alt="VacTrack"
        />
      </section>

      <PageHeader eyebrow="Pantalla principal" title="Respuesta segura en consulta">
        Consulta rápida del calendario Asturias 2025, sin pauta acelerada ni
        rescate hasta cargar esas reglas oficiales.
      </PageHeader>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
              Pregunta prioritaria
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-normal text-slate-950 dark:text-white">
              ¿Qué vacunas debo administrar hoy?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Respuesta por edad desde datos estructurados y fuente visible.
            </p>
          </div>
          <StatusPill status={data.sources.globalStatus} />
        </div>
        <button
          className="focus-ring mt-6 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_22px_rgba(15,118,110,0.18)] transition hover:bg-teal-800 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
          type="button"
          onClick={() => onNavigate("quick")}
        >
          Abrir consulta
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <button
              className="focus-ring group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-teal-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800"
              key={module.key}
              type="button"
              onClick={() => onNavigate(module.key)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-teal-700 transition group-hover:bg-teal-50 dark:bg-slate-800 dark:text-teal-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <ArrowRight className="mt-2 h-4 w-4 text-slate-400" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-white">
                {module.title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                {module.description}
              </p>
            </button>
          );
        })}
      </section>
    </div>
  );
}
