import { fade } from '@material-ui/core/styles';
import uploadIcon from '../../../../images/upload.svg';

const styles = theme => ({
  root: {
    paddingTop: '2em',
    paddingBottom: '2em',
    flex: '1 0 auto',
    background: 'rgba(255,204,0,1)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
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
    fontWeight: 900,
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
      color: '#00B8C4',
    },
    fontWeight: 'bold',
    fontSize: '1rem',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.7rem',
    },
  },

  customInputStyle: {
    width: '100%',
    borderRadius: 15,
    '&.MuiOutlinedInput-notchedOutline': {
      border: '2px solid #00B8C4',
      boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
    },
    '&.MuiOutlinedInput-root': {
      '&:hover fieldset': {
        border: '2px solid #00B8C4',
        boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
      },
      '&.Mui-focused fieldset': {
        border: '2px solid #00B8C4',
        boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
      },
      [theme.breakpoints.up('1600')]: {
        fontSize: '1.7rem',
      },
    },
  },
  videoFileDropBoxStyles: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '1em',
    border: '1px solid rgb(191 191 191)',
    '&.videoFileDragOver': {
      border: '2px dashed #6a6a6a',
      backgroundColor: '#e1e1e1',
      '& > input::before': {
        background: '#e1e1e1',
      },
    },
    '&.videoFileDragDrop': {
      border: '2px dashed #00B8C4',
      backgroundColor: '#e1e1e1',
      '& > input::before': {
        background: '#e1e1e1',
      },
    },
  },
  videoFileInputStyle: {
    width: '100%',
    height: '150px',
    padding: '4px',
    position: 'relative',
    cursor: 'pointer',

    '&:before': {
      content: '""',
      position: 'absolute',
      background: 'white',
      fontSize: '20px',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
    },

    '&:after': {
      content: '""',
      background: `transparent url(${uploadIcon}) no-repeat`,
      backgroundSize: 'contain',
      backgroundPosition: '50%',
      position: 'absolute',
      color: '#808080',
      fontSize: '20px',
      top: '50%',
      left: '50%',
      height: '100%',
      width: '100%',
      transform: 'translate(-50%, -50%)',
    },
  },
  videoFileName: {
    margin: '0.5em 0 0 0',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  videoInputDialogActionSectionStyle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  videoInputDialogSwitchContainerStyle: {
    flexGrow: 1,
  },
  videoInputDialogToggleSwitchStyles: {
    '& .MuiSwitch-colorSecondary.Mui-checked': {
      color: '#00B8C4',
    },
    '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#00B8C4',
    },
  },
  videoInputDialogActionButtonStyle: {
    marginLeft: '0.5em',
    [theme.breakpoints.down('500')]: {
      width: '100%',
      marginLeft: 0,
      marginTop: '0.5em',
    },
  },
  fieldNumberStyle: {
    height: '20px',
    width: '20px',
    backgroundColor: '#00B8C4',
    color: 'white',
    display: 'inline-block',
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
    color: '#00B8C4',
    right: '0',
    [theme.breakpoints.up('1600')]: {
      top: '20px',
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
  tagsViewStyle: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '0.5em',
    border: '1px solid #c1c1c1',
    borderRadius: '20px',
    '&:hover': {
      border: '2px solid #00B8C4',
      boxShadow: `${fade('#00B8C4', 0)} 0 0 0 0.2rem`,
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
    color: '#00B8C4',
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
    borderColor: '#a94442',
    backgroundColor: '#ffcdd2',
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.5rem',
    },
  },
  error: {
    color: '#a94442',
  },
  fieldHelperTextStyle: {
    [theme.breakpoints.up('1600')]: {
      fontSize: '1.2rem',
    },
  },
});

export default styles;
