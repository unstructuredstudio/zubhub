const styles = theme => ({
  descriptionHeadingStyle: {
    marginTop: '1em',
    fontWeight: 900,
    fontSize: '2.2rem',
  },

  commentSectionStyle: {
    maxWidth: '1000px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2.5em',
    marginBottom: '2.5em',
    borderRadius: '15px',
    backgroundColor: 'var(--text-color3)',
  },
  commentAvatarStyle: {
    backgroundColor: 'var(--text-color3)',
    marginRight: '1em',
  },

  creatorSuggestionBoxStyle: {
    position: 'absolute',
    padding: '1em',
    width: '100%',
    maxWidth: '300px',
    height: '10em',
    overflowY: 'scroll',
    top: '-10em',
    left: 0,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    boxShadow: '0 0px 5px 4px rgba(0, 0, 0, .12)',
  },
  creatorSuggestionStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5em 0',
    borderTop: '1px solid #d7d7d7',
  },
  creatorSuggestionLoadingStyle: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
