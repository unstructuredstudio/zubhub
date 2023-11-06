const styles = theme => ({
  popperContainerStyle: {
    top: '56px !important',
    height:10
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
    overflowY: 'auto',
    [theme.breakpoints.down('600')]: {
      marginTop: 10,
    },
  },

  container: {
    backgroundColor: 'white',
    minWidth: 200,
    maxWidth:340,
    zIndex: 20,
    padding: '20px 15px',
    borderRadius: '20px',
    boxShadow: '0px 4px 4px 0px rgb(0 0 0 / 25%)',
  },
  signUpcontainer: {
    backgroundColor: 'white',
    minWidth: 200,
    zIndex: 20,
    padding: '20px 15px',
    borderRadius: '20px',
    boxShadow: '0px 4px 4px 0px rgb(0 0 0 / 25%)',
    [theme.breakpoints.down('600')]: {
      minWidth: 220,
      marginTop: "20%",
      marginLeft: '25%',
    },
    [theme.breakpoints.up('600')]: {
      width: '238px'
    },

  },
 
});

export default styles;
