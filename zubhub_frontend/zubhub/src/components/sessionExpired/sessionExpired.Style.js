export const sessionExpiredStyle = theme => ({
    card: {
        width: 500,
        borderRadius: 12,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: theme.shadows[5],
        overflow: 'hidden',
    },
    cardHeader: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: theme.spacing(1, 2),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    closeButton: {
        cursor: 'pointer',
        color: '#fff',
    },
    iconWrapper: {
        marginBottom: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
    },
    centerText: {
        textAlign: 'center',
        marginBottom: theme.spacing(1),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 233, 154, 0.5)',
        backdropFilter: 'blur(25px)',
    },
    textDecorationNone: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
    customButtonStyle: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#388E3C',
        },
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
});