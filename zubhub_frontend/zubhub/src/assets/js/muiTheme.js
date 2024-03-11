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
  categoryColors: {
    Animations: '#FCB07F',
    Art: '#F8D991',
    Science: '#FBC9B3',
    Coding: '#65B4BD',
    Electronics: '#F1D27C',
    Toys: '#FAC5C2',
    Games: '#6065A4',
    Mechanical: '#F571AE',
    Music: '#F1FC73',
    Robotics: '#A66CA9',
    Structures: '#FAE393',
  },
});
