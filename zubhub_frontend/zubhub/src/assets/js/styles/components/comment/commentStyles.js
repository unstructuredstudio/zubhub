const styles = theme => ({
  commentsStyle: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1em',
    backgroundColor: 'white',
    maxWidth: '1000px',
    width: '100%',
    fontSize: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 1px 4px rgba(0,0,0,.06)',
    border: '1px solid rgba(0,0,0,.1)',
    margin: '0.8em',
  },
  commentMetaStyle: {
    display: 'flex',
    marginBottom: '1em',
  },
  commentAvatarStyle: {
    backgroundColor: '#c4c4c4',
    marginRight: '1em',
  },
  commentMenuButtonStyle: {
    top: 0,
    right: 0,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    minWidth: 0,
  },
});

export default styles;
