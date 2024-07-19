import { colors } from '../../assets/js/colors';

export const activityDetailsStyles = theme => ({
  mainContainer: {
    [theme.breakpoints.down('sm')]: {
      margin: '0 24px',
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0 12px',
    },
  },
  signedOutMainContainer: {
    padding: '2em 12em',
    [theme.breakpoints.down('sm')]: {
      padding: '2em 0',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '3em 0',
    },
  },
  card: {
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 24,
    marginBottom: 40,
    [theme.breakpoints.down('xs')]: {
      padding: '24px 16px',
    },
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  headerFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 700,
  },
  headerButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    padding: '0 1.5em',
    height: '2.5em',
    '& .MuiButton-label': {
      gap: '0.5em',
    },
  },
  headerIconBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('400')]: {
      gap: '0.5em',
      fontSize: '0.9em',
    },
  },
  headerIconText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
    fontSize: '1em',
    [theme.breakpoints.down('400')]: {
      '& .MuiSvgIcon-root': {
        fontSize: '1.2em',
      },
    },
  },
  creatorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
  },
  creatorUsername: {
    fontWeight: 500,
    fontSize: 16,
    textTransform: 'capitalize',
    color: colors.black,
  },
  cardTitle: {
    fontSize: '1.2em',
    fontWeight: 600,
  },
  descriptionBodyStyle: {
    '& .ql-editor': {
      fontSize: '1.1em',
      fontFamily: 'Raleway,Roboto,sans-serif',
      lineHeight: 1.9,
      margin: 0,
      padding: 0,
      '& ol': {
        padding: 0,
      },
    },
  },
  classGrade: {
    width: 'fit-content',
    border: `1px solid ${colors.primary}`,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2em',
    textAlign: 'center',
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: 700,
  },
  menuItemIcon: {
    minWidth: '2em',
  },
  dangerButton: {
    color: colors.secondary,
  },
});

export const socialButtonsStyleOverrides = () => ({
  containerStyle: {
    display: 'flex',
  },
  outlined: {
    border: 'none',
  },
});
