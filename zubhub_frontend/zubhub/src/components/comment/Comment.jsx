import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Avatar, Box, Typography, Menu, MenuItem } from '@material-ui/core';

import CustomButton from '../../components/button/Button';
import dFormatter from '../../assets/js/dFormatter';
import styles from '../../assets/js/styles/components/comment/commentStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const handleCommentMenuOpen = e => {
  return { commentMenuAnchorEl: e.currentTarget };
};

const handleCommentMenuClose = () => {
  return { commentMenuAnchorEl: null };
};

function Comment(props) {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    commentMenuAnchorEl: null,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { commentMenuAnchorEl } = state;
  const {
    auth,
    t,
    comment,
    handleUnpublishComment,
    handleDeleteComment,
  } = props;
  const commentMenuOpen = Boolean(commentMenuAnchorEl);

  return (
    <Box className={classes.commentsStyle}>
      <Box className={commonClasses.positionRelative}>
        <Link
          className={clsx(
            commonClasses.textDecorationNone,
            classes.commentMetaStyle,
          )}
          to={`/creators/${props.auth.username}`}
        >
          <Avatar
            className={classes.commentAvatarStyle}
            src={comment.creator.avatar}
            alt={comment.creator.username}
          />
          <Box>
            <Typography color="textPrimary">
              {comment.creator.username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {`${dFormatter(comment.created_on).value} ${t(
                `date.${dFormatter(comment.created_on).key}`,
              )} ${t('date.ago')}`}{' '}
            </Typography>
          </Box>
        </Link>

        {auth.role === 'staff' || auth.role === 'moderator' ? (
          <>
            <CustomButton
              className={clsx(
                commonClasses.positionAbsolute,
                classes.commentMenuButtonStyle,
              )}
              onClick={e => handleSetState(handleCommentMenuOpen(e))}
            >
              <MoreVertIcon />
            </CustomButton>
            <Menu
              className={classes.commentMenuStyle}
              id="comment_menu"
              anchorEl={commentMenuAnchorEl}
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
                  {t('comment.unpublish')}
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography
                  variant="subtitle2"
                  className={commonClasses.colorRed}
                  component="span"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  {t('comment.delete')}
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : null}
      </Box>

      {comment.text}
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
