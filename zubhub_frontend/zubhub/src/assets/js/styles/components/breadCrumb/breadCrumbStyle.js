export const styles = theme => ({
  container: {
    backgroundColor: '#00B8C4',
    boxShadow:
      '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
  },
  active: {
    backgroundColor: '#00949E',
  },

  link: {
    padding: '5px 10%',
    boxShadow: '10px 0 5px -2px #888',
    color: 'white',
    fontWeight: 500,
    '&:active': {
      backgroundColor: '#00949E',
    },
  },
});
