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

import CustomButton from '../components/button/Button.js';
import LoadingPage from './loading/LoadingPage';
import * as AuthActions from '../store/actions/authActions';
import unstructuredLogo from '../assets/images/logos/unstructured-logo.png';
import logo from '../assets/images/logos/logo.png';
import styles from '../assets/js/styles/views/page_wrapper/pageWrapperStyles';
import commonStyles from '../assets/js/styles';

import languageMap from '../assets/js/languageMap.json';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const logout = (e, props) => {
  e.preventDefault();
  return props.logout({
    token: props.auth.token,
    history: props.history,
    t: props.t,
  });
};

const handleScrollTopClick = (e, ref) => {
  e.preventDefault();
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const handleProfileMenuOpen = e => {
  return { anchorEl: e.currentTarget };
};

const handleProfileMenuClose = () => {
  return { anchorEl: null };
};

const handleChangeLanguage = ({ e, props }) => {
  props.i18n.changeLanguage(e.target.value);
};

const handleToggleSearchForm = ({ openSearchForm }) => {
  return { openSearchForm: !openSearchForm };
};

const handleCloseSearchForm = () => {
  return { openSearchForm: false };
};

const closeSearchFormOrIgnore = e => {
  let isToggleSearchButton;
  e.path.forEach(el => {
    if (el.id === 'toggle-search') {
      isToggleSearchButton = true;
    }
  });
  if (!isToggleSearchButton) return handleCloseSearchForm();
};

function PageWrapper(props) {
  const backToTopEl = React.useRef(null);
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    username: null,
    anchorEl: null,
    loading: false,
    openSearchForm: false,
  });

  React.useEffect(() => {
    if (props.auth.token) {
      handleSetState({ loading: true });
      props.get_auth_user(props).finally(() => {
        handleSetState({ loading: false });
      });
    }
  }, [props.auth.token]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { anchorEl, loading, openSearchForm } = state;
  const { t } = props;
  const profileMenuOpen = Boolean(anchorEl);
  return (
    <>
      <ToastContainer />
      <CssBaseline />
      <AppBar className={classes.navBarStyle}>
        <Container className={classes.mainContainerStyle}>
          <Toolbar className={classes.toolBarStyle}>
            <Box className={classes.logoStyle}>
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
              <Box
                className={clsx(
                  classes.languageSelectBoxStyle,
                  commonClasses.displayInlineFlex,
                  commonClasses.alignCenter,
                  commonClasses.addOnSmallScreen,
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
                  commonClasses.displayInlineFlex,
                  commonClasses.alignCenter,
                  commonClasses.removeOnSmallScreen,
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
                      commonClasses.removeOnSmallScreen,
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
                      commonClasses.removeOnSmallScreen,
                    )}
                    to="/signup"
                  >
                    <CustomButton
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      customButtonStyle
                      className={commonClasses.marginLeft1em}
                    >
                      {t('pageWrapper.navbar.signup')}
                    </CustomButton>
                  </Link>

                  <MenuRoundedIcon
                    className={commonClasses.addOnSmallScreen}
                    aria-label={t('pageWrapper.navbar.menu')}
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={e => handleSetState(handleProfileMenuOpen(e))}
                  />
                  <Menu
                    className={commonClasses.addOnSmallScreen}
                    id="menu"
                    anchorEl={anchorEl}
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
                      commonClasses.marginRight1em,
                      commonClasses.removeOnSmallScreen,
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
                    anchorEl={anchorEl}
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
                    <MenuItem className={commonClasses.addOnSmallScreen}>
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
                        className={commonClasses.colorRed}
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
          {openSearchForm ? (
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
              src={unstructuredLogo}
              className={classes.footerLogoStyle}
              alt="unstructured-studio-logo"
            />
          </a>
          <div>
            <Box
              className={clsx(
                classes.languageSelectBoxStyle,
                commonClasses.displayInlineFlex,
                commonClasses.alignCenter,
                commonClasses.addOnSmallScreen,
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
                commonClasses.displayInlineFlex,
                commonClasses.alignCenter,
                commonClasses.removeOnSmallScreen,
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
              to={`/guidelines_and_policy`}
              className={commonClasses.textDecorationNone}
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
              className={commonClasses.textDecorationNone}
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

            <a
              href="https://unstructured.studio/zub-app/"
              className={commonClasses.textDecorationNone}
            >
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.zubhub')}
              </Typography>
            </a>

            <a
              href="https://unstructured.studio/about/"
              className={commonClasses.textDecorationNone}
            >
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.unstructuredStudio')}
              </Typography>
            </a>
          </Box>

          <Box className={classes.footerBoxStyle}>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              className={classes.footerTitleStyle}
            >
              {t('pageWrapper.footer.help')}
            </Typography>

            <Link
              to={`/resources`}
              className={commonClasses.textDecorationNone}
            >
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.footerLinkStyle}
              >
                {t('pageWrapper.footer.resources')}
              </Typography>
            </Link>

            <Link to={`/faqs`} className={commonClasses.textDecorationNone}>
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
              className={commonClasses.textDecorationNone}
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
  set_auth_user: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  get_auth_user: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    set_auth_user: auth_user => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
    logout: args => {
      return dispatch(AuthActions.logout(args));
    },
    get_auth_user: props => {
      return dispatch(AuthActions.get_auth_user(props));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageWrapper);
