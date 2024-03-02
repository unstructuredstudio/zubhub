import { fade } from '@mui/material/styles';

const styles = theme => ({
  root: {
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background: 'var(--primary-color2)',
    background:
      'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
  },
  containerStyle: {
    maxWidth: '600px',
    [theme.breakpoints.up('1600')]: {
      maxWidth: '950px',
    },
  },
  cardStyle: {
    border: 0,
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .12)',
    color: 'white',
    padding: '0 30px',
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: '1.7rem',
    [theme.breakpoints.up('1600')]: {
      fontSize: '2.5rem',
    },
  },
  descStyle: {
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.7rem',
    },
  },
  customLabelStyle: {
    '&.MuiFormLabel-root.Mui-focused': {
      color: 'var(--primary-color3)',
    },
    fontWeight: 'bold',
    fontSize: '1rem',
    display: 'flex',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.7rem',
    },
  },

  customInputStyle: {
    width: '100%',
    borderRadius: 15,
    '&.MuiOutlinedInput-notchedOutline': {
      border: '2px solid var(--primary-color3)',
      boxShadow: `rgba(var(--primary-color3), 0.2rem) 0 0 0 0.2rem`,
    },
    '&.MuiOutlinedInput-root': {
      '&:hover fieldset': {
        border: '2px solid var(--primary-color3)',
        boxShadow: `rgba(var(--primary-color3), 0.2rem) 0 0 0 0.2rem`,
      },
      '&.Mui-focused fieldset': {
        border: '2px solid var(--primary-color3)',
        boxShadow: `rgba(var(--primary-color3), 0.2rem) 0 0 0 0.2rem`,
      },
      [theme.breakpoints.up('1600')]: {
        fontSize: '1.7rem',
      },
    },
  },
  circleBox: {
    height: '20px',
    width: '20px',
    color: 'white',
    backgroundColor: [theme.circleBox.backgroundColor],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '50%',
    lineHeight: '17px',
    marginRight: '0.3em',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
  descInputStyle: {
    color: 'black',
    borderRadius: 15,
    boxShadow: `rgba(var(--primary-color3), 0.2rem) 0 0 0 0.2rem`,
    '&:hover': {
      outline: '2px solid var(--primary-color3)',
    },
    '& .ql-toolbar': {
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
    },
    '& .ql-container': {
      borderBottomRightRadius: 15,
      borderBottomLeftRadius: 15,
      '& .ql-editor': {
        WebkitUserSelect: 'text',
        color: 'var(--text-color1)',
        fontSize: '1rem',
        fontFamily: 'Raleway,Roboto,sans-serif',
        lineHeight: '1.1876em',
        minHeight: '200px !important',
        [theme.breakpoints.up('1600')]: {
          fontSize: '1.7rem',
        },
      },
    },
  },
  descInputFocusStyle: {
    outline: '2px solid var(--primary-color3) !important',
  },
  descInputErrorStyle: {
    outline: '1px solid #f44336',
  },
  videoInputDialogContainerStyle: {
    [theme.breakpoints.down('400')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  videoInputDialogCardStyle: {
    [theme.breakpoints.down('400')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  videoFileName: {
    margin: 0,
    color: 'rgba(0, 0, 0, 0.54)',
    textOverflow: 'ellipsis',

    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '50%',
    minWidth: '150px',
    [theme.breakpoints.down('550')]: {
      width: '100%',
    },
  },
  videoInputDialogURLFormControlStyle: {
    width: '59%',
    [theme.breakpoints.down('550')]: {
      width: '100%',
    },
  },
  videoInputDialogControlSectionStyle: {
    width: '100%',
    border: '2px solid var(--primary-color3)',
    padding: '2px',
    borderRadius: 30,
  },
  videoInputDialogControlButtonStyle: {
    width: '50%',
  },
  videoInputDialogControlButtonUseTextDescStyle: {
    [theme.breakpoints.down('500')]: {
      display: 'none',
    },
  },
  videoInputDialogControlButtonUseIconDescStyle: {
    [theme.breakpoints.up('500')]: {
      display: 'none',
    },
  },
  videoInputDialogBodyGridStyle: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: '16px !important',
    [theme.breakpoints.down('550')]: {
      justifyContent: 'space-between',
    },
  },
  videoInputDialogActionSectionStyle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  videoInputDialogActionButtonStyle: {
    marginLeft: '0.5em',
    [theme.breakpoints.down('550')]: {
      width: '48.5%',
      marginLeft: 0,
      marginTop: '0.5em',
    },
  },
  fieldNumberStyle: {
    height: '20px',
    width: '20px',
    backgroundColor: 'var(--primary-color3)',
    color: 'white',
    textAlign: 'center',
    borderRadius: '50%',
    lineHeight: '17px',
    marginRight: '0.3em',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
  questionIconStyle: {
    position: 'absolute',
    color: 'var(--primary-color3)',
    right: '0',
    [theme.breakpoints.up('1600')]: {
      top: '20px',
    },
  },
  uploadProgressIndicatorContainerStyle: {
    display: 'inline-flex',
    position: 'relative',
    overflow: 'hidden',
  },
  uploadProgressLabelStyle: {
    color: 'white',
  },
  uploadProgressStyle: {
    color: 'var(--primary-color3)',
  },
  customChipStyle: {
    border: '1px solid var(--primary-color3)',
    color: 'var(--primary-color3)',
    margin: '0.5em',
  },
  tagsViewStyle: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '0.5em',
    border: '1px solid #c1c1c1',
    borderRadius: '20px',
    '&:hover': {
      border: '2px solid var(--primary-color3)',
      boxShadow: `rgba(var(--primary-color3), 0.2rem) 0 0 0 0.2rem`,
    },
  },
  tagsInputStyle: {
    flexGrow: '1',
    height: '3em',
    border: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
  tagSuggestionStyle: {
    position: 'absolute',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '1em',
    width: '100%',
    maxWidth: '500px',
    height: '5.6em',
    overflowY: 'scroll',
    bottom: '-5.6em',
    left: 0,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    boxShadow: '0 0px 5px 4px rgba(0, 0, 0, .12)',
  },
  tagSuggestionTextStyle: {
    color: 'var(--primary-color3)',
    fontSize: '1.5em',
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
    borderColor: 'var(--primary-color2)',
    backgroundColor: 'var(--secondary-color1)',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.5rem',
    },
  },
  error: {
    color: 'var(--primary-color2)',
  },
  fieldHelperTextStyle: {
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
  requiredLabelStyle: {
    display: 'inline-block',
    color: 'red',
  },
  errorMessage: {
    color: 'red',
  },
});

export default styles;
