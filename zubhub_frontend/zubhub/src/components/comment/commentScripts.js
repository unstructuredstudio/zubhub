export const toggleRepliesCollapsed = (e, { replies_collapsed }) => {
  e.preventDefault();
  return { replies_collapsed: !replies_collapsed };
};

export const toggleReplyInputCollapsed = (e, { reply_input_collapsed }) => {
  e.preventDefault();
  return { reply_input_collapsed: !reply_input_collapsed };
};

export const handleCommentMenuOpen = e => {
  return { comment_menu_anchor_el: e.currentTarget };
};

export const handleCommentMenuClose = () => {
  return { comment_menu_anchor_el: null };
};
