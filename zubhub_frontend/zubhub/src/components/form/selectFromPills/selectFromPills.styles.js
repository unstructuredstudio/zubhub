export const selectFromPillsStyles = theme => ({
  pillContainer: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // gap: 10,
    // justifyContent: 'space-between',
    marginTop: 20,
  },
  pill: {
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px 8px 8px',
    gap: '6px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
});
