import { colors } from '../../../colors';

const styles = theme => ({
  popperContainerStyle: {
    top: '48px !important',
  },
  popperStyle: {
    backgroundColor: 'white',
    minWidth: 200,
    zIndex: 20,
    padding: '20px 15px',
    borderRadius: '20px',
    [theme.breakpoints.down('400')]: {
      marginTop: 12,
    },
    [theme.breakpoints.up('400')]: {
      marginTop: -12,
    },
    boxShadow: '0px 0px 0px 0px rgb(0 0 0 / 25%)',
    // backgroundColor:'purple'
  },
  fullscreenPopperStyle: {
    width: '100vw',
    height: '100vh',
    //  height: 'auto',
    borderRadius: '0px',
  },
  panelHeaderStyle: {
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'center',
    gap: '10px',
    color: '#00B8C4',
    padding: '2.5px 0px',
  },
  logedOutPanel: {
    display: 'flex',
    flexDirection: 'column',
    // maxWidth:600,
    color: colors.black,
    textAlign: 'center',
    alignItems: 'center',
    marginRight:'10%',
    [theme.breakpoints.down('600')]: {
      maxWidth: 250,
      borderRadius: 10,
      boxShadow: ' 0 2px 4px rgba(0, 0, 0, 0.2)',
      zIndex: 1,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      marginLeft: '10%',
    },
    [theme.breakpoints.up('400')]: {
      marginLeft: '20%',
    },

    //  backgroundColor:'red'
  },
  panelHeaderButtons: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  circularProgressStyle: {
    color: '#00B8C4',
    alignSelf: 'center',
    margin: '20px',
  },
  notificationsWrapper: {
    display: 'flex',
    flexFlow: 'column nowrap',
    color: 'black',
    [theme.breakpoints.up('600')]: {
      maxHeight: '450px',
    },
    overflowY: 'auto',
    [theme.breakpoints.down('600')]: {
      height: '86%',
    },
    overscrollBehavior: 'contain',
  },
  panelHeaderTextStyle: {
    margin: '0px',
    marginRight: '30px',
    fontWeight: '600',
  },
  panelSubheadingTextStyle: {
    fontWeight: '600',
    color: '#00B8C4',
    padding: '5px 0px',
    position: 'sticky',
    top: '0px',
    backgroundColor: 'white',
    margin: '0px',
    zIndex: 20,
  },
  fullWidth: {
    width: '100%',
  },
});

export default styles;
