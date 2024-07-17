import { colors } from '../../assets/js/colors';

export const activityDefailsStyles = theme => ({
  container: {
    margin: '2em 24px',
    [theme.breakpoints.down('378')]: {
      marginTop: '3em 24px',
    },
    // borderRadius: 8,
    // backgroundColor: colors.white,
    // padding: 24
  },
  descriptionBodyStyle: {
    marginBottom: '0.7em',
    color: 'rgba(0, 0, 0, 0.54)',
    '& .ql-editor': {
      fontSize: '1.01rem',
      fontFamily: 'Raleway,Roboto,sans-serif',
      padding: '4px 0',
      lineHeight: 1.9,
    },
  },
  socialButtons: {
    backgroundColor: colors.primary,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '16px 0',
    borderRadius: 8,
  },
  moreTextTitle: {
    marginTop: 50,
    marginBottom: 30,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
  },
  card: {
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 24,
  },
  creatorProfileStyle: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
    '& a': {
      display: 'flex',
      alignItems: 'center',
    },
    [theme.breakpoints.down('500')]: {
      width: '100%',
      // justifyContent: 'space-between',
    },
  },
  actionBoxButtonStyle: {
    color: 'white',
    '& MuiFab-root:hover': {
      color: '#F2F2F2',
    },
    '& svg': {
      fill: 'white',
    },
    '& svg:hover': {
      fill: '#F2F2F2',
    },
  },
  closed: {
    height: 0,
    transition: '0.4s',
    overflow: 'hidden',
  },
  expandableMargin: {
    // marginBottom: 10,
    marginTop: 30,
  },
  expanded: {
    transition: '0.4s',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    marginTop: 20,
  },
  dialogCloseButton: {
    display: 'flex',
    justifyContent: 'end',
    marginTop: '-1em',
  },
  dialogTitle: {
    fontWeight: 600,
    fontSize: '1em',
  },
  dialogText: {
    fontSize: '1.1em',
  },
});
