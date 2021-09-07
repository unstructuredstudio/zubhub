import { fade } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background: 'rgba(255,204,0,1)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
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
  ttitleStyle: {
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
      color: '#00B8C4',
    },
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.7rem',
    },
  },
  customInputStyle: {
    borderRadius: 15,
    '&.MuiOutlinedInput-notchedOutline': {
      border: '2px solid #00B8C4',
      boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
    },
    '&.MuiOutlinedInput-root': {
      '&:hover fieldset': {
        border: '2px solid #00B8C4',
        boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
      },
      '&.Mui-focused fieldset': {
        border: '2px solid #00B8C4',
        boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
      },
      [theme.breakpoints.up('1600')]: {
        fontSize: '1.7rem',
      },
    },
  },
  secondaryLink: {
    color: '#00B8C4',
    '&:hover': {
      color: '#03848C',
    },
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerText: {
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
  divider: {
    width: '30%',
    marginRight: '1em',
    marginLeft: '1em',
    [theme.breakpoints.up('1600')]: {
      height: '0.1em',
    },
    [theme.breakpoints.down('510')]: {
      width: '20%',
    },
    [theme.breakpoints.down('381')]: {
      marginLeft: '0.5em',
      marginRight: '0.5em',
    },
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  errorBox: {
    width: '100%',
    padding: '1em',
    borderRadius: 6,
    borderWidth: '1px',
    borderColor: '#a94442',
    backgroundColor: '#ffcdd2',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.5rem',
    },
  },
  error: {
    color: '#a94442',
  },
  fieldHelperTextStyle: {
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
});

export default styles;
