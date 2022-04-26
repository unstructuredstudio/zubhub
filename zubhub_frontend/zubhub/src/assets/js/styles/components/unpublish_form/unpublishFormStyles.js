const styles = theme => ({
    unpublishModalStyle: {
        backgroundColor: "#ffffff",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 20,
        width: '40%',
        padding: 30,
    },
    descriptionHeadingStyle: {
        marginTop: '1em',
        fontWeight: 900,
        fontSize: '2.2rem',
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
      },
    }
});

export default styles;