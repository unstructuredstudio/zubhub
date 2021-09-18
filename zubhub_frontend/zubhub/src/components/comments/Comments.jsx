import React from 'react';
import PropTypes from 'prop-types';

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

import { nFormatter, countComments } from '../../assets/js/utils/scripts';

import {
  addComment,
  unpublishComment,
  handleToggleDeleteCommentModal,
  deleteComment,
} from './commentsScripts';
import styles from '../../assets/js/styles/components/comments/commentsStyles';

const useStyles = makeStyles(styles);

function Comments(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    open_delete_comment_modal: false,
    delete_comment_dialog_error: false,
  });

  const handleCommentsSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { open_delete_comment_modal, delete_comment_dialog_error } = state;
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
          handleAddComment={(comment_text_el, parent_id) =>
            addComment(
              props,
              comment_text_el,
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
              handleAddComment={(comment_text_el, parent_id) =>
                addComment(
                  props,
                  comment_text_el,
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
        open={open_delete_comment_modal}
        onClose={(_, id = open_delete_comment_modal) =>
          handleCommentsSetState(handleToggleDeleteCommentModal(state, id))
        }
        aria-labelledby={t('projectDetails.ariaLabels.deleteComment')}
      >
        <DialogTitle id="delete-comment">
          {t('projectDetails.comment.delete.dialog.primary')}
        </DialogTitle>
        <Box
          component="p"
          className={delete_comment_dialog_error !== null && classes.errorBox}
        >
          {delete_comment_dialog_error !== null && (
            <Box component="span" className={classes.error}>
              {delete_comment_dialog_error}
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
            onClick={(_, id = open_delete_comment_modal) =>
              handleCommentsSetState(handleToggleDeleteCommentModal(state, id))
            }
            color="primary"
            secondaryButtonStyle
          >
            {t('projectDetails.comment.delete.dialog.cancel')}
          </CustomButton>
          <CustomButton
            variant="contained"
            onClick={(_, id = open_delete_comment_modal) =>
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
