import { fade } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flex: '1 0 auto',
  },
  classFlex: {
    display: 'flex',
    [theme.breakpoints.down('900')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  profileHeaderStyle: {
    paddingTop: '1.5em',
    paddingBottom: '1.5em',
    background: 'rgba(255,204,0,1)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
  },
  avatarBoxStyle: {
    minWidth: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileShareButtonStyle: {
    borderRadius: '50% !important',
  },
  avatarStyle: {
    width: '80%',
    height: '80%',
    paddingLeft: '1em',
    paddingRight: '1em',
    '& img': {
      width: '10rem',
      backgroundColor: 'white',
      height: '10rem',
      borderRadius: '50%',
      boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    },
  },
  ProfileDetailStyle: {
    minWidth: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    marginRight: '1.5em',
    [theme.breakpoints.down('900')]: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '1.5em',
      paddingRight: 0,
    },
  },
  userNameStyle: {
    fontWeight: 900,
    fontSize: '2rem',
    position: 'relative',
    overflowWrap: 'anywhere',

    [theme.breakpoints.down('750')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  tagsContainerStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
    [theme.breakpoints.down('900')]: {
      paddingTop: '0',
      paddingBottom: '0',
    },
  },
  removeTagMargin: {
    marginLeft: '0 !important',
  },
  centerTag: {
    justifyContent: 'center',
  },
  emailStyle: {
    overflowWrap: 'anywhere',
  },
  dividerStyle: {},
  moreInfoBoxStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'end',
    [theme.breakpoints.down('830')]: {
      justifyContent: 'none',
    },

    [theme.breakpoints.down('900')]: {
      marginTop: '1.3em',
      justifyContent: 'center',
      gap: '1.5em',
      flexWrap: 'wrap',
    },
    width: '100%',
  },
  moreInfoStyle: {
    backgroundColor: '#E0F6F7',
    borderRadius: '10px',
    padding: '1em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  moreInfoTitle: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#00B8C4',
  },
  moreInfoCount: {
    fontWeight: '550',
    fontSize: '3.5em',
    color: '#00B8C4',
    justifyContent: 'start',
  },
  profileLowerStyle: {
    flexGrow: 1,
    margin: '1em 0 0 1em',
    padding: '1em',
    [theme.breakpoints.down('900')]: {
      margin: '1em',
      padding: '1em',
    },
  },
  titleStyle: {
    fontWeight: 900,
    fontSize: '1.5rem',
  },
  badgeBox: {
    backgroundColor: '#FFF7D4',
    margin: '1em 1em 0 0',
    padding: '1em',
    width: '40%',
    [theme.breakpoints.down('900')]: {
      width: 'auto',
      margin: '1em',
      padding: '1em',
    },
  },
  badgeTitleStyle: {
    fontWeight: 900,
    fontSize: '1.5rem',
    color: '#00B8C4',
  },
  badgeContainerStyle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  badgeStyle: {
    backgroundColor: '#FFD11A',
    borderRadius: '50px',
    color: '#9F861E',
    fontWeight: 600,
    padding: '0 0.5em',
    margin: '0.3em',
  },
  aboutMeBadgeBox: {
    display: 'flex',
    [theme.breakpoints.down('900')]: {
      display: 'block',
    },
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
  floatRight: {
    float: 'right',
  },
  secondaryButtonMargin: {
    marginTop: '1em',
  },
  verticalOption: {
    float: 'right',
    [theme.breakpoints.down('900')]: {
      float: 'none',
    },
  },
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
