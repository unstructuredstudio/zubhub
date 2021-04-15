const temp_delete_comment = (comments, comment_id) => {
    for (let index=0; index < comments.length; index++) {
      if (Number(comments[index].id) === Number(comment_id)) {
          comments.splice(index, 1);
        break;
      } else {
        temp_delete_comment(comments[index]['replies'], comment_id);
      }
    }
  };
  
  export default temp_delete_comment;
  