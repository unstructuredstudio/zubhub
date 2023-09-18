const styles = theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: '2rem 16px',
    },
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiGrid-root.MuiGrid-container': {
      width: '100%',
    },
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
  textDecorationNone: {
    textDecoration: 'none',
  },
  followButton: {
    display: 'flex',
    marginTop: '0.75rem'
  },
  mainContainerStyle: {
    maxWidth: '1190px',
    width: '100%',
  },

  pageHeaderStyle: {
    marginTop: '1em',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  projectGridStyle: {
    // marginBottom: '2em',
  },
  buttonGroupStyle: {
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'block',
    marginTop: '2em',
    maxWidth: '2000px',
    width: '100%',
  },
  floatRight: {
    float: 'right',
  },
  floatLeft: {
    float: 'left',
  },
});

export default styles;
