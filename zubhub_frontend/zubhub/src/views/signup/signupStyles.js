export const mainStyles = theme => ({
  wrapper: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('lg')]: {
      marginTop: theme.spacing(10),
    },
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(5),
    },
  },
  gridContainer: {
    alignItems: 'center',
    borderRadius: theme.spacing(1),
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
    color: theme.palette.text.primary,
    fontSize: theme.spacing(3),
    fontWeight: 800,
    lineHeight: 'normal',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      fontWeight: 700,
    },
  },
  text: {
    fontSize: theme.spacing(2),
    fontWeight: 400,
    lineHeight: '32px',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      lineHeight: 'unset',
    },
  },
  header2: {
    color: theme.palette.text.primary,
    fontSize: '30px',
    fontWeight: 700,
    lineHeight: '50px',
  },
  subHeader2: {
    color: theme.palette.text.primary,
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '24px',
  },
  text2: {},
  wizard: {
    width: '100%',
  },
  outlinedInput: {
    borderRadius: theme.spacing(1),
    paddingInline: theme.spacing(3),
    gap: theme.spacing(3),
    '& .MuiOutlinedInput-input': {
      padding: '20px 0',
    },
    '&.MuiOutlinedInput-root': {
      '&:hover fieldset': {
        border: `1px solid ${theme.palette.primary.light}`,
      },
      '&.Mui-focused fieldset': {
        border: `2px solid ${theme.palette.primary.light}`,
      },
    },
  },
  formControl: {
    gap: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      gap: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1),
    },
  },
  inputIcon: {
    fontSize: theme.spacing(3),
    fill: theme.palette.grey[400],
  },
  button: {
    fontSize: '18px',
    fontWeight: 600,
    paddingBlock: '20px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      padding: '5px 16px',
    },
  },
  spaceBackground: {
    width: '100%',
    height: '100%',
  },
  backContainer: {
    borderRadius: '50%',
    background: theme.palette.background.default,
    padding: '10px',
  },
  backIcon: {
    fontSize: theme.spacing(3),
  },
  gridControl: {
    background: theme.palette.background.default,
    padding: '0 40px',
    boxShadow: '2px 4px 5px 0px rgba(0, 184, 196, 0.05)',
  },
});

export const step1Styles = theme => ({
  paper: {
    cursor: 'pointer',
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
    '&.selected': {
      border: '3px solid var(--primary-color3)',
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
});

export const step2Styles = theme => ({
  container: {
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(8, 5),
    boxShadow: '2px 4px 5px 0px rgba(0, 184, 196, 0.05)',
  },
});

export const step3Styles = theme => ({});

export const step4Styles = theme => ({});
export const step5Styles = theme => ({
  label: {
    gap: theme.spacing(3),
  },
  formControl: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(5),
    alignItems: 'left',
  },
  fieldSet: {
    padding: `20px ${theme.spacing(3)}`,
    borderWidth: '1px',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid',
    borderRadius: theme.spacing(1),
    '&:hover': {
      borderColor: theme.palette.primary.light,
    },
    '&.selected': {
      borderWidth: '3px',
      borderColor: theme.palette.primary.light,
    },
  },
});
