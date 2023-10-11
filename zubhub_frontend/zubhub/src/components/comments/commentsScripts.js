import { nanoid } from 'nanoid';

import { tempAddComment, tempDeleteComment, parseComments } from '../../assets/js/utils/scripts';

/**
 * @function addComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const addComment = (props, comment_text_el, parent_id, context, handleSetState) => {
  if (!props.auth.token) {
    props.navigate('/login');
  } else {
    const comment_text = comment_text_el.current.value;
    comment_text_el.current.value = '';

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

    parseComments([comment]);
    parent_id ? tempAddComment(comment, context.body.comments, parent_id) : context.body.comments.unshift(comment);

    handleSetState({ [context.name]: context.body });

    Promise.resolve(
      props.addComment({
        id: context.body.id,
        token: props.auth.token,
        parent_id: parent_id,
        text: comment_text,
        t: props.t,
      }),
    ).then(obj => {
      if (obj[context.name]) {
        parseComments(obj[context.name].comments);
      }
      handleSetState(obj);
    });
  }
};

/**
 * @function unpublishComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const unpublishComment = (props, context, id) => {
  if (props.auth.token && (props.auth.tags.includes('moderator') || props.auth.tags.includes('staff'))) {
    return props
      .unpublishComment({
        token: props.auth.token,
        id: id,
        t: props.t,
        navigate: props.navigate,
      })
      .then(updated_comment => {
        if (updated_comment) {
          tempDeleteComment(context.body.comments, updated_comment.id);
          return { [context.name]: context.body };
        }
      });
  }
};

/**
 * @function handleToggleDeleteCommentModal
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleToggleDeleteCommentModal = (state, id) => {
  const open_delete_comment_modal = !state.open_delete_comment_modal;
  if (open_delete_comment_modal) {
    return { open_delete_comment_modal: id };
  }
  return { open_delete_comment_modal };
};

/**
 * @function deleteComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const deleteComment = (props, context, id, handleSetState, handleCommentsSetState) => {
  if (props.auth.token && (props.auth.tags.includes('moderator') || props.auth.tags.includes('staff'))) {
    props
      .deleteComment({
        token: props.auth.token,
        id: id,
        t: props.t,
        navigate: props.navigate,
      })
      .then(() => {
        tempDeleteComment(context.body.comments, id);

        handleCommentsSetState({
          ...handleToggleDeleteCommentModal({}),
          delete_comment_dialog_error: null,
        });
        handleSetState({ [context.name]: context.body });
      })
      .catch(error => handleCommentsSetState({ delete_comment_dialog_error: error.message }));
  } else {
    handleCommentsSetState({
      delete_comment_dialog_error: null,
      ...handleToggleDeleteCommentModal({}),
    });
  }
};
