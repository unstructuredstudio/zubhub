import { colors } from "../../assets/js/colors"

export const activityDefailsStyles = theme => ({
    mainContainer: {
        [theme.breakpoints.down('sm')]: {
            margin: '0 24px'
        },
        [theme.breakpoints.down('xs')]: {
            margin: '0 12px'
        }
    },
    descriptionBodyStyle: {
        '& .ql-editor': {
            fontSize: '1.1em',
            fontFamily: 'Raleway,Roboto,sans-serif',
            lineHeight: 1.9,
            margin: 0,
            padding: 0,
            '& ol': {
                padding: 0
            }
        },
    },
    socialButtons: {
        backgroundColor: colors.primary,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '16px 0',
        borderRadius: 8,
    },
    card: {
        borderRadius: 8,
        backgroundColor: colors.white,
        padding: 24,
        marginBottom: 40,
        [theme.breakpoints.down('xs')]: {
            padding: '24px 16px',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    cardTitle: {
        fontSize: '1.2em',
        fontWeight: 600,
    },
    classGrade: {
        width: 'fit-content',
        border: `1px solid ${colors.primary}`,
    },
    actionBoxButtonStyle: {
        color: 'white',
        '& MuiFab-root:hover': {
            color: '#F2F2F2',
        },
        '& svg': {
            fill: 'white',
        },
        '& svg:hover': {
            fill: '#F2F2F2',
        },
    },
    footer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2em',
        textAlign: 'center'
    },
    footerTitle: {
        fontSize: 22,
        fontWeight: 700,
    },
    footerButton: {
        width: 'fit-content',
        alignSelf: 'center',
        borderRadius: 4,
        fontSize: '1.2em'
    }
})