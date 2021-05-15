import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Box,
  Typography,
  ClickAwayListener,
  CircularProgress,
} from '@material-ui/core';

import CustomButton from '../../components/button/Button';

import styles from '../../assets/js/styles/components/comments/commentsStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);
const timer = { id: null };

const constructCommentBox = refs => {
  refs.commentText.current.addEventListener('focus', e =>
    handleCommentTextFocus(refs),
  );

  document.addEventListener('click', e => handleDocumentClick(e, refs));
};

const handleCommentTextFocus = refs => {
  refs.commentBox.current.classList.remove('comment-collapsed');
  refs.commentBox.current.classList.add('comment');
  refs.commentAuthorName.current.classList.remove('display-none');
  refs.commentPublishButton.current.classList.remove('display-none');
};

const handleDocumentClick = (e, refs) => {
  try {
    if (
      ![
        refs.commentBox.current,
        refs.commentPublishButton.current,
        refs.commentText.current,
      ].includes(e.target)
    ) {
      refs.commentBox.current.classList.remove('comment');
      refs.commentBox.current.classList.add('comment-collapsed');
      refs.commentAuthorName.current.classList.add('display-none');
      refs.commentPublishButton.current.classList.add('display-none');
    }
  } catch {}
};

const handleAddComment = (e, props, commentText) => {
  e.preventDefault();
  props.handleAddComment(commentText, props.parent_id);
};

const handleSuggestCreators = (e, props, timer, handleSetState) => {
  clearTimeout(timer.id);
  const value = e.currentTarget.value;
  const value_arr = value.split('@');

  if (
    value !== '' &&
    value_arr.length > 1 &&
    value_arr[value_arr.length - 1] !== '' &&
    value_arr[value_arr.length - 1].search(' ') === -1
  ) {
    timer.id = setTimeout(() => {
      suggestCreators(value_arr[value_arr.length - 1], props, handleSetState);
    }, 500);
  } else {
    handleSetState({ creator_suggestion_open: false });
  }
};

const suggestCreators = (query_string, props, handleSetState) => {
  handleSetState({ creator_suggestion_open: true });
  handleSetState(
    props.suggest_creators({ page: null, query_string, t: props.t }),
  );
};

const handleInsertCreatorName = (value, commentTextEl) => {
  const comment_text = commentTextEl.current.value;
  const comment_text_arr = comment_text.split('@');
  const old_value = comment_text_arr[comment_text_arr.length - 1];

  if (
    comment_text !== '' &&
    comment_text_arr.length > 1 &&
    old_value !== '' &&
    old_value.search(' ') === -1
  ) {
    commentTextEl.current.value = comment_text.replace(
      `@${old_value}`,
      `${value} `,
    );
  }
};

function CommentInput(props) {
  const refs = {
    commentText: React.useRef(null),
    commentBox: React.useRef(null),
    commentAuthorName: React.useRef(null),
    commentPublishButton: React.useRef(null),
  };
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    creator_suggestion: [],
    creator_suggestion_open: false,
  });

  React.useEffect(() => {
    const commentTextEl = refs.commentText.current;

    return () => {
      try {
        commentTextEl.removeEventListener('focus', () =>
          handleCommentTextFocus(refs),
        );
      } catch {}

      try {
        document.removeEventListener('click', e =>
          handleDocumentClick(e, refs),
        );
      } catch {}
    };
  }, []);

  React.useEffect(() => {
    try {
      constructCommentBox(refs);
    } catch {}
  }, [props.context.body]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { creator_suggestion, creator_suggestion_open } = state;

  const { parent_id, t } = props;

  return (
    <Box
      className={clsx(
        'comment-box comment-collapsed',
        parent_id ? 'sub-comment-box' : null,
      )}
      ref={refs.commentBox}
    >
      <Box className="comment-meta">
        <Link
          className={clsx(commonClasses.textDecorationNone)}
          to={`/creators/${props.auth.username}`}
        >
          {props.auth.token ? (
            <Avatar
              className={classes.commentAvatarStyle}
              src={props.auth.avatar}
              alt={props.auth.username}
            />
          ) : null}
        </Link>
        <Link
          ref={refs.commentAuthorName}
          className={clsx(
            commonClasses.textDecorationNone,
            'comment-meta__a',
            'display-none',
          )}
          to={`/creators/${props.auth.username}`}
        >
          {props.auth.username}
        </Link>
      </Box>
      <form className="comment-form">
        <textarea
          ref={refs.commentText}
          className={
            !parent_id ? 'comment-text' : 'comment-text sub-comment-text'
          }
          name="comment"
          id="comment"
          autoComplete="off"
          placeholder={`${t('comments.write')} ...`}
          onChange={e => {
            handleSuggestCreators(e, props, timer, handleSetState);
          }}
        ></textarea>
        <CustomButton
          ref={refs.commentPublishButton}
          onClick={e => handleAddComment(e, props, refs.commentText)}
          className={clsx('comment-publish-button', 'display-none')}
          variant="contained"
          size={parent_id ? 'small' : 'medium'}
          primaryButtonStyle
        >
          {t('comments.action')}
        </CustomButton>
      </form>
      <ClickAwayListener
        onClickAway={() =>
          handleSetState({
            creator_suggestion_open: false,
            creator_suggestion: [],
          })
        }
      >
        <Box
          className={clsx(
            classes.creatorSuggestionBoxStyle,
            !creator_suggestion_open ? commonClasses.displayNone : null,
          )}
        >
          {creator_suggestion && creator_suggestion.length > 0 ? (
            creator_suggestion.map((creator, index) => (
              <Box
                className={classes.creatorSuggestionStyle}
                key={index}
                onClick={() => {
                  clearTimeout(timer.id);
                  handleSetState({
                    creator_suggestion: [],
                    creator_suggestion_open: false,
                  });
                  handleInsertCreatorName(
                    `@${creator.username}`,
                    refs.commentText,
                  );
                }}
              >
                <Avatar
                  className={classes.commentAvatarStyle}
                  src={creator.avatar}
                  alt={creator.username}
                />
                <Typography color="textPrimary">{creator.username}</Typography>
              </Box>
            ))
          ) : (
            <Box className={classes.creatorSuggestionLoadingStyle}>
              <CircularProgress size={30} thickness={3} />
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
}

CommentInput.propTypes = {
  auth: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parent_id: PropTypes.string,
  comment: PropTypes.object.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  suggest_creators: PropTypes.func.isRequired,
};

export default CommentInput;
