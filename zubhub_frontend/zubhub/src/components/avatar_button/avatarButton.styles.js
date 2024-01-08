import { colors } from '../../assets/js/colors';

export const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 250,
    color: colors.black,
    textAlign: 'center',
    alignItems: 'center',
    gap: 15,
    [theme.breakpoints.up('600')]: {
      maxHeight: '450px',
    },
    overflowY: 'auto',
    [theme.breakpoints.down('600')]: {
      height: '86%',
    },
  },
  avatarIconStyle:{
    backgroundColor: 'white'
  }
});
