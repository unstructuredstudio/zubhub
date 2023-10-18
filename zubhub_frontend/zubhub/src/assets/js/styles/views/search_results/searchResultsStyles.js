import { colors } from "../../../colors";

export const styles = theme => ({
  root: {
    paddingBottom: '2em',
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

  pageHeaderStyle: {
    marginTop: '1em',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: '36px'
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
});

export const resultModal = (theme) => ({
  root: {
    maxWidth: '1152px',
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
    borderRadius: '8px 8px 0 0',
    height: '1013px',
  
    '& .MuiGrid-root.MuiGrid-container': {
      width: '100%',
      backgroundColor: colors.white,
    },
  },
  projectContainer: {
    width: '100%', 
    backgroundColor: colors.white, 
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  gridBlur: {
    background: `linear-gradient(to top, ${colors.white} 0%, ${colors.white} 25%, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 100%)`,
    position: 'absolute', 
    height: '588px', 
    width: '100%', 
    top: 0, 
    zIndex: 1
  },
  loginModal: {
    zIndex: 2,
    position: 'absolute',
    marginTop: '25%',
    [theme.breakpoints.down('756')]: {
      marginTop: '35%'
    },
    [theme.breakpoints.down('556')]: {
      marginTop: '45%'
    },
    [theme.breakpoints.down('400')]: {
      marginTop: '65%'
    }
  }
})

