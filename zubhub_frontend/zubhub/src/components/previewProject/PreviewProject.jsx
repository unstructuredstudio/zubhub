import { IconButton, useMediaQuery } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FiShare } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Confetti from 'react-confetti';

import {
  Avatar,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';

import ClapIcon, { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import CustomButton from '../button/Button';
import SocialButtons from '../social_share_buttons/socialShareButtons.jsx';
import * as ProjectActions from '../../store/actions/projectActions';
import * as UserActions from '../../store/actions/userActions';
import ErrorPage from '../../views/error/ErrorPage';
import LoadingPage from '../../views/loading/LoadingPage';
import {
  deleteProject,
  handleOpenEnlargedImageDialog,
  handleToggleDeleteProjectModal,
  isCloudinaryVideo,
  isGdriveORVimeoORYoutube,
  toggleFollow,
  toggleLike,
  toggleSave,
} from '../../views/project_details/projectDetailsScripts';

import { CloseOutlined, DescriptionOutlined } from '@material-ui/icons';
import { colors } from '../../assets/js/colors.js';
import commonStyles from '../../assets/js/styles';
import styles, { sliderSettings } from './previewProject.styles';
import { cloudinaryFactory, getPlayerOptions, parseComments } from '../../assets/js/utils/scripts';
import { Comments, Modal } from '../index.js';
import Project from '../project/Project';
import { getUrlQueryObject } from '../../utils.js/index.js';
import Navbar from '../Navbar/Navbar';
import { images } from '../../assets/images';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function buildMaterialsUsedComponent
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const buildMaterialsUsedComponent = (classes, state) => {
  const arr = state.project.materials_used && state.project.materials_used.split(',');
  return arr.map((material, index) => (
    <CustomButton key={index} primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
      {material}
    </CustomButton>
  ));
};

/**
 * @function buildTagsComponent
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const buildTagsComponent = (classes, tags, history) => {
  return tags.map((tag, index) => (
    <CustomButton
      key={index}
      primaryButtonOutlinedStyle
      style={{ borderRadius: 4 }}
      onClick={() => history.push(`/search?q=${tag.name}`)}
    >
      {tag.name}
    </CustomButton>
  ));
};

/**
 * @function PreviewProject View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function PreviewProject({ onClose, ...props }) {
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const [{ height, width }, setDimensions] = useState({});
  const [moreProjects, setMoreProjects] = useState([]);
  const { id } = useParams();
  const [open, setOpen] = useState(false);

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
    ).then(async obj => {
      if (obj.project) {
        let { project } = obj;
        const userProjects = await props.getUserProjects({
          limit: 4,
          username: project.creator.username,
          project_to_omit: project.id,
        });
        let moreProjects = userProjects.results;
        setMoreProjects(moreProjects);
        parseComments(project.comments);
      }
      handleSetState(obj);
    });
  }, [id]);

  useEffect(() => {
    const query = getUrlQueryObject();
    if (query.success) {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
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

  const toggleDialog = () => {
    // oncl;
  };

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
      <div className={classes.previewRoot}>
        <div className={classes.previewheader}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
            <DescriptionOutlined />
            <Typography>Preview Draft</Typography>
          </div>

          <CustomButton onClick={onClose} primaryButtonOutlinedStyle style={{ padding: '2px 10px' }}>
            Close
          </CustomButton>
        </div>
        <div className={classes.body}>
          <div className={classes.navbar}>
            <img src={images.logo} height={25} />
          </div>
          {/* <div className={classes.breadcrum}></div> */}
          <Box className={classes.root}>
            <Box className={classes.projectDetailHeaderStyle}>
              <Container className={classes.headerStyle}>
                <Typography
                  align="center"
                  style={{ marginBottom: 40, marginTop: 20 }}
                  className={common_classes.title1}
                  variant="h3"
                  gutterBottom
                >
                  {project.title}
                </Typography>
                {/* Over video */}
                <Grid container>
                  <Grid item className={classes.creatorProfileStyle}>
                    <Link className={clsx(classes.textDecorationNone)} to={`/creators/${project.creator.username}`}>
                      <Avatar
                        className={classes.creatorAvatarStyle}
                        src={project.creator.avatar}
                        alt={project.creator.username}
                      />
                      <Typography color="textSecondary" component="span">
                        {project.creator.username}
                      </Typography>
                    </Link>

                    <CustomButton
                      className={common_classes.marginLeft1em}
                      style={{ marginLeft: 'auto' }}
                      variant="contained"
                      primaryButtonStyle
                    >
                      {t('projectDetails.project.creator.follow')}
                    </CustomButton>
                  </Grid>
                </Grid>
              </Container>
              <Container className={classes.detailStyle}>
                <Grid container spacing={3} justify="center">
                  <Grid item xs={12} sm={12} md={12} className={clsx(classes.positionRelative)}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      className={clsx(classes.videoWrapperStyle, classes.positionRelative)}
                    >
                      {project.video ? (
                        <>
                          {isCloudinaryVideo(project.video) ? (
                            <video
                              id="cloudinary-video-player"
                              controls
                              className={clsx('cld-video-player', classes.iframeStyle)}
                            ></video>
                          ) : isGdriveORVimeoORYoutube(project.video) ? (
                            <iframe title={project.title} className={classes.iframeStyle} src={project.video}></iframe>
                          ) : (
                            <video src={project.video} className={classes.iframeStyle} controls>
                              {t('projectDetails.errors.noBrowserSupport')}
                            </video>
                          )}
                        </>
                      ) : project.images.length > 0 ? (
                        <img className={classes.iframeStyle} src={project.images[0].image_url} alt={project.title} />
                      ) : null}
                    </Grid>
                  </Grid>
                  <div
                    style={{
                      backgroundColor: colors.primary,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '16px 12px',
                      borderRadius: 8,
                    }}
                  >
                    <IconButton
                      className={classes.actionBoxButtonStyle}
                      aria-label={t('projectDetails.ariaLabels.likeButton.label')}
                      onClick={e => handleSetState(toggleLike(e, props, project.id))}
                    >
                      {project.likes.includes(props.auth.id) ? (
                        <ClapIcon
                          color={colors.white}
                          arial-label={t('projectDetails.ariaLabels.likeButton.unlilke')}
                        />
                      ) : (
                        <ClapBorderIcon
                          color={colors.white}
                          arial-label={t('projectDetails.ariaLabels.likeButton.like')}
                        />
                      )}
                    </IconButton>
                    <IconButton
                      className={classes.actionBoxButtonStyle}
                      aria-label={t('projectDetails.ariaLabels.saveButton.label')}
                      onClick={e => handleSetState(toggleSave(e, props, project.id))}
                    >
                      {project.saved_by.includes(props.auth.id) ? (
                        <BookmarkIcon aria-label={t('projectDetails.ariaLabels.saveButton.unsave')} />
                      ) : (
                        <BookmarkBorderIcon aria-label={t('projectDetails.ariaLabels.saveButton.save')} />
                      )}
                    </IconButton>

                    <IconButton className={classes.actionBoxButtonStyle}>
                      <VisibilityIcon />
                    </IconButton>

                    <SocialButtons />
                  </div>
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
                                onClick={e => handleSetState(handleOpenEnlargedImageDialog(e, state))}
                              />
                            </div>
                          ))}
                        </Slider>
                      </Box>
                    </Grid>
                  ) : null}

                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h5" className={common_classes.title1}>
                      {t('projectDetails.project.description')}
                    </Typography>
                    <ReactQuill
                      className={classes.descriptionBodyStyle}
                      theme={'bubble'}
                      readOnly={true}
                      value={project.description || ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h5" className={common_classes.title1}>
                      {t('projectDetails.project.materials')}
                    </Typography>
                    <div style={{ display: 'flex', gap: 20 }}>{buildMaterialsUsedComponent(classes, state)}</div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h5" className={common_classes.title1}>
                      {t('projectDetails.project.category')}
                    </Typography>
                    <div style={{ display: 'flex', gap: 20 }}>
                      {project.category ? (
                        project.category.map(cat => (
                          <CustomButton
                            key={cat}
                            primaryButtonOutlinedStyle
                            style={{ borderRadius: 4 }}
                            onClick={() => props.history.push(`/search?q=${cat}`)}
                          >
                            {cat}
                          </CustomButton>
                        ))
                      ) : (
                        <Typography className={classes.categoryStyle}>{t('projectDetails.project.none')}</Typography>
                      )}
                    </div>
                  </Grid>

                  {project.tags.length > 0 ? (
                    <Grid item xs={12} sm={12} md={12}>
                      <Typography variant="h5" className={common_classes.title1}>
                        {t('projectDetails.project.hashtags')}
                      </Typography>

                      <div className={classes.tagsBoxStyle}>
                        {buildTagsComponent(classes, project.tags, props.history)}
                      </div>
                    </Grid>
                  ) : null}
                </Grid>
              </Container>

              {/* <div style={{ marginTop: 100 }}>
              <Comments context={{ name: 'project', body: project }} handleSetState={handleSetState} {...props} />
            </div> */}
              {/* <Box style={{ marginTop: 100 }}>
              <Typography align="center" style={{ marginBottom: 50 }} className={common_classes.title1}>
                More Projects
              </Typography>

              <Grid container spacing={4}>
                {moreProjects.map((project, index) => (
                  <Grid key={index} item xs={12} sm={6} md={6} align="center">
                    <Project
                      project={project}
                      key={project.id}
                      // updateProjects={res => handleSetState(updateProjects(res, state, props, toast))}
                      {...props}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box> */}
            </Box>
          </Box>
        </div>

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
          <img className={classes.enlargedImageStyle} src={enlarged_image_url} alt={`${project.title}`} />
        </Dialog>

        <Dialog
          open={open_delete_project_modal}
          onClose={() => handleSetState(handleToggleDeleteProjectModal(state))}
          aria-labelledby={t('projectDetails.ariaLabels.deleteProject')}
        >
          <DialogTitle id="delete-project">
            <Typography variant="h4">{t('projectDetails.project.delete.dialog.primary')}</Typography>
          </DialogTitle>
          {delete_project_dialog_error !== null && (
            <Box component="p" className={classes.errorBox}>
              <Box component="span" className={classes.error}>
                {delete_project_dialog_error}
              </Box>
            </Box>
          )}
          <DialogContent>
            <Typography>{t('projectDetails.project.delete.dialog.secondary')}</Typography>
          </DialogContent>
          <DialogActions className={classes.dialogButtonContainer}>
            <CustomButton
              variant="outlined"
              onClick={() => handleSetState(handleToggleDeleteProjectModal(state))}
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

        {open ? <Confetti width={width} height={height} /> : null}
      </div>
    );
  } else {
    return <ErrorPage error={t('projectDetails.errors.unexpected')} />;
  }
}

PreviewProject.propTypes = {
  auth: PropTypes.object.isRequired,
  getProject: PropTypes.func.isRequired,
  getUserProjects: PropTypes.func.isRequired,
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
    getUserProjects: args => {
      return dispatch(ProjectActions.getUserProjects(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewProject);
