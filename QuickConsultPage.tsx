import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { BottomNavigation } from "./BottomNavigation";
import { ClinicalBanner } from "./ClinicalBanner";
import { UpdateBadge } from "./UpdateBadge";
import type { ModuleKey } from "../types/navigation";

interface ShellProps {
  activeModule: ModuleKey;
  isDark: boolean;
  lastVerifiedAt: string | null;
  safetyNotice: string;
  children: ReactNode;
  onModuleChange: (module: ModuleKey) => void;
  onToggleDarkMode: () => void;
}

export function Shell({
  activeModule,
  isDark,
  lastVerifiedAt,
  safetyNotice,
  children,
  onModuleChange,
  onToggleDarkMode
}: ShellProps) {
  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 pb-24 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center">
                <img
                  className="h-9 w-auto max-w-[190px] dark:rounded-xl dark:bg-white dark:px-2 dark:py-1"
                  src="brand/vactrack-horizontal.svg"
                  alt="VacTrack"
                />
              </div>
              <button
                className="focus-ring grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                type="button"
                aria-label="Cambiar modo oscuro"
                onClick={onToggleDarkMode}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </header>

          <main className="flex-1 space-y-4 px-4 py-5">
            <UpdateBadge lastVerifiedAt={lastVerifiedAt} />
            <ClinicalBanner notice={safetyNotice} />
            {children}
          </main>
        </div>
        <BottomNavigation
          activeModule={activeModule}
          onChange={onModuleChange}
        />
      </div>
    </div>
  );
}
