import { colors } from "../../assets/js/colors";
import clsx from 'clsx';
import commonClasses from '../../assets/js/styles/index'
export const navbarStyle = theme => ({
    root: {
        backgroundColor: colors.primary,
        '&.MuiPaper-elevation4': {
            boxShadow: 'unset'
        },
        zIndex: 2
    },
    box: {
        backgroundColor: colors.secondary,
        padding: '15px 0px',
    },
    container: {
        display: 'flex',
        gap: 20,
        alignItems: 'center'
    },
    logo: {
        height: 30,
        '&:hover': {
            cursor: 'pointer'
        },
        [theme.breakpoints.down('sm')]: {
            height: 18
        },
        [theme.breakpoints.up('md')]: {
            marginRight: 'auto',
        },
    },
    input: {
        borderRadius: 50,
        border: `solid 1.5px ${colors.white}`,
        minWidth: 300,
        width: '40%',
        // height: 35,
        padding: '0px 30px',
        // outline: `solid 1px ${colors.light}`,
        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'yellow !important'
        },
        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'tranparent'
        },
        '& .MuiOutlinedInput-input': {
            padding: '10px 14px',
            color: colors.white,
            fontSize: 16,
            fontWeight: '600'
        }
    },
    languageContainerStyle: {
        paddingLeft: '0.7em',
        color: 'white',
        width: 'auto',
        backgroundColor: '#d13241',
        borderRadius: '50px',
        [theme.breakpoints.down('282')]: {
            marginLeft: '0.3em',
        },
        [theme.breakpoints.down('md')]: {
            marginRight: 'auto',
        },
        [theme.breakpoints.up('md')]: {
            marginRight: 0,
        },
        '&:hover': {
            backgroundColor: '#c7313f',
        },
    }
    ,
    languageSelectStyle: {
        '&:hover': {
            backgroundColor: '#c7313f',
        },
        display: 'inline-block',
        maxWidth: '5em',
        color: 'white',
        '&.MuiInput-underline:before': {
            display: 'none !important',
        },
        '&.MuiInput-underline:after': {
            display: 'none !important',
        },
        '& .MuiSelect-icon': {
            color: 'white',
        },
        '& .MuiSelect-root': {
            boxSizing: 'border-box',
            backgroundColor: 'rgba(0,0,0,0)',
        },
    },
    notification: {
        backgroundColor: colors["primary-01"],
    },
    username: {
        color: `${colors.white} !important`,
        marginBottom: `${0} !important`,
        textTransform: 'capitalize'
    },
    menuDropdown: {
        // width: 'max-content !important',
        padding: '10px 20px'
    }

}) 