const styles = theme => ({
  popperStyle: {
    backgroundColor: 'white',
    zIndex: 20,
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0px 4px 4px 0px rgb(0 0 0 / 25%)',
  },
  popperArrowStyle: {
    width: '50px',
    height: '50px',
    top: '-20px',
    background: 'white',
    position: 'absolute',
    transform: 'scaleX(0.7) rotate(45deg)',
    transformOrigin: 'center',
    borderRadius: '10px',
    zIndex: '-1',
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
