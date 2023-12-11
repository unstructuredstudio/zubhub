import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    },
  },
  palette: {
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: ['Raleway', 'Roboto', 'sans-serif'].join(','),
  },
  circleBox: {
    backgroundColor: 'var(--primary-color3)',
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '& .Mui-checked': {
            color: 'green', // Replace with your desired checked color
          },
        },
      },
    },
  },
});
