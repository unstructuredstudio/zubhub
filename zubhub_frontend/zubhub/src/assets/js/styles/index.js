import { colors } from "../colors";

const styles = theme => ({
  iconBox: {
    height: 35,
    width: 35,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  flexColumn: {
    flexDirection: 'column'
  },
  flexWrap: {
    flexWrap: 'wrap'
  },
  textCapitalize: {
    textTransform: 'capitalize'
  },
  inputTextPlaceholder: {
    color: '#B3B3B3',
    fontSize: '15px !important',
    fontFamily: 'Raleway, sans-serif !important',
  },
  inputText: {
    fontSize: '15px !important',
    fontFamily: 'Raleway, sans-serif !important',
    color: 'rgba(0, 0, 0, 0.87)',
    '&::placeholder': {
      color: '#B3B3B3 !important',
    },
    '& .ql-editor.ql-blank::before': {
      color: '#B3B3B3 !important',
      fontStyle: 'normal !important',
    },
    '& .MuiOutlinedInput-input, .ql-editor, .ql-editor.ql-blank::before,input': {
      fontSize: '15px !important',
      fontFamily: 'Raleway, sans-serif !important'
    },

  },
  title1: {
    fontWeight: 'bold',
    fontSize: '30px !important',
    lineHeight: '35px',
    marginBottom: 8,
    color: colors.black
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: '16px',
    marginBottom: 8,
    color: colors.black
  },
  margin: {
    margin: '1em',
  },
  marginTop1em: {
    marginTop: '1em',
  },
  marginTop3em: {
    marginTop: '3em',
  },
  marginBottom1em: {
    marginBottom: '1em',
  },
  marginBottom3em: {
    marginBottom: '3em!important',
  },
  marginLeft1em: {
    marginLeft: '1em',
  },
  centerContainer: {
    margin: 'auto',
    width: '90%',
  },
  centerVertically: {
    alignSelf: 'center',
  },
  marginRight1em: {
    marginRight: '1em',
  },
  textCenter: {
    textAlign: 'center',
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  colorRed: {
    color: 'red',
  },
  borderRed: {
    borderColor: `${colors.red} !important`,
    '& .ql-container.ql-snow': {
      borderColor: `${colors.red} !important`
    },
    '& .ql-toolbar.ql-snow': {
      borderColor: `${colors.red} !important`
    }
  },
  positionRelative: {
    position: 'relative',
  },
  positionAbsolute: {
    position: 'absolute',
  },
  displayNone: {
    display: 'none',
  },
  displayInlineBlock: {
    display: 'inline-block',
  },
  displayInlineFlex: {
    display: 'inline-flex',
  },
  displayFlex: {
    display: 'flex',
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifySelfCenter: {
    justifySelf: 'center',
  },
  justifyRight: {
    justifyContent: 'right',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
    display: 'flex'
  },
  addOnSmallScreen: {
    [theme.breakpoints.up('555')]: {
      display: 'none',
    },
  },
  removeOnSmallScreen: {
    [theme.breakpoints.down('555')]: {
      display: 'none',
    },
  },
  topMinus20PX: {
    top: '-20px',
  },
  left15PX: {
    left: '15px',
  },
  width100Percent: {
    width: '100%',
  },
  floatRight: {
    float: 'right',
  },
  floatLeft: {
    float: 'left',
  },
  baseTagStyle: {
    backgroundColor: 'var(--primary-color3)',
    borderRadius: '50px',
    color: 'white',
    padding: '0 0.5em',
    marginLeft: '0.4em',
    marginBottom: '0.4em',
    [theme.breakpoints.down('470')]: {
      marginLeft: 0,
      position: 'static',
      marginBottom: '0.4em',
    },
  },
  extendedTagStyle: {
    backgroundColor: 'grey',
  },
  outlined: {
    border: '2px solid var(--primary-color3)',
    borderRadius: '15px',
    padding: '1em',
  },
  projectsCountIcon: {
    color: 'var(--primary-color2)',
  },
  fabButtonStyle: {
    color: 'var(--primary-color2)',
    backgroundColor: 'var(--primary-color1)',
    position: 'absolute',
    marginLeft: '1em',
    left: '0em',
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
  textDecorationNone: {
    textDecoration: 'none',
  },
  fieldNumberStyle: {
    height: '20px',
    width: '20px',
    backgroundColor: 'var(--primary-color3)',
    fontWeight: 700,
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
  listDotsStyle: {
    height: '10px',
    width: '10px',
    backgroundColor: 'var(--primary-color2)',
    borderRadius: '50%',
    marginRight: '0.3em',
  },
  link: {
    textDecoration: 'none',
  },
  checkbox: {
    '&.MuiIconButton-root': {
      padding: '0px !important'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem'
    },
  },
  textSmall: {
    fontSize: '0.9rem'
  },
  boxShadow: {
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.09), 0px 2px 2px 0px rgba(0,0,0,0.08), 0px 1px 5px 0px rgba(0,0,0,0.17)'
  },
  gap: {
    gap: 17
  },
  smallScreenPadding: {
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),

    },
  }
});

export default styles;
