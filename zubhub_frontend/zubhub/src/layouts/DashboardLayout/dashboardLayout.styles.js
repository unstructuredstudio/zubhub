export const dashboardLayoutStyles = theme => ({
    root: {
        minHeight: '97vh',
        justifyContent: 'center',
        margin: '40px 0',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginTop: 0,
        },
        [theme.breakpoints.up('md')]: {
            margin: '40px 0',
            padding: `0 ${theme.spacing(4)}px`,
        },
    },
    body: ({ height }) => ({
        [theme.breakpoints.up('md')]: {
            paddingLeft: theme.spacing(4),
        },

        [theme.breakpoints.down('sm')]: {
            // paddingLeft: theme.spacing(4),
            paddingTop: height,
        },

    }),
});