import { useMemo, useState } from "react";
import { Shell } from "./components/Shell";
import { AcceleratedPage } from "./pages/AcceleratedPage";
import { HealthyChildPage } from "./pages/HealthyChildPage";
import { HomePage } from "./pages/HomePage";
import { InternationalPage } from "./pages/InternationalPage";
import { LibraryPage } from "./pages/LibraryPage";
import { QuickConsultPage } from "./pages/QuickConsultPage";
import type { ModuleKey } from "./types/navigation";
import { formatDateForInput } from "./utils/format";
import { loadClinicalData } from "./utils/dataLoader";

export default function App() {
  const data = useMemo(() => loadClinicalData(), []);
  const [activeModule, setActiveModule] = useState<ModuleKey>("home");
  const [birthDate, setBirthDate] = useState("");
  const [consultationDate, setConsultationDate] = useState(() =>
    formatDateForInput(new Date())
  );
  const [knownDosesSummary, setKnownDosesSummary] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  return (
    <Shell
      activeModule={activeModule}
      isDark={isDark}
      lastVerifiedAt={data.sources.lastVerifiedAt}
      safetyNotice={data.sources.clinicalSafetyNotice}
      onModuleChange={setActiveModule}
      onToggleDarkMode={() => setIsDark((current) => !current)}
    >
      {activeModule === "home" ? (
        <HomePage data={data} onNavigate={setActiveModule} />
      ) : null}

      {activeModule === "quick" ? (
        <QuickConsultPage
          data={data}
          birthDate={birthDate}
          consultationDate={consultationDate}
          onBirthDateChange={setBirthDate}
          onConsultationDateChange={setConsultationDate}
        />
      ) : null}

      {activeModule === "healthy" ? (
        <HealthyChildPage
          data={data}
          birthDate={birthDate}
          consultationDate={consultationDate}
          onBirthDateChange={setBirthDate}
          onConsultationDateChange={setConsultationDate}
        />
      ) : null}

      {activeModule === "accelerated" ? (
        <AcceleratedPage
          data={data}
          birthDate={birthDate}
          consultationDate={consultationDate}
          knownDosesSummary={knownDosesSummary}
          onBirthDateChange={setBirthDate}
          onConsultationDateChange={setConsultationDate}
          onKnownDosesSummaryChange={setKnownDosesSummary}
        />
      ) : null}

      {activeModule === "library" ? <LibraryPage data={data} /> : null}

      {activeModule === "international" ? <InternationalPage /> : null}
    </Shell>
  );
}
