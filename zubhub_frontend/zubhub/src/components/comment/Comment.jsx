import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ReplyIcon from '@material-ui/icons/Reply';
import { Avatar, Box, Typography } from '@material-ui/core';

import CustomButton from '../../components/button/Button';
import CommentInput from '../../components/comment_input/CommentInput';
import dFormatter from '../../assets/js/dFormatter';
import nFormatter from '../../assets/js/nFormatter';
import countComments from '../../assets/js/countComments';
import styles from '../../assets/js/styles/components/comment/commentStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const toggleRepliesCollapsed = (e, { repliesCollapsed }) => {
  e.preventDefault();
  return { repliesCollapsed: !repliesCollapsed };
};

const toggleReplyInputCollapsed = (e, { replyInputCollapsed }) => {
  e.preventDefault();
  return { replyInputCollapsed: !replyInputCollapsed };
};

function Comment(props) {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    replyDepth: props.replyDepth !== undefined ? props.replyDepth + 1 : 0,
    replyInputCollapsed: false,
    repliesCollapsed: false,
  });

  React.useEffect(() => {
    handleSetState({
      repliesCollapsed: state.replyDepth === 0 ? true : false,
    });
  }, [state.replyDepth]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { repliesCollapsed, replyInputCollapsed, replyDepth } = state;
  const { t, comment, parent } = props;

  return (
    <Box className={!parent ? classes.commentsStyle : classes.subCommentsStyle}>
      <Box className={commonClasses.positionRelative}>
        <Link
          className={clsx(
            commonClasses.textDecorationNone,
            !parent ? classes.commentMetaStyle : classes.subCommentMetaStyle,
          )}
          to={`/creators/${props.auth.username}`}
        >
          <Avatar
            className={
              !parent
                ? classes.commentAvatarStyle
                : classes.subCommentAvatarStyle
            }
            src={comment.creator.avatar}
            alt={comment.creator.username}
          />
          <Box>
            <Typography color="textPrimary" className={clsx('comment-creator')}>
              {comment.creator.username}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className={clsx('comment-created-on')}
            >
              {`${dFormatter(comment.created_on).value} ${t(
                `date.${dFormatter(comment.created_on).key}`,
              )} ${t('date.ago')}`}{' '}
            </Typography>
          </Box>
        </Link>
      </Box>
      <Box className={classes.commentTextSectionStyle}>
        <Typography
          className={
            !parent ? classes.commentTextStyle : classes.subCommentTextStyle
          }
          dangerouslySetInnerHTML={{ __html: comment.text }}
        ></Typography>

        {Array.isArray(comment.replies) &&
        comment.replies.length > 0 &&
        replyDepth < 3 ? (
          <CustomButton
            className={
              !parent
                ? classes.showRepliesButtonStyle
                : classes.subShowRepliesButtonStyle
            }
            endIcon={
              repliesCollapsed ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
            }
            onClick={e => handleSetState(toggleRepliesCollapsed(e, state))}
          >
            {!repliesCollapsed
              ? t('comments.showReplies')
              : t('comments.hideReplies')}
            {` ( ${nFormatter(countComments(comment.replies))} )`}
          </CustomButton>
        ) : null}

        {replyDepth < 3 ? (
          <CustomButton
            className={
              !parent
                ? classes.showRepliesButtonStyle
                : classes.subShowRepliesButtonStyle
            }
            endIcon={<ReplyIcon />}
            onClick={e => handleSetState(toggleReplyInputCollapsed(e, state))}
          >
            {t('comments.reply')}
          </CustomButton>
        ) : null}

        <Box className={classes.commentReplyStyle}>
          <a
            href="#"
            className={classes.commentThreadLineStyle}
            aria-hidden="true"
          ></a>
          {replyInputCollapsed ? (
            <CommentInput parent_id={comment.id} {...props} />
          ) : null}
          {Array.isArray(comment.replies) &&
            comment.replies.length > 0 &&
            repliesCollapsed &&
            comment.replies.map(comment => (
              <Comment
                {...props}
                key={comment.id}
                auth={props.auth}
                t={t}
                comment={comment}
                parent={comment.id}
                replyDepth={replyDepth}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
}

Comment.propTypes = {
  auth: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
};

export default Comment;
