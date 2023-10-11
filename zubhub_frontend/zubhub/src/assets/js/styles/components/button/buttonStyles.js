import { colors } from "../../../colors";

const styles = theme => ({
  primaryButtonStyle: {
<<<<<<< HEAD
    backgroundColor: '#00B8C4',
=======
    backgroundColor: 'var(--primary-color3)',
>>>>>>> d166c9a8632299abe2e49b2067dd2f57ff6953f4
    borderRadius: 30,
    color: 'white',
    '&:hover': {
      backgroundColor: 'var(--secondary-color6)',
    },
  },
  primaryButtonStyleNoRadius: {
    backgroundColor: '#00B8C4',
    color: 'white',
    borderRadius: 5,
    '&:hover': {
      backgroundColor: '#03848C',
    },
    whiteSpace:'nowrap'
  },
  primaryButtonOutlinedStyle: {
    backgroundColor: 'transparent',
    border: `1px solid ${colors.primary}`,
    borderRadius: 30,
    color: colors.primary,
    '&:hover': {
      backgroundColor: 'var(--primary-color3)',
      color: colors.white
    },
  },
  primaryButtonStyle2: {
    backgroundColor: 'var(--primary-color2)',
    '&:hover': {
      backgroundColor: 'var(--primary-color2)',
    },
  },
  primaryButtonStyle3: {
    backgroundColor: 'var(--primary-color1)',
    border: '2px solid var(--primary-color2)',
    borderRadius: 30,
    color: 'white',
    '&:hover': {
      backgroundColor: 'var(--secondary-color1)',
    },
  },
  secondaryButtonStyle: {
    borderRadius: 30,
    backgroundColor: 'white',
    color: 'var(--primary-color3)',
    '&:hover': {
      color: 'var(--secondary-color6)',
      backgroundColor: 'rgba(255,255,255,0.8)',
    },
  },
  dangerButtonStyle: {
    borderRadius: 30,
    backgroundColor: 'rgb(220, 0, 78)',
    color: 'white',
    '&:hover': {
      color: 'white',
      backgroundColor: 'var(--secondary-color2)',
    },
  },
  darkDangerButtonStyle: {
    borderRadius: 30,
    backgroundColor: 'var(--secondary-color2)',
    color: 'white',
    '&:hover': {
      color: 'white',
      backgroundColor: 'var(--secondary-color2)',
    },
  },
  customWarningButtonStyle: {
    borderRadius: 30,
    backgroundColor: 'var(--primary-color2)',
    color: 'white',
    '&:hover': {
      color: 'white',
      backgroundColor: 'var(--secondary-color4)',
    },
  },
  mediaUploadButtonStyle: {
    '& MuiButton-label': {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
    },
  },
  customButtonStyle: {
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.5rem',
    },
  },
  fullWidth: {
    width: '100%',
  },
  default: {
    padding: '8px 40px',
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: '500'
  }
});

export default styles;
