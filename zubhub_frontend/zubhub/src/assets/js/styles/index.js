const styles = theme => ({
  marginLeft1em: {
    marginLeft: '1em',
  },
  marginRight1em: {
    marginRight: '1em',
  },
  colorRed: {
    color: 'red',
  },
  displayInlineBlock:{
    display:"inline-block"
  },
  addOnSmallScreen:{
    [theme.breakpoints.up('530')]: {
      display: 'none',
    },
  },
  removeOnSmallScreen:{
    [theme.breakpoints.down('530')]: {
      display: 'none',
    },
  },
});

export default styles;
