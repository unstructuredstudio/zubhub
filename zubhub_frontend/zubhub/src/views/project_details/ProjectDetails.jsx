import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { makeStyles } from '@material-ui/core/styles';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Avatar,
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

import * as UserActions from '../../store/actions/userActions';
import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import Comments from '../../components/comments/Comments';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import ClapIcon, { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import nFormatter from '../../assets/js/nFormatter';
import styles, {
  sliderSettings,
} from '../../assets/js/styles/views/project_details/projectDetailsStyles';
import commonStyles from '../../assets/js/styles';
import parse_comments from '../../assets/js/parseComments';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const handleOpenEnlargedImageDialog = (e, state) => {
  const image_url = e.currentTarget.getAttribute('src');
  const openEnlargedImageDialog = !state.openEnlargedImageDialog;
  return { enlargedImageUrl: image_url, openEnlargedImageDialog };
};

const handleToggleDeleteProjectModal = state => {
  const openDeleteProjectModal = !state.openDeleteProjectModal;
  return { openDeleteProjectModal };
};

const deleteProject = (props, state) => {
  if (props.auth.token && props.auth.id === state.project.creator.id) {
    return props
      .delete_project({
        token: props.auth.token,
        id: state.project.id,
        t: props.t,
        history: props.history,
      })
      .catch(error => ({ deleteProjectDialogError: error.message }));
  } else {
    return handleToggleDeleteProjectModal(state);
  }
};

const toggle_save = (e, props, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props.toggle_save({
      id,
      token: props.auth.token,
      t: props.t,
    });
  }
};

const toggle_like = (e, props, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    return props.history.push('/login');
  } else {
    return props.toggle_like({ id, token: props.auth.token, t: props.t });
  }
};

const toggle_follow = (e, props, id, state) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props
      .toggle_follow({ id, token: props.auth.token, t: props.t })
      .then(({ profile }) => {
        const { project } = state;
        if (project.creator.id === profile.id) {
          project.creator = profile;
        }

        return { project };
      });
  }
};

const buildMaterialsUsedComponent = (classes, state) => {
  const arr =
    state.project.materials_used && state.project.materials_used.split(',');
  return arr.map((material, index) => (
    <Typography
      key={index}
      component="span"
      className={classes.materialsUsedStyle}
    >
      {material}
    </Typography>
  ));
};

const buildTagsComponent = (classes, tags, history) => {
  return tags.map((tag, index) => (
    <CustomButton
      key={index}
      className={classes.tagsStyle}
      onClick={() => history.push(`/search?q=${tag.name}`)}
    >
      {tag.name}
    </CustomButton>
  ));
};

function ProjectDetails(props) {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    project: {},
    loading: true,
    enlargedImageUrl: '',
    openEnlargedImageDialog: false,
    openDeleteProjectModal: false,
    deleteProjectDialogError: null,
  });

  React.useEffect(() => {
    Promise.resolve(
      props.get_project({
        id: props.match.params.id,
        token: props.auth.token,
        t: props.t,
      }),
    ).then(obj => {
      if (obj.project) {
        parse_comments(obj.project.comments);
      }
      handleSetState(obj);
    });
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    project,
    loading,
    enlargedImageUrl,
    openEnlargedImageDialog,
    openDeleteProjectModal,
    deleteProjectDialogError,
  } = state;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else if (Object.keys(project).length > 0) {
    return (
      <>
        <Box className={classes.root}>
          <Paper className={classes.projectDetailHeaderStyle}>
            <Container className={classes.headerStyle}>
              <Typography
                className={classes.titleStyle}
                variant="h3"
                gutterBottom
              >
                {project.title}
              </Typography>
              <Grid container justify="space-around">
                <Grid item className={classes.creatorProfileStyle}>
                  <Link
                    className={clsx(classes.textDecorationNone)}
                    to={`/creators/${project.creator.username}`}
                  >
                    <Avatar
                      className={classes.creatorAvatarStyle}
                      src={project.creator.avatar}
                      alt={project.creator.username}
                    />
                    <Typography color="textSecondary" component="span">
                      {project.creator.username}
                    </Typography>
                  </Link>
                  {project.creator.id === props.auth.id ? (
                    <>
                      <Link
                        className={classes.textDecorationNone}
                        to={`/projects/${project.id}/edit`}
                      >
                        <CustomButton
                          className={commonClasses.marginLeft1em}
                          variant="contained"
                          primaryButtonStyle
                        >
                          {t('projectDetails.project.edit')}
                        </CustomButton>
                      </Link>
                      <CustomButton
                        className={commonClasses.marginLeft1em}
                        variant="contained"
                        dangerButtonStyle
                        onClick={() =>
                          handleSetState(handleToggleDeleteProjectModal(state))
                        }
                      >
                        {t('projectDetails.project.delete.label')}
                      </CustomButton>
                    </>
                  ) : (
                    <CustomButton
                      className={commonClasses.marginLeft1em}
                      variant="contained"
                      onClick={e =>
                        handleSetState(
                          toggle_follow(e, props, project.creator.id, state),
                        )
                      }
                      primaryButtonStyle
                    >
                      {project.creator.followers.includes(props.auth.id)
                        ? t('projectDetails.project.creator.unfollow')
                        : t('projectDetails.project.creator.follow')}
                    </CustomButton>
                  )}
                </Grid>
              </Grid>
            </Container>
            <Container className={classes.detailStyle}>
              <Grid container justify="center">
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  className={clsx(
                    classes.positionRelative,
                    classes.marginBottom1em,
                  )}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    className={clsx(
                      classes.videoWrapperStyle,
                      classes.positionRelative,
                    )}
                  >
                    {project.video ? (
                      <iframe
                        title={project.title}
                        className={classes.iframeStyle}
                        src={project.video}
                      ></iframe>
                    ) : project.images.length > 0 ? (
                      <img
                        className={classes.iframeStyle}
                        src={project.images[0].image_url}
                        alt={project.title}
                      />
                    ) : null}
                  </Grid>
                  <Box className={classes.actionBoxStyle}>
                    <CustomButton
                      className={classes.actionBoxButtonStyle}
                      size="small"
                      aria-label={t(
                        'projectDetails.ariaLabels.likeButton.label',
                      )}
                      variant="extended"
                      onClick={e =>
                        handleSetState(toggle_like(e, props, project.id))
                      }
                    >
                      {project.likes.includes(props.auth.id) ? (
                        <ClapIcon
                          arial-label={t(
                            'projectDetails.ariaLabels.likeButton.unlilke',
                          )}
                        />
                      ) : (
                        <ClapBorderIcon
                          arial-label={t(
                            'projectDetails.ariaLabels.likeButton.like',
                          )}
                        />
                      )}
                      <Typography>
                        {nFormatter(project.likes.length)}
                      </Typography>
                    </CustomButton>
                    <CustomButton
                      className={classes.actionBoxButtonStyle}
                      size="small"
                      aria-label={t(
                        'projectDetails.ariaLabels.saveButton.label',
                      )}
                      onClick={e =>
                        handleSetState(toggle_save(e, props, project.id))
                      }
                    >
                      {project.saved_by.includes(props.auth.id) ? (
                        <BookmarkIcon
                          aria-label={t(
                            'projectDetails.ariaLabels.saveButton.unsave',
                          )}
                        />
                      ) : (
                        <BookmarkBorderIcon
                          aria-label={t(
                            'projectDetails.ariaLabels.saveButton.save',
                          )}
                        />
                      )}
                    </CustomButton>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                      component="span"
                      className={classes.actionBoxButtonStyle}
                    >
                      <VisibilityIcon />
                      <Typography>{project.views_count}</Typography>
                    </Typography>
                  </Box>
                </Grid>
                {project.images && project.images.length > 0 ? (
                  <Grid item xs={12} sm={12} md={12} align="center">
                    <Box className={classes.sliderBoxStyle}>
                      <Slider {...sliderSettings(project.images.length)}>
                        {project.images.map(image => (
                          <div>
                            <img
                              key={image.public_id}
                              className={classes.carouselImageStyle}
                              src={image.image_url}
                              alt={image.public_id}
                              onClick={e =>
                                handleSetState(
                                  handleOpenEnlargedImageDialog(e, state),
                                )
                              }
                            />
                          </div>
                        ))}
                      </Slider>
                    </Box>
                  </Grid>
                ) : null}
                <Grid item xs={12} sm={12} md={12}>
                  <Typography
                    variant="h5"
                    className={classes.descriptionHeadingStyle}
                  >
                    {t('projectDetails.project.description')}
                  </Typography>
                  <Typography
                    className={classes.descriptionBodyStyle}
                    color="textSecondary"
                  >
                    {project.description}
                  </Typography>
                </Grid>
                {project.tags.length > 0 ? (
                  <Grid item xs={12} sm={12} md={12}>
                    <Box className={classes.tagsBoxStyle}>
                      {buildTagsComponent(classes, project.tags, props.history)}
                    </Box>
                  </Grid>
                ) : null}
                <Grid item xs={12} sm={12} md={12}>
                  <Typography
                    variant="h5"
                    className={classes.descriptionHeadingStyle}
                  >
                    {t('projectDetails.project.materials')}
                  </Typography>
                  <Typography
                    className={classes.descriptionBodyStyle}
                    color="textSecondary"
                  >
                    {buildMaterialsUsedComponent(classes, state)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography
                    variant="h5"
                    className={classes.descriptionHeadingStyle}
                  >
                    {t('projectDetails.project.category')}
                  </Typography>
                  {project.category ? (
                    <CustomButton
                      className={classes.categoryStyle}
                      onClick={() =>
                        props.history.push(`/search?q=${project.category}`)
                      }
                    >
                      {project.category}
                    </CustomButton>
                  ) : (
                    <Typography className={classes.categoryStyle}>
                      {t('projectDetails.project.none')}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Container>

            <Comments
              context={{ name: 'project', body: project }}
              handleSetState={handleSetState}
              {...props}
            />
          </Paper>
        </Box>

        <Dialog
          PaperProps={{
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
          className={classes.enlargedImageDialogStyle}
          open={openEnlargedImageDialog}
          onClose={() =>
            setState({
              ...state,
              openEnlargedImageDialog: !openEnlargedImageDialog,
            })
          }
          aria-labelledby={t('projectDetails.ariaLabels.imageDialog')}
        >
          <img
            className={classes.enlargedImageStyle}
            src={enlargedImageUrl}
            alt={`${project.title}`}
          />
        </Dialog>

        <Dialog
          open={openDeleteProjectModal}
          onClose={() => handleSetState(handleToggleDeleteProjectModal(state))}
          aria-labelledby={t('projectDetails.ariaLabels.deleteProject')}
        >
          <DialogTitle id="delete-project">
            {t('projectDetails.project.delete.dialog.primary')}
          </DialogTitle>
          <Box
            component="p"
            className={deleteProjectDialogError !== null && classes.errorBox}
          >
            {deleteProjectDialogError !== null && (
              <Box component="span" className={classes.error}>
                {deleteProjectDialogError}
              </Box>
            )}
          </Box>{' '}
          <DialogContent>
            <Typography>
              {t('projectDetails.project.delete.dialog.secondary')}
            </Typography>
          </DialogContent>
          <DialogActions>
            <CustomButton
              variant="outlined"
              onClick={() =>
                handleSetState(handleToggleDeleteProjectModal(state))
              }
              color="primary"
              secondaryButtonStyle
            >
              {t('projectDetails.project.delete.dialog.cancel')}
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={e => handleSetState(deleteProject(props, state))}
              dangerButtonStyle
            >
              {t('projectDetails.project.delete.dialog.proceed')}
            </CustomButton>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return <ErrorPage error={t('projectDetails.errors.unexpected')} />;
  }
}

ProjectDetails.propTypes = {
  auth: PropTypes.object.isRequired,
  get_project: PropTypes.func.isRequired,
  suggest_creators: PropTypes.func.isRequired,
  delete_project: PropTypes.func.isRequired,
  unpublish_comment: PropTypes.func.isRequired,
  delete_comment: PropTypes.func.isRequired,
  toggle_follow: PropTypes.func.isRequired,
  toggle_like: PropTypes.func.isRequired,
  toggle_save: PropTypes.func.isRequired,
  add_comment: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    get_project: args => {
      return dispatch(ProjectActions.get_project(args));
    },
    suggest_creators: args => {
      return dispatch(UserActions.suggest_creators(args));
    },
    delete_project: args => {
      return dispatch(ProjectActions.delete_project(args));
    },
    unpublish_comment: args => {
      return dispatch(ProjectActions.unpublish_comment(args));
    },
    delete_comment: args => {
      return dispatch(ProjectActions.delete_comment(args));
    },
    toggle_follow: args => {
      return dispatch(UserActions.toggle_follow(args));
    },
    toggle_like: args => {
      return dispatch(ProjectActions.toggle_like(args));
    },
    toggle_save: args => {
      return dispatch(ProjectActions.toggle_save(args));
    },
    add_comment: args => {
      return dispatch(ProjectActions.add_comment(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
