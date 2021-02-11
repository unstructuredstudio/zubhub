const styles = theme => ({
  navBarStyle: {
    backgroundColor: '#DC3545',
  },
  mainContainerStyle: {
    maxWidth: '2000px',
  },
  logoStyle: {
    flexGrow: 1,
    '& img': {
      height: '2em',
    },
    [theme.breakpoints.down('317')]: {
      '& img': {
        height: '1.5em',
      },
    },
  },
  footerLogoStyle: {
    height: '5em',
    [theme.breakpoints.down('376')]: {
      height: '3em',
    },
    [theme.breakpoints.down('230')]: {
      height: '2em',
    },
  },
  navActionStyle: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarStyle: {
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  profileMenuStyle: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  profileStyle: { fontWeight:"bold"},
  logOutStyle: {
    borderTop: '1px solid #C4C4C4',
  },
  scrollTopButtonStyle: {
    zIndex: 100,
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  languageSelectBoxStyle:{
    marginLeft:"2em",
    color:"white",
    [theme.breakpoints.down('282')]: {
        marginLeft: '1em',
    },
  },
  languageSelectStyle: {
    display:"inline-block",
    maxWidth:"5em",
    color:"white",
    "& .MuiInputBase-input":{
      boxSizing: 'border-box'
    }
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  displayNone: { display: 'none' },
  largeLabel: {
    fontSize: '1.3rem',
  },
});

export default styles;
