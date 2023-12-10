import { colors } from '../../../assets/js/colors';

export const dropdownStyle = theme => ({
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    border: `solid 1.5px ${colors.light}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeRadio: {
    border: `solid 1px ${colors.primary}`,
    '& div': {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
  },
});
