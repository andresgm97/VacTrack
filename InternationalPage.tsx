import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, children }: PageHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
        {eyebrow}
      </p>
      <h1 className="text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
        {title}
      </h1>
      {children ? (
        <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          {children}
        </p>
      ) : null}
    </header>
  );
}
