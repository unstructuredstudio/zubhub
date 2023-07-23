const styles = theme => ({
  titleStyle: {
    fontWeight: 900,
    fontSize: '1.5rem',
    padding: '1em',
  },

  profileLowerStyle: {
    // margin: '1em',
    [theme.breakpoints.down('740')]: {
      margin: '1em',
    },
  },

  viewAllBtn: {
    marginLeft: '2em',
  },

  gridStyle: {
    // marginBottom: '2em',
  },

  tabStyle: {
    '&.Mui-selected': {
      color: '#00B8C4',
      fontWeight: 'bold',
      backgroundColor: '#ffffff',
    },

    backgroundColor: '#EDEDED',
    width: '50%',
    maxWidth: '50%',
  },

  indicator: {
    backgroundColor: "#00B8C4",
    height: '5px',
  }
});

export default styles;