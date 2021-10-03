
export const fetchHero = props => {
  return props.getHero({ t: props.t });
};

export const logout = (e, props) => {
  e.preventDefault();
  return props.logout({
    token: props.auth.token,
    history: props.history,
    t: props.t,
  });
};

export const handleScrollTopClick = (e, ref) => {
  e.preventDefault();
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export const handleProfileMenuOpen = e => {
  return { anchor_el: e.currentTarget };
};

export const handleProfileMenuClose = () => {
  return { anchor_el: null };
};

export const handleChangeLanguage = ({ e, props }) => {
  props.i18n.changeLanguage(e.target.value);
};

export const handleToggleSearchForm = ({ open_search_form }) => {
  return { open_search_form: !open_search_form };
};

export const handleCloseSearchForm = () => {
  return { open_search_form: false };
};

export const closeSearchFormOrIgnore = e => {
  let is_toggle_search_button;
  e.path.forEach(el => {
    if (el.id === 'toggle-search') {
      is_toggle_search_button = true;
    }
  });
  if (!is_toggle_search_button) return handleCloseSearchForm();
};
