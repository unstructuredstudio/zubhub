import { colors } from "../../../colors";

const styles = theme => ({
  popperContainerStyle: {
    top: '48px !important',
  },
  // popperStyle: {
  //   backgroundColor: 'white',
  //   minWidth: 200,
  //   zIndex: 20,
  //   padding: '20px 15px',
  //   borderRadius: '20px',
  //   boxShadow: '0px 4px 4px 0px rgb(0 0 0 / 25%)',
  // },
  fullscreenPopperStyle: {
    width: '100vw',
    height: '100vh',
    /* height: 'auto', */
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
    maxWidth: 200,
    color: colors.black,
    textAlign: 'center',
    alignItems: 'center'
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
