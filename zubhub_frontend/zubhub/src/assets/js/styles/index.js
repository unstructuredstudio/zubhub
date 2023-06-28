const styles = theme => ({
  margin: {
    margin: '1em',
  },
  marginTop1em: {
    marginTop: '1em',
  },
  marginTop3em: {
    marginTop: '3em',
  },
  marginBottom1em: {
    marginBottom: '1em',
  },
  marginBottom3em: {
    marginBottom: '3em!important',
  },
  marginLeft1em: {
    marginLeft: '1em',
  },
  centerContainer: {
    margin: 'auto',
    width: '90%',
  },
  centerVertically: {
    alignSelf: 'center',
  },
  marginRight1em: {
    marginRight: '1em',
  },
  textCenter: {
    textAlign: 'center',
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  colorRed: {
    color: 'red',
  },
  positionRelative: {
    position: 'relative',
  },
  positionAbsolute: {
    position: 'absolute',
  },
  displayNone: {
    display: 'none',
  },
  displayInlineBlock: {
    display: 'inline-block',
  },
  displayInlineFlex: {
    display: 'inline-flex',
  },
  displayFlex: {
    display: 'flex',
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifySelfCenter: {
    justifySelf: 'center',
  },
  justifyRight: {
    justifyContent: 'right',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  addOnSmallScreen: {
    [theme.breakpoints.up('555')]: {
      display: 'none',
    },
  },
  removeOnSmallScreen: {
    [theme.breakpoints.down('555')]: {
      display: 'none',
    },
  },
  topMinus20PX: {
    top: '-20px',
  },
  left15PX: {
    left: '15px',
  },
  width100Percent: {
    width: '100%',
  },
  floatRight: {
    float: 'right',
  },
  floatLeft: {
    float: 'left',
  },
  baseTagStyle: {
    backgroundColor: 'var(--primary-color3)',
    borderRadius: '50px',
    color: 'white',
    padding: '0 0.5em',
    marginLeft: '0.4em',
    marginBottom: '0.4em',
    [theme.breakpoints.down('470')]: {
      marginLeft: 0,
      position: 'static',
      marginBottom: '0.4em',
    },
  },
  extendedTagStyle: {
    backgroundColor: 'grey',
  },
  outlined: {
    border: '2px solid var(--primary-color3)',
    borderRadius: '15px',
    padding: '1em',
  },
  projectsCountIcon: {
    color: 'var(--primary-color2)',
  },
  fabButtonStyle: {
    color: 'var(--primary-color2)',
    backgroundColor: 'var(--primary-color1)',
    position: 'absolute',
    marginLeft: '1em',
    left: '0em',
    top: '-1.8em',
    '&:hover': {
      backgroundColor: 'var(--secondary-color2)',
      backgroundSize: '100%',
    },
    '& svg': {
      fill: 'var(--primary-color2)',
    },
    '& svg:hover': {
      fill: 'var(--primary-color2)',
    },
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  fieldNumberStyle: {
    height: '20px',
    width: '20px',
    backgroundColor: 'var(--primary-color3)',
    fontWeight: 700,
    color: 'white',
    display: 'inline-block',
    textAlign: 'center',
    borderRadius: '50%',
    lineHeight: '17px',
    marginRight: '0.3em',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
  listDotsStyle: {
    height: '10px',
    width: '10px',
    backgroundColor: 'var(--primary-color2)',
    borderRadius: '50%',
    marginRight: '0.3em',
  },
  link: {
    textDecoration: 'none',
  },
});

export default styles;
