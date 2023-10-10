import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import { Avatar, Box, Typography, ClickAwayListener, CircularProgress } from '@mui/material';

import {
  timer,
  constructCommentBox,
  handleCommentTextFocus,
  handleDocumentClick,
  handleAddComment,
  handleSuggestCreators,
  handleInsertCreatorName,
} from './commentInputScripts';

import CustomButton from '../../components/button/Button';

import styles from '../../assets/js/styles/components/comments/commentsStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function CommentInput Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function CommentInput(props) {
  const refs = {
    comment_text: React.useRef(null),
    comment_box: React.useRef(null),
    comment_author_name: React.useRef(null),
    comment_publish_button: React.useRef(null),
  };
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    creator_suggestion: [],
    creator_suggestion_open: false,
  });

  const [isTextAreaMounted, setIsTextAreaMounted] = React.useState(false);

  React.useEffect(() => {
    const comment_text_el = refs.comment_text.current;
    comment_text_el && setIsTextAreaMounted(true);

    return () => {
      try {
        comment_text_el.removeEventListener('focus', () => handleCommentTextFocus(refs));
      } catch {}

      try {
        document.removeEventListener('click', e => handleDocumentClick(e, refs));
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
    <Box className={clsx('comment-box comment-collapsed', parent_id ? 'sub-comment-box' : null)} ref={refs.comment_box}>
      <Box className="comment-meta">
        <Link className={clsx(common_classes.textDecorationNone)} to={`/creators/${props.auth.username}`}>
          {props.auth.token ? (
            <Avatar className={classes.commentAvatarStyle} src={props.auth.avatar} alt={props.auth.username} />
          ) : null}
        </Link>
        <Link
          ref={refs.comment_author_name}
          className={clsx(common_classes.textDecorationNone, 'comment-meta__a', 'display-none')}
          to={`/creators/${props.auth.username}`}
        >
          {props.auth.username}
        </Link>
      </Box>
      <form className="comment-form">
        <textarea
          ref={refs.comment_text}
          className={!parent_id ? 'comment-text' : 'comment-text sub-comment-text'}
          name="comment"
          id="comment"
          autoComplete="off"
          placeholder={`${t('comments.write')} ...`}
          onChange={e => {
            handleSuggestCreators(e, props, timer, handleSetState);
          }}
        ></textarea>
        <CustomButton
          ref={refs.comment_publish_button}
          onClick={e =>
            isTextAreaMounted && refs.comment_text.current?.value?.length > 0
              ? handleAddComment(e, props, refs.comment_text)
              : null
          }
          className={clsx('comment-publish-button', {
            'no-button-click': isTextAreaMounted && refs.comment_text.current?.value?.length == 0,
          })}
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
            !creator_suggestion_open ? common_classes.displayNone : null,
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
                  handleInsertCreatorName(`@${creator.username}`, refs.comment_text);
                }}
              >
                <Avatar className={classes.commentAvatarStyle} src={creator.avatar} alt={creator.username} />
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
  suggestCreators: PropTypes.func.isRequired,
};

export default CommentInput;
