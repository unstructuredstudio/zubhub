import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  typography: {
    fontFamily: ['Raleway', 'Roboto', 'sans-serif'].join(','),
  },
  circleBox: {
    backgroundColor: '#00B8C4',
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
