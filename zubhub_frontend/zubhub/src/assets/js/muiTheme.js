import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
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
