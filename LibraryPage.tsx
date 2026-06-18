interface SharedDateFieldsProps {
  birthDate: string;
  consultationDate: string;
  onBirthDateChange: (value: string) => void;
  onConsultationDateChange: (value: string) => void;
}

export function SharedDateFields({
  birthDate,
  consultationDate,
  onBirthDateChange,
  onConsultationDateChange
}: SharedDateFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Fecha de nacimiento
        </span>
        <input
          className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 shadow-[0_6px_16px_rgba(15,23,42,0.03)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          type="date"
          value={birthDate}
          onChange={(event) => onBirthDateChange(event.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Fecha de consulta
        </span>
        <input
          className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 shadow-[0_6px_16px_rgba(15,23,42,0.03)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          type="date"
          value={consultationDate}
          onChange={(event) => onConsultationDateChange(event.target.value)}
        />
      </label>
    </div>
  );
}
