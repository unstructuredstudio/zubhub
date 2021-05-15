import { fade } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    color: 'black',
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background: 'rgba(255,204,0,1)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
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

  resourcesHeadingStyle: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: 'black',
    margin: '2em 0',
  },

  resourcesBodyStyle: {
    marginBottom: '5em',
  },
});

export default styles;
