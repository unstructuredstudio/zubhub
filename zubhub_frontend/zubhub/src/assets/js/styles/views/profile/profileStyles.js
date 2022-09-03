import { fade } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flex: '1 0 auto',
  },
  profileHeaderStyle: {
    paddingTop: '1.5em',
    background: 'rgba(255,204,0,1)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    [theme.breakpoints.down('511')]: {
      paddingTop: '4em',
    },
  },
  avatarBoxStyle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  profileShareButtonStyle: {
    borderRadius: '50% !important',
  },
  avatarStyle: {
    width: '100%',
    height: '100%',
    paddingTop: '1.5em',
    paddingBottom: '1.5em',
    '& img': {
      width: '10em',
      backgroundColor: 'white',
      height: '10em',
      borderRadius: '50%',
      boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    },
  },
  ProfileDetailStyle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userNameStyle: {
    fontWeight: 900,
    fontSize: '2rem',
    position: 'relative',
    [theme.breakpoints.down('470')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  tagsContainerStyle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  emailStyle: { marginBottom: '0.5em' },
  dividerStyle: {
    width: '100vw',
  },
  moreInfoBoxStyle: {
    height: '3em',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreInfoStyle: {
    marginLeft: '0.5em',
    marginRight: '0.5em',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    color: '#00B8C4',
  },
  profileLowerStyle: {
    margin: '1em',
    padding: '1em',
  },
  titleStyle: {
    fontWeight: 900,
    fontSize: '1.5rem',
  },
  cardStyle: {
    border: 0,
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .12)',
    color: 'white',
    padding: '0 30px',
  },
  customLabelStyle: {
    '&.MuiFormLabel-root.Mui-focused': {
      color: '#00B8C4',
    },
  },

  projectGridStyle: {
    marginBottom: '2em',
  },
  customInputStyle: {
    borderRadius: 15,
    '&.MuiOutlinedInput-notchedOutline': {
      border: '2px solid #00B8C4',
      boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
    },
    '&.MuiOutlinedInput-root': {
      '&:hover fieldset': {
        border: '2px solid #00B8C4',
        boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
      },
      '&.Mui-focused fieldset': {
        border: '2px solid #00B8C4',
        boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
      },
    },
  },
  secondaryLink: {
    color: '#00B8C4',
    '&:hover': {
      color: '#03848C',
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
  floatRight: { float: 'right' },
  displayNone: { display: 'none' },
  largeLabel: {
    fontSize: '1.3rem',
  },
  errorBox: {
    width: '100%',
    padding: '1em',
    borderRadius: 6,
    borderWidth: '1px',
    borderColor: '#a94442',
    backgroundColor: '#ffcdd2',
  },
  error: {
    color: '#a94442',
  },
});

export default styles;
