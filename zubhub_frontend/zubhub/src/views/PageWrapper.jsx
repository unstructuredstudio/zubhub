import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect } from 'react-redux';

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
  getQueryParams
} from './search_results/searchResultsScripts'

import CustomButton from '../components/button/Button.js';
import LoadingPage from './loading/LoadingPage';
import * as AuthActions from '../store/actions/authActions';
import * as ProjectActions from '../store/actions/projectActions';
import unstructuredLogo from '../assets/images/logos/unstructured-logo.png';
import logo from '../assets/images/logos/logo.png';
import styles from '../assets/js/styles/views/page_wrapper/pageWrapperStyles';
import commonStyles from '../assets/js/styles';

import languageMap from '../assets/js/languageMap.json';

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
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    username: null,
    anchor_el: null,
    loading: false,
    open_search_form: false,
  });

  React.useEffect(() => {
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

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { anchor_el, loading, open_search_form } = state;
  const { t } = props;
  const { zubhub } = props.projects;
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
              >
                <FormControl variant="outlined">
                  <InputLabel
                    htmlFor="q"
                    className={classes.searchFormLabelStyle}
                  >
                    {t('pageWrapper.inputs.search.label')}
                  </InputLabel>
                  <OutlinedInput
                    name="q"
                    id="q"
                    type="search"
                    defaultValue={props.location.search && getQueryParams(props.location.search).query}
                    className={clsx(
                      classes.searchFormInputStyle,
                      'search-form-input',
                    )}
                    placeholder={`${t('pageWrapper.inputs.search.label')}...`}
                    pattern="(.|\s)*\S(.|\s)*"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          type="submit"
                          className={classes.searchFormSubmitStyle}
                          aria-label={t('pageWrapper.inputs.search.label')}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
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
                      customButtonStyle
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
                      className={common_classes.marginLeft1em}
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
                      customButtonStyle
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
                  <Avatar
                    className={classes.avatarStyle}
                    aria-label={`${props.auth.username}' Avatar`}
                    aria-controls="profile_menu"
                    aria-haspopup="true"
                    onClick={e => handleSetState(handleProfileMenuOpen(e))}
                    src={props.auth.avatar}
                    alt={props.auth.username}
                  />
                  <Menu
                    className={classes.profileMenuStyle}
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
                      <Typography
                        variant="subtitle2"
                        color="textPrimary"
                        component="span"
                        className={classes.profileStyle}
                      >
                        {props.auth.username}
                      </Typography>
                    </MenuItem>
                    <MenuItem>
                      <a className={classes.textDecorationNone} href="/profile">
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {t('pageWrapper.navbar.profile')}
                        </Typography>
                      </a>
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
              >
                <FormControl variant="outlined">
                  <InputLabel
                    htmlFor="q"
                    className={classes.searchFormLabelStyle}
                  >
                    {t('pageWrapper.inputs.search.label')}
                  </InputLabel>
                  <OutlinedInput
                    name="q"
                    id="q"
                    type="search"
                    className={clsx(
                      classes.smallSearchFormInputStyle,
                      'search-form-input',
                    )}
                    placeholder={`${t('pageWrapper.inputs.search.label')}...`}
                    pattern="(.|\s)*\S(.|\s)*"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          type="submit"
                          className={classes.searchFormSubmitStyle}
                          aria-label="search"
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </ClickAwayListener>
          ) : null}
        </Container>
      </AppBar>
      <Toolbar ref={backToTopEl} />

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
              href="http://kriti.unstructured.studio/"
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
