const styles = theme => ({
    viewDot: {
        color: '#00B8C4',
        borderRadius: '50%',
        width: '14px',
        height: '14px',
        '&:hover': {
            color: '#F9D967',
        }
    },
    notificationStyle: {
        outline: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        width: '100%',
        height:'10%',
        color: '#FFFFFF',
        '&:hover': {
            color: '#52B5C2',
        },
    },
});

export default styles;
