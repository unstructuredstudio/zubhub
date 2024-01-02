const styles = theme => ({
  notificationLink: {
    textDecoration: 'none',
    color: 'inherit',
    marginRight: '8px',
  },
  notificationStyle: {
    display: 'flex',
    borderRadius: '5px',
    width: '100%',
    height: '80px',
    cursor: 'pointer',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: '0px',
    paddingRight: '5%',
    margin: '0px',
    justifyContent: 'space-evenly',
    '&:hover': {
      backgroundColor: 'var(--primary-color3)',
      fontColor: '#FFFFFF',
      '& $viewDot': {
        backgroundColor: 'var(--secondary-color3)',
      },
      '& $message': {
        color: '#FFFFFF',
      },
      '& $time': {
        color: '#FFFFFF',
      },
    },
  },
  image: {
    width: '56px !important',
    height: '56px !important',
    borderRadius: '50%',
    border: '2px solid var(--text-color3)',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  group: {
    height: '78px',
    width: '68px',
    display: 'flex',
    padding: '4px',
  },
  firstImage: {
    width: '46px !important',
    height: '46px !important',
    border: '2px solid var(--text-color3)',
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  secondImage: {
    width: '48px !important',
    height: '48px !important',
    border: '2px solid var(--text-color3)',
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    marginLeft: '-30px',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '4px',
    width: '76%',
  },
  message: {
    fontSize: '16px',
    font: 'Raleway',
    color: 'var(--text-color1)',
    marginBottom: '0px',
    marginLeft: '6px',
    textDecoration: 'none',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  time: {
    marginTop: '0px',
    fontSize: '14px',
    color: 'var(--primary-color3)',
    marginLeft: '6px',
  },
  viewDot: {
    backgroundColor: 'var(--primary-color3)',
    borderRadius: '50%',
    width: '14px !important',
    height: '14px !important',
    [theme.breakpoints.up('sm')]: {
      width: '12px !important',
      height: '12px !important',  
    },
  },
  unviewed: {
    backgroundColor: 'transparent',
    width: '14px !important',
    height: '14px !important',
    [theme.breakpoints.up('sm')]: {
      width: '12px !important',
      height: '12px !important',  
    },
  },
});

export default styles;
