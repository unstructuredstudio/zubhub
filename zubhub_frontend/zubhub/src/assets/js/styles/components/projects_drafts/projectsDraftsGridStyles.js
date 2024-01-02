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
    borderRadius: 8, overflow: 'hidden'
  },

  viewAllBtn: {
    marginLeft: '2em',
  },

  gridStyle: {
    // marginBottom: '2em',
  },

  tabStyle: {
      '&.Mui-selected': {
        color: 'var(--primary-color3)',
        fontWeight: 'bold',
        backgroundColor: '#ffffff',
      },

      backgroundColor: 'var(--text-color3)',
      width: '50%',
      maxWidth: '50%',
  },

  indicator: {
    backgroundColor: "var(--primary-color3)",
    height: '5px',
  }
});

export default styles;