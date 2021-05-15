const parse_comments = comments => {
  for (let each_comment of comments) {
    const mentions = each_comment.text.match(/\B@[a-z0-9_.-]+/gi);
    if (Array.isArray(mentions)) {
      for (let mention of mentions) {
        each_comment.text = each_comment.text.replace(
          mention,
          `<a href="/creators/${
            mention.split('@')[1]
          }" class="mention">${mention}</a>`,
        );
      }
    }
    parse_comments(each_comment['replies']);
  }
};

export default parse_comments;
