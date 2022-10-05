export const styles = theme => ({
  container: {
    backgroundColor: '#00B8C4',
    maxHeight: '80px',
    textAlign: 'center',
    display: 'flex',

    lineHeight: '40px',
    boxShadow:
      '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    '& ol': {
      flexWrap: 'nowrap',
    },
  },
  textStyle: {
    color: 'white',
    fontWeight: 500,
    fontSize: '1rem',
    whiteSpace: 'nowrap',
    width: '110px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    [theme.breakpoints.down('700')]: {
      fontSize: '0.8rem',
    },
  },
  link: {
    padding: '0 20px',
    [theme.breakpoints.down('700')]: {
      maxWidth: '110',
      padding: '0 5px',
    },
    boxShadow: '10px 0 5px -2px #888',
    color: 'white',
    fontWeight: 500,
  },
  select: {
    color: 'white',
    fontWeight: 600,
    fontSize: '1rem',
    width: '150px',
    [theme.breakpoints.down('700')]: {
      width: '110px',
      fontSize: '0.8rem',
    },
    borderRadius: 30,
    border: 'none',
    underline: {
      border: 'none',
    },
    backgroundColor: '#00949E',
    '&:before': {
      borderColor: 'none',
    },
    '&:after': {
      borderColor: 'none',
    },
  },
  icon: {
    fill: 'white',
  },
});
