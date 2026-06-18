import { CalendarCheck2 } from "lucide-react";

interface UpdateBadgeProps {
  lastVerifiedAt: string | null;
}

export function UpdateBadge({ lastVerifiedAt }: UpdateBadgeProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <CalendarCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" />
      <div>
        <p className="font-bold text-slate-900 dark:text-white">
          Actualizado a día
        </p>
        <p className="mt-1 leading-5">
          {lastVerifiedAt ?? "Última verificación pendiente"}
        </p>
      </div>
    </div>
  );
}
