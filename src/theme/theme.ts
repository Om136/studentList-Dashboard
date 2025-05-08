import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
  typography: {
    h6: {
      fontWeight: 500,
    },
  },
});
