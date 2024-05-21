const styles = theme => ({
  root: {
    flex: '1 0 auto',
    marginTop: '2em',
    [theme.breakpoints.down('378')]: {
      marginTop: '3em',
    },
  },
  activityDetailContainer: {
    width: '100%',
    margin: 'auto',
  },
  activityDetailBlockContainer: {
    width: '80%',
    margin: '3em auto',
    [theme.breakpoints.down('700')]: {
      width: '90%',
    },
  },
  marginAuto: {
    margin: 'auto',
  },
  activityDetailBlock: {
    width: '60%',
    margin: '3em auto',
    padding: '5vh 0',
    [theme.breakpoints.down('900')]: {
      width: '90%',
    },
  },
  // demoImageContainerStyle: {
  //   // maxHeight: '450px',
  // },
  leftCropedContainer: {
    clipPath: 'polygon(100% 10%,100% 100%, 0% 100%,0% 0%)',
    padding: '8em 20%',
    minHeight: '80vh',
    backgroundColor: 'var(--primary-color2)',
    [theme.breakpoints.down('511')]: {
      padding: '1em 5%',
      clipPath: 'polygon(100% 5%,100% 100%, 0% 100%,0% 0%)',
    },
  },
  inspiringExamplesContainer: {
    clipPath: 'polygon(100% 0%,100% 100%, 0% 100%,0% 10%)',
    padding: '8em 20% ',
    minHeight: '80vh',
    backgroundColor: 'var(--primary-color2)',
    [theme.breakpoints.down('511')]: {
      padding: '1em 5%',
      clipPath: 'polygon(100% 0%,100% 100%, 0% 100%,0% 5%)',
    },
  },
  inspiringExampleImageStyle: {
    height: '100%',
    objectFit: 'cover',
    margin: '2%',
  },
  demoImageStyle: {
    objectFit: 'cover',
    // height: '60vh',
    maxWidth: '100%',
    borderRadius: '15px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  titleStyle: {
    fontWeight: 800,
    textAlign: 'center',
    color: 'var(--text-color1)',
    [theme.breakpoints.down('900')]: {
      fontSize: '1.9rem',
    },
    [theme.breakpoints.down('500')]: {
      fontSize: '1.5rem',
    },
  },
  artistBiography: {
    alignSelf: 'center',
  },
  createdOn: {
    fontStyle: 'normal',
    fontSize: '0.9rem',
    textAlign: 'center',
    color: '#3E3E5F',
  },
  videoPlayer: {
    borderRadius: '15px',
    height: '60vh',
  },
  imageCreditStyle: {
    color: '#3E3E5F',
    fontSize: '10px',
    textAlign: 'center',
  },

  subTitles: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '2rem',
    [theme.breakpoints.down('700')]: {
      fontWeight: 700,
      fontSize: '1.8rem',
    },
    textAlign: 'center',
    margin: '3em 0 1em 0',
    color: 'var(--text-color1)',
  },

  makingStepsDescriptionStyle: {
    marginBottom: '0.7em',
    color: 'rgba(0, 0, 0, 0.54)',
    '& .ql-editor': {
      fontSize: '1rem',
      fontFamily: 'Raleway,Roboto,sans-serif',
    },
  },
  creatorImage: {
    objectFit: 'cover',
    height: 'auto',
    width: '80%',
    borderRadius: '50%',
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    '&:hover': {
      width: '80%',
      height: 'auto',
      border: '2px solid rgba(0, 0, 0, .12)',
    },
  },
  quillBodyStyle: {
    '& > *': {
      color: 'var(--text-color1)',
      fontSize: '1.2rem',
      fontFamily: 'Raleway,Roboto,sans-serif',
      fontWeight: 500,
      display: 'block',
    },
    '& .ql-bubble': {
      whiteSpace: 'nowrap',
    },
    [theme.breakpoints.down('959')]: {
      '& .ql-editor': {
        fontSize: '1rem',
      },
    },
    '& .ql-toolbar': {
      display: 'none',
    },
  },

  quillTextCenter: {
    '& > *': {
      textAlign: 'center',
    },
  },

  videoWrapperStyle: {
    marginBottom: '1em',
    position: 'relative',
    paddingBottom: '40.25%',
    maxWidth: '1000px',
    [theme.breakpoints.down('959')]: {
      paddingBottom: '56.25%',
    },
  },
  iframeStyle: {
    position: 'absolute',
    borderRadius: '15px',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },

  materialsUsedStyle: {
    display: 'inline-block',
    fontSize: '1.5rem',
    padding: '0.2em 0.5em',
    color: 'var(--text-color1)',
    borderRadius: '15px',
    border: '1px solid var(--primary-color3)',
    marginRight: '0.5em',
    marginBottom: '0.5em',
  },
  tagsBoxStyle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tagsStyle: {
    backgroundColor: 'var(--text-color3)',
    textTransform: 'lowercase',
    color: 'black',
    border: 'none',
    padding: '0 0.6em',
    fontSize: '1.2rem',
    borderRadius: '15px',
    marginRight: '0.5em',
    marginBottom: '0.5em',
  },
  categoryStyle: {
    fontSize: '1.5rem',
    color: 'rgba(0, 0, 0, 0.54)',
    textTransform: 'lowercase',
    borderRadius: '50px',
    padding: '0 0.6em',
    marginBottom: '0.7em',
  },

  customLabelStyle: {
    '&.MuiFormLabel-root.Mui-focused': {
      color: 'var(--primary-color3)',
    },
  },
  secondaryLink: {
    color: 'var(--primary-color3)',
    '&:hover': {
      color: 'var(--secondary-color6)',
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
  floatRight: { float: 'right' },
  displayNone: { display: 'none' },
  largeLabel: {
    fontSize: '1.3rem',
  },
  dialogButtonContainer: {
    padding: '16px 24px',
  },
});

export default styles;
