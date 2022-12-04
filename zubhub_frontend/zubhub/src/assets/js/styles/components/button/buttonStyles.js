const styles = theme => ({
  primaryButtonStyle: {
    backgroundColor: '#00B8C4',
    borderRadius: 30,
    color: 'white',
    '&:hover': {
      backgroundColor: '#03848C',
    },
  },
  secondaryButtonStyle: {
    borderRadius: 30,
    backgroundColor: 'white',
    color: '#00B8C4',
    '&:hover': {
      color: '#03848C',
      backgroundColor: 'rgba(255,255,255,0.8)',
    },
  },
  dangerButtonStyle: {
    borderRadius: 30,
    backgroundColor: 'rgb(220, 0, 78)',
    color: 'white',
    '&:hover': {
      color: 'white',
      backgroundColor: '#9A0036',
    },
  }, 
  darkDangerButtonStyle: {
    borderRadius: 30,
    backgroundColor: '#9A0036',
    color: 'white',
    '&:hover': {
      color: 'white',
      backgroundColor: '#9A0036',
    },
  },
  customWarningButtonStyle: {
    borderRadius: 30,
    backgroundColor: '#FECB00',
    color: '#896e00',
    '&:hover': {
      color: '#896e00',
      backgroundColor: '#FECB00',
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
