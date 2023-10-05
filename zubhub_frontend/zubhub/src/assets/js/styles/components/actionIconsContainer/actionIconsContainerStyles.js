const styles = theme => ({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50% !important',
    color: 'white',
  },
  buttonGroup: {
    height: '100%',
    display: 'inherit',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionBoxStyle: {
    backgroundColor: 'var(--primary-color3)',
    '&:hover': {
      backgroundColor: 'var(--secondary-color6)',
    },
    borderRadius: '15px',
    position: 'absolute',
    top: '0',
    right: '-4.5em',

    display: 'flex',

    justifyContent: 'space-between',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',

    position: 'static',
    height: '3.5em',
    width: '100%',
    flexDirection: 'row',

    padding: '0px 0.5em 0px',
  },
  saveContainer: {
    display: 'flex',
  },
  actionBoxMobileWrapper: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconsBoxStyle: {
    display: 'flex',
    paddingRight: 4,
  },
  actionBoxButtonStyle: {
    margin: '0.5em',
    display: 'flex',
    flexDirection: 'row',
    margin: '0.2em',
    padding: '7px',
    '& span': {
      flexDirection: 'row',
    },

    textAlign: 'center',
    color: 'white',
    '& MuiFab-root:hover': {
      color: '#F2F2F2',
    },
    '& svg': {
      fill: 'white',
    },
    '& svg:hover': {
      fill: '#F2F2F2',
    },
  },
  sliderBoxStyle: {
    [theme.breakpoints.down('1080')]: {
      width: '90%',
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
  positionRelative: { position: 'relative' },
  positionAbsolute: { position: 'absolute' },
  marginBottom1em: { marginBottom: '1em' },
});

export default styles;
