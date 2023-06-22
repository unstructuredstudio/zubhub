import { colors } from "../../assets/js/colors";

export const sidenavStyle = theme => ({
    container: {
        backgroundColor: 'white',
        height: '100%',
        borderRadius: 12
    },
    label: {
        backgroundColor: colors["primary-01"],
        '& span': {
            fontSize: '16px !important',
            fontWeight: '500',
            color: colors.black,
        },
        '& :hover': {
            backgroundColor: colors["primary-01"]
        }
    },
    active: {
        '& li': {
            backgroundColor: colors["primary-01"]
        }
    }
})