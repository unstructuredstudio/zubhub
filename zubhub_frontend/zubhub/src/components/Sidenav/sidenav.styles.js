import { colors } from "../../assets/js/colors";

export const sidenavStyle = theme => ({
    container: {
        backgroundColor: 'white',
        height: '80vh',
        borderRadius: 12,

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
    listContainer: { display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 50 }
})