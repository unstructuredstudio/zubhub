import { colors } from "../../assets/js/colors"

export const modalStyles = theme => ({
    dialogTitle: {
        fontSize: '18px !important',
        lineHeight: '26px !important',
        marginTop: 0
    },
    sucessDialogHeadericon: {
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
        }
    },
})