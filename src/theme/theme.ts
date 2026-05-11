import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "@/stores/theme-store";

const fontFamily = [
  "Inter",
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "sans-serif",
].join(", ");

export const createAppTheme = (mode: ThemeMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === "light" ? "#6d867d" : "#9fb9af",
      dark: mode === "light" ? "#5f7971" : "#7f9c91",
      light: mode === "light" ? "#8ea79f" : "#c3d6cf",
    },
    secondary: {
      main: mode === "light" ? "#8ea79f" : "#b5c9c1",
    },
    background: {
      default: mode === "light" ? "#eef3ef" : "#101816",
      paper:
        mode === "light"
          ? "rgba(255, 255, 255, 0.76)"
          : "rgba(23, 34, 31, 0.84)",
    },
    text: {
      primary: mode === "light" ? "#273432" : "#edf5f1",
      secondary: mode === "light" ? "#6f817d" : "#afc2bb",
    },
    divider:
      mode === "light"
        ? "rgba(93, 118, 112, 0.16)"
        : "rgba(190, 213, 204, 0.16)",
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily,
    allVariants: {
      letterSpacing: 0,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(16px)",
          backgroundImage: "none",
          border:
            mode === "light"
              ? "1px solid rgba(93, 118, 112, 0.16)"
              : "1px solid rgba(190, 213, 204, 0.16)",
          boxShadow:
            mode === "light"
              ? "0 24px 70px -34px rgba(95, 121, 113, 0.25)"
              : "0 24px 70px -34px rgba(0, 0, 0, 0.52)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          paddingBlock: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor:
            mode === "light"
              ? "rgba(255, 255, 255, 0.72)"
              : "rgba(18, 28, 25, 0.72)",
        },
      },
    },
  },
});
