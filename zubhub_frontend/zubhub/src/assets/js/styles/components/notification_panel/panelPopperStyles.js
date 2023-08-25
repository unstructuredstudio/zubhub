const styles = theme => ({
  popperContainerStyle: {
    top: '56px !important',
  },
  popperArrowStyle: {
    width: '50px',
    height: '50px',
    top: '-19px',
    background: 'white',
    position: 'absolute',
    transform: 'scaleX(0.7) rotate(45deg)',
    transformOrigin: 'center',
    borderRadius: '200px 0px 1000px 0px',
    zIndex: '2000',
  },
  container: {
    backgroundColor: 'white',
    minWidth: 200,
    zIndex: 20,
    padding: '20px 15px',
    borderRadius: '20px',
    boxShadow: '0px 4px 4px 0px rgb(0 0 0 / 25%)',
  }
});

export default styles;
