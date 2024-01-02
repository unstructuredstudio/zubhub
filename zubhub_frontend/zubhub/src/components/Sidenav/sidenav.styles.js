import { colors } from "../../assets/js/colors";

export const sidenavStyle = theme => ({
    container: {
        backgroundColor: 'white',
        minHeight: '80vh',
        display: 'flex',
        borderRadius: 8,

        [theme.breakpoints.down('sm')]: {
            height: '100%',
        },
        [theme.breakpoints.up('md')]: {
            // position: 'fixed',
            // width: `calc(100vw / 12 * 3 - (${theme.spacing(4)}px * 2))`,
        },
        [theme.breakpoints.up('lg')]: {
            // width: `calc(100vw / 12 * 3 - (${theme.spacing(4)}px))`,
        },

        boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
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
    link: {
        textDecoration: 'none', padding: '0 30px',
    },
    listContainer: { display: 'flex', flex: 1, flexDirection: 'column', paddingTop: 30 },
    customNumberTag: {
        backgroundColor: colors.primary,
        color: 'white',
        borderRadius: 40,
        padding: '0 5px',
        fontSize: 12,
        marginLeft: 30,
        alignSelf: 'right',
        border: 'none',
        height: 20,
        minWidth: 30,
        '& span': {
            color: 'white',
            fontSize: 12,
            fontWeight: '300',
        },
        '&:hover': {
            backgroundColor: colors.primary,
        },
    },
})