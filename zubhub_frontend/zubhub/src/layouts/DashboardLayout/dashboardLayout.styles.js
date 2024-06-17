export const dashboardLayoutStyles = theme => ({
  root: {
    minHeight: '97vh',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
    },
    [theme.breakpoints.up('md')]: {
      padding: `0 ${theme.spacing(4)}px`,
    },
  },
  body: () => ({
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
    },
  }),
});
