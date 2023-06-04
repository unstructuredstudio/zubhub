const styles = theme => ({
  root: {
    paddingBottom: '2em',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--primary-color2)',
    background:
      '-moz-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-webkit-gradient(left top, left bottom, color-stop(0%, var(--primary-color2)), color-stop(25%, var(--primary-color2)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))',
    background:
      '-webkit-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-o-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-ms-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    filter:
      "progid:DXImageTransform.Microsoft.gradient( startColorstr='var(--primary-color2)', endColorstr='#ffffff', GradientType=0 )",
    '& .MuiGrid-root.MuiGrid-container': {
      width: '100%',
    },
  },
  mainContainerStyle: {
    maxWidth: '2000px',
    width: '100%',
  },
  pageHeaderStyle: {
    marginTop: '1em',
    fontWeight: 900,
    textAlign: 'center',
  },
  buttonGroupStyle: {
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'block',
    marginTop: '2em',
    maxWidth: '2000px',
    width: '100%',
  },
  followersGridStyle: {
    marginBottom: '2em',
  },
  cardStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '94%',
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
    height: 'auto',
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
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  primaryButton: {
    backgroundColor: 'var(--primary-color3)',
    borderRadius: 15,
    color: 'white',
    marginLeft: '1em',
    '&:hover': {
      backgroundColor: 'var(--primary-color3)',
    },
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: 'var(--primary-color3)',
    color: 'var(--primary-color3)',
    marginLeft: '1em',
    '&:hover': {
      color: 'var(--primary-color3)',
      borderColor: 'var(--primary-color3)',
      backgroundColor: '#F2F2F2',
    },
  },
  secondaryLink: {
    color: 'var(--primary-color3)',
    '&:hover': {
      color: 'var(--primary-color3)',
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
  floatLeft: {
    float: 'left',
  },
  displayNone: { display: 'none' },
  largeLabel: {
    fontSize: '1.3rem',
  },
});

export default styles;
