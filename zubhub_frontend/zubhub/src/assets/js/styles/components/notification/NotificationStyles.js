const styles = theme => ({
    notificationStyle: {
        display: 'flex',
        borderRadius: '5px',
        width: '100%',
        height:'80px',
        cursor: 'pointer',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: '0px',
        paddingBottom: '0px',
        paddingLeft: '2.5%',
        paddingRight: '5%',
        margin: '0px',
        justifyContent: 'space-evenly',
        '&:hover': {
            '& $viewDot': {
                backgroundColor: '#F9D967',
            },
            '& $message': {
                color: '#FFFFFF',
            },
            '& $time': {
                color: '#FFFFFF',
            },
            '& $image': {
                backgroundColor: 'white',

            },
            backgroundColor: '#52B5C2',
            fontColor: '#FFFFFF',
        },
    },
    image: {
        width: '56px !important',
        height: '56px !important',
        borderRadius: '50%',
        border: '2px solid #E4E4E4',
        marginRight: '5%',
    },
    message: {
        fontSize: '16px',
        font: 'Raleway',
        color: '#000000',
        marginBottom: '0px',
        textDecoration: 'none',
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
    },
    time: {
        marginTop: '0px',
        fontSize: '14px',
        color: '#00B8C4',
    },
    viewDot: {
        backgroundColor: '#00B8C4',
        borderRadius: '50%',
        width: '14px !important',
        height: '14px !important',
    },
    unviewed: {
        backgroundColor: 'transparent',
        width: '14px !important',
        height: '14px !important',
    },
});

export default styles;
