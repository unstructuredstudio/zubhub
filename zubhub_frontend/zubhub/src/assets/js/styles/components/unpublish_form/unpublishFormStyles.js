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
    },
    closeIconStyle: {
      float: 'right',
      color: '#C4C4C4',
      fontSize: 30,
      strokeWidth: 0.5,
      stroke: '#ffffff',
    },
    descriptionHeadingStyle: {
        marginTop: '1.5em',
        fontWeight: 900,
        fontSize: '2rem',
    },
    descriptionBodyStyle: {
        marginBottom: '1.5em',
        color: 'rgba(0, 0, 0, 0.54)',
        '& .ql-editor': {
          fontSize: '1.5rem',
          fontFamily: 'Raleway,Roboto,sans-serif',
        },
    },
    hideProjectButtonStyle: {
      float: 'right',
      backgroundColor: '#DC3545',
      paddingLeft: 25,
      paddingRight: 25,
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