"use client";

import { useThemeStore } from "@/stores/theme-store";

export default function ThemeToggle() {
  const themeMode = useThemeStore((state) => state.themeMode);
  const toggleThemeMode = useThemeStore((state) => state.toggleThemeMode);
  const nextThemeMode = themeMode === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextThemeMode} theme`}
      title={`Switch to ${nextThemeMode} theme`}
      onClick={toggleThemeMode}
      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text)] shadow-[inset_0_1px_0_var(--glass-highlight)] transition duration-300 hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent-strong)]"
    >
      {themeMode === "light" ? (
        <svg
          aria-hidden="true"
          className="h-4.5 w-4.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 7.5A8 8 0 1 1 12 3Z" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          className="h-4.5 w-4.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
