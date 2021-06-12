const styles = theme => ({
  root: {
    paddingBottom: '2em',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,204,0,1)',
    background:
      '-moz-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,204,0,1)), color-stop(25%, rgba(255,229,133,1)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))',
    background:
      '-webkit-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-o-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-ms-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    filter:
      "progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffcc00', endColorstr='#ffffff', GradientType=0 )",
    '& .MuiGrid-root.MuiGrid-container': {
      width: '100%',
    },
  },
  heroSectionStyle: {
    backgroundColor: '#DC3545',
    boxShadow: "-2px 25px 13px -18px rgba(220,53,69,0.7)",
// -webkit-box-shadow: -2px 27px 20px -26px rgba(220,53,69,0.75);
// -moz-box-shadow: -2px 27px 20px -26px rgba(220,53,69,0.75);
    width: "100%",
    display:"flex",
    justifyContent:"center",
  },
  heroContainerStyle: {
    width: "100%",
    maxWidth: "1190px",
    padding:"1rem 1rem",
    display: "flex",
    [theme.breakpoints.down('1000')]:{
      flexDirection:"column-reverse"
    }
  },
  heroMessageContainerStyle: {
    flexGrow: 1,
    color: "white",
  },
  heroMessageSecondaryStyle: {
    fontSize: "2.2rem",
  },
  heroMessagePrimaryStyle: {
    fontSize: "2.2rem",
    fontWeight: 1000
  },

  heroButtonStyle: {
    textTransform: "capitalize",
    padding:"0 1em",
    fontSize:"1.2rem",
    fontWeight: 700,
    marginRight:"1em",
    [theme.breakpoints.down('530')]: {
      marginTop:"1em"
    }
  },
  heroImageContainerStyle: {
    display: "flex",
    transform: "rotate(-12deg)",
    [theme.breakpoints.down('1000')]:{
      transform: "rotate(0deg)",
    },
    [theme.breakpoints.down('500')]: {
    justifyContent:"center",
    }
  },
  heroImageTextStyle: {
    marginLeft: "2em",
    [theme.breakpoints.down('500')]:{
      display:"none"
    }
  },
  heroImageStyle: {
    cursor: "pointer",
    marginLeft: "2em",
    marginRight: "2em",
    border: '0.3em solid #FFCE0C',
    borderRadius: '5px',
    height:"10em",
    width: "16em",
    alignSelf: "flex-end",
    [theme.breakpoints.down('500')]:{
      marginLeft: "0",
      marginRight: "0",
    }
  },

  mainContainerStyle: {
    maxWidth: '1190px',
    width: '100%',
  },
  projectGridStyle: {
    marginBottom: '2em',
  },
  titleStyle: {
    fontWeight: 900,
    fontSize: '1.5rem',
    marginTop: '2em',
    marginLeft: '1rem',
    marginRight: '1rem',
  },
  buttonGroupStyle: {
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'block',
    marginTop: '2em',
    maxWidth: '2000px',
    width: '100%',
  },
  floatRight: {
    float: 'right',
  },
  floatLeft: {
    float: 'left',
  },
});

export default styles;
