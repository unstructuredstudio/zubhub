import { colors } from "../../../assets/js/colors";

export const videoInputStyles = theme => ({
    container: {
        border: 'dashed 1px #D9DEE2',
        borderWidth: 4,
        borderRadius: 4,
        padding: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 10,
        cursor: 'pointer',
    },
    input: {
        visibility: 'hidden'
    },
    previewBox: {
        width: '100%',
        height: 90,
        borderRadius: 4.5,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative'
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    clearIcon: {
        backgroundColor: colors.white,
        height: 18,
        width: 18,
        borderRadius: 10,
        padding: 4,
        position: 'absolute',
        right: 6,
        top: 6,
        fontSize: 10,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    previewContainer: { display: 'flex', gap: 12, marginTop: 20 }
})