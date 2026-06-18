@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-tap-highlight-color: transparent;
  }

  body {
    @apply bg-slate-50 text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }
}

@layer components {
  .focus-ring {
    @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950;
  }
}
