import clsx from 'clsx';
import PropTypes from 'prop-types';
import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@mui/styles';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Translate as TranslateIcon,
  SearchOutlined,
} from '@mui/icons-material';

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

import { capitalize } from '../../assets/js/utils/scripts';

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
import * as CreatorActions from '../../store/actions/userActions';

import languageMap from '../../assets/js/languageMap.json';
import Autocomplete from '../autocomplete/Autocomplete';
import Option from '../autocomplete/Option';
import InputSelect from '../input_select/InputSelect';
import NotificationButton from '../notification_button/NotificationButton';
import AvatarButton from '../avatar_button/AvatarButton';
import Sidenav from '../Sidenav/Sidenav';
import {
  toggleDrawer,
  toggleSearchBar,
  autoComplete,
  isSearch,
  handleSubmit,
  onSearchOptionClick,
} from './navbarScripts';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function NavBar View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function NavBar(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const trigger = useScrollTrigger();
  const formRef = useRef();

  const [state, setState] = React.useState({
    open_search_form: false,
    sidenav_open: false,
    is_autocomplete_open: false,
    autocomplete: [],
    autocomplete_reset: null,
    search_type: getQueryParams(window.location.href).get('type') || SearchType.PROJECTS,
    query: isSearch(props.location.pathname) ? getQueryParams(window.location.href).get('q') : '',
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  useEffect(() => {
    state.autocomplete_reset && state.autocomplete_reset();
    const debouncedAutoComplete = _.debounce(
      () =>
        handleSetState(
          autoComplete(
            props,
            state.query || (props.location.search && getQueryParams(window.location.href).get('q')),
            state.search_type,
          ),
        ),
      1000,
    );
    debouncedAutoComplete();
    handleSetState({ autocomplete_reset: debouncedAutoComplete.cancel });
  }, [state.query, state.search_type, props.auth.token]);

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

  const { open_search_form, sidenav_open, search_type, is_autocomplete_open, query, autocomplete } = state;
  const { t } = props;
  const { zubhub } = props.projects;

  return (
    <>
      <AppBar className={classes.navBarStyle}>
        <Container id="navbar-root" className={classes.mainContainerStyle}>
          <Toolbar className={classes.toolBarStyle}>
            <Hidden mdUp>
              <Box style={{ marginRight: 10 }} onClick={e => handleSetState(toggleDrawer(e, sidenav_open))}>
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
              <form
                action="/search"
                className={clsx(classes.searchFormStyle, classes.removeOn894)}
                role="search"
                onSubmit={e => handleSubmit(e, props, query, search_type)}
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
                      <InputSelect
                        searchType={search_type}
                        onSearchTypeChange={value => handleSetState({ search_type: value })}
                        name="type"
                      >
                        <MenuItem value={SearchType.PROJECTS}>{t('pageWrapper.navbar.searchType.projects')}</MenuItem>
                        <MenuItem value={SearchType.CREATORS}>{t('pageWrapper.navbar.searchType.creators')}</MenuItem>
                        <MenuItem value={SearchType.TAGS}>{t('pageWrapper.navbar.searchType.tags')}</MenuItem>
                      </InputSelect>
                    </FormControl>
                    <Autocomplete
                      open={is_autocomplete_open}
                      onOpen={() => props.auth.token && handleSetState({ is_autocomplete_open: true })}
                      onClose={() => handleSetState({ is_autocomplete_open: false })}
                      className={classes.input}
                      options={autocomplete}
                      defaultValue={{ title: query }}
                      value={{ title: query }}
                      renderOption={(renderOptionProps, option, { inputValue }) => (
                        <Option
                          {...renderOptionProps}
                          option={option}
                          inputValue={inputValue}
                          onOptionClick={(e, option) => onSearchOptionClick(e, props, option, search_type)}
                        />
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
                          onChange={e => handleSetState({ query: e.target.value })}
                          placeholder={`${t('pageWrapper.inputs.search.label')}...`}
                        />
                      )}
                    </Autocomplete>
                  </FormGroup>
                </FormControl>
              </form>
            </Box>
            <div className={classes.navActionStyle}>
              <SearchOutlined
                onClick={() => handleSetState(toggleSearchBar(open_search_form))}
                className={classes.addOn894}
              />

              <NotificationButton />
              <Hidden smDown>
                {props.auth.username && (
                  <Box>
                    <Typography className={clsx(common_classes.title2, classes.username)}>
                      {props.auth.username}
                    </Typography>
                    <Typography className="">{props.auth.tags ? capitalize(props.auth.tags[0]) : ''}</Typography>
                  </Box>
                )}
              </Hidden>

              <AvatarButton navigate={props.navigate} />
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
                  <InputSelect
                    searchType={search_type}
                    onSearchTypeChange={value => handleSetState({ search_type: value })}
                    name="type"
                  >
                    <MenuItem value={SearchType.PROJECTS}>{t('pageWrapper.navbar.searchType.projects')}</MenuItem>
                    <MenuItem value={SearchType.CREATORS}>{t('pageWrapper.navbar.searchType.creators')}</MenuItem>
                    <MenuItem value={SearchType.TAGS}>{t('pageWrapper.navbar.searchType.tags')}</MenuItem>
                  </InputSelect>
                </FormControl>
                <FormControl variant="outlined" style={{ flex: '1 1 auto', maxWidth: '350px' }}>
                  <InputLabel htmlFor="q" className={classes.searchFormLabelStyle}>
                    {t('pageWrapper.inputs.search.label')}
                  </InputLabel>
                  <Autocomplete
                    style={{ width: '100%' }}
                    options={autocomplete}
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
                        onChange={e => handleSetState({ query: e.target.value })}
                      />
                    )}
                  </Autocomplete>
                </FormControl>
              </form>
            </ClickAwayListener>
          ) : null}
        </Container>
        {/* <BreadCrumb /> */}
        <SwipeableDrawer anchor="sidenav_anchor" open={sidenav_open} onClose={toggleDrawer} onOpen={toggleDrawer}>
          {sidenav_open ? <Sidenav /> : null}
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

const mapStateToProps = state => ({ auth: state.auth, projects: state.projects });

const mapDispatchToProps = dispatch => ({
  setAuthUser: auth_user => dispatch(AuthActions.setAuthUser(auth_user)),
  logout: args => dispatch(AuthActions.logout(args)),
  getAuthUser: props => dispatch(AuthActions.getAuthUser(props)),
  getHero: args => dispatch(ProjectActions.getHero(args)),
  autoCompleteTags: args => dispatch(ProjectActions.autoCompleteTags(args)),
  autoCompleteCreators: args => dispatch(CreatorActions.autoCompleteCreators(args)),
  autoCompleteProjects: args => dispatch(ProjectActions.autoCompleteProjects(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
