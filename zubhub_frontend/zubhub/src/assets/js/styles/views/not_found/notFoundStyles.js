const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  mainContainerStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '72px 0 52px 0',
    width: '80%',
    gap: '40px',
    [theme.breakpoints.down('1024')]: {
      width: '90%',
    },
    [theme.breakpoints.down('768')]: {
      flexWrap: 'wrap-reverse',
      justifyContent: 'center',
    },
  },
  errorBoxStyle: {
    width: '450px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    '& h1, p': {
      fontWeight: '500',
    },
    [theme.breakpoints.down('1024')]: {
      width: '350px',
      gap: '15px',
      '& h1, p': {
        fontSize: '40px',
      },
    },
    [theme.breakpoints.down('768')]: {
      width: '100%',
      maxWidth: '400px',
      marginBottom: '40px',
      '& h1, p': {
        fontSize: '32px',
      },
    },
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  boldErrorText: {
    display: 'block',
    fontSize: '200px',
    fontWeight: '600',
    lineHeight: '70%',
    paddingBottom: '30px',
    [theme.breakpoints.down('1024')]: {
      fontSize: '110px',
    },
    [theme.breakpoints.down('768')]: {
      fontSize: '90px',
      paddingBottom: '20px',
    },
  },
  wrongText: {
    display: 'block',
    fontWeight: '700',
    margin: '10px 0',
  },
  errorImg: {
    width: '45%',
    [theme.breakpoints.down('768')]: {
      width: '70%',
      maxWidth: '300px',
    },
  },
});

export default styles;
