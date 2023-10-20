export const sessionExpiredStyle = theme => (
    {
        card: {
            width: 300,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: theme.shadows[5],
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
        },
        closeButton: {
            cursor: 'pointer',
            color: '#fff',
        },
        alertIcon: {
            color: '#f44336',
            marginRight: theme.spacing(1),
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }
    }
);