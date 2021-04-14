const temp_add_comment = (comment, comments, parent_id) => {
  for (let each_comment of comments) {
    if (each_comment.id === parent_id) {
      each_comment.replies.unshift(comment);
      break;
    } else {
      temp_add_comment(comment, each_comment['replies'], parent_id);
    }
  }
};

export default temp_add_comment;
