import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";

import { toast } from "react-toastify";

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
  Button,
} from "@material-ui/core";

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

let commentText;
let commentBox;
let commentAuthorName;
let commentPublishButton;

function ProjectDetails(props) {
  const classes = makeStyles(styles)();
  const commonClasses = makeStyles(commonStyles)();

  const [state, setState] = React.useState({
    project: {},
    loading: true,
    enlargedImageUrl: "",
    openEnlargedImageDialog: false,
  });

  React.useEffect(() => {
    props.api
      .get_project({
        id: props.match.params.id,
        token: props.auth.token,
      })
      .then((res) => {
        if (res.title) {
          return setState({ ...state, project: res, loading: false });
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        toast.warning(error.message);
      });

    return () => {
      try {
        commentText.removeEventListener("focus", handleCommentTextFocus);
      } catch {}

      try {
        document.removeEventListener("click", handleDocumentClick);
      } catch {}
    };
  }, []);

  React.useEffect(() => {
    try {
      constructCommentBox();
    } catch {}
  }, [state.project]);

  const toggle_like = (e, id) => {
    e.preventDefault();
    if (!props.auth.token) {
      props.history.push("/login");
    } else {
      props.api
        .toggle_like({ id, token: props.auth.token })
        .then((res) => {
          if (res.id) {
            return setState({ ...state, project: res });
          } else {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          if (error.message.startsWith("Unexpected")) {
            toast.warning(
              "An error occured while performing this action. Please try again later"
            );
          } else {
            toast.warning(error.message);
          }
        });
    }
  };

  const toggle_follow = (id) => {
    if (!props.auth.token) {
      props.history.push("/login");
    } else {
      props.api
        .toggle_follow({ id, token: props.auth.token })
        .then((res) => {
          if (res.id) {
            let { project } = state;
            if (project.creator.id === res.id) {
              project.creator = res;
            }

            return setState({ ...state, project });
          } else {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          if (error.message.startsWith("Unexpected")) {
            toast.warning(
              "An error occured while performing this action. Please try again later"
            );
          } else {
            toast.warning(error.message);
          }
        });
    }
  };

  const toggle_save = (e, id) => {
    e.preventDefault();
    if (!props.auth.token) {
      props.history.push("/login");
    } else {
      props.api
        .toggle_save({
          id,
          token: props.auth.token,
        })
        .then((res) => {
          if (res.id) {
            return setState({ project: res });
          } else {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
        })
        .catch((error) => {
          setState({ loading: false });
          if (error.message.startsWith("Unexpected")) {
            toast.warning(
              "An error occured while performing this action. Please try again later"
            );
          } else {
            toast.warning(error.message);
          }
        });
    }
  };

  const handleOpenEnlargedImageDialog = (e) => {
    let image_url = e.currentTarget.getAttribute("src");
    let openEnlargedImageDialog = !state.openEnlargedImageDialog;
    setState({
      ...state,
      enlargedImageUrl: image_url,
      openEnlargedImageDialog,
    });
  };

  const buildMaterialsUsedComponent = () => {
    let arr = state.project.materials_used.split(",");
    return arr.map((material, index) => (
      <Typography component="span" className={classes.materialsUsedStyle}>
        {material}
      </Typography>
    ));
  };

  const add_comment = (e) => {
    e.preventDefault();
    if (!props.auth.token) {
      props.history.push("/login");
    } else {
      let textarea = document.querySelector("#comment");
      let comment_text = textarea.value;
      props.api
        .add_comment({
          id: state.project.id,
          token: props.auth.token,
          text: comment_text,
        })
        .then((res) => {
          if (res.id) {
            textarea.value = "";
            return setState({ ...state, project: res });
          } else {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          if (error.message.startsWith("Unexpected")) {
            toast.warning(
              "An error occured while performing this action. Please try again later"
            );
          } else {
            toast.warning(error.message);
          }
        });
    }
  };

  const constructCommentBox = () => {
    commentBox = document.querySelector(".comment-box");
    commentText = document.querySelector(".comment-text");
    commentAuthorName = document.querySelector(".comment-box .comment-meta__a");
    commentPublishButton = document.querySelector(".comment-publish-button");
    commentText.addEventListener("focus", handleCommentTextFocus);

    document.addEventListener("click", handleDocumentClick);
  };

  const handleCommentTextFocus = () => {
    commentBox.classList.remove("comment-collapsed");
    commentBox.classList.add("comment");
    commentAuthorName.classList.remove("display-none");
    commentPublishButton.classList.remove("display-none");
  };

  const handleDocumentClick = (e) => {
    try {
      if (![commentBox, commentPublishButton, commentText].includes(e.target)) {
        commentBox.classList.remove("comment");
        commentBox.classList.add("comment-collapsed");
        commentAuthorName.classList.add("display-none");
        commentPublishButton.classList.add("display-none");
      }
    } catch {}
  };

  let { project, loading, enlargedImageUrl, openEnlargedImageDialog } = state;
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
                      onClick={(e, id = project.creator.id) =>
                        toggle_follow(id)
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
                      onClick={(e, id = project.id) => toggle_like(e, id)}
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
                      onClick={(e, id = project.id) => toggle_save(e, id)}
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
                              onClick={handleOpenEnlargedImageDialog}
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
                    {buildMaterialsUsedComponent()}
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
              <Box className="comment-box comment-collapsed">
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
                    className="comment-text"
                    name="comment"
                    id="comment"
                    placeholder="write a comment ..."
                  ></textarea>
                  <CustomButton
                    onClick={add_comment}
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
  api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ProjectDetails);
