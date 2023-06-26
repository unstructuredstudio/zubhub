import { colors } from "../../assets/js/colors"

export const createProjectStyle = theme => ({
    container: {
        color: colors.gray,
    },
    banner: ({ height }) => ({
        backgroundColor: colors.white,
        padding: '15px',
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        [theme.breakpoints.down('sm')]: {
            borderRadius: 0,
            position: 'fixed',
            top: height,
            zIndex: 2,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10)'
            // width: '100%'
        },
    })
    ,
    previewButton: {
        borderRadius: 20
    },
    draft: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        color: colors.gray,
    },
    savedToDraft: {
        color: colors.green
    },
    linkToDraft: {
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    formContainer: {
        borderRadius: 10,
        backgroundColor: colors.white,
        padding: 24,
        marginTop: 24,
        overflow: 'hidden',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
        [theme.breakpoints.down('sm')]: {
            margin: '24px',
            marginTop: 24 * 4
        },
        [theme.breakpoints.down('xs')]: {
            margin: '18px',
            marginTop: 24 * 2
        },
    },
    stepperLine: {
        height: 2,
        width: 'calc(100% / 3)',
        backgroundColor: colors["primary-01"],
        position: 'relative',
        marginTop: 42,
        display: 'flex',
        justifyContent: 'center',
    },
    activeStep: {
        backgroundColor: colors.primary,
        color: colors.white,
    },
    stepLabel: {
        marginTop: 20,
        fontWeight: '500',
        textAlign: 'center'
    },
    stepBall: {
        height: 30,
        width: 30,
        borderRadius: 25,
        backgroundColor: 'inherit',
        position: 'absolute',
        marginTop: -15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600'
    },
    stepperContainer: {
        display: 'flex',
        marginBottom: 50
    },
    activeLabel: {
        color: colors.primary
    },
    nextButton: { color: 'inherit', fontSize: 14 },
    previousButton: { color: 'inherit', fontSize: 14 },
    buttonGroup: {
        display: 'flex',
        marginTop: 40
    },


})