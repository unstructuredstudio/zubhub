const styles = theme => ({
    descriptionHeadingStyle: {
        marginTop: '0.5em',
        marginBottom: '0.5em',
        fontWeight: 900,
        fontSize: '2.2rem',
    },
    unpublishedButtonStyle: {
        borderRadius: '3px'
    },
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: 24,
        p: 4,
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
