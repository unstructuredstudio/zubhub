export const styles = theme => ({
  navBarStyle: {
    backgroundColor: '#DC3545',
  },
  input: {
    flex: 1,
    marginRight: '2rem',
  },
  customButton: {
    fontSize: '1.15rem',
    [theme.breakpoints.down('1315')]: {
      width: '8em',
    },
  },
  mainContainerStyle: {
    maxWidth: '2000px',
    zIndex: 1,
    boxShadow:
      '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    [theme.breakpoints.down('1184')]: {
      maxWidth: '100%',
    },
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
    [theme.breakpoints.down('332')]: {
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
      width: '24em',
      minWidth: 'unset',
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
      [theme.breakpoints.down('1315')]: {
        width: '20em',
      },
      [theme.breakpoints.down('1216')]: {
        width: '100%',
      },
      [theme.breakpoints.down('1181')]: {
        width: '10em',
      },
    },
  },
  smallSearchFormStyle: {
    height: '4em',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    '& .search-form-input': {
      height: '2.5em',
      width: '18em',
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
      [theme.breakpoints.down('420')]: {
        width: '15em',
      },
      [theme.breakpoints.down('376')]: {
        width: '13em',
      },
      [theme.breakpoints.down('290')]: {
        width: '8em',
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
  searchFormSubmitStyle: {
    padding: 0,
    color: '#FFCE0C',
  },
  toggleSearchFormStyle: {
    color: 'white',
  },
  //  remove the search toggle icon from screens higher than 894
  addOn894: {
    [theme.breakpoints.up('1168')]: {
      display: 'none',
    },
  },
  // to remove the search bar from screens lower than 894
  removeOn894: {
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
          backgroundColor: '#ededed',
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
    borderTop: '1px solid #C4C4C4',
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
    backgroundColor: '#d13241',
    borderRadius: '50px',
    [theme.breakpoints.down('282')]: {
      marginLeft: '0.3em',
    },
    '&:hover': {
      backgroundColor: '#c7313f',
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
    '& .MuiSelect-root': {
      boxSizing: 'border-box',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    [theme.breakpoints.down('282')]: {
      marginLeft: '0.3em',
    },
  },
  footerStyle: {
    backgroundColor: '#dc3545',
    boxSizing: 'border-box',
    width: '100vw',
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
    marginBottom: '45px',
  },
});

export default styles;
