import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@mui/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TranslateIcon from '@mui/icons-material/Translate';

import {
  CssBaseline,
  Container,
  Toolbar,
  Typography,
  useScrollTrigger,
  Box,
  Fab,
  Zoom,
  MenuItem,
  Select,
} from '@mui/material';

import { fetchHero, handleScrollTopClick, handleProfileMenuClose, handleChangeLanguage } from './pageWrapperScripts';

import LoadingPage from './loading/LoadingPage';
import * as AuthActions from '../store/actions/authActions';
import * as ProjectActions from '../store/actions/projectActions';
import unstructuredLogo from '../assets/images/logos/unstructured-logo.png';
import styles from '../assets/js/styles/views/page_wrapper/pageWrapperStyles';
import commonStyles from '../assets/js/styles';

import languageMap from '../assets/js/languageMap.json';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import Navbar from '../components/Navbar/Navbar';
import NotFoundPage from './not_found/NotFound';

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
  const params = useParams();
  const location = useLocation();
  const routeProps = {
    location,
    params,
    navigate,
  };

  const [state, setState] = React.useState({
    loading: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    setIsVisible(prevScrollPos < currentScrollPos);
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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

  const { loading } = state;
  const { t } = props;
  const { zubhub, hero } = props.projects;

  // TODO: remove childrenRenderer and use children directly. this will likely mean having useNavigate, useParams,
  //       useLocation in every component that needs them.
  //       React.cloneElement makes our code brittle: see https://react.dev/reference/react/cloneElement
  const childrenRenderer = () =>
    React.Children.map(props.children, child => React.cloneElement(child, { ...props, ...routeProps }));
  return (
    <>
      <ToastContainer />
      <CssBaseline />

      <Toolbar ref={backToTopEl} className={classes.marginBottom} />
      <Navbar {...props} {...routeProps} />

      <Container className={classes.childrenContainer} maxWidth="lg">
        {props.auth?.token ? <DashboardLayout>{loading ? <LoadingPage /> : childrenRenderer()}</DashboardLayout> : null}
        {!props.auth?.token &&
          ![
            '/',
            '/signup',
            '/login',
            '/projects/:id',
            '/ambassadors',
            '/creators/:username',
            '/privacy_policy',
            '/terms_of_use',
            '/about',
            '/challenge',
            '/password-reset',
            '/email-confirm',
            '/password-reset-confirm',
          ].includes(location?.pathname) && (
            <div style={{ minHeight: '80vh' }}>
              <NotFoundPage />
            </div>
          )}
      </Container>
      {!props.auth?.token &&
        [
          '/',
          '/signup',
          '/login',
          '/password-reset',
          '/projects/:id',
          '/ambassadors',
          '/creators/:username',
          '/privacy_policy',
          '/terms_of_use',
          '/about',
          '/challenge',
          '/email-confirm',
          '/password-reset-confirm',
        ].includes(location?.pathname) && <div style={{ minHeight: '90vh' }}>{childrenRenderer()}</div>}

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

const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects,
});

const mapDispatchToProps = dispatch => ({
  setAuthUser: auth_user => {
    dispatch(AuthActions.setAuthUser(auth_user));
  },
  logout: args => dispatch(AuthActions.logout(args)),
  getAuthUser: props => dispatch(AuthActions.getAuthUser(props)),
  getHero: args => dispatch(ProjectActions.getHero(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageWrapper);
