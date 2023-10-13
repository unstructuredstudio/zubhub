const styles = theme => ({
  root: {
    // maxWidth: 345,
    height: '100%',
    paddingTop: 0,
    paddingBottom: '0!important',
    borderRadius: '15px',
    textAlign: 'left',
    backgroundColor: '#ffffff',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
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
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '0.2em 0.7em',
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
    color: 'var(--primary-color2)',
    backgroundColor: 'var(--primary-color1)',
    position: 'absolute',
    marginLeft: '1em',
    right: '1em',
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
  likeButtonStyle: {
    right: '4.5em',
    top: '-1.6em',
  },
  titleStyle: {
    fontWeight: 900,
    fontSize: '1.3rem',
  },
  descriptionStyle: {
    // flexGrow: 1,
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
    marginTop: '15px',
    marginBottom: '0.5em',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  date: { fontWeight: '600', marginLeft: 'auto' },
  footer: { marginTop: 10, flexDirection: 'row', display: 'flex' },
  tagsContainer: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '100%',
    gap: '5px',
  },
  tagContainer: {
    overflow: 'hidden',
    marginLeft: '0 !important',
  },
  restOfTags: {
    fontWeight: '700',
    fontSize: '0.85rem',
    padding: '2px 10px !important',
    whiteSpace: 'nowrap',
  },
  username: {
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontWeight: '700',
  },
  tagName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '700',
    fontSize: '0.9rem',
    padding: '2px 10px',
  },
  creatorAvatarStyle: {
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
  },
  creatorUsernameStyle: {
    maxWidth: '70%',
    marginRight: 'auto',
    fontWeight: '700',
  },
  captionStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captionIconStyle: {
    backgroundColor: '#eee',
    padding: '2px 7px',
    borderRadius: 25,
    justifyContent: 'space-between',
    fontWeight: '600',
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
    color: 'var(--primary-color3)',
  },
  primaryButton: {
    backgroundColor: 'var(--primary-color3)',
    borderRadius: 15,
    color: 'white',
    marginLeft: '1em',
    '&:hover': {
      backgroundColor: 'var(--secondary-color6)',
    },
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: 'var(--primary-color3)',
    color: 'var(--primary-color3)',
    marginLeft: '1em',
    '&:hover': {
      color: 'var(--secondary-color6)',
      borderColor: 'var(--secondary-color6)',
      backgroundColor: '#F2F2F2',
    },
  },
  secondaryLink: {
    color: 'var(--primary-color3)',
    '&:hover': {
      color: 'var(--secondary-color6)',
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
