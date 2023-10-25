import { colors } from "../../../colors";

const styles = theme => ({
  childrenContainer: { padding: '0' },
  navBarStyle: {
    backgroundColor: 'var(--primary-color1)',
  },
  input: {
    flex: 1,
    marginRight: '2rem',
  },
  customButton: {
    fontSize: '1.15rem',
  },
  mainContainerStyle: {
    maxWidth: '100vw',
    zIndex: 1,
    // boxShadow:
    //   '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
  },
  toolBarStyle: {
    padding: '15px 0',
  },
  logoStyle: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& img': {
      height: '2em',
    },
    [theme.breakpoints.down('420')]: {
      '& img': {
        height: '1.5em',
      },
    },
  },
  searchFormStyle: {
    display: 'inline-block',
    position: 'relative',
    marginLeft: '2em',
    verticalAlign: 'bottom',
    '& .search-form-input': {
      height: '2.5em',
      maxWidth: '40em',
      backgroundColor: 'rgba(0,0,0,0.2)',
      color: 'white',
      borderRadius: '50px',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.3)',
        '& .MuiInputAdornment-root .MuiButtonBase-root': {
          color: '#FFF',
        },
      },
      '&.MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(0,0,0,0.2)',
      },
      '&.MuiOutlinedInput-root': {
        '& fieldset': {
          border: '1px solid rgba(0,0,0,0.2)',
        },
        '&:hover fieldset': {
          border: '1px solid rgba(0,0,0,0.2)',
        },
        '&.Mui-focused fieldset': {
          border: '1px solid rgba(0,0,0,0.2)',
        },
      },
      [theme.breakpoints.down('1216')]: {
        width: '100%',
      },
      [theme.breakpoints.down('1054')]: {
        // width: '20em',
      },
    },
  },
  smallSearchFormStyle: {
    height: '4em',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    '& .search-form-input': {
      height: '2.5em',
      backgroundColor: 'rgba(0,0,0,0.2)',
      color: 'white',
      borderRadius: '50px',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.3)',
        '& .MuiInputAdornment-root .MuiButtonBase-root': {
          color: '#FFF',
        },
      },
      '&.MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(0,0,0,0.2)',
      },
      '&.MuiOutlinedInput-root': {
        '& fieldset': {
          border: '1px solid rgba(0,0,0,0.2)',
        },
        '&:hover fieldset': {
          border: '1px solid rgba(0,0,0,0.2)',
        },
        '&.Mui-focused fieldset': {
          border: '1px solid rgba(0,0,0,0.2)',
        },
      },
    },
  },
  formControlStyle: {
    minWidth: 'unset',
  },

  searchFormLabelStyle: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute!important',
    width: '1px',
  },
  username: {
    color: `${colors.white} !important`,
    marginBottom: `${0} !important`,
    textTransform: 'capitalize'
  },

  searchFormSubmitStyle: {
    padding: 0,
    color: 'var(--primary-color2)',
  },
  toggleSearchFormStyle: {
    color: 'white',
  },
  addOn894: {
    [theme.breakpoints.up('1168')]: {
      display: 'none',
    },
  },
  removeOn894: {
    flex: 1,
    [theme.breakpoints.down('1168')]: {
      display: 'none',
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
    gap: 20
  },
  avatarStyle: {
    cursor: 'pointer',
    backgroundColor: 'white',
    [theme.breakpoints.up('1600')]: {
      height: '40px',
      width: '40px',
    },
  },
  profileMenuStyle: {
    '& .MuiList-root': {
      paddingTop: 0,
      '& .MuiListItem-root': {
        '&:first-child': {
          backgroundColor: 'var(--text-color3)',
          paddingTop: '12px',
          paddingBottom: '8px',
        },
      },
    },
    [theme.breakpoints.up('1600')]: {
      '& .MuiMenu-paper': {
        width: '10em',
        '& .MuiTypography-root': {
          fontSize: '1.2rem',
        },
      },
    },
  },
  profileStyle: {
    fontWeight: 'bold',
    width: '130px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  logOutStyle: {
    borderTop: '1px solid var(--text-color3)',
  },
  scrollTopButtonStyle: {
    zIndex: 100,
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  languageSelectBoxStyle: {
    marginLeft: '1.3em',
    paddingLeft: '0.7em',
    color: 'white',
    backgroundColor: 'var(--primary-color1)',
    borderRadius: '50px',
    [theme.breakpoints.down('282')]: {
      marginLeft: '0.3em',
    },
    '&:hover': {
      backgroundColor: 'var(--secondary-color2)',
    },
  },
  languageSelectStyle: {
    display: 'inline-block',
    maxWidth: '5em',
    color: 'white',
    '&.MuiInput-underline:before': {
      display: 'none !important',
    },
    '&.MuiInput-underline:after': {
      display: 'none !important',
    },
    '& .MuiSelect-icon': {
      color: 'white',
    },
    '& .MuiSelect-root': {
      boxSizing: 'border-box',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  footerStyle: {
    backgroundColor: 'var(--primary-color1)',
    boxSizing: 'border-box',
    width: '100%',
    textAlign: 'left',
    padding: '45px 50px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexShrink: 0,
  },

  footerSectionStyle: {
    minWidth: '600px',
    margin: '0 2em',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('1058')]: {
      margin: '2em 0',
    },
    [theme.breakpoints.down('650')]: {
      flexDirection: 'column',
      width: '100%',
      minWidth: 0,
    },
  },
  footerBoxStyle: {
    marginBottom: '1em',
  },
  footerTitleStyle: {
    fontSize: '1.5rem',
    color: 'white',
    marginBottom: '0.2em',
  },
  footerLinkStyle: {
    color: 'white',
    cursor: 'pointer',
    '&:hover': {
      color: 'rgb(243 137 147)',
    },
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
  marginBottom: {
    marginBottom: '0px',
  },
});

export default styles;
