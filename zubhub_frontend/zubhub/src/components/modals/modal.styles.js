import { colors } from "../../assets/js/colors"

export const modalStyles = theme => ({
    dialogTitle: {
        fontSize: '18px !important',
        lineHeight: '26px !important',
        marginTop: 0
    },
    successDialogHeaderIcon: {
        height: 50, width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
        position: 'absolute',
        alignSelf: 'center',
        left: 'calc(50% - 25px)',
        top: -25,
        backgroundColor: colors.white
    },
    dialogContainer: {
        '& .MuiDialog-paper': {
            overflow: 'visible !important'
        },
        backdropFilter: 'blur(15px)',
    },
    dialogPaper: {
        borderRadius: 8,
        padding: '20px 4px',
        position: 'relative',
        overflow: 'inherit',
    },
    dialogIcon: {
        color: colors["tertiary-dark"],
    },
    coloredTitle: {
        color: colors["tertiary-dark"],
        fontWeight: 600,
    },
    dialogActionsStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 20,
        marginTop: 24,
        height: '3em',
    },
    iconButton: {
        borderColor: colors.primary, 
        padding: '6px 24px',
    },
    buttonIcon: {
        color: colors.primary,
        fontSize: 18,
    }
})