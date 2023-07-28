import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { connect, useSelector } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@material-ui/core/styles';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import SearchIcon from '@material-ui/icons/Search';
import TranslateIcon from '@material-ui/icons/Translate';

import {
  AppBar,
  Avatar,
  Box,
  ClickAwayListener,
  Container,
  CssBaseline,
  FormControl,
  FormGroup,
  Hidden,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from '@material-ui/core';

import {
  closeSearchFormOrIgnore,
  fetchHero,
  handleChangeLanguage,
  handleProfileMenuClose,
  handleProfileMenuOpen,
  handleToggleSearchForm,
  logout,
} from '../../views/pageWrapperScripts';

import { getQueryParams, SearchType } from '../../views/search_results/searchResultsScripts';

import logo from '../../assets/images/logos/logo.png';
import commonStyles from '../../assets/js/styles';
import styles from '../../assets/js/styles/views/page_wrapper/pageWrapperStyles';
import CustomButton from '../../components/button/Button.js';
import * as AuthActions from '../../store/actions/authActions';
import * as ProjectActions from '../../store/actions/projectActions';

import API from '../../api';
import languageMap from '../../assets/js/languageMap.json';
import Autocomplete from '../../components/autocomplete/Autocomplete';
import Option from '../../components/autocomplete/Option';
import BreadCrumb from '../../components/breadCrumb/breadCrumb';
import InputSelect from '../../components/input_select/InputSelect';
import Navbar from '../../components/Navbar/Navbar';
import NotificationButton from '../../components/notification_button/NotificationButton';
import { throttle } from '../../utils.js';
import { SearchOutlined, Menu as MenuIcon } from '@material-ui/icons';
import AvatarButton from '../avatar_button/AvatarButton';
import Sidenav from '../Sidenav/Sidenav';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);
const anchor = 'left';

/**
 * @function PageWrapper View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function PageWrapper(props) {
  const backToTopEl = React.useRef(null);
  const history = useHistory();
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const trigger = useScrollTrigger();
  const [searchType, setSearchType] = useState(getQueryParams(window.location.href).get('type') || SearchType.PROJECTS);
  const formRef = useRef();
  const token = useSelector(state => state.auth.token);

  const [state, setState] = React.useState({
    username: null,
    anchor_el: null,
    loading: false,
    open_search_form: false,
  });

  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState(props.location.search ? getQueryParams(window.location.href).get('q') : '');

  const toggleDrawer = event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(oldState => ({ ...oldState, left: !state.left }));
  };

  const throttledFetchOptions = useMemo(
    () =>
      throttle(async (query, searchType) => {
        if (query?.length === 0) {
          setOptions([]);
          return;
        }

        const api = new API();
        let completions = [];
        if (searchType === SearchType.TAGS) {
          completions = await api.autocompleteTags({ query, token });
          completions = completions.map(({ name }) => ({
            title: name,
          }));
        } else if (searchType === SearchType.PROJECTS) {
          completions = await api.autocompleteProjects({ query, token });
          completions = completions.map(({ id, title, creator, images }) => ({
            title,
            shortInfo: creator.username,
            image: images.length > 0 ? images[0].image_url : null,
            link: `/projects/${id}`,
          }));
        } else {
          completions = await api.autocompleteCreators({ query, token });
          completions = completions.map(({ username, avatar }) => ({
            title: username,
            image: avatar,
            link: `/creators/${username}`,
          }));
        }
        setOptions(completions);
      }, 2),
    [],
  );

  useEffect(() => {
    throttledFetchOptions(
      query || (props.location.search && getQueryParams(window.location.href).get('q')),
      searchType,
    );
  }, [query, searchType]);

  useEffect(() => {
    throttledFetchOptions.cancel();
  }, []);

  useEffect(() => {
    handleSetState({ loading: true });
    fetchHero(props)
      .then(() => {
        if (props.auth.token) {
          return props.getAuthUser(props);
        }
      })
      .finally(() => {
        handleSetState({ loading: false });
      });
  }, [props.auth.token]);

  useEffect(() => {
    handleSetState(handleProfileMenuClose());
  }, [trigger]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const toggleSearchBar = () => setState({ ...state, open_search_form: !state.open_search_form });

  const onSearchOptionClick = async (_, option) => {
    if (!option || !option.title) return;

    await new Promise(resolve => setTimeout(resolve, 100));
    if (option.link) {
      window.history.pushState({}, '', option.link);
      window.location.reload();
      return;
    }

    const queryParams = new URLSearchParams({
      type: searchType,
      q: option.title,
    });
    window.history.pushState({}, '', `/search?${queryParams}`);
    window.location.reload();
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (query.length == 0) return;
    const queryParams = new URLSearchParams({
      type: searchType,
      q: query,
    });

    window.history.pushState({}, '', `/search?${queryParams}`);
    window.location.reload();
  };

  const handleTextField = event => {
    setQuery(event.target.value);
  };

  const { anchor_el, loading, open_search_form } = state;
  const { t } = props;
  const { zubhub, hero } = props.projects;

  const profileMenuOpen = Boolean(anchor_el);
  return (
    <>
      <AppBar id="navbar-root" className={classes.navBarStyle}>
        <Container className={classes.mainContainerStyle}>
          <Toolbar className={classes.toolBarStyle}>
            <Hidden mdUp>
              <Box style={{ marginRight: 10 }} onClick={toggleDrawer}>
                <MenuIcon />
              </Box>
            </Hidden>
            <Box className={classes.logoStyle}>
              <Link to="/">
                <img src={zubhub?.header_logo_url ? zubhub.header_logo_url : logo} alt="logo" />
              </Link>
              <Box
                className={clsx(
                  classes.languageSelectBoxStyle,
                  common_classes.displayInlineFlex,
                  common_classes.alignCenter,
                  common_classes.addOnSmallScreen,
                )}
              >
                <TranslateIcon />
                <Select
                  className={classes.languageSelectStyle}
                  value=""
                  onChange={e => handleChangeLanguage({ e, props })}
                >
                  {Object.keys(languageMap).map((ln, index) => (
                    <MenuItem key={index} value={ln}>
                      {languageMap[ln]}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box
                className={clsx(
                  classes.languageSelectBoxStyle,
                  common_classes.displayInlineFlex,
                  common_classes.alignCenter,
                  common_classes.removeOnSmallScreen,
                )}
              >
                <TranslateIcon />
                <Select
                  className={classes.languageSelectStyle}
                  value={props.i18n.language}
                  onChange={e => handleChangeLanguage({ e, props })}
                >
                  {Object.keys(languageMap).map((ln, index) => (
                    <MenuItem key={index} value={ln}>
                      {languageMap[ln]}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <form
                action="/search"
                className={clsx(classes.searchFormStyle, classes.removeOn894)}
                role="search"
                onSubmit={handleSubmit}
                ref={formRef}
              >
                <FormControl
                  className={clsx(
                    common_classes.width100Percent,
                    common_classes.displayFlex,
                    common_classes.displayInlineFlex,
                  )}
                  variant="outlined"
                >
                  <InputLabel htmlFor="q" className={classes.searchFormLabelStyle}>
                    {t('pageWrapper.inputs.search.label')}
                  </InputLabel>
                  <FormGroup row>
                    <FormControl variant="outlined">
                      <InputSelect searchType={searchType} onSearchTypeChange={setSearchType} name="type">
                        <MenuItem value={SearchType.PROJECTS}>Projects</MenuItem>
                        <MenuItem value={SearchType.CREATORS}>Creators</MenuItem>
                        <MenuItem value={SearchType.TAGS}>Tags</MenuItem>
                      </InputSelect>
                    </FormControl>
                    <Autocomplete
                      className={classes.input}
                      options={options}
                      defaultValue={{ title: query }}
                      value={{ title: query }}
                      renderOption={(option, { inputValue }) => (
                        <Option option={option} inputValue={inputValue} onOptionClick={onSearchOptionClick} />
                      )}
                    >
                      {params => (
                        <TextField
                          name="q"
                          id="q"
                          type="search"
                          variant="outlined"
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            className: clsx(classes.searchFormInputStyle, 'search-form-input'),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  type="submit"
                                  className={classes.searchFormSubmitStyle}
                                  aria-label={t('pageWrapper.inputs.search.label')}
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                            pattern: '(.|s)*S(.|s)*',
                          }}
                          onChange={handleTextField}
                          placeholder={`${t('pageWrapper.inputs.search.label')}...`}
                        />
                      )}
                    </Autocomplete>
                  </FormGroup>
                </FormControl>
              </form>
            </Box>
            <div className={classes.navActionStyle}>
              <SearchOutlined onClick={toggleSearchBar} className={classes.addOn894} />

              <NotificationButton />
              <Hidden smDown>
                {props.auth.username && (
                  <Box>
                    <Typography className={clsx(common_classes.title2, classes.username)}>
                      {props.auth.username}
                    </Typography>
                    <Typography className="">Student</Typography>
                  </Box>
                )}
              </Hidden>

              <AvatarButton history={props.history} />
            </div>
          </Toolbar>
          {open_search_form ? (
            <ClickAwayListener onClickAway={e => handleSetState(closeSearchFormOrIgnore(e))}>
              <form
                action="/search"
                className={clsx(classes.smallSearchFormStyle, classes.addOn894)}
                role="search"
                ref={formRef}
              >
                <FormControl variant="outlined" style={{ minWidth: 'unset' }} className={classes.formControlStyle}>
                  <InputSelect searchType={searchType} onSearchTypeChange={setSearchType} name="type">
                    <MenuItem value={SearchType.PROJECTS}>Projects</MenuItem>
                    <MenuItem value={SearchType.CREATORS}>Creators</MenuItem>
                    <MenuItem value={SearchType.TAGS}>Tags</MenuItem>
                  </InputSelect>
                </FormControl>
                <FormControl variant="outlined" style={{ flex: '1 1 auto', maxWidth: '350px' }}>
                  <InputLabel htmlFor="q" className={classes.searchFormLabelStyle}>
                    {t('pageWrapper.inputs.search.label')}
                  </InputLabel>
                  <Autocomplete
                    style={{ width: '100%' }}
                    options={options}
                    defaultValue={{ title: query }}
                    value={{ title: query }}
                    renderOption={(option, { inputValue }) => (
                      <Option option={option} inputValue={inputValue} onOptionClick={onSearchOptionClick} />
                    )}
                  >
                    {params => (
                      <TextField
                        name="q"
                        id="q"
                        type="search"
                        variant="outlined"
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          className: clsx(classes.smallSearchFormInputStyle, 'search-form-input'),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                type="submit"
                                className={classes.searchFormSubmitStyle}
                                aria-label={t('pageWrapper.inputs.search.label')}
                              >
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                          pattern: '(.|s)*S(.|s)*',
                        }}
                        placeholder={`${t('pageWrapper.inputs.search.label')}...`}
                        onChange={handleTextField}
                      />
                    )}
                  </Autocomplete>
                </FormControl>
              </form>
            </ClickAwayListener>
          ) : null}
        </Container>
        <BreadCrumb />
        <SwipeableDrawer anchor={anchor} open={state.left} onClose={toggleDrawer} onOpen={toggleDrawer}>
          <Sidenav />
        </SwipeableDrawer>
      </AppBar>
    </>
  );
}

PageWrapper.propTypes = {
  auth: PropTypes.object.isRequired,
  setAuthUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  getAuthUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAuthUser: auth_user => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
    logout: args => {
      return dispatch(AuthActions.logout(args));
    },
    getAuthUser: props => {
      return dispatch(AuthActions.getAuthUser(props));
    },
    getHero: args => {
      return dispatch(ProjectActions.getHero(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageWrapper);
