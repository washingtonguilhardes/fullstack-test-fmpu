'use client';

import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#0088FF',
      light: 'rgba(0, 136, 255, 0.1)',
      dark: '#00111F',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#00111F',
      paper: '#00111F',
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
        },
      },
    },
  },
});
