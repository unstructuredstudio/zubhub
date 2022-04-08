const styles = theme => ({
  marginTop1em: {
    marginTop: '1em',
  },
  marginBottom1em: {
    marginBottom: '1em',
  },
  marginLeft1em: {
    marginLeft: '1em',
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
    [theme.breakpoints.down('628')]: {
      marginLeft: 0,
      position: 'static',
      marginBottom: '0.4em',
      fontSize: '0.8rem',
    },
  },
  extendedTagStyle: {
    backgroundColor: 'grey',
  },
});

export default styles;
