const styles = theme => ({
    notificationStyle: {
        display: 'flex',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '500px',
        height:'80px',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#52B5C2',
            fontColor: '#FFFFFF'
        },
    },
    image: {
        height: '30px',
        width: '30px',
        borderRadius: '50%',
    },
    message: {
        fontSize: '16px',
        font: 'Raleway',
        color: '#000000',
        marginBottom: '0px',
        '&:hover': {
            color: '#FFFFFF',
        },
    },
    time: {
        marginTop: '0px',
        fontSize: '14px',
        color: '#00B8C4',
        '&:hover': {
            color: '#FFFFFF',
        },
    },
    viewDot: {
        backgroundColor: '#00B8C4',
        borderRadius: '50%',
        width: '14px',
        height: '14px',
        '&:hover': {
            backgroundColor: '#F9D967',
        },
    },
});

export default styles;
