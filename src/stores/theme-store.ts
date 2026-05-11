import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

type ThemeStore = {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeMode: "light",
      toggleThemeMode: () => {
        set((state) => ({
          themeMode: state.themeMode === "light" ? "dark" : "light",
        }));
      },
    }),
    {
      name: "theme-settings",
    },
  ),
);
