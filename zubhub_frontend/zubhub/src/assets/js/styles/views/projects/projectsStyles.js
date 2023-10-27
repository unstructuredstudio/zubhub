const styles = theme => ({
  root: {

    paddingBottom: '2em',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // background: 'var(--primary-color2)',
    // background:
    //   '-moz-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-webkit-gradient(left top, left bottom, color-stop(0%, var(--primary-color2)), color-stop(25%, var(--primary-color2)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))',
    // background:
    //   '-webkit-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-o-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-ms-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // filter:
    //   "progid:DXImageTransform.Microsoft.gradient( startColorstr='var(--primary-color2)', endColorstr='#ffffff', GradientType=0 )",
    // '& .MuiGrid-root.MuiGrid-container': {
    //   width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '0 24px',
      width: '100%',
    },
  },
  heroMainSectionStyle: {
    backgroundColor: 'var(--primary-color1)',
    display: 'flex',
    paddingTop: '2.3em',
    paddingBottom: '2.8em',
    justifyContent: 'center',
    width: '100vw',
    marginBottom: '2em',
    height:'100vh',
    [theme.breakpoints.down('sm')]: {
      width: '100',
      height:'fit-content',
    },
  },
    heroSectionStyle: {
      backgroundColor: 'var(--primary-color1)',
      boxShadow: '-2px 25px 13px -18px rgba(220,53,69,0.7)',
      WebkitBoxShadow: '-2px 25px 13px -18px rgba(220,53,69,0.7)',
      MozBoxShadow: '-2px 25px 13px -18px rgba(220,53,69,0.7)',
      display: 'flex',
      paddingTop: '2.3em',
      paddingBottom: '2.85em',
      justifyContent: 'center',
      width: '100vw',
      marginBottom: '2em'
  },
  imageLeft: {
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  centerCarousel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  carouselContainer: {
    maxWidth: '100%',
  },
  carouselSlide: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  titleStyle: {
    fontFamily: 'Nanum Pen, sans-serif',
    fontSize: '30px',
    fontWeight: 400,
    lineHeight: '40px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  SectionStyle: {
    backgroundColor: '#FFFFFF',
    boxShadow: '-2px 25px 13px -18px rgba(220,53,69,0.7)',
    WebkitBoxShadow: '-2px 25px 13px -18px rgba(220,53,69,0.7)',
    MozBoxShadow: '-2px 25px 13px -18px rgba(220,53,69,0.7)',
    display: 'flex',
    paddingTop: '2.3em',
    paddingBottom: '2.8em',
    justifyContent: 'center',
    width: '100%',
  },
  heroMainContainerStyle: {
    width: '100%',
    padding: '7rem 4rem',
    display: 'flex',
    [theme.breakpoints.down('1000')]: {
      padding: '2rem 1rem',
      flexDirection: 'column-reverse',
      width: '100',
      height:'fit-content',
    },
  },
  heroContainerStyle: {
    width: '100%',
    maxWidth: '1190px',
    padding: '1.2em 1.2em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('1000')]: {
      flexDirection: 'column-reverse',
    },
  },
  MessageContainerStyle: {
    flexGrow: 1,
    // color: 'white',
  },
  heroMessageContainerStyle: {
    flexGrow: 1,
    color: 'white',
    maxWidth: '37.8rem',
  },
  heroMessageSecondaryStyle: {
    fontSize: '2.2rem',
  },
  MessageSecondaryStyle: {
    fontSize: '1.5rem',
  },
  heroMessagePrimaryStyle: {
    fontSize: '2.2rem',
    fontWeight: '1000',
  },
  MessagePrimaryStyle: {
    fontSize: '2.5rem',
    fontWeight: 1000,
  },
  heroMainMessageSecondaryStyle: {
    fontSize: '4.5rem',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem'
    },
  },
  heroMainMessagePrimaryStyle: {
    fontSize: '2.2rem',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem'
    },
  },
  heroButtonStyle: {
    textTransform: 'none',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginRight: '1em',
    marginTop: '1.2em',
    width: 'fit-content',
    height: '4rem',
    padding: '1rem 2rem',
    borderRadius: '2rem',
    gap: '1rem',
  [theme.breakpoints.down('sm')]: {
    height:'fit-content',
    padding: '0.1em 0.7em',
    marginBottom: '3rem',
    width: 'fit-content',
    fontSize: "1.2rem"
  },
  },
  heroBtnStyle: {
    textTransform: 'none',
    padding: '0 1em',
    fontSize: '1.2rem',
    fontWeight: 700,
    marginRight: '1em',
    marginTop: '1.2em',
  },
  heroImageContainerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('1000')]: {
    },
    [theme.breakpoints.down('500')]: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  heroImageTextSmallStyle: {
    display: 'none',
    [theme.breakpoints.down('500')]: {
      display: 'block',
    },
  },
  heroImageTextStyle: {
    marginLeft: '2em',
    [theme.breakpoints.down('500')]: {
      display: 'none',
    },
  },
  heroImageLinkStyle: {
    alignSelf: 'flex-end',
    [theme.breakpoints.down('500')]: {
      alignSelf: 'center',
    },
  },
  heroImageStyle: {
    marginLeft: '4em',
    marginRight: '2em',
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('1480')]: {
      marginLeft: '0',
      marginRight: '0',
    },
    [theme.breakpoints.down('500')]: {
      marginLeft: '0',
      marginRight: '0',
      // marginTop: '100em',
    },
  },
  desktopheroImageStyle: {
    marginLeft: '2em',
    marginRight: '2em',
    height: '27.5em',
    width: '40em',
    [theme.breakpoints.down('500')]: {
      marginLeft: '0',
      marginRight: '0',
      // marginTop: '100em',
    },
  },
  ambassadorImageStyle: {
    marginLeft: '2em',
    marginRight: '2em',
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('500')]: {
      marginLeft: '0',
      marginRight: '0',
      // marginTop: '100em',
    },
  },
  desktopambassadorImageStyle: {
    marginLeft: '2em',
    marginRight: '2em',
    height: '25em',
    width: '35em',
    [theme.breakpoints.down('500')]: {
      marginLeft: '0',
      marginRight: '0',
      // marginTop: '100em',
    },
  },
  teamsImageStyle: {
    marginLeft: '2em',
    marginRight: '2em',
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('500')]: {
      marginLeft: '0',
      marginRight: '0',
      // marginTop: '100em',
    },
  },
  desktopteamsImageStyle: {
    marginLeft: '2em',
    marginRight: '2em',
    height: '18em',
    width: '34em',
    [theme.breakpoints.down('500')]: {
      marginLeft: '0',
      marginRight: '0',
      // marginTop: '100em',
    },
  },
  reviewImageStyle: {
    marginLeft: '2em',
    marginRight: '2em',
    height: '20em',
    width: '40em',
    [theme.breakpoints.down('500')]: {
      marginLeft: '0',
      marginRight: '0',
      // width: '100%',
    },
  },
  globalImageStyle: {
    marginLeft: '2em',
    marginRight: '2em',
    height: '20em',
    width: '20em',
    [theme.breakpoints.down('500')]: {
      marginLeft: '0',
      marginRight: '0',
      // marginTop: '100em',
    },
  },

  mainContainerStyle: {
    // marginTop: '3em',
    maxWidth: '1190px',
    width: '100%',
  },
  projectGridStyle: {
    marginBottom: '2em',
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginTop: '2em',
    marginLeft: '0.7em',
    marginRight: '0.7em',
  },
  buttonGroupStyle: {
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'block',
    marginTop: '2em',
    maxWidth: '2000px',
    width: '100%',
  },
  buttonGroupStyleThree: {
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2em',
    [theme.breakpoints.down('500')]: {
      padding: '0',
      display: 'flex',
    },
  },
  paginationComp:{
    width: '5rem',
    height: '2rem',
    display: 'flex',
    flexWrap: 'nowrap',
    '& .MuiPaginationItem-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '0.5rem'
    },
    '& .MuiPaginationItem-ul':{
      display: 'flex',
    },
  },
  paginationRoot: {
    '& .MuiPaginationItem-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 'auto',
      '&:hover': {
        backgroundColor: 'var(--primary-color3)',
        color: 'white',
        display: 'flex',
      },
    },
    '& .MuiPaginationItem-ul':{
      display: 'flex',
    }
  },
  buttonGroupStyleAlternative: {
    padding: '7px 21px',
    [theme.breakpoints.down('600')]: {
      padding: '3px 3px 3px 6px',
      fontSize: '15px',
      paddingTop: '0'
    },
  },
  floatRight: {
    float: 'right',

  },
  visibilityNone:{
    visibility: 'hidden'
  },
  floatLeft: {
    float: 'left',
  },
  welcomeContainerStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('500')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  welcomeStyle: {
    height: '20em',
    [theme.breakpoints.down('500')]: {
      height: '10em',
    },
  },
  welcomeBoxStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& h1': {
      fontWeight: 'bold',
    },
  },
});

export default styles;
