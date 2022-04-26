const styles = theme => ({
    unpublishModalStyle: {
        backgroundColor: "#ffffff",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 20,
        width: '50%',
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 30,
    },
    descriptionHeadingStyle: {
        marginTop: '1em',
        fontWeight: 900,
        fontSize: '2.2rem',
    },
    descriptionBodyStyle: {
        marginBottom: '0.7em',
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
      borderRadius: 20,
      '& .checked': {
        color: '#9A0036',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '2rem',
        fontWeight: 900,
      }
    },
});

export default styles;