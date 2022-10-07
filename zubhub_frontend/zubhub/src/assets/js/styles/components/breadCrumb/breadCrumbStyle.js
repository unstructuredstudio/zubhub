export const styles = theme => ({
  container: {
    backgroundColor: '#00B8C4',
    // maxHeight: '80px',
    minHeight: '45px',
    [theme.breakpoints.down('700')]: {
      minHeight: '40px',
    },
    textAlign: 'center',
    display: 'flex',
    maxWidth: '100vw',
    lineHeight: '40px',
    paddingRight: '10px',
    boxShadow:
      '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    '& ol': {
      flexWrap: 'nowrap',
      overflow: 'hidden',
      margin: 0,
    },
    '& li': {
      margin: 0,
      padding: 0,
    },
  },
  separator: {
    color: '#00949E',
  },
  textStyle: {
    color: 'white',
    fontWeight: 600,
    maxWidth: '110px',
    fontSize: '1rem',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('900')]: {
      fontSize: '0.8rem',
    },
  },
  link: {
    padding: '0 20px',
    // whiteSpace: 'nowrap',
    // width: '110px',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    [theme.breakpoints.down('900')]: {
      // maxWidth: '110',
      padding: '0 5px',
    },
    // boxShadow: '10px 0 5px -2px #888',
    color: 'white',
    fontWeight: 500,
  },
  select: {
    color: 'white',
    fontWeight: 600,
    fontSize: '1rem',
    display: 'flex',
    width: '150px',
    [theme.breakpoints.down('900')]: {
      width: '130px',
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
    marginRight: '15px',
  },
  item: {
    margin: 'auto 0',
  },
});
