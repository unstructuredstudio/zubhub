const styles = theme => ({
    notificationStyle: {
        viewDot: {
            color: '#00B8C4',
            borderRadius: '50%',
            width: '14px',
            height: '14px',
        },
        outline: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '8px',
        width: '100%',
        height:'10%',
        backgroundColor: '#FFFFFF',
        '&:hover': {
            color: '#52B5C2',
            viewDot: {
                color: '#F9D967',
            }
        },
    },
});

export default styles;