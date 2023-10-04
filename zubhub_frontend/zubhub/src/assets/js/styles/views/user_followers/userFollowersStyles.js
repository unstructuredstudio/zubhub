const styles = theme => ({
  root: {
    paddingBottom: '2em',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // background: 'rgba(255,204,0,1)',
    width: '60vw',
    // background:
    //   '-moz-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,204,0,1)), color-stop(25%, rgba(255,229,133,1)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))',
    // background:
    //   '-webkit-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-o-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-ms-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // filter:
    //   "progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffcc00', endColorstr='#ffffff', GradientType=0 )",
    '& .MuiGrid-root.MuiGrid-container': {
      width: '100%',
    },
  },
  mainContainerStyle: {
    maxWidth: '2000px',
    width: '100%',
  },
  pageHeaderStyle: {
    marginTop: '1em',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonGroupStyle: {
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'block',
    marginTop: '2em',
    maxWidth: '2000px',
    width: '100%',
  },
  followersGridStyle: {
    marginBottom: '2em',
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
  },
  cardStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // height: '94%',
    // width: 500,
    // padding:'1rem',
    paddingTop: 0,
    paddingBottom: '0 !important',
    marginTop: '1em',
    marginBottom: '0',
    borderRadius: '15px',
    textAlign: 'left',
    backgroundColor: '#ffffff',
  },
  avatarStyle: {
    width: '50%',
    height: 'auto',
    // paddingLeft:"2rem",
    // paddingRight:'2rem',
    paddingBottom: '1rem',
    '& img': {
      width: '5em',
      backgroundColor: 'white',
      height: '5em',
      borderRadius: '50%',
      boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    },
  },
  userNameStyle: {
    margin: '0.5em',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  primaryButton: {
    backgroundColor: '#00B8C4',
    borderRadius: 15,
    color: 'white',
    marginLeft: '1em',
    '&:hover': {
      backgroundColor: '#03848C',
    },
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#00B8C4',
    color: '#00B8C4',
    marginLeft: '1em',
    '&:hover': {
      color: '#03848C',
      borderColor: '#03848C',
      backgroundColor: '#F2F2F2',
    },
  },
  secondaryLink: {
    color: '#00B8C4',
    '&:hover': {
      color: '#03848C',
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  floatRight: {
    float: 'right',
  },
  floatLeft: {
    float: 'left',
  },
  displayNone: { display: 'none' },
  largeLabel: {
    fontSize: '1.3rem',
  },
  editIconContainer: {
    marginLeft: '3rem',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'end',
    // marginTop:'0.1rem' ,
    paddingLeft: '8rem',
    // backgroundColor:'purple'
  },
  editIcon: {
    backgroundColor: 'gray',
    padding: '0.4rem',
    borderRadius: '0.5rem',
    color: 'white',
  },
  popper: {
    paddingRight: '0.2rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  memberrole: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '1rem',
  },
  roleItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginLeft: '1rem',
  },
  checkedrole: {
    fontFamily: 'sans-serif',
    marginRight: '5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    '&:hover, &:focus': {
      outline: 'none',
      cursor: 'pointer',
    },
  },
  uncheckedRole: {
    fontFamily: 'sans-serif',
    marginLeft: '2.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    '&:hover, &:focus': {
      outline: 'none',
      cursor: 'pointer',
    },
  },
  updateButton: {
    '&:hover, &:focus': {
      outline: 'none',
      cursor: 'pointer',
    },
  },
  removeButton: {
    fontFamily: 'sans-serif',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '5px',
    whiteSpace: 'nowrap',
    color: 'red',
    marginLeft: '2.5rem',
    '&:hover, &:focus': {
      outline: 'none',
      cursor: 'pointer',
    },
  },
});

export default styles;
