const styles = theme => ({
    unpublishModalStyle: {
      backgroundColor: "#ffffff",
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: 20,
      width: '45%',
      padding: 35,
      paddingTop: 20,
      paddingRight: 0,
    },
    overflowWrapper: {
      maxHeight: '90vh',
      overflow: 'scroll',
      overflowX: 'hidden',
    },
    unpublishModalMobileStyle: {
      backgroundColor: "#ffffff",
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: 20,
      width: '90%',
      height: '95%',
      padding: 25,
      paddingRight: 0,
    },
    closeIconStyle: {
      color: '#C4C4C4',
      fontSize: 30,
      strokeWidth: 0.5,
      stroke: '#ffffff',
      position: 'absolute',
      right: 25,
      top: 10,
    },
    closeIconMobileStyle: {
      color: '#C4C4C4',
      fontSize: 30,
      strokeWidth: 0.5,
      stroke: '#ffffff',
      position: 'absolute',
      right: 10,
      top: 10,
    },
    descriptionHeadingStyle: {
      marginTop: '1.5em',
      fontWeight: 900,
      fontSize: '2rem',
    },
    descriptionHeadingMobileStyle: {
      marginTop: '1.5em',
      fontWeight: 900,
      fontSize: '1.6rem',
      marginRight: 20,
    },
    descriptionSubtitleMobileStyle: {
      marginBottom: '1em',
      marginRight: '1.5em',
      fontSize: '0.9rem',
      color: 'rgba(0, 0, 0, 0.54)',
      '& .ql-editor': {
        fontSize: '1rem',
        fontFamily: 'Raleway,Roboto,sans-serif',
      },
    },
    descriptionBodyStyle: {
      marginBottom: '1.5em',
      marginRight: '1.5em',
      color: 'rgba(0, 0, 0, 0.54)',
      '& .ql-editor': {
        fontSize: '1.5rem',
        fontFamily: 'Raleway,Roboto,sans-serif',
      },
    },
    descriptionBodyMobileStyle: {
      marginRight: '1.5em',
      marginBottom: '1.5em',
      color: 'rgba(0, 0, 0, 0.54)',
      '& .ql-editor': {
        fontSize: '1rem',
        fontFamily: 'Raleway,Roboto,sans-serif',
      },
      '& .MuiTypography-root': {
        fontSize: '0.9rem',
      }
  },
    hideProjectButtonStyle: {
      float: 'right',
      backgroundColor: '#DC3545',
      paddingLeft: 25,
      paddingRight: 25,
      marginRight: 25,
    },
    hideProjectButtonMobileStyle: {
      float: 'right',
      backgroundColor: '#DC3545',
      paddingLeft: 25,
      paddingRight: 25,
      marginRight: 25,
      marginBottom: 10,
    },
    checkboxStyle: {
      '& .MuiCheckbox-colorSecondary.Mui-checked': {
        color: '#DC3545',
      },
      '& .MuiCheckbox-root': {
        color: '#C4C4C4',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '3.5rem',
        fontWeight: 900,
        strokeWidth: 0.8,
        stroke: '#ffffff',
      },
    }
});

export default styles;