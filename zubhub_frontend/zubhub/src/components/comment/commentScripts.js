/**
 * @function toggleRepliesCollapsed
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const toggleRepliesCollapsed = (e, { replies_collapsed }) => {
  e.preventDefault();
  return { replies_collapsed: !replies_collapsed };
};

/**
 * @function toggleReplyInputCollapsed
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const toggleReplyInputCollapsed = (e, { reply_input_collapsed }) => {
  e.preventDefault();
  return { reply_input_collapsed: !reply_input_collapsed };
};

/**
 * @function handleCommentMenuOpen
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleCommentMenuOpen = e => {
  return { comment_menu_anchor_el: e.currentTarget };
};

/**
 * @function handleCommentMenuClose
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleCommentMenuClose = () => {
  return { comment_menu_anchor_el: null };
};
