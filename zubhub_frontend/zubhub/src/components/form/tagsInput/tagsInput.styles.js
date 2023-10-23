import { colors } from "../../../assets/js/colors";

export const tagsInputStyles = theme => ({
    container: {

    },
    tagsContainer: {
        border: 'solid 1px #C4C4C4',
        display: 'flex',
        flexWrap: 'wrap',
        padding: '8px 14px',
        minHeight: 50,
        borderRadius: 4,
        gap: 12
    },
    button: {
        borderRadius: 4,
        // marginRight: 12
    },
    disabledButton: {
        borderColor: colors.light
        // marginRight: 12
    },
    input: {
        flex: 1,
        border: 'none',
        outline: 'none',
    },
    suggestionBox: {
        position: 'absolute',
        padding: 20,
        width: '100%',
        minHeight: 100,
        backgroundColor: colors.white,
        zIndex: 12,
        border: 'solid 1px #ccc',
        borderRadius: 4
    },
    suggestion: {
        backgroundColor: '#eee',
        margin: '5px 0',
        padding: '5px 10px',
        borderRadius: 4,
        cursor: 'pointer'
    },
    tagsContainer: {
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 12, 
        marginTop: 12
    },
    generalTag: {
        fontWeight: '800',
    },
    
})