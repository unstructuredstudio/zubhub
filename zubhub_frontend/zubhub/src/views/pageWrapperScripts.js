/**
 * @function fetchHero
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchHero = props => {
  return props.getHero({ t: props.t });
};

/**
 * @function logout
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const logout = (e, props) => {
  e.preventDefault();
  return props.logout({
    token: props.auth.token,
    history: props.history,
    t: props.t,
  });
};

/**
 * @function handleScrollTopClick
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleScrollTopClick = (e, ref) => {
  e.preventDefault();
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

/**
 * @function handleProfileMenuOpen
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleProfileMenuOpen = e => {
  return { anchor_el: e.currentTarget };
};

/**
 * @function handleProfileMenuClose
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleProfileMenuClose = () => {
  return { anchor_el: null };
};

/**
 * @function handleChangeLanguage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleChangeLanguage = ({ e, props }) => {
  props.i18n.changeLanguage(e.target.value);
};

/**
 * @function handleToggleSearchForm
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleToggleSearchForm = ({ open_search_form }) => {
  return { open_search_form: !open_search_form };
};

/**
 * @function handleCloseSearchForm
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleCloseSearchForm = () => {
  return { open_search_form: false };
};

/**
 * @function closeSearchFormOrIgnore
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const closeSearchFormOrIgnore = e => {
  const form = e.target.closest('form');
  if (!form || form.getAttribute('role') !== 'search') {
    handleCloseSearchForm();
  }
};

export const sliceLongName = (name) => {
  const arr = name.split('')
  arr.splice(9, arr.length - 11, '...')
  return arr.join('')
}
