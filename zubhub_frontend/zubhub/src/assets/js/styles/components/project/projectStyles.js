const styles = theme => ({
  root: {
    maxWidth: 345,
    height: '94%',
    paddingTop: 0,
    paddingBottom: '0!important',
    marginTop: '1em',
    marginBottom: '1em',
    marginLeft: '1em',
    marginRight: '1em',
    borderRadius: '15px',
    textAlign: 'left',
    backgroundColor: '#ffffff',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255,204,0,1)',
    background:
      '-moz-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,204,0,1)), color-stop(25%, rgba(255,229,133,1)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))',
    background:
      '-webkit-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-o-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-ms-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    filter:
      "progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffcc00', endColorstr='#ffffff', GradientType=0 )",
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaBoxStyle: {
    width: '100%',
    height: '13em',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaStyle: {
    width: '100%',
    height: '100%',
    borderStyle: 'none',
  },
  publishStyle: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    top: '0.5em',
    right: '0.5em',
    zIndex: 1,
    backgroundColor: '#0000003b',
    padding: '0.2em 0.5em',
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: '1.05rem',
  },
  mediaImageStyle: {
    objectFit: 'cover',
    width: '100%',
    height: '13em',
    position: 'absolute',
  },
  playIconStyle: {
    zIndex: 0,
    height: '40%',
    width: '40%',
  },
  actionAreaStyle: {
    flexGrow: 100,
  },
  contentStyle: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fabButtonStyle: {
    color: '#ffcc00',
    backgroundColor: '#dc3545',
    position: 'absolute',
    marginLeft: '1em',
    right: '1em',
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
  likeButtonStyle: {
    right: '4.5em',
    top: '-1.6em',
  },
  titleStyle: {
    fontWeight: 900,
    fontSize: '1.3rem',
  },
  descriptionStyle: {
    flexGrow: 1,
    '& p': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      height: '90%',
    },
  },
  creatorBoxStyle: {
    marginTop: '0.5em',
    marginBottom: '0.5em',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  creatorAvatarStyle: {
    marginRight: '0.5em',
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
  },
  captionStyle: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  captionIconStyle: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '1em',
    '& svg': {
      fill: 'rgba(0,0,0,0.54)',
      marginRight: '0.5em',
    },
  },
  VisibilityIconStyle: {
    '& svg': {
      fontSize: '1.1rem',
    },
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
  primaryButton: {
    backgroundColor: '#00B8C4',
    borderRadius: 15,
    color: 'white',
    marginLeft: '1em',
    '&:hover': {
      backgroundColor: '#03848C',
    },
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#00B8C4',
    color: '#00B8C4',
    marginLeft: '1em',
    '&:hover': {
      color: '#03848C',
      borderColor: '#03848C',
      backgroundColor: '#F2F2F2',
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
  positionRelative: { position: 'relative' },
  largeLabel: {
    fontSize: '1.3rem',
  },
});

export default styles;
