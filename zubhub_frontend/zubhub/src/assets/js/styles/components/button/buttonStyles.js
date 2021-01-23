const styles = theme => ({
  primaryButtonStyle: {
    backgroundColor: '#00B8C4',
    borderRadius: 15,
    color: 'white',
    '&:hover': {
      backgroundColor: '#03848C',
    },
  },
  secondaryButtonStyle: {
    borderRadius: 15,
    backgroundColor: 'white',
    color: '#00B8C4',
    '&:hover': {
      color: '#03848C',
      backgroundColor: 'rgba(255,255,255,0.8)',
    },
  },
  dangerButtonStyle: {
    borderRadius: 15,
    backgroundColor: 'rgb(220, 0, 78)',
    color: 'white',
    '&:hover': {
      color: 'white',
      backgroundColor: '#9A0036',
    },
  },
  imageUploadButtonStyle: {
    '& MuiButton-label': {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      '& imageCountStyle': {
        flexGrow: 1,
      },
    },
  },
  fullWidth: {
    width: '100%',
  },
});

export default styles;
