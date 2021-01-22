import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  useScrollTrigger,
  Box,
  Fab,
  Zoom,
  Menu,
  MenuItem,
  Avatar,
} from '@material-ui/core';

import CustomButton from '../components/button/Button.js';
import LoadingPage from './loading/LoadingPage';
import * as AuthActions from '../store/actions/authActions';
import unstructuredLogo from '../assets/images/logos/unstructured-logo.png';
import logo from '../assets/images/logos/logo.png';
import styles from '../assets/js/styles/views/page_wrapper/pageWrapperStyles';
import commonStyles from '../assets/js/styles';

const useStyles = makeStyles(styles);

const logout = (e, props) => {
  e.preventDefault();
  return props.logout(props);
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

function PageWrapper(props) {
  const backToTopEl = React.useRef(null);
  const classes = useStyles();
  const commonClasses = makeStyles(commonStyles)();

  const [state, setState] = React.useState({
    username: null,
    anchorEl: null,
    loading: false,
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

  const { anchorEl, loading } = state;
  const profileMenuOpen = Boolean(anchorEl);
  return (
    <>
      <ToastContainer />
      <CssBaseline />
      <AppBar className={classes.navBarStyle}>
        <Container className={classes.mainContainerStyle}>
          <Toolbar>
            <Box className={classes.logoStyle}>
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </Box>
            <div className={classes.navActionStyle}>
              {!props.auth.token ? (
                <>
                  <Link className={classes.textDecorationNone} to="/login">
                    <CustomButton
                      variant="outlined"
                      size="large"
                      secondaryButtonStyle
                    >
                      Login
                    </CustomButton>
                  </Link>
                  <Link className={classes.textDecorationNone} to="/signup">
                    <CustomButton
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      className={commonClasses.marginLeft1em}
                    >
                      Sign Up
                    </CustomButton>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className={classes.textDecorationNone}
                    to="/projects/create"
                  >
                    <CustomButton
                      className={commonClasses.marginLeft1em}
                      variant="contained"
                      primaryButtonStyle
                      size="small"
                    >
                      Create Project
                    </CustomButton>
                  </Link>
                  <Avatar
                    className={classes.avatarStyle}
                    aria-label={`${props.auth.username}' Avatar`}
                    aria-controls="profile_menu"
                    aria-haspopup="true"
                    onClick={e => handleSetState(handleProfileMenuOpen(e))}
                    src={`https://robohash.org/${props.auth.username}`}
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
                    <MenuItem className={classes.profileStyle}>
                      <a className={classes.textDecorationNone} href="/profile">
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {props.auth.username}
                        </Typography>
                      </a>
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
                          Projects
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
                          Followers
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
                          Following
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
                          Saved Projects
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem className={classes.logOutStyle}>
                      <Typography
                        className={classes.textDecorationNone}
                        onClick={e => logout(e, props)}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          Logout
                        </Typography>
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar ref={backToTopEl} />

      {loading ? <LoadingPage /> : props.children}

      <footer className="footer-distributed" style={{ flexShrink: 0 }}>
        <div className="footer-right"></div>

        <div className="footer-left"></div>
        <a href="https://unstructured.studio">
          <img
            src={unstructuredLogo}
            className={classes.footerLogoStyle}
            alt="unstructured-studio-logo"
          />
        </a>
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
    logout: props => {
      return dispatch(AuthActions.logout(props));
    },
    get_auth_user: props => {
      return dispatch(AuthActions.get_auth_user(props));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageWrapper);
