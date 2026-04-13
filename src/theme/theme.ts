import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6d867d",
      dark: "#5f7971",
      light: "#8ea79f",
    },
    secondary: {
      main: "#8ea79f",
    },
    background: {
      default: "#eef3ef",
      paper: "rgba(255, 255, 255, 0.76)",
    },
    text: {
      primary: "#273432",
      secondary: "#6f817d",
    },
    divider: "rgba(93, 118, 112, 0.16)",
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: 'Georgia, "Times New Roman", serif',
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
          border: "1px solid rgba(93, 118, 112, 0.16)",
          boxShadow: "0 24px 70px -34px rgba(95, 121, 113, 0.25)",
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
          backgroundColor: "rgba(255, 255, 255, 0.72)",
        },
      },
    },
  },
});
