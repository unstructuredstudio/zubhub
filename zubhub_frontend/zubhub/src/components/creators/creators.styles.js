// eslint-disable-next-line no-unused-vars
export const creatorsStyles = theme => ({
  creatorBox: {
    margin: '15px 0 0.5em 0',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: '15px',
    overflow: 'hidden',
  },
  twoCreatorBox: {
    minWidth: '4em',
    transition: '0.4s',
    display: 'grid',
    gridTemplateColumns: '1.5em 1.5em',
    '&:hover': {
      gridTemplateColumns: '3.2em 3.2em',
    },
  },
  multipleCreatorBox: {
    minWidth: '5.5em',
    transition: '0.4s',
    display: 'grid',
    gridTemplateColumns: '1.5em 1.5em 1.5em',
    '&:hover': {
      gridTemplateColumns: '3.2em 3.2em 3.2em',
    },
  },
  creatorAvatar: {
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    background: 'white',
    color: 'black',
  },
  creatorUsernameTooltip: {
    marginRight: 'auto',
    fontWeight: '400',
  },
  creatorUsername: {
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontWeight: '600',
    fontSize: '1.1em',
  },
  creatorTag: {
    fontWeight: '500',
    fontSize: '0.9rem',
  },
});
