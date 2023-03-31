import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ReplyIcon from '@material-ui/icons/Reply';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Avatar, Box, Typography, Menu, MenuItem } from '@material-ui/core';

import CustomButton from '../../components/button/Button';
import CommentInput from '../../components/comment_input/CommentInput';
import {
  countComments,
  nFormatter,
  dFormatter,
} from '../../assets/js/utils/scripts';

import {
  toggleRepliesCollapsed,
  toggleReplyInputCollapsed,
  handleCommentMenuOpen,
  handleCommentMenuClose,
} from './commentScripts';

import styles from '../../assets/js/styles/components/comment/commentStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function Comment Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function Comment(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    reply_depth: props.reply_depth !== undefined ? props.reply_depth + 1 : 0,
    reply_input_collapsed: false,
    replies_collapsed: false,
    comment_menu_anchor_el: null,
  });

  React.useEffect(() => {
    handleSetState({
      replies_collapsed: state.reply_depth === 0 ? true : false,
    });
  }, [state.reply_depth]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    replies_collapsed,
    reply_input_collapsed,
    reply_depth,
    comment_menu_anchor_el,
  } = state;
  const {
    auth,
    t,
    comment,
    parent,
    handleUnpublishComment,
    handleToggleDeleteCommentModal,
  } = props;
  const commentMenuOpen = Boolean(comment_menu_anchor_el);

  return (
    <Box className={!parent ? classes.commentsStyle : classes.subCommentsStyle}>
      <Box className={common_classes.positionRelative}>
        <Link
          className={clsx(
            common_classes.textDecorationNone,
            !parent ? classes.commentMetaStyle : classes.subCommentMetaStyle,
          )}
          to={`/creators/${comment.creator.username}`}
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
        {auth.tags.includes('staff') || auth.tags.includes('moderator') ? (
          <>
            <CustomButton
              className={clsx(
                common_classes.positionAbsolute,
                classes.commentMenuButtonStyle,
              )}
              onClick={e => handleSetState(handleCommentMenuOpen(e))}
            >
              <MoreVertIcon />
            </CustomButton>
            <Menu
              disableScrollLock = {true}
              className={classes.commentMenuStyle}
              id="comment_menu"
              anchorEl={comment_menu_anchor_el}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={commentMenuOpen}
              onClose={e => handleSetState(handleCommentMenuClose(e))}
            >
              <MenuItem>
                <Typography
                  variant="subtitle2"
                  component="span"
                  onClick={() => handleUnpublishComment(comment.id)}
                >
                  {t('comments.unpublish')}
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography
                  variant="subtitle2"
                  className={common_classes.colorRed}
                  component="span"
                  onClick={() => handleToggleDeleteCommentModal(comment.id)}
                >
                  {t('comments.delete')}
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : null}
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
        reply_depth < 3 ? (
          <CustomButton
            className={
              !parent
                ? classes.showRepliesButtonStyle
                : classes.subShowRepliesButtonStyle
            }
            endIcon={
              replies_collapsed ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
            }
            onClick={e => handleSetState(toggleRepliesCollapsed(e, state))}
          >
            {!replies_collapsed
              ? t('comments.showReplies')
              : t('comments.hideReplies')}
            {` ( ${nFormatter(countComments(comment.replies))} )`}
          </CustomButton>
        ) : null}

        {reply_depth < 3 ? (
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
          {reply_input_collapsed ? (
            <CommentInput parent_id={comment.id} {...props} />
          ) : null}
          {Array.isArray(comment.replies) &&
            comment.replies.length > 0 &&
            replies_collapsed &&
            comment.replies.map(comment => (
              <Comment
                {...props}
                key={comment.id}
                auth={props.auth}
                t={t}
                comment={comment}
                parent={comment.id}
                reply_depth={reply_depth}
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
  handleUnpublishComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
};

export default Comment;
