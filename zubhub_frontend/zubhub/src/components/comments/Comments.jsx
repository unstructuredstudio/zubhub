import React from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';

import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import { Typography, Container } from '@material-ui/core';

import Comment from '../../components/comment/Comment';
import CommentInput from '../../components/comment_input/CommentInput';

import nFormatter from '../../assets/js/nFormatter';
import countComments from '../../assets/js/countComments';
import temp_add_comment from '../../assets/js/tempAddComment';
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

function Comments(props) {
  const classes = useStyles();

  const { context, handleSetState, t } = props;

  return (
    <Container className={classes.commentSectionStyle}>
      <Typography variant="h5" className={classes.descriptionHeadingStyle}>
        <CommentIcon /> {nFormatter(countComments(context.body.comments))}{' '}
        {t('comments.label')}
      </Typography>

      <CommentInput
        {...props}
        handleAddComment={(commentTextEl, parent_id) =>
          add_comment(props, commentTextEl, parent_id, context, handleSetState)
        }
      />

      {context.body.comments &&
        context.body.comments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
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
  );
}

Comments.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default Comments;
