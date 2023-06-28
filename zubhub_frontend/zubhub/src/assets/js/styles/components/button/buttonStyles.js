const styles = theme => ({
  primaryButtonStyle: {
    backgroundColor: 'var(--primary-color3)',
    borderRadius: 30,
    color: 'white',
    '&:hover': {
      backgroundColor: 'var(--secondary-color6)',
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
});

export default styles;
