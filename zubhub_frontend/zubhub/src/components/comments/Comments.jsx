import React from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';

import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import {
  Typography,
  Container,
  Dialog,
  DialogTitle,
  Box,
  DialogActions,
  DialogContent,
} from '@material-ui/core';

import Comment from '../../components/comment/Comment';
import CommentInput from '../../components/comment_input/CommentInput';
import CustomButton from '../../components/button/Button';

import nFormatter from '../../assets/js/nFormatter';
import countComments from '../../assets/js/countComments';
import temp_add_comment from '../../assets/js/tempAddComment';
import temp_delete_comment from '../../assets/js/tempDeleteComment';
import styles from '../../assets/js/styles/components/comments/commentsStyles';
import parse_comments from '../../assets/js/parseComments';

const useStyles = makeStyles(styles);

const add_comment = (
  props,
  commentTextEl,
  parent_id,
  context,
  handleSetState,
) => {
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    const comment_text = commentTextEl.current.value;
    commentTextEl.current.value = '';

    const comment = {
      id: nanoid(),
      creator: {
        username: props.auth.username,
        avatar: props.auth.avatar,
      },
      text: comment_text,
      parent_id: parent_id ? parent_id : null,
      created_on: new Date().toISOString(),
      replies: [],
    };

    parse_comments([comment]);
    parent_id
      ? temp_add_comment(comment, context.body.comments, parent_id)
      : context.body.comments.unshift(comment);

    handleSetState({ [context.name]: context.body });

    Promise.resolve(
      props.add_comment({
        id: context.body.id,
        token: props.auth.token,
        parent_id: parent_id,
        text: comment_text,
        t: props.t,
      }),
    ).then(obj => {
      if (obj[context.name]) {
        parse_comments(obj[context.name].comments);
      }
      handleSetState(obj);
    });
  }
};

const unpublishComment = (props, context, id) => {
  if (
    props.auth.token &&
    (props.auth.role === 'moderator' || props.auth.role === 'staff')
  ) {
    return props
      .unpublish_comment({
        token: props.auth.token,
        id: id,
        t: props.t,
        history: props.history,
      })
      .then(updated_comment => {
        if (updated_comment) {
          temp_delete_comment(context.body.comments, updated_comment.id);
          return { [context.name]: context.body };
        }
      });
  }
};

const handleToggleDeleteCommentModal = (state, id) => {
  const openDeleteCommentModal = !state.openDeleteCommentModal;
  if (openDeleteCommentModal) {
    return { openDeleteCommentModal: id };
  }
  return { openDeleteCommentModal };
};

const deleteComment = (
  props,
  context,
  id,
  handleSetState,
  handleCommentsSetState,
) => {
  if (
    props.auth.token &&
    (props.auth.role === 'moderator' || props.auth.role === 'staff')
  ) {
    props
      .delete_comment({
        token: props.auth.token,
        id: id,
        t: props.t,
        history: props.history,
      })
      .then(() => {
        temp_delete_comment(context.body.comments, id);

        handleCommentsSetState({
          ...handleToggleDeleteCommentModal({}),
          deleteCommentDialogError: null,
        });
        handleSetState({ [context.name]: context.body });
      })
      .catch(error =>
        handleCommentsSetState({ deleteCommentDialogError: error.message }),
      );
  } else {
    handleCommentsSetState({
      deleteCommentDialogError: null,
      ...handleToggleDeleteCommentModal({}),
    });
  }
};

function Comments(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    openDeleteCommentModal: false,
    deleteCommentDialogError: false,
  });

  const handleCommentsSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { openDeleteCommentModal, deleteCommentDialogError } = state;
  const { context, handleSetState, t } = props;

  return (
    <>
      <Container className={classes.commentSectionStyle}>
        <Typography variant="h5" className={classes.descriptionHeadingStyle}>
          <CommentIcon /> {nFormatter(countComments(context.body.comments))}{' '}
          {t('comments.label')}
        </Typography>

        <CommentInput
          {...props}
          handleAddComment={(commentTextEl, parent_id) =>
            add_comment(
              props,
              commentTextEl,
              parent_id,
              context,
              handleSetState,
            )
          }
        />

        {context.body.comments &&
          context.body.comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              handleUnpublishComment={id =>
                handleSetState(unpublishComment(props, context, id))
              }
              handleToggleDeleteCommentModal={id =>
                handleCommentsSetState(
                  handleToggleDeleteCommentModal(state, id),
                )
              }
              handleAddComment={(commentTextEl, parent_id) =>
                add_comment(
                  props,
                  commentTextEl,
                  parent_id,
                  context,
                  handleSetState,
                )
              }
              {...props}
            />
          ))}
      </Container>
      <Dialog
        open={openDeleteCommentModal}
        onClose={(e, id = openDeleteCommentModal) =>
          handleCommentsSetState(handleToggleDeleteCommentModal(state, id))
        }
        aria-labelledby={t('projectDetails.ariaLabels.deleteComment')}
      >
        <DialogTitle id="delete-comment">
          {t('projectDetails.comment.delete.dialog.primary')}
        </DialogTitle>
        <Box
          component="p"
          className={deleteCommentDialogError !== null && classes.errorBox}
        >
          {deleteCommentDialogError !== null && (
            <Box component="span" className={classes.error}>
              {deleteCommentDialogError}
            </Box>
          )}
        </Box>{' '}
        <DialogContent>
          <Typography>
            {t('projectDetails.comment.delete.dialog.secondary')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="outlined"
            onClick={(e, id = openDeleteCommentModal) =>
              handleCommentsSetState(handleToggleDeleteCommentModal(state, id))
            }
            color="primary"
            secondaryButtonStyle
          >
            {t('projectDetails.comment.delete.dialog.cancel')}
          </CustomButton>
          <CustomButton
            variant="contained"
            onClick={(e, id = openDeleteCommentModal) =>
              deleteComment(
                props,
                context,
                id,
                handleSetState,
                handleCommentsSetState,
              )
            }
            dangerButtonStyle
          >
            {t('projectDetails.comment.delete.dialog.proceed')}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

Comments.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default Comments;
