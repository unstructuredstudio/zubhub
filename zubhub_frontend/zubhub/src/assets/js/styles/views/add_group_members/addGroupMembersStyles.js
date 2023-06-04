import { fade } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background: 'var(--primary-color2)',
    background:
      'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
  },
  containerStyle: {
    maxWidth: '600px',
    [theme.breakpoints.up('1600')]: {
      maxWidth: '950px',
    },
  },
  cardStyle: {
    border: 0,
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .12)',
    color: 'white',
    padding: '0 30px',
  },
  titleStyle: {
    fontWeight: 900,
    fontSize: '1.7rem',
    [theme.breakpoints.up('1600')]: {
      fontSize: '2.5rem',
    },
  },
  descStyle: {
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.7rem',
    },
  },
  customLabelStyle: {
    '&.MuiFormLabel-root.Mui-focused': {
      color: 'var(--primary-color3)',
    },
    fontWeight: 'bold',
    fontSize: '1rem',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.7rem',
    },
  },

  customInputStyle: {
    width: '100%',
    borderRadius: 15,
    '&.MuiOutlinedInput-notchedOutline': {
      border: '2px solid var(--primary-color3)',
      boxShadow: `rgba(var(--primary-color3), 0.2rem) 0 0 0 0.2rem`,
    },
    '&.MuiOutlinedInput-root': {
      '&:hover fieldset': {
        border: '2px solid var(--primary-color3)',
        boxShadow: `rgba(var(--primary-color3), 0.2rem) 0 0 0 0.2rem`,
      },
      '&.Mui-focused fieldset': {
        border: '2px solid var(--primary-color3)',
        boxShadow: `rgba(var(--primary-color3), 0.2rem) 0 0 0 0.2rem`,
      },
      [theme.breakpoints.up('1600')]: {
        fontSize: '1.7rem',
      },
    },
  },

  CSVBoxStyles: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  bulkAddStyles: {
    '& .MuiSwitch-colorSecondary.Mui-checked': {
      color: 'var(--primary-color3)',
    },
    '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
      backgroundColor: 'var(--primary-color3)',
    },
  },

  uploadProgressStyle: {
    color: 'var(--primary-color3)',
  },

  addCSVStyles: {
    width: '100%',
    backgroundColor: 'grey',
  },

  errorBox: {
    width: '100%',
    padding: '1em',
    borderRadius: 6,
    borderWidth: '1px',
    borderColor: 'var(--primary-color2)',
    backgroundColor: 'var(--secondary-color1)',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.5rem',
    },
  },
  error: {
    color: 'var(--primary-color2)',
  },
  fieldHelperTextStyle: {
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
});

export default styles;
