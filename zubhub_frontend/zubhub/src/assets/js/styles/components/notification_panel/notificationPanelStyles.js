const styles = theme => ({
  popperContainerStyle: {
    top: '48px !important',
  },
  popperStyle: {
    backgroundColor: 'white',
    zIndex: 20,
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0px 4px 4px 0px rgb(0 0 0 / 25%)',
  },
  fullscreenPopperStyle: {
    width: '100vw',
    height: '100vh',
    borderRadius: '0px',
  },
  panelHeaderStyle: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    gap: '10px',
    color: '#00B8C4',
  },
  panelHeaderTextStyle: {
    margin: '0px',
    marginRight: '30px',
    fontWeight: '600',
  },
  panelSubheadingTextStyle: {
    margin: '5px 0px',
    fontWeight: '600',
    color: '#00B8C4',
  },
  fullWidth: {
    width: '100%',
  },
});

export default styles;
