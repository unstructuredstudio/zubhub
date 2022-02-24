const styles = theme => ({
  popperContainerStyle: {
    top: '56px !important',
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
});

export default styles;
