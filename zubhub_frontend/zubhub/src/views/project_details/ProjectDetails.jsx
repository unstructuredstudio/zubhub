import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { makeStyles } from "@material-ui/core/styles";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CommentIcon from "@material-ui/icons/Comment";
import {
  Avatar,
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Dialog,
} from "@material-ui/core";

import * as UserActions from "../../store/actions/userActions";
import * as ProjectActions from "../../store/actions/projectActions";
import CustomButton from "../../components/button/Button";
import ErrorPage from "../error/ErrorPage";
import LoadingPage from "../loading/LoadingPage";
import ClapIcon, { ClapBorderIcon } from "../../assets/js/icons/ClapIcon";
import nFormatter from "../../assets/js/nFormatter";
import dFormatter from "../../assets/js/dFormatter";
import styles, {
  sliderSettings,
} from "../../assets/js/styles/views/project_details/projectDetailsStyles";
import commonStyles from "../../assets/js/styles";
import Project from "../../components/project/Project";

const useStyles = makeStyles(styles);

const constructCommentBox = (refs) => {
  refs.commentText.current.addEventListener("focus", (e) =>
    handleCommentTextFocus(refs)
  );

  document.addEventListener("click", (e) => handleDocumentClick(e, refs));
};

const handleCommentTextFocus = (refs) => {
  refs.commentBox.current.classList.remove("comment-collapsed");
  refs.commentBox.current.classList.add("comment");
  refs.commentAuthorName.current.classList.remove("display-none");
  refs.commentPublishButton.current.classList.remove("display-none");
};

const handleDocumentClick = (e, refs) => {
  try {
    if (
      ![
        refs.commentBox.current,
        refs.commentPublishButton.current,
        refs.commentText.current,
      ].includes(e.target)
    ) {
      refs.commentBox.current.classList.remove("comment");
      refs.commentBox.current.classList.add("comment-collapsed");
      refs.commentAuthorName.current.classList.add("display-none");
      refs.commentPublishButton.current.classList.add("display-none");
    }
  } catch {}
};

const handleOpenEnlargedImageDialog = (e, state) => {
  const image_url = e.currentTarget.getAttribute("src");
  const openEnlargedImageDialog = !state.openEnlargedImageDialog;
  return { enlargedImageUrl: image_url, openEnlargedImageDialog };
};

const add_comment = (e, props, refs, state) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push("/login");
  } else {
    const textarea = refs.commentText.current;
    const comment_text = textarea.value;
    textarea.value = "";
    return props.add_comment({
      id: state.project.id,
      token: props.auth.token,
      text: comment_text,
    });
  }
};

const toggle_save = (e, props, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push("/login");
  } else {
    return props.toggle_save({
      id,
      token: props.auth.token,
    });
  }
};

const toggle_like = (e, props, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    return props.history.push("/login");
  } else {
    return props.toggle_like({ id, token: props.auth.token });
  }
};

const toggle_follow = (e, props, id, state) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push("/login");
  } else {
    return props
      .toggle_follow({ id, token: props.auth.token })
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
  const arr = state.project.materials_used.split(",");
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

function ProjectDetails(props) {
  const refs = {
    commentText: React.useRef(null),
    commentBox: React.useRef(null),
    commentAuthorName: React.useRef(null),
    commentPublishButton: React.useRef(null),
  };
  const classes = useStyles();
  const commonClasses = makeStyles(commonStyles)();

  const [state, setState] = React.useState({
    project: {},
    loading: true,
    enlargedImageUrl: "",
    openEnlargedImageDialog: false,
  });

  React.useEffect(() => {
    const commentTextEl = refs.commentText.current;
    handleSetState(
      props.get_project({
        id: props.match.params.id,
        token: props.auth.token,
      })
    );

    return () => {
      try {
        commentTextEl.removeEventListener("focus", () =>
          handleCommentTextFocus(refs)
        );
      } catch {}

      try {
        document.removeEventListener("click", (e) =>
          handleDocumentClick(e, refs)
        );
      } catch {}
    };
  }, []);

  React.useEffect(() => {
    try {
      constructCommentBox(refs);
    } catch {}
  }, [state.project]);

  const handleSetState = (obj) => {
    if (obj) {
      Promise.resolve(obj).then((obj) => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { project, loading, enlargedImageUrl, openEnlargedImageDialog } = state;
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
                  {project.creator.id !== props.auth.id ? (
                    <CustomButton
                      className={commonClasses.marginLeft1em}
                      variant="contained"
                      onClick={(e) =>
                        handleSetState(
                          toggle_follow(e, props, project.creator.id, state)
                        )
                      }
                      primaryButtonStyle
                    >
                      {project.creator.followers.includes(props.auth.id)
                        ? "Unfollow"
                        : "Follow"}
                    </CustomButton>
                  ) : null}
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
                    classes.marginBottom1em
                  )}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    className={clsx(
                      classes.videoWrapperStyle,
                      classes.positionRelative
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
                      aria-label="like button"
                      variant="extended"
                      onClick={(e) =>
                        handleSetState(toggle_like(e, props, project.id))
                      }
                    >
                      {project.likes.includes(props.auth.id) ? (
                        <ClapIcon arial-label="unlike" />
                      ) : (
                        <ClapBorderIcon arial-label="like" />
                      )}
                      <Typography>
                        {nFormatter(project.likes.length)}
                      </Typography>
                    </CustomButton>
                    <CustomButton
                      className={classes.actionBoxButtonStyle}
                      size="small"
                      aria-label="save button"
                      onClick={(e) =>
                        handleSetState(toggle_save(e, props, project.id))
                      }
                    >
                      {project.saved_by.includes(props.auth.id) ? (
                        <BookmarkIcon aria-label="unsave" />
                      ) : (
                        <BookmarkBorderIcon aria-label="save" />
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
                {project.images.length > 0 ? (
                  <Grid item xs={12} sm={12} md={12} align="center">
                    <Box className={classes.sliderBoxStyle}>
                      <Slider {...sliderSettings(project.images.length)}>
                        {project.images.map((image) => (
                          <div>
                            <img
                              key={image.public_id}
                              className={classes.carouselImageStyle}
                              src={image.image_url}
                              alt={image.public_id}
                              onClick={(e) =>
                                handleSetState(
                                  handleOpenEnlargedImageDialog(e, state)
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
                    Description
                  </Typography>
                  <Typography
                    className={classes.descriptionBodyStyle}
                    color="textSecondary"
                  >
                    {project.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography
                    variant="h5"
                    className={classes.descriptionHeadingStyle}
                  >
                    Materials used
                  </Typography>
                  <Typography
                    className={classes.descriptionBodyStyle}
                    color="textSecondary"
                  >
                    {buildMaterialsUsedComponent(classes, state)}
                  </Typography>
                </Grid>
              </Grid>
            </Container>
            <Container className={classes.commentSectionStyle}>
              <Typography
                variant="h5"
                className={classes.descriptionHeadingStyle}
              >
                <CommentIcon /> {nFormatter(project.comments.length)} Comments
              </Typography>
              <Box
                className="comment-box comment-collapsed"
                ref={refs.commentBox}
              >
                <Box className="comment-meta">
                  <Link
                    className={clsx(classes.textDecorationNone)}
                    to={`/creators/${props.auth.username}`}
                  >
                    {props.auth.token ? (
                      <Avatar
                        className={classes.commentAvatarStyle}
                        src={`https://robohash.org/${props.auth.username}`}
                        alt={props.auth.username}
                      />
                    ) : null}
                  </Link>
                  <Link
                    ref={refs.commentAuthorName}
                    className={clsx(
                      classes.textDecorationNone,
                      "comment-meta__a",
                      "display-none"
                    )}
                    to={`/creators/${props.auth.username}`}
                  >
                    {props.auth.username}
                  </Link>
                </Box>
                <form className="comment-form">
                  <textarea
                    ref={refs.commentText}
                    className="comment-text"
                    name="comment"
                    id="comment"
                    placeholder="write a comment ..."
                  ></textarea>
                  <CustomButton
                    ref={refs.commentPublishButton}
                    onClick={(e) =>
                      handleSetState(add_comment(e, props, refs, state))
                    }
                    className={clsx("comment-publish-button", "display-none")}
                    variant="contained"
                    primaryButtonStyle
                  >
                    Comment
                  </CustomButton>
                </form>
              </Box>
              {project.comments.map((comment) => (
                <Box className={classes.commentsStyle} key={comment.id}>
                  <Link
                    className={clsx(
                      classes.textDecorationNone,
                      classes.commentMetaStyle
                    )}
                    to={`/creators/${props.auth.username}`}
                  >
                    <Avatar
                      className={classes.commentAvatarStyle}
                      src={`https://robohash.org/${comment.creator}`}
                      alt={comment.creator}
                    />
                    <Box>
                      <Typography color="textPrimary">
                        {comment.creator}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {dFormatter(comment.created_on)}
                      </Typography>
                    </Box>
                  </Link>

                  {comment.text}
                </Box>
              ))}
            </Container>
          </Paper>
        </Box>
        <Dialog
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
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
          aria-labelledby="enlarged image dialog"
        >
          <img
            className={classes.enlargedImageStyle}
            src={enlargedImageUrl}
            alt={`${project.title}`}
          />
        </Dialog>
      </>
    );
  } else {
    return (
      <ErrorPage error="An error occured while fetching project details, please try again later" />
    );
  }
}

ProjectDetails.propTypes = {
  auth: PropTypes.object.isRequired,
  get_project: PropTypes.func.isRequired,
  toggle_follow: PropTypes.func.isRequired,
  toggle_like: PropTypes.func.isRequired,
  toggle_save: PropTypes.func.isRequired,
  add_comment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    get_project: (values) => {
      return dispatch(ProjectActions.get_project(values));
    },
    toggle_follow: (values) => {
      return dispatch(UserActions.toggle_follow(values));
    },
    toggle_like: (values) => {
      return dispatch(ProjectActions.toggle_like(values));
    },
    toggle_save: (values) => {
      return dispatch(ProjectActions.toggle_save(values));
    },
    add_comment: (values) => {
      return dispatch(ProjectActions.add_comment(values));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
