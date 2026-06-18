import { ShieldAlert } from "lucide-react";

interface ClinicalBannerProps {
  notice: string;
}

export function ClinicalBanner({ notice }: ClinicalBannerProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-bold uppercase tracking-wide">
            Estado de datos
          </p>
          <p className="mt-1 text-sm leading-5">{notice}</p>
        </div>
      </div>
    </section>
  );
}
