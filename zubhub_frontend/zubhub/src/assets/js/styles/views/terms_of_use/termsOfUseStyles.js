const styles = theme => ({
  root: {
    color: 'black',
    flex: '1 0 auto',
    marginTop: '2em',
    marginBottom: '2em',
    [theme.breakpoints.down('378')]: {
      marginTop: '3em',
      marginBottom: '3em',
    },
    // background: 'var(--primary-color2)',
    // background:
    //   'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
  },
  containerStyle: {
    maxWidth: '1000px',
  },
  cardStyle: {
    border: 0,
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .12)',
    padding: '0 30px 30px 30px',
    minHeight: '500px',
    width: '100%',
  },

  termsOfUseHeadingStyle: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: 'black',
    margin: '2em 0',
  },

  termsOfUseBodyStyle: {
    marginBottom: '5em',
  },
});

export default styles;
