import { colors } from '../../assets/js/colors';

export const createActivityStyles = theme => ({
  container: {
    color: colors.gray,
    marginTop: '2em',
    marginBottom: '2em',
    [theme.breakpoints.down('378')]: {
      marginTop: '3em',
      marginBottom: '3em',
    },
  },
  banner: ({ height }) => ({
    backgroundColor: colors.white,
    padding: '15px',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      position: 'fixed',
      top: height,
      zIndex: 2,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10)',
      // width: '100%'
    },
  }),
  previewButton: {
    borderRadius: 20,
  },
  draft: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    color: colors.gray,
  },
  savedToDraft: {
    color: colors.green,
  },
  linkToDraft: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  modeItemContainer: {
    display: 'flex',
    gap: 20,
    marginTop: 40,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  modeItemSelected: {
    border: `solid 1.5px ${colors.primary} !important`,
  },
  modeItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: '16px 24px',
    border: `solid 1.5px transparent`,
    width: '50%',
    '&:hover': {
      border: `solid 1.5px ${colors.primary}`,
      cursor: 'pointer',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  dialogTitle1: {
    fontSize: '18px !important',
    lineHeight: '26px !important',
    marginBottom: 0,
    color: `${colors['tertiary-dark']} !important`,
    marginTop: 40,
  },
  modeItemTitle: {
    fontSize: '18px !important',
    // lineHeight: '26px !important',
    marginBottom: 5,
    marginTop: 10,
  },
  formContainer: {
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: '64px',
    marginTop: 24,
    overflow: 'hidden',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
    [theme.breakpoints.down('sm')]: {
      margin: '24px',
      marginTop: 24 * 4,
    },
    [theme.breakpoints.down('xs')]: {
      margin: '18px',
      marginTop: 24 * 2,
      padding: '32px',
    },
  },
  selectMode: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: '64px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    color: colors.black,
    [theme.breakpoints.down('sm')]: {
      // margin: '24px',
    },
    [theme.breakpoints.down('xs')]: {
      // margin: '18px',
      padding: '32px',
    },
  },
  stepperLine: {
    height: 2,
    width: 'calc(100% / 2)',
    backgroundColor: colors['primary-01'],
    position: 'relative',
    marginTop: 42,
    display: 'flex',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  stepLabel: {
    marginTop: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepBall: {
    height: 30,
    width: 30,
    borderRadius: 25,
    backgroundColor: 'inherit',
    position: 'absolute',
    marginTop: -15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '600',
  },
  stepperContainer: {
    display: 'flex',
    marginBottom: 50,
  },
  activeLabel: {
    color: colors.primary,
  },
  nextButton: { color: 'inherit', fontSize: 14 },
  previousButton: { color: 'inherit', fontSize: 14 },
  buttonGroup: {
    display: 'flex',
    marginTop: 40,
  },
});
