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
  marginRight1em: {
    marginRight: '1em',
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
    backgroundColor: '#00B8C4',
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
    border: '2px solid #00B8C4',
    borderRadius: '15px',
    padding: '1em',
  },
  projectsCountIcon: {
    color: '#ffcc00',
  },
  fabButtonStyle: {
    color: '#ffcc00',
    backgroundColor: '#dc3545',
    position: 'absolute',
    marginLeft: '1em',
    left: '0em',
    top: '-1.8em',
    '&:hover': {
      backgroundColor: '#b52836',
      backgroundSize: '100%',
    },
    '& svg': {
      fill: '#ffcc00',
    },
    '& svg:hover': {
      fill: '#ffcc00',
    },
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
});

export default styles;
