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
import {
  handleOpenEnlargedImageDialog,
  handleToggleDeleteProjectModal,
  isVideoFromGdrive,
  deleteProject,
  toggleSave,
  toggleLike,
  toggleFollow,
  isCloudinaryVideo,
} from './projectDetailsScripts';

import {
  nFormatter,
  parseComments,
  cloudinaryFactory,
  getPlayerOptions,
} from '../../assets/js/utils/scripts';
import styles, {
  sliderSettings,
} from '../../assets/js/styles/views/project_details/projectDetailsStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

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
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    project: {},
    loading: true,
    enlarged_image_url: '',
    open_enlarged_image_dialog: false,
    open_delete_project_modal: false,
    delete_project_dialog_error: null,
  });

  React.useEffect(() => {
    Promise.resolve(
      props.getProject({
        id: props.match.params.id,
        token: props.auth.token,
        t: props.t,
      }),
    ).then(obj => {
      if (obj.project) {
        parseComments(obj.project.comments);
      }
      handleSetState(obj);
    });
  }, []);

  React.useEffect(() => {
    if (state.project.video && isCloudinaryVideo(state.project.video)) {
      const cld = cloudinaryFactory(window);

      const player = cld.videoPlayer('cloudinary-video-player', {
        ...getPlayerOptions(window, state.project.video),
      });

      player.source(state.project.video);
      player.videojs.error(null);
      player.videojs.error({
        message: props.t('project.errors.videoPlayerError'),
      });
    }
  }, [state.project.video]);

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
    enlarged_image_url,
    open_enlarged_image_dialog,
    open_delete_project_modal,
    delete_project_dialog_error,
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
                          className={common_classes.marginLeft1em}
                          variant="contained"
                          primaryButtonStyle
                        >
                          {t('projectDetails.project.edit')}
                        </CustomButton>
                      </Link>
                      <CustomButton
                        className={common_classes.marginLeft1em}
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
                      className={common_classes.marginLeft1em}
                      variant="contained"
                      onClick={e =>
                        handleSetState(
                          toggleFollow(e, props, project.creator.id, state),
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
                      isCloudinaryVideo(project.video) ? (
                        <video
                          id="cloudinary-video-player"
                          controls
                          className={clsx(
                            'cld-video-player',
                            classes.iframeStyle,
                          )}
                        ></video>
                      ) : (
                        <iframe
                          title={project.title}
                          className={classes.iframeStyle}
                          src={project.video}
                        ></iframe>
                      )
                    ) : project.images.length > 0 ? (
                      <img
                        className={classes.iframeStyle}
                        src={project.images[0].image_url}
                        alt={project.title}
                      />
                    ) : null}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    {project.video && isVideoFromGdrive(project.video) ? (
                      <a
                        className={common_classes.floatRight}
                        href={project.video}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Can't play video? click here
                      </a>
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
                        handleSetState(toggleLike(e, props, project.id))
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
                        handleSetState(toggleSave(e, props, project.id))
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
          open={open_enlarged_image_dialog}
          onClose={() =>
            setState({
              ...state,
              open_enlarged_image_dialog: !open_enlarged_image_dialog,
            })
          }
          aria-labelledby={t('projectDetails.ariaLabels.imageDialog')}
        >
          <img
            className={classes.enlargedImageStyle}
            src={enlarged_image_url}
            alt={`${project.title}`}
          />
        </Dialog>

        <Dialog
          open={open_delete_project_modal}
          onClose={() => handleSetState(handleToggleDeleteProjectModal(state))}
          aria-labelledby={t('projectDetails.ariaLabels.deleteProject')}
        >
          <DialogTitle id="delete-project">
            {t('projectDetails.project.delete.dialog.primary')}
          </DialogTitle>
          <Box
            component="p"
            className={delete_project_dialog_error !== null && classes.errorBox}
          >
            {delete_project_dialog_error !== null && (
              <Box component="span" className={classes.error}>
                {delete_project_dialog_error}
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
  getProject: PropTypes.func.isRequired,
  suggestCreators: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  unpublishComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  toggleFollow: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProject: args => {
      return dispatch(ProjectActions.getProject(args));
    },
    suggestCreators: args => {
      return dispatch(UserActions.suggestCreators(args));
    },
    deleteProject: args => {
      return dispatch(ProjectActions.deleteProject(args));
    },
    unpublishComment: args => {
      return dispatch(ProjectActions.unpublishComment(args));
    },
    deleteComment: args => {
      return dispatch(ProjectActions.deleteComment(args));
    },
    toggleFollow: args => {
      return dispatch(UserActions.toggleFollow(args));
    },
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
    addComment: args => {
      return dispatch(ProjectActions.addComment(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
