import { Translate } from "@material-ui/icons";
import { colors } from "../../../colors";

const styles = theme => ({
  root: {
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background: 'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
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
    padding: '24px 30px',
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: '1.7rem',
    [theme.breakpoints.up('1600')]: {
      fontSize: '2.5rem',
    },
  },
  descStyle: {
    fontSize: '18px',
    fontWeight: 600,
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.7rem',
    },
  },
  bodyStyle: {
    fontWeight: 500,
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.3rem',
    },
  },
  customButtonStyle: {
    borderRadius: 8,
  },
  customInputStyle: {
    borderRadius: 8,
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
  textDecorationNone: {
    textDecoration: 'none',
  },
  linkStyle: {
    color: colors.primary,
    '&:hover': {
      color: 'var(--secondary-color6)',
    },
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
  marginTop: {
    marginTop: 22,
  },
});

export default styles;