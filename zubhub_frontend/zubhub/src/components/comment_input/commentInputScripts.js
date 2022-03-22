export const timer = { id: null };

/**
 * @function constructCommentBox
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const constructCommentBox = refs => {
  refs.comment_text.current.addEventListener('focus', e =>
    handleCommentTextFocus(refs),
  );

  refs.comment_text.current.ownerDocument.addEventListener('click', e =>
    handleDocumentClick(e, refs),
  );
};

/**
 * @function handleCommentTextFocus
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleCommentTextFocus = refs => {
  refs.comment_box.current.classList.remove('comment-collapsed');
  refs.comment_box.current.classList.add('comment');
  refs.comment_author_name.current.classList.remove('display-none');
  refs.comment_publish_button.current.classList.remove('display-none');
};

/**
 * @function handleDocumentClick
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleDocumentClick = (e, refs) => {
  try {
    if (
      ![
        refs.comment_box.current,
        refs.comment_publish_button.current,
        refs.comment_text.current,
      ].includes(e.target)
    ) {
      refs.comment_box.current.classList.remove('comment');
      refs.comment_box.current.classList.add('comment-collapsed');
      refs.comment_author_name.current.classList.add('display-none');
      refs.comment_publish_button.current.classList.add('display-none');
    }
  } catch {}
};

/**
 * @function handleAddComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleAddComment = (e, props, comment_text) => {
  e.preventDefault();
  props.handleAddComment(comment_text, props.parent_id);
};

/**
 * @function handleSuggestCreators
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleSuggestCreators = (e, props, timer, handleSetState) => {
  clearTimeout(timer.id);
  const value = e.currentTarget.value;
  const value_arr = value.split('@');

  if (
    value !== '' &&
    value_arr.length > 1 &&
    value_arr[value_arr.length - 1] !== '' &&
    value_arr[value_arr.length - 1].search(' ') === -1
  ) {
    timer.id = setTimeout(() => {
      suggestCreators(value_arr[value_arr.length - 1], props, handleSetState);
    }, 500);
  } else {
    handleSetState({ creator_suggestion_open: false });
  }
};

/**
 * @function suggestCreators
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const suggestCreators = (query_string, props, handleSetState) => {
  handleSetState({ creator_suggestion_open: true });
  handleSetState(
    props.suggestCreators({ page: null, query_string, t: props.t }),
  );
};

/**
 * @function handleInsertCreatorName
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleInsertCreatorName = (value, comment_text_el) => {
  const comment_text = comment_text_el.current.value;
  const comment_text_arr = comment_text.split('@');
  const old_value = comment_text_arr[comment_text_arr.length - 1];

  if (
    comment_text !== '' &&
    comment_text_arr.length > 1 &&
    old_value !== '' &&
    old_value.search(' ') === -1
  ) {
    comment_text_el.current.value = comment_text.replace(
      `@${old_value}`,
      `${value} `,
    );
  }
};
