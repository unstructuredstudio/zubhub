export const sessionExpiredStyle = theme => ({
    card: {
        borderRadius: 12,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: theme.shadows[5],
        overflow: 'hidden',
        width: '90%',
        zIndex: 1300,
        [theme.breakpoints.up('sm')]: {
            width: 500,
        },
    },
    cardHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        padding: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(1, 2),
        },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        padding: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(2),
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    closeButton: {
        cursor: 'pointer',
        color: theme.palette.common.white,
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
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(5px)',
    },
    textDecorationNone: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
    customButtonStyle: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    errorIcon: {
        fontSize: 60,
        color: 'var(--primary-color1)',
    },
    titleStyle: {
        fontSize: '1.2rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.5rem',
        },
        fontWeight: 600,
    },
});
