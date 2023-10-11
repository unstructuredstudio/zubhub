
const addTeamMembersStyles = theme => ({
  primaryButtonStyle: {
    backgroundColor: '#00B8C4',
    borderRadius: 30,
    color: 'white',
    '&:hover': {
      backgroundColor: '#03848C',
    },
  },
  customTextField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
    },
  },
  textfieldBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '0.5px solid #B2B0BB',
    paddingRight: '20px',
    borderRadius:'5px'
  },
  formContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: '64px',
    marginTop: 24,
    overflow: 'hidden',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
    [theme.breakpoints.down('sm')]: {
        width:'90vw',
        margin:'auto',
    },
    [theme.breakpoints.down('xs')]: {
        padding: '32px',
        width:'90vw',
        margin:'auto',
    },
},
banner: ({ height }) => ({
  backgroundColor:'white',
  padding: '15px',
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 10,
  [theme.breakpoints.down('sm')]: {
      width:'90vw',
      margin:'auto',
      borderRadius: 0,
      position: 'fixed',
      top: height,
      zIndex: 2,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10)',
      // marginRight:'40px'
  },
})
});

export default addTeamMembersStyles;
