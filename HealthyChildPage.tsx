import {
  BookOpen,
  Gauge,
  HeartPulse,
  Home,
  Plane,
  Search
} from "lucide-react";
import type { ModuleKey } from "../types/navigation";

interface BottomNavigationProps {
  activeModule: ModuleKey;
  onChange: (module: ModuleKey) => void;
}

const items: Array<{
  key: ModuleKey;
  label: string;
  icon: typeof Home;
}> = [
  { key: "home", label: "Inicio", icon: Home },
  { key: "quick", label: "Consulta", icon: Search },
  { key: "healthy", label: "Niño sano", icon: HeartPulse },
  { key: "accelerated", label: "Acelerada", icon: Gauge },
  { key: "library", label: "Biblioteca", icon: BookOpen },
  { key: "international", label: "Viajes", icon: Plane }
];

export function BottomNavigation({
  activeModule,
  onChange
}: BottomNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-10px_28px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto grid max-w-3xl grid-cols-6 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.key;

          return (
            <button
              className={`focus-ring relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.68rem] font-semibold transition ${
                isActive
                  ? "text-teal-700 dark:text-teal-300"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              }`}
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive ? (
                <span className="absolute top-1 h-0.5 w-7 rounded-full bg-teal-700 dark:bg-teal-300" />
              ) : null}
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
