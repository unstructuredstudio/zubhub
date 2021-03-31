const recursive_count_comments = (comments, countArr) => {
  for (let comment of comments) {
    countArr['count'] += 1;
    recursive_count_comments(comment['replies'], countArr);
  }
};

const countComments = comments => {
  const countArr = { count: 0 };
  recursive_count_comments(comments, countArr);
  return countArr['count'];
};

export default countComments;
