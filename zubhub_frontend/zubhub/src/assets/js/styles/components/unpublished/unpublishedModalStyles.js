const styles = theme => ({
    descriptionHeadingStyle: {
        marginTop: '0.5em',
        marginBottom: '0.5em',
        fontWeight: 900,
        fontSize: '2.2rem',
    },
    unpublishedLabelStyle: {
        borderRadius: '5px',
        marginRight: '20px',
        marginTop: '15px',
        padding: '5px 20px',
        backgroundColor: 'rgb(221,52,68)',
        color: 'white',
        fontSize: '0.7rem',
        fontFamily: 'Raleway,Roboto,sans-serif',
        fontWeight: '400!important',
        width: 'fit-content',
        height: 'fit-content',
        cursor: 'pointer',
    },
    overflowWrapper: {
        maxHeight: '60vh',
        overflow: 'scroll',
    },
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        backgroundColor: '#ffffff',
        border: 'none',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: 24,
        p: 4,
        maxHeight: '70%',
        '&:focus': {
            outline: 0,
        },
    },
    modalMobileStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: 24,
        p: 4,
        maxHeight: '70%',
    },
    modalBodyStyle: {
        marginBottom: '1.0em',
        color: 'rgba(0, 0, 0, 0.54)',
        '& .ql-editor': {
            fontSize: '1.5rem',
            fontFamily: 'Raleway,Roboto,sans-serif',
        },
    },
    violationReasonStyle: {
        marginBottom: '0.7em',
        color: 'rgba(220, 53, 69, 1)',
        '& .ql-editor': {
            fontSize: '1.5rem',
            fontFamily: 'Raleway,Roboto,sans-serif',
        },
    },
    understandButtonStyle: {
        float: 'right',
        marginTop: '30px',
    },
    closeIconStyle: {
        float: 'right',
        color: 'rgba(196, 196, 196, 1)',
        fontSize: 40,
    }
});

export default styles;
