import { colors } from "../../../assets/js/colors";

export const editorStyle = theme => ({
    editor: {
        '& .ql-toolbar': {
            display: 'none'
        },
        height: 200,
        fontSize: 20
    },
    editorTooltip: ({ position: { left, top, width } }) => ({
        display: 'flex',
        border: 'solid 1px #ccc',
        position: 'absolute',
        top: top - 50,
        left: width / 2 + left,
        borderRadius: 10,
        padding: '2px 20px',
        // gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    }),
    tooltipItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px',
        borderRadius: 6,
        '&:hover': {
            backgroundColor: '#eee',
            cursor: 'pointer'
        }
    }
})