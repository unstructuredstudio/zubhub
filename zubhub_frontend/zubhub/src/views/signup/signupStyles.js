export const mainGridStyles = theme => ({
  wrapper: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('lg')]: {
      marginTop: theme.spacing(10),
    },
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(5),
    },
  },
  wizard: {
    width: '100%',
  },
});

export const step1Styles = theme => ({
  gridContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: theme.palette.text.primary,
    fontSize: theme.spacing(5),
    fontWeight: 800,
    lineHeight: '50px',
    [theme.breakpoints.down('sm')]: {
      lineHeight: 'unset',
      fontSize: '20px',
    },
  },
  subHeader: {
    fontSize: theme.spacing(2),
    fontWeight: 400,
    lineHeight: '32px',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      lineHeight: 'unset',
      alignItems: 'unset',
    },
  },
  paper: {
    width: '350px',
    height: '300px',
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 3),
      width: '342px',
      height: '124px',
      alignItems: 'unset',
    },
  },
  icon: {
    fill: '#00B8C4',
    fontSize: '64px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 'unset',
      height: '32px',
      width: '32px',
    },
  },
  button: {
    color: theme.palette.background.default,
    padding: '20px 30px',
    backgroundColor: '#00B8C4',
    borderRadius: '30px',
  },
});
