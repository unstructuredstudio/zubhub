const styles = theme => ({
  rootStyle: {
    paddingBottom: '2em',
    display: 'flex',
    flex: '1 0 auto',
    marginTop: '2em',
    [theme.breakpoints.down('378')]: {
      marginTop: '3em',
    },
    background: 'var(--primary-color2)',
    // eslint-disable-next-line no-dupe-keys
    background:
      'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    filter:
      "progid:DXImageTransform.Microsoft.gradient( startColorstr='var(--primary-color2)', endColorstr='#ffffff', GradientType=0 )",
    '& .MuiGrid-root.MuiGrid-container': {
      width: '100%',
    },
  },
  mainContainerStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('500')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  messageBoxStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageStyle: {
    textAlign: 'center',
  },
});

export default styles;
