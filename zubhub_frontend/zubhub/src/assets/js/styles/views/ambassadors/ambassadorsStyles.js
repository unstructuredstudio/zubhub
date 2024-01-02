const styles = theme => ({
  root: {
    color: 'black',
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background:
      'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
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
    fontWeight: 'bold',
    color: 'black',
    margin: '1em 0',
  },
  ambassadorsBodyStyle: {
    marginBottom: '5em',
    fontSize: '1.2rem'
  },
  projectGridStyle: {
    marginBottom: '2em',
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
