import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { connect, useSelector } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import TranslateIcon from '@mui/icons-material/Translate';

import {
  AppBar,
  Box,
  ClickAwayListener,
  Container,
  FormControl,
  FormGroup,
  Hidden,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';

import {
  closeSearchFormOrIgnore,
  fetchHero,
  handleChangeLanguage,
  handleProfileMenuClose,
} from '../../views/pageWrapperScripts';

import { getQueryParams, SearchType } from '../../views/search_results/searchResultsScripts';

import logo from '../../assets/images/logos/logo.png';
import commonStyles from '../../assets/js/styles';
import styles from '../../assets/js/styles/views/page_wrapper/pageWrapperStyles';
import * as AuthActions from '../../store/actions/authActions';
import * as ProjectActions from '../../store/actions/projectActions';

import { Menu as MenuIcon, SearchOutlined } from '@mui/icons-material';
import API from '../../api';
import languageMap from '../../assets/js/languageMap.json';
import Autocomplete from '../../components/autocomplete/Autocomplete';
import Option from '../../components/autocomplete/Option';
import InputSelect from '../../components/input_select/InputSelect';
import NotificationButton from '../../components/notification_button/NotificationButton';
import { throttle } from '../../utils.js';
import AvatarButton from '../avatar_button/AvatarButton';
import Sidenav from '../Sidenav/Sidenav';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);
const anchor = 'left';

/**
 * @function NavBar View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function NavBar(props) {
  const backToTopEl = React.useRef(null);
  const navigate = useNavigate();
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const trigger = useScrollTrigger();
  const [searchType, setSearchType] = useState(getQueryParams(window.location.href).get('type') || SearchType.PROJECTS);
  const formRef = useRef();
  const token = useSelector(state => state.auth.token);
  const pathname = props.location?.pathname
  const hideSearchAndActions = pathname === '/signup' || pathname === '/login';

  const [state, setState] = React.useState({
    username: null,
    anchor_el: null,
    loading: false,
    open_search_form: false,
    left: false,
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
          completions = completions?.map(({ name }) => ({
            title: name,
          }));
        } else if (searchType === SearchType.PROJECTS) {
          completions = await api.autocompleteProjects({ query, token });
          completions = completions
          .filter(c=>( c.creator.id === props.auth.id && c.publish.type !== 1 ))
          .map(({ id, title, creator, images }) => ({
            title,
            shortInfo: creator.username,
            image: images.length > 0 ? images[0].image_url : null,
            link: `/projects/${id}`,
          }));
        } else {
          completions = await api.autocompleteCreators({ query, token });
          completions = completions?.map(({ username, avatar }) => ({
            title: username,
            image: avatar,
            link: `/creators/${username}`,
          }));
        }
        setOptions(completions);
      }, 2),
    [props.auth.id, token],
  );

  useEffect(() => {
    throttledFetchOptions(
      query || (props.location.search && getQueryParams(window.location.href).get('q')),
      searchType,
    );
  }, [props.location.search, query, searchType, throttledFetchOptions]);

  useEffect(() => {
    throttledFetchOptions.cancel();
  }, [throttledFetchOptions]);

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
      <AppBar className={classes.navBarStyle}>
        <Container id="navbar-root" className={classes.mainContainerStyle}>
          <Toolbar className={classes.toolBarStyle}>
            {!hideSearchAndActions && (
              <Hidden mdUp>
                <Box style={{ marginRight: 10 }} onClick={toggleDrawer}>
                  <MenuIcon />
                </Box>
              </Hidden>
            )}

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
                  variant="standard"
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
                  variant="standard"
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
              {
                !hideSearchAndActions && (
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
                      renderOption={(props, option, { inputValue }) => (
                        <Option {...props} option={option} inputValue={inputValue} onOptionClick={onSearchOptionClick} />
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
              )
            }
            </Box>
            {!hideSearchAndActions && (
              <div className={classes.navActionStyle}>
                <SearchOutlined onClick={toggleSearchBar} className={classes.addOn894} />

                <NotificationButton />
                <Hidden smDown>
                  {props.auth.username && (
                    <Box>
                      <Typography className={clsx(common_classes.title2, classes.username)}>
                        {props.auth.username}
                      </Typography>
                      {/* Todo: Change this subheading based on current role of user */}
                      <Typography className="">Creator</Typography>
                    </Box>
                  )}
                </Hidden>
              <AvatarButton navigate={props.navigate} />
            </div>
            )}
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
                    renderOption={(props, option, { inputValue }) => (
                      <Option {...props} option={option} inputValue={inputValue} onOptionClick={onSearchOptionClick} />
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
        {/* <BreadCrumb /> */}
        <SwipeableDrawer anchor={anchor} open={state.left} onClose={toggleDrawer} onOpen={toggleDrawer}>
          { state.left ? <Sidenav /> : null }
        </SwipeableDrawer>
      </AppBar>
    </>
  );
}

NavBar.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);