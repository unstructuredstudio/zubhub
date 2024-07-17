export const styles = theme => ({
  root: {
    marginTop: '2em',
    marginBottom: '2em',
    [theme.breakpoints.down('378')]: {
      marginTop: '3em',
      marginBottom: '3em',
    },
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // background: 'var(--primary-color2)',
    // background:
    //   'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    '& .MuiGrid-root.MuiGrid-container': {
      width: '100%',
    },
  },
  mainContainerStyle: {
    maxWidth: '1190px',
    width: '100%',
  },
  mainContainerLoggedOutStyle: {
    background: 'white',
    padding: '0 3em',
    marginTop: '3em',
    borderRadius: '15px',
    [theme.breakpoints.down('1080')]: {
      padding: '0 1em',
    },
    [theme.breakpoints.down('500')]: {
      padding: 0,
    },
  },
  pageHeaderStyle: {
    margin: '1em 0',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  creatorsContainerStyle: {
    width: '100%',
    display: 'flex',
    gap: '1em',
  },
  creatorsContainerLoggedOutStyle: {
    justifyContent: 'center',
  },
  projectsContainerStyle: {
    margin: 0,
  },
  loggedOutResultsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    maxHeight: '400px',
    overflow: 'hidden',
  },
  cardStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 345,
    paddingTop: 0,
    paddingBottom: '0 !important',
    marginTop: '1em',
    marginBottom: '0',
    borderRadius: '15px',
    textAlign: 'left',
    backgroundColor: '#ffffff',
  },
  cardLoggedOutStyle: {
    marginBottom: '9em',
    boxShadow: 'none',
  },
  avatarStyle: {
    width: '100%',
    height: '100%',
    paddingTop: '1.5em',
    paddingBottom: '1.5em',
    '& img': {
      width: '6em',
      backgroundColor: 'white',
      height: '6em',
      borderRadius: '50%',
      boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    },
  },
  userNameStyle: {
    margin: '0.5em',
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  buttonGroupStyle: {
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'block',
    marginTop: '2em',
    maxWidth: '2000px',
    width: '100%',
  },
  buttonGroupLoggedOut: {
    // background: 'white'
    display: 'none',
  },
  floatRight: {
    float: 'right',
  },
  floatLeft: {
    float: 'left',
  },

  searchSectionStyle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    fontWeight: '900',
  },

  selectedTabStyle: {
    borderBottom: '4px solid var(--primary-color1) !important',
  },
  tabStyle: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 0,
    fontWeight: '900',
    fontSize: '1.5rem',
  },
  transitionStyle: {
    height: '20em',
    marginTop: '-20em',
    background: 'linear-gradient(0deg, rgba(255,255,255,80%) 34%, rgba(255,255,255,0) 100%)',
    position: 'relative',
    zIndex: 1060,
  },
  loginCardStyle: {
    background: 'white',
    marginTop: '-2em',
  },
  notFoundRobotStyle: {
    width: '20em',
    marginTop: '3em',
    [theme.breakpoints.down('600')]: {
      width: '15em',
    },
    [theme.breakpoints.down('400')]: {
      width: '12em',
    },
  },
  noResultContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultTitleStyle: {
    width: '70%',
    padding: '0 1em',
    [theme.breakpoints.down('600')]: {
      width: '100%',
      fontSize: '1.5rem',
    },
  },
  noResultDescStyle: {
    padding: '0 1em',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '3em',
    [theme.breakpoints.down('600')]: {
      fontSize: '1rem',
    },
  },
  marginBottom: {
    marginBottom: '4em',
    zIndex: 10,
  },
});

export const loginStyleOverrides = theme => ({
  rootStyle: {
    paddingTop: 0,
  },
  containerStyle: {
    [theme.breakpoints.down('400')]: {
      padding: 0,
    },
  },
  cardStyle: {
    boxShadow: 'none',
    [theme.breakpoints.down('500')]: {
      padding: 0,
    },
  },
  titleStyle: {
    textAlign: 'center',
    margin: 0,
  },
  descriptionStyle: {
    display: 'none',
  },
  gridStyle: {
    margin: 0,
  },
});

export const staffPickStyleOverrides = theme => ({
  rootStyle: {
    margin: 0,
    width: '80%',
    [theme.breakpoints.down('400')]: {
      width: '100%',
    },
  },
  mainContainerStyle: {
    margin: 0,
  },
  messagePrimaryStyle: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 700,
    [theme.breakpoints.down('600')]: {
      fontSize: '1.5rem',
    },
  },
});
