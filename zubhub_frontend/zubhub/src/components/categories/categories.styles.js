import { categoryColors } from "../../assets/js/colors"

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
    border: `1px solid ${categoryColors.border}`,
    borderRadius: '10em',
  },
});