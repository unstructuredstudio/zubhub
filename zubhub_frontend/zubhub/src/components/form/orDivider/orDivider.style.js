import { colors } from '../../../assets/js/colors';

export const orDividerStyle = theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    '&>p': {
      position: 'absolute',
      marginTop: -10,
      backgroundColor: colors.white,
      padding: 5,
    },
    '&>hr': {
      width: '100%',
      border: 'none',
      backgroundColor: colors.light,
      height: 0.5,
    },
  },
});
