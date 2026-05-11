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

const themeTokens = {
  light: {
    primary: {
      main: "#6d867d",
      dark: "#5f7971",
      light: "#8ea79f",
    },
    secondary: "#8ea79f",
    background: {
      default: "#eef3ef",
      paper: "rgba(255, 255, 255, 0.76)",
      input: "rgba(255, 255, 255, 0.72)",
    },
    text: {
      primary: "#273432",
      secondary: "#6f817d",
    },
    divider: "rgba(93, 118, 112, 0.16)",
    paperShadow: "0 24px 70px -34px rgba(95, 121, 113, 0.25)",
  },
  dark: {
    primary: {
      main: "#9fb9af",
      dark: "#7f9c91",
      light: "#c3d6cf",
    },
    secondary: "#b5c9c1",
    background: {
      default: "#101816",
      paper: "rgba(23, 34, 31, 0.84)",
      input: "rgba(18, 28, 25, 0.72)",
    },
    text: {
      primary: "#edf5f1",
      secondary: "#afc2bb",
    },
    divider: "rgba(190, 213, 204, 0.16)",
    paperShadow: "0 24px 70px -34px rgba(0, 0, 0, 0.52)",
  },
} satisfies Record<
  ThemeMode,
  {
    background: {
      default: string;
      input: string;
      paper: string;
    };
    divider: string;
    paperShadow: string;
    primary: {
      dark: string;
      light: string;
      main: string;
    };
    secondary: string;
    text: {
      primary: string;
      secondary: string;
    };
  }
>;

export const createAppTheme = (mode: ThemeMode) => {
  const tokens = themeTokens[mode];

  return createTheme({
    palette: {
      mode,
      primary: tokens.primary,
      secondary: {
        main: tokens.secondary,
      },
      background: {
        default: tokens.background.default,
        paper: tokens.background.paper,
      },
      text: tokens.text,
      divider: tokens.divider,
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
            border: `1px solid ${tokens.divider}`,
            boxShadow: tokens.paperShadow,
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
            backgroundColor: tokens.background.input,
          },
        },
      },
    },
  });
};
