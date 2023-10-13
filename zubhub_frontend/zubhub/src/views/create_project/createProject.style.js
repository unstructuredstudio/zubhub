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
    selectModeTextContainer: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '750px',
        textAlign: 'center',
    },
    modeItemContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 20,
        paddingRight: 40,
        paddingLeft: 40, 
        marginTop: 60,
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'center'
        },
    },
    modeItemSelected: {
        border: `solid 1.5px ${colors.primary} !important`
    },
    modeItem: {
        width: '260px',
        height: '220px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: '18px 24px',
        border: `solid 1.5px transparent`,
        boxShadow: '2px 4px 5px 0px #00B8C41A',
        '&:hover': {
            border: `solid 1.5px ${colors.primary}`,
            cursor: 'pointer'
        },
        [theme.breakpoints.down('md')]: {
            width: '100%',
            maxWidth: '500px',
        },
    },
    modeItemDescription: {
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: '300'
    },
    modeItemIcon: {
        color: colors.primary,
        marginBottom: 2,
        fontSize: 40,
    },
    modeSubmitButton: {
        width: '150px',
        height: '40px',
        fontFamily: 'Raleway, Roboto, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '20px',
        letterSpacing: 0,
        marginTop: 60,
        marginBottom: 60,
        padding: 4,
        alignSelf: 'center',
        '&:disabled': {
            backgroundColor: '#00B8C433',
            color: '#7BA8AB',
        }
    },
    dialogTitle1: {
        fontSize: '18px !important',
        lineHeight: '26px !important',
        marginBottom: 0,
        color: colors["tertiary-dark"] + '!important',
        marginTop: 40
    },
    modeItemTitle: {
        fontSize: '18px !important',
        // lineHeight: '26px !important',
        marginBottom: 5,
        marginTop: 10
    },
    checkBoxContainer: {
        position: 'absolute',
        right: '12px',
        top: '14px',
        width: '30px',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkBoxDefault: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        borderRadius: '50%',
        border: `solid 2px ${colors.primary}`,
        color: colors.white,
    },
    checkBoxSelected: {
        borderRadius: '50%',
        fontSize: '36px',
        color: colors.primary,
    },
    formContainer: {
        borderRadius: 10,
        backgroundColor: colors.white,
        padding: '64px',
        marginTop: 24,
        overflow: 'hidden',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
        [theme.breakpoints.down('sm')]: {
            margin: '24px',
        },
        [theme.breakpoints.down('xs')]: {
            margin: '18px',
            padding: '32px'
        },
    },
    selectMode: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: '64px',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        color: colors.black,
        [theme.breakpoints.down('sm')]: {
            // margin: '24px',
        },
        [theme.breakpoints.down('xs')]: {
            // margin: '18px',
            padding: '32px'
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
    dividerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    divider: {
        width: '100%',
        maxWidth: '250px'
    }

})