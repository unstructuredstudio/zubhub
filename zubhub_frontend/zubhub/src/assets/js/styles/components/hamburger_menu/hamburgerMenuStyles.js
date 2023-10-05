const styles = theme => ({
  hamburgerButtonStyle: {
    color: 'white',
  },

  hamburgerSidebarStyle: {
    '& .MuiDrawer-paper': {
      height: '85%',
      width: '50%',
      top: '3.5em',
      left: '50%',
      borderRadius: '10px',
    },
  },

  textDecorationNone: {
    textDecoration: 'none',
  },

  logOutStyle: {
    borderTop: '1px solid var(--text-color3)',
    backgroundColor: 'var(--text-color3)',
    height: '10%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuItemSelected: {
    backgroundColor: 'black',
  },

  menuItemStyle: {
    backgroundColor: 'var(--text-color3)',
    height: '10%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paddingItem: {
    borderRadius: '10px',
    paddingLeft: '15%',
    height: '80%',
    width: '90%',

    '&:hover': {
      backgroundColor: 'var(--primary-color3)',
      '& .MuiTypography-root': {
        color: 'white',
      },
    },
  },

  avatarItemStyle: {
    height: '20%',
    paddingLeft: '15%',
    paddingRight: '15%',
    pointerEvents: 'none',
  },

  avatarStyle: {
    height: '50%',
    width: '25%',
    marginRight: '10%',
  },

  menuItemHeader: {
    marginLeft: '40%',
  },
});

export default styles;
