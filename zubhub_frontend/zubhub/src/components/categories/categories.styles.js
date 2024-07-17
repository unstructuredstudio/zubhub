import { colors } from '../../assets/js/colors';

// eslint-disable-next-line no-unused-vars
export const styles = theme => ({
  container: {
    border: '2px olid red',
    margin: '12px 0',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '8px',
  },
  chip: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.9em',
    border: `1px solid ${colors.border}`,
    borderRadius: '10em',
  },
});
