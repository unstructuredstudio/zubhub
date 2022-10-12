const styles = theme => ({
  root: {
    color: 'black',
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
  },
  cardStyle: {
    border: 0,
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .12)',
    padding: '0 30px 30px 30px',
    minHeight: '500px',
    width: '100%',
  },
  ambassadorsHeadingStyle: {
    fontSize: '2rem',
    fontWeight: '900',
    color: 'black',
    margin: '1em 0',
  },
  ambassadorsBodyStyle: {
    marginBottom: '5em',
    fontSize: '1.2rem'
  },
});

export default styles;
