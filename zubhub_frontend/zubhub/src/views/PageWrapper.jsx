import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect, useSelector } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TranslateIcon from '@material-ui/icons/Translate';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import SearchIcon from '@material-ui/icons/Search';

import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  ClickAwayListener,
  Typography,
  useScrollTrigger,
  Box,
  IconButton,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  Fab,
  Zoom,
  Menu,
  MenuItem,
  Avatar,
  Select,
  FormGroup,
  InputBase,
  TextField,
  Tooltip,
} from '@material-ui/core';

import {
  logout,
  fetchHero,
  handleScrollTopClick,
  handleProfileMenuOpen,
  handleProfileMenuClose,
  handleChangeLanguage,
  handleToggleSearchForm,
  closeSearchFormOrIgnore,
} from './pageWrapperScripts';

import {
  getQueryParams,
  SearchType,
} from './search_results/searchResultsScripts';

import CustomButton from '../components/button/Button.js';
import LoadingPage from './loading/LoadingPage';
import * as AuthActions from '../store/actions/authActions';
import * as ProjectActions from '../store/actions/projectActions';
import unstructuredLogo from '../assets/images/logos/unstructured-logo.png';
import logo from '../assets/images/logos/logo.png';
import styles from '../assets/js/styles/views/page_wrapper/pageWrapperStyles';
import commonStyles from '../assets/js/styles';

import languageMap from '../assets/js/languageMap.json';
import InputSelect from '../components/input_select/InputSelect';
import Autocomplete from '../components/autocomplete/Autocomplete';
import API from '../api';
import { throttle } from '../utils.js';
import Option from '../components/autocomplete/Option';
import NotificationButton from '../components/notification_button/NotificationButton';
import BreadCrumb from '../components/breadCrumb/breadCrumb';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

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
  const [searchType, setSearchType] = useState(
    getQueryParams(window.location.href).get('type') || SearchType.PROJECTS,
  );
  const formRef = useRef();
  const token = useSelector(state => state.auth.token);

  const [state, setState] = React.useState({
    username: null,
    anchor_el: null,
    loading: false,
    open_search_form: false,
  });

  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState('');
  const [queryInput, setQueryInput] = useState('');

  const throttledFetchOptions = useMemo(
    () =>
      throttle(async (query, searchType) => {
        if (query.length === 0) {
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
      query ||
        (props.location.search &&
          getQueryParams(window.location.href).get('q')),
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

  React.useEffect(() => {
    handleSetState(handleProfileMenuClose());
  }, [trigger]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

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

  const { anchor_el, loading, open_search_form } = state;
  const { t } = props;
  const { zubhub, hero } = props.projects;

  const profileMenuOpen = Boolean(anchor_el);

  return (
    <>
      <ToastContainer />
      <CssBaseline />
      <AppBar className={classes.navBarStyle}>
        <Container className={classes.mainContainerStyle}>
          <Toolbar className={classes.toolBarStyle}>
            <Box className={classes.logoStyle}>
              <Link to="/">
                <img
                  src={zubhub?.header_logo_url ? zubhub.header_logo_url : logo}
                  alt="logo"
                />
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
                  <InputLabel
                    htmlFor="q"
                    className={classes.searchFormLabelStyle}
                  >
                    {t('pageWrapper.inputs.search.label')}
                  </InputLabel>
                  <FormGroup row>
                    <FormControl variant="outlined">
                      <InputSelect
                        searchType={searchType}
                        onSearchTypeChange={setSearchType}
                        name="type"
                      >
                        <MenuItem value={SearchType.PROJECTS}>
                          Projects
                        </MenuItem>
                        <MenuItem value={SearchType.CREATORS}>
                          Creators
                        </MenuItem>
                        <MenuItem value={SearchType.TAGS}>Tags</MenuItem>
                      </InputSelect>
                    </FormControl>
                    <Autocomplete
                      className={classes.input}
                      options={options}
                      defaultValue={{
                        title:
                          props.location.search &&
                          getQueryParams(window.location.href).get('q'),
                      }}
                      renderOption={(option, { inputValue }) => (
                        <Option
                          option={option}
                          inputValue={inputValue}
                          onOptionClick={onSearchOptionClick}
                        />
                      )}
                      onChange={onSearchOptionClick}
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
                            className: clsx(
                              classes.searchFormInputStyle,
                              'search-form-input',
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  type="submit"
                                  className={classes.searchFormSubmitStyle}
                                  aria-label={t(
                                    'pageWrapper.inputs.search.label',
                                  )}
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                            pattern: '(.|s)*S(.|s)*',
                            defaultValue: {
                              title:
                                props.location.search &&
                                getQueryParams(window.location.href).get('q'),
                            },
                          }}
                          onChange={e => setQuery(e.target.value)}
                          placeholder={`${t(
                            'pageWrapper.inputs.search.label',
                          )}...`}
                        />
                      )}
                    </Autocomplete>
                  </FormGroup>
                </FormControl>
              </form>
            </Box>
            <div className={classes.navActionStyle}>
              {!props.auth.token ? (
                <>
                  <IconButton
                    className={clsx(
                      classes.toggleSearchFormStyle,
                      classes.addOn894,
                    )}
                    id="toggle-search"
                    aria-label="toggle search form"
                    onClick={() =>
                      handleSetState(handleToggleSearchForm(state))
                    }
                  >
                    <SearchIcon />
                  </IconButton>
                  <Link
                    className={clsx(
                      classes.textDecorationNone,
                      common_classes.removeOnSmallScreen,
                    )}
                    to="/login"
                  >
                    <CustomButton
                      variant="outlined"
                      size="large"
                      secondaryButtonStyle
                      className={classes.customButton}
                    >
                      {t('pageWrapper.navbar.login')}
                    </CustomButton>
                  </Link>
                  <Link
                    className={clsx(
                      classes.textDecorationNone,
                      common_classes.removeOnSmallScreen,
                    )}
                    to="/signup"
                  >
                    <CustomButton
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      customButtonStyle
                      className={`${common_classes.marginLeft1em} ${classes.customButton}`}
                    >
                      {t('pageWrapper.navbar.signup')}
                    </CustomButton>
                  </Link>

                  <MenuRoundedIcon
                    className={common_classes.addOnSmallScreen}
                    aria-label={t('pageWrapper.navbar.menu')}
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={e => handleSetState(handleProfileMenuOpen(e))}
                  />
                  <Menu
                    className={common_classes.addOnSmallScreen}
                    disableScrollLock={true}
                    id="menu"
                    anchorEl={anchor_el}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={profileMenuOpen}
                    onClose={e => handleSetState(handleProfileMenuClose(e))}
                  >
                    <MenuItem>
                      <Link className={classes.textDecorationNone} to="/login">
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.login')}
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link className={classes.textDecorationNone} to="/signup">
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.signup')}
                        </Typography>
                      </Link>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {props.match.path === '/activities' ? (
                    props.auth.tags.filter(
                      tag =>
                        tag === 'moderator' ||
                        tag === 'staff' ||
                        tag === 'educator',
                    ).length > 0 && (
                      <Link
                        className={clsx(
                          classes.textDecorationNone,
                          common_classes.marginRight1em,
                          common_classes.removeOnSmallScreen,
                        )}
                        to="/activities/create"
                      >
                        <CustomButton
                          variant="contained"
                          primaryButtonStyle
                          primaryButtonStyle2
                          className={classes.customButton}
                          size="small"
                        >
                          {t('pageWrapper.navbar.createActivity')}
                        </CustomButton>
                      </Link>
                    )
                  ) : (
                    <Link
                      className={clsx(
                        classes.textDecorationNone,
                        common_classes.marginRight1em,
                        common_classes.removeOnSmallScreen,
                      )}
                      to="/activities"
                    >
                      <CustomButton
                        variant="contained"
                        primaryButtonStyle
                        primaryButtonStyle2
                        className={classes.customButton}
                        size="small"
                      >
                        {t('pageWrapper.navbar.browseActivities')}
                      </CustomButton>
                    </Link>
                  )}
                  <Link
                    className={clsx(
                      classes.textDecorationNone,
                      common_classes.marginRight1em,
                      common_classes.removeOnSmallScreen,
                    )}
                    to="/projects/create"
                  >
                    <CustomButton
                      variant="contained"
                      primaryButtonStyle
                      className={classes.customButton}
                      size="small"
                    >
                      {t('pageWrapper.navbar.createProject')}
                    </CustomButton>
                  </Link>
                  <IconButton
                    className={clsx(
                      classes.toggleSearchFormStyle,
                      classes.addOn894,
                    )}
                    id="toggle-search"
                    aria-label="toggle search form"
                    onClick={() =>
                      handleSetState(handleToggleSearchForm(state))
                    }
                  >
                    <SearchIcon />
                  </IconButton>
                  <NotificationButton
                    className={clsx(
                      common_classes.marginRight1em,
                      common_classes.removeOnSmallScreen,
                    )}
                  />
                  <Avatar
                    className={clsx(
                      classes.avatarStyle,
                      common_classes.removeOnSmallScreen,
                    )}
                    aria-label={`${props.auth.username}' Avatar`}
                    aria-controls="profile_menu"
                    aria-haspopup="true"
                    onClick={e => handleSetState(handleProfileMenuOpen(e))}
                    src={props.auth.avatar}
                    alt={props.auth.username}
                  />
                  <Menu
                    className={classes.profileMenuStyle}
                    disableScrollLock={true}
                    id="profile_menu"
                    anchorEl={anchor_el}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={profileMenuOpen}
                    onClose={e => handleSetState(handleProfileMenuClose(e))}
                  >
                    <MenuItem>
                      <Tooltip title={props.auth.username} placement="top">
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                          className={classes.profileStyle}
                        >
                          {props.auth.username}
                        </Typography>
                      </Tooltip>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        className={classes.textDecorationNone}
                        to="/profile"
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.profile')}
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem className={common_classes.addOnSmallScreen}>
                      <Link
                        className={classes.textDecorationNone}
                        to="/projects/create"
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.createProject')}
                        </Typography>
                      </Link>
                    </MenuItem>
                    {props.auth.tags.filter(
                      tag => tag === 'staff' || tag === 'educator',
                    ).length > 0 && (
                      <MenuItem
                        className={clsx(common_classes.removeOnSmallScreen)}
                        onClick={() => {
                          history.push('/activities', { flag: 'educator' });
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.myActivities')}
                        </Typography>
                      </MenuItem>
                    )}
                    {props.auth.tags.filter(
                      tag => tag === 'staff' || tag === 'moderator',
                    ).length > 0 && (
                      <MenuItem
                        className={clsx(common_classes.removeOnSmallScreen)}
                        onClick={() => {
                          history.push('/activities', { flag: 'staff' });
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.unpublishedActivities')}
                        </Typography>
                      </MenuItem>
                    )}
                    <MenuItem>
                      <Link
                        className={classes.textDecorationNone}
                        to={`/creators/${props.auth.username}/projects`}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.projects')}
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        className={classes.textDecorationNone}
                        to={`/creators/${props.auth.username}/followers`}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.followers')}
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        className={classes.textDecorationNone}
                        to={`/creators/${props.auth.username}/following`}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.following')}
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        className={classes.textDecorationNone}
                        to="/projects/saved"
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.savedProjects')}
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem className={classes.logOutStyle}>
                      <Typography
                        className={common_classes.colorRed}
                        variant="subtitle2"
                        component="span"
                        onClick={e => logout(e, props)}
                      >
                        {t('pageWrapper.navbar.logout')}
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </Toolbar>
          {open_search_form ? (
            <ClickAwayListener
              onClickAway={e => handleSetState(closeSearchFormOrIgnore(e))}
            >
              <form
                action="/search"
                className={clsx(classes.smallSearchFormStyle, classes.addOn894)}
                role="search"
                ref={formRef}
              >
                <FormControl variant="outlined" style={{ minWidth: 'unset' }}>
                  <InputSelect
                    searchType={searchType}
                    onSearchTypeChange={setSearchType}
                    name="type"
                  >
                    <MenuItem value={SearchType.PROJECTS}>Projects</MenuItem>
                    <MenuItem value={SearchType.CREATORS}>Creators</MenuItem>
                    <MenuItem value={SearchType.TAGS}>Tags</MenuItem>
                  </InputSelect>
                </FormControl>
                <FormControl
                  variant="outlined"
                  style={{ flex: '1 1 auto', maxWidth: '350px' }}
                >
                  <InputLabel
                    htmlFor="q"
                    className={classes.searchFormLabelStyle}
                  >
                    {t('pageWrapper.inputs.search.label')}
                  </InputLabel>
                  <Autocomplete
                    style={{ width: '100%' }}
                    options={options}
                    defaultValue={
                      props.location.search &&
                      getQueryParams(window.location.href).get('q')
                    }
                    renderOption={(option, { inputValue }) => (
                      <Option
                        option={option}
                        inputValue={inputValue}
                        onOptionClick={onSearchOptionClick}
                      />
                    )}
                    onChange={onSearchOptionClick}
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
                          className: clsx(
                            classes.smallSearchFormInputStyle,
                            'search-form-input',
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                type="submit"
                                className={classes.searchFormSubmitStyle}
                                aria-label={t(
                                  'pageWrapper.inputs.search.label',
                                )}
                              >
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                          pattern: '(.|s)*S(.|s)*',
                        }}
                        placeholder={`${t(
                          'pageWrapper.inputs.search.label',
                        )}...`}
                        onChange={e => setQuery(e.target.value)}
                      />
                    )}
                  </Autocomplete>
                </FormControl>
              </form>
            </ClickAwayListener>
          ) : null}
        </Container>
        <BreadCrumb />
      </AppBar>
      <Toolbar ref={backToTopEl} className={classes.marginBottom} />

      {loading ? <LoadingPage /> : props.children}

      <footer className={clsx('footer-distributed', classes.footerStyle)}>
        <Box>
          <a href="https://unstructured.studio">
            <img
              src={
                zubhub?.footer_logo_url
                  ? zubhub.footer_logo_url
                  : unstructuredLogo
              }
              className={classes.footerLogoStyle}
              alt="unstructured-studio-logo"
            />
          </a>
          <div>
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
          </div>
        </Box>

        <section className={classes.footerSectionStyle}>
          <Box className={classes.footerBoxStyle}>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              className={classes.footerTitleStyle}
            >
              {t('pageWrapper.footer.privacy')}
            </Typography>

            <Link
              to={`/privacy_policy`}
              className={common_classes.textDecorationNone}
            >
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.guidelines')}
              </Typography>
            </Link>

            <Link
              to={`/terms_of_use`}
              className={common_classes.textDecorationNone}
            >
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.termsOfUse')}
              </Typography>
            </Link>
          </Box>

          <Box className={classes.footerBoxStyle}>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              className={classes.footerTitleStyle}
            >
              {t('pageWrapper.footer.about')}
            </Typography>

            <Link to="/about" className={common_classes.textDecorationNone}>
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.zubhub')}
              </Typography>
            </Link>

            <Link to="/challenge" className={common_classes.textDecorationNone}>
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.challenges')}
              </Typography>
            </Link>
          </Box>

          <Box className={classes.footerBoxStyle}>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              className={classes.footerTitleStyle}
            >
              {t('pageWrapper.footer.help')}
            </Typography>

            <a
              target="__blank"
              rel="noreferrer"
              href={
                hero.tinkering_resource_url
                  ? hero.tinkering_resource_url
                  : 'https://kriti.unstructured.studio/'
              }
              className={common_classes.textDecorationNone}
            >
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.resources')}
              </Typography>
            </a>

            <Link
              to={`/faqs`}
              className={clsx(
                common_classes.textDecorationNone,
                common_classes.displayNone,
              )}
            >
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.faqs')}
              </Typography>
            </Link>

            <a
              href="mailto:hello@unstructured.studio"
              className={common_classes.textDecorationNone}
            >
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.contactUs')}
              </Typography>
            </a>
          </Box>
        </section>

        <Zoom in={useScrollTrigger}>
          <div
            onClick={e => handleScrollTopClick(e, backToTopEl)}
            role="presentation"
            className={classes.scrollTopButtonStyle}
          >
            <Fab color="secondary" size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </div>
        </Zoom>
      </footer>
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
