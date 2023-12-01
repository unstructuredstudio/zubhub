import { colors } from '../../assets/js/colors';

export const collapsibleStyles = theme => ({
  card: {
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 24,
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
    gap: '32px',
    marginTop: 20,
  },
});
