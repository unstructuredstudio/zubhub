const styles = theme => ({
    notificationStyle: {
        display: 'flex',
        borderRadius: '5px',
        width: '340px',
        height:'80px',
        cursor: 'pointer',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: '0px',
        paddingLeft: '1.5%',
        paddingRight: '5%',
        margin: '0px',
        justifyContent: 'space-evenly',
        '&:hover': {
            backgroundColor: '#52B5C2',
            fontColor: '#FFFFFF',
            '& $viewDot': {
                backgroundColor: '#F9D967',
            },
            '& $message': {
                color: '#FFFFFF',
            },
            '& $time': {
                color: '#FFFFFF',
            },
        },
    },
    image: {
        width: '56px !important',
        height: '56px !important',
        borderRadius: '50%',
        border: '2px solid #E4E4E4',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    group: {
        height: '78px',
        width: '68px',
        display: 'flex',
        padding: '4px',
    },
    firstImage: {
        width: '46px !important',
        height: '46px !important',
        border: '2px solid #E4E4E4',
        backgroundColor: 'white',
        alignSelf: 'flex-end',
    },
    secondImage: {
        width: '48px !important',
        height: '48px !important',
        border: '2px solid #E4E4E4',
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        marginLeft: '-30px',
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '4px',
        width: '76%',
    },
    message: {
        fontSize: '16px',
        font: 'Raleway',
        color: '#000000',
        marginBottom: '0px',
        marginLeft: '6px',
        textDecoration: 'none',
    },
    time: {
        marginTop: '0px',
        fontSize: '14px',
        color: '#00B8C4',
        marginLeft: '6px',
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
