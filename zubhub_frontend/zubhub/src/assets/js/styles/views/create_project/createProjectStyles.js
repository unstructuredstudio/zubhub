import { fade } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background: 'rgba(255,204,0,1)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
  },
  cardStyle: {
    border: 0,
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .12)',
    color: 'white',
    padding: '0 30px',
  },
  titleStyle: {
    fontSize:"2rem",
    fontWeight: 900,
  },
  descStyle:{
    fontSize:"1.7rem"
  },
  customLabelStyle: {
    fontSize:"1.5rem",
    '&.MuiFormLabel-root.Mui-focused': {
      color: '#00B8C4',
    },
  },

  customInputStyle: {
    width: '100%',
    borderRadius: 15,
    '&.MuiOutlinedInput-notchedOutline': {
      border: '1px solid #00B8C4',
      boxShadow: `${fade('#00B8C4', 0.25)} 0 0 0 0.2rem`,
    },
    '&.MuiOutlinedInput-root': {
      fontSize:"1.7rem",
      '&:hover fieldset': {
        border: '1px solid #00B8C4',
        boxShadow: `${fade('#00B8C4', 0.25)} 0 0 0 0.2rem`,
      },
      '&.Mui-focused fieldset': {
        border: '1px solid #00B8C4',
        boxShadow: `${fade('#00B8C4', 0.25)} 0 0 0 0.2rem`,
      },
    },
  },
  staticLabelInputStyle: {
    '&.MuiOutlinedInput-root fieldset legend': {
      width: '75.5px !important',
    },
  },
  staticLabelInputSmallStyle: {
    '&.MuiOutlinedInput-root fieldset legend': {
      width: '40px !important',
    },
  },
  uploadProgressLabelStyle: {
    color: 'white',
  },
  uploadProgressStyle: {
    color: '#00B8C4',
  },
  customChipStyle: {
    border: '1px solid #00B8C4',
    color: '#00B8C4',
    margin: '0.5em',
  },
  materialsUsedViewStyle: {
    padding: '0.5em',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  displayNone: { display: 'none' },
  largeLabel: {
    fontSize: '1.3rem',
  },
  errorBox: {
    width: '100%',
    padding: '1em',
    borderRadius: 6,
    borderWidth: '1px',
    borderColor: '#a94442',
    backgroundColor: '#ffcdd2',
  },
  error: {
    color: '#a94442',
  },
});

export default styles;
