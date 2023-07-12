import { colors } from "../../assets/js/colors";

export const sidenavStyle = theme => ({
    container: {
        backgroundColor: 'white',
        height: '80vh',
        borderRadius: 12,
        [theme.breakpoints.down('sm')]: {
            height: '100%',
        },
    },
    label: {
        margin: '5px 0',
        '& span': {
            fontSize: '15px !important',
            fontWeight: '500',
            color: colors.black,
        },
        '& :hover': {
            backgroundColor: colors["primary-01"],
            cursor: 'pointer'
        }
    },
    logo: {
        marginBottom: 30,
        '& img': {
            height: 20,
            [theme.breakpoints.down('sm')]: {
                height: 18
            },
            [theme.breakpoints.up('md')]: {
                marginRight: 'auto',
            },
        }
    },

    active: {
        '& li': {
            backgroundColor: colors["primary-01"]
        }
    },
    red: {
        '& li *': {
            color: colors.secondary + ' !important'
        }
    },
    listContainer: { display: 'flex', flexDirection: 'column', height: '100%' }
})