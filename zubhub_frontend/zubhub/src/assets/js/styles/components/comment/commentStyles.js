const styles = theme => ({
  commentsStyle: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1em',
    backgroundColor: 'white',
    maxWidth: '1000px',
    width: '100%',
    borderRadius: '15px',
    boxShadow: '0 1px 4px rgba(0,0,0,.06)',
    border: '1px solid rgba(0,0,0,.1)',
    margin: '0.8em',
    wordBreak: 'break-word',
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
  subCommentsStyle: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1em',
    backgroundColor: 'white',
    maxWidth: '1000px',
    width: '100%',
    borderRadius: '15px',
    boxShadow: '0 1px 4px rgba(0,0,0,0)',
    border: '1px solid rgba(0,0,0,0)',
    margin: '0.2em',
    wordBreak: 'break-word',
  },
  commentMetaStyle: {
    display: 'flex',
    marginBottom: '1em',
  },
  subCommentMetaStyle: {
    display: 'flex',
    // marginBottom: '0.2em',
    '& .comment-creator': {
      fontSize: '0.8rem',
    },
    '& .comment-created-on': {
      fontSize: '0.7rem',
    },
  },
  commentAvatarStyle: {
    backgroundColor: '#c4c4c4',
    marginRight: '1em',
  },
  subCommentAvatarStyle: {
    backgroundColor: '#c4c4c4',
    marginRight: '0.5em',
    height: '35px',
    width: '35px',
    border: '3px solid white',
    zIndex: 2,
  },
  commentTextSectionStyle: {
    // display: "flex",
  },
  commentThreadLineStyle: {
    backgroundColor: '#00B8C4',
    width: '3px',
    height: '100%',
    marginRight: '2em',
    position: 'absolute',
    left: '2.3em',
    zIndex: 1,
  },
  showRepliesButtonStyle: {
    marginTop: '0.5em',
    color: '#00B8C4',
    borderRadius: '50px',
    '&:hover': {
      color: '#03848C',
    },
  },

  subShowRepliesButtonStyle: {
    marginTop: '0.3em',
    marginLeft: '1.5em',
    color: '#00B8C4',
    borderRadius: '50px',
    '&:hover': {
      color: '#03848C',
    },
  },
  commentReplyStyle: {
    position: 'relative',
    // height:"5em"
  },
  // commentTextBoxStyle: {
  //     marginTop: "1em",
  // },
  commentTextStyle: {
    fontSize: '1.5rem',
    //   marginLeft: "40px",
  },
  subCommentTextStyle: {
    fontSize: '1.2rem',
    marginLeft: '40px',
  },

  replyCommentFormStyle: {
    height: '2.5em',
    width: '100%',
    paddingLeft: '3em',
    '& .MuiFormControl-root': {
      width: '100%',
    },

    '& .reply-comment-form-input': {
      height: '2.5em',
      position: 'absolute',
      top: '-0.3em',
      width: '100%',
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'black',
      borderRadius: '50px',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.8)',
      },
      '&.MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgb(0, 184, 196)',
      },
      '&.MuiOutlinedInput-root': {
        '& fieldset': {
          border: '1px solid rgb(0, 184, 196)',
        },
        '&:hover fieldset': {
          border: '2px solid rgb(0, 184, 196)',
        },
        '&.Mui-focused fieldset': {
          border: '2px solid rgb(0, 184, 196)',
        },
      },
    },
  },
  replyCommentFormLabelStyle: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute!important',
    width: '1px',
  },

  replyCommentFormSubmitStyle: {
    padding: 0,
    color: 'black',
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
