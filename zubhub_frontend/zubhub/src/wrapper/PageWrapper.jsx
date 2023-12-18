import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect, useSelector } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@mui/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TranslateIcon from '@mui/icons-material/Translate';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchIcon from '@mui/icons-material/Search';

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
} from '@mui/material';

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

import { getQueryParams, SearchType } from '../views/search_results/searchResultsScripts';

import CustomButton from '../components/button/Button.js';
import LoadingPage from '../views/loading/LoadingPage';
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
import { throttle } from '../utils.js/index.js';
import Option from '../components/autocomplete/Option';
import NotificationButton from '../components/notification_button/NotificationButton';
import BreadCrumb from '../components/breadCrumb/breadCrumb';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import Navbar from '../components/Navbar/Navbar';
import NotFoundPage from '../views/not_found/NotFound';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function PageWrapper View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function PageWrapper(props) {
  const backToTopEl = useRef(null);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
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

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    setIsVisible(prevScrollPos < currentScrollPos);
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    if (!props.global && !props.auth.token) {
      return props.navigate('/session-expired');
    }
  }, [props.auth.token, props.global]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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
      <ToastContainer />
      <CssBaseline />

      <Toolbar ref={backToTopEl} className={classes.marginBottom} />
      <Navbar {...props} />

      <Container className={classes.childrenContainer} maxWidth="lg">
        {props.auth?.token ? <DashboardLayout>{loading ? <LoadingPage /> : props.children}</DashboardLayout> : null}
        {!props.auth?.token && !props.global && (
          <div style={{ minHeight: '80vh' }}>
            <NotFoundPage />
          </div>
        )}
      </Container>
      {props.global && <div style={{ minHeight: '90vh' }}>{props.children}</div>}

      <footer className={clsx('footer-distributed', classes.footerStyle)}>
        <Box>
          <a href="https://unstructured.studio">
            <img
              src={zubhub?.footer_logo_url ? zubhub.footer_logo_url : unstructuredLogo}
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
              )}
              style={{ margin: 0 }}
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
          </div>
        </Box>

        <section className={classes.footerSectionStyle}>
          <Box className={classes.footerBoxStyle}>
            <Typography variant="subtitle2" color="textPrimary" className={classes.footerTitleStyle}>
              {t('pageWrapper.footer.privacy')}
            </Typography>

            <Link to={`/privacy_policy`} className={common_classes.textDecorationNone}>
              <Typography variant="subtitle2" color="textPrimary" className={classes.footerLinkStyle}>
                {t('pageWrapper.footer.guidelines')}
              </Typography>
            </Link>

            <Link to={`/terms_of_use`} className={common_classes.textDecorationNone}>
              <Typography variant="subtitle2" color="textPrimary" className={classes.footerLinkStyle}>
                {t('pageWrapper.footer.termsOfUse')}
              </Typography>
            </Link>
          </Box>

          <Box className={classes.footerBoxStyle}>
            <Typography variant="subtitle2" color="textPrimary" className={classes.footerTitleStyle}>
              {t('pageWrapper.footer.about')}
            </Typography>

            <Link to="/about" className={common_classes.textDecorationNone}>
              <Typography variant="subtitle2" color="textPrimary" className={classes.footerLinkStyle}>
                {t('pageWrapper.footer.zubhub')}
              </Typography>
            </Link>

            <Link to="/challenge" className={common_classes.textDecorationNone}>
              <Typography variant="subtitle2" color="textPrimary" className={classes.footerLinkStyle}>
                {t('pageWrapper.footer.challenges')}
              </Typography>
            </Link>
          </Box>

          <Box className={classes.footerBoxStyle}>
            <Typography variant="subtitle2" color="textPrimary" className={classes.footerTitleStyle}>
              {t('pageWrapper.footer.help')}
            </Typography>

            <a
              target="__blank"
              rel="noreferrer"
              href={hero.tinkering_resource_url ? hero.tinkering_resource_url : 'https://kriti.unstructured.studio/'}
              className={common_classes.textDecorationNone}
            >
              <Typography variant="subtitle2" color="textPrimary" className={classes.footerLinkStyle}>
                {t('pageWrapper.footer.resources')}
              </Typography>
            </a>

            <Link to={`/faqs`} className={clsx(common_classes.textDecorationNone, common_classes.displayNone)}>
              <Typography variant="subtitle2" color="textPrimary" className={classes.footerLinkStyle}>
                {t('pageWrapper.footer.faqs')}
              </Typography>
            </Link>

            <a href="mailto:hello@unstructured.studio" className={common_classes.textDecorationNone}>
              <Typography variant="subtitle2" color="textPrimary" className={classes.footerLinkStyle}>
                {t('pageWrapper.footer.contactUs')}
              </Typography>
            </a>
          </Box>
        </section>

        {isVisible && (
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
        )}
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
