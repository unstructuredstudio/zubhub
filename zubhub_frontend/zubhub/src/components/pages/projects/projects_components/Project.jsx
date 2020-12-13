import React, { Component } from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ClapIcon, { ClapBorderIcon } from "../../../../assets/js/icons/ClapIcon";
import CommentIcon from "../../../../assets/js/icons/CommentIcon";
import VisibilityIcon from "@material-ui/icons/Visibility";
import nFormatter from "../../../../assets/js/nFormatter";
import dFormatter from "../../../../assets/js/dFormatter";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  root: {
    maxWidth: 345,
    height: "100%",
    paddingTop: 0,
    paddingBottom: "0 !important",
    marginTop: "1em",
    marginBottom: "0",
    borderRadius: "15px",
    textAlign: "left",
    backgroundColor: "#ffffff",
  },
  mediaBoxStyle: {
    width: "100%",
    height: "50%",
  },
  mediaStyle: {
    width: "100%",
    height: "100%",
    borderStyle: "none",
  },
  fabButtonStyle: {
    color: "#00B8C4",
    position: "absolute",
    marginLeft: "1em",
    right: "1em",
    top: "-1.8em",
    "& MuiFab-root:hover": {
      color: "#03848C",
    },
    "& svg": {
      fill: "#00B8C4",
    },
    "& svg:hover": {
      fill: "#03848C",
    },
  },
  likeButtonStyle: {
    right: "4.5em",
    top: "-1.6em",
  },
  titleStyle: {
    fontSize: "1.2rem",
  },
  descriptionStyle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  creatorBoxStyle: {
    marginTop: "0.5em",
    marginBottom: "0.5em",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  creatorAvatarStyle: {
    marginRight: "0.5em",
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
  },
  captionStyle: {
    display: "flex",
    justifyContent: "space-between",
  },
  captionIconStyle: {
    display: "flex",
    alignItems: "center",
    marginRight: "1em",
    "& svg": {
      fill: "rgba(0,0,0,0.54)",
      marginRight: "0.5em",
    },
  },
  VisibilityIconStyle: {
    "& svg": {
      fontSize: "1.1rem",
    },
  },
  moreInfoBoxStyle: {
    height: "3em",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  moreInfoStyle: {
    marginLeft: "0.5em",
    marginRight: "0.5em",
    fontWeight: "bold",
    fontSize: "0.9rem",
    color: "#00B8C4",
  },
  primaryButton: {
    backgroundColor: "#00B8C4",
    borderRadius: 15,
    color: "white",
    marginLeft: "1em",
    "&:hover": {
      backgroundColor: "#03848C",
    },
  },
  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#00B8C4",
    color: "#00B8C4",
    marginLeft: "1em",
    "&:hover": {
      color: "#03848C",
      borderColor: "#03848C",
      backgroundColor: "#F2F2F2",
    },
  },
  secondaryLink: {
    color: "#00B8C4",
    "&:hover": {
      color: "#03848C",
    },
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textDecorationNone: {
    textDecoration: "none",
  },
  floatRight: { float: "right" },
  displayNone: { display: "none" },
  positionRelative: { position: "relative" },
  largeLabel: {
    fontSize: "1.3rem",
  },
});

class Project extends Component {
  toggle_like = (e, id) => {
    e.preventDefault();
    if (!this.props.auth.token) this.props.history.push("/login");
    let toggle_like_promise = this.props.api.toggle_like({
      id,
      token: this.props.auth.token,
    });
    this.props.updateProjects(toggle_like_promise);
  };

  toggle_save = (e, id) => {
    e.preventDefault();
    if (!this.props.auth.token) this.props.history.push("/login");
    let toggle_save_promise = this.props.api.toggle_save({
      id,
      token: this.props.auth.token,
    });
    this.props.updateProjects(toggle_save_promise);
  };

  render() {
    let { project, classes } = this.props;
    return (
      <Link
        to={`/projects/${project.id}`}
        className={classes.textDecorationNone}
      >
        <Card className={classes.root}>
          <CardMedia className={classes.mediaBoxStyle} title={project.title}>
            {project.video ? (
              <iframe
                className={classes.mediaStyle}
                title={project.title}
                src={project.video}
              ></iframe>
            ) : (
              <img
                className={classes.mediaStyle}
                src={project.images[0].image_url}
                alt={project.title}
              />
            )}
          </CardMedia>
          <CardActionArea>
            <CardContent className={classes.positionRelative}>
              <Fab
                className={classes.fabButtonStyle}
                size="small"
                aria-label="save button"
                onClick={(e, id = project.id) => this.toggle_save(e, id)}
              >
                {project.saved_by.includes(this.props.auth.id) ? (
                  <BookmarkIcon aria-label="unsave" />
                ) : (
                  <BookmarkBorderIcon aria-label="save" />
                )}
              </Fab>
              <Fab
                className={clsx(
                  classes.fabButtonStyle,
                  classes.likeButtonStyle
                )}
                size="small"
                aria-label="like button"
                variant="extended"
                onClick={(e, id = project.id) => this.toggle_like(e, id)}
              >
                {project.likes.includes(this.props.auth.id) ? (
                  <ClapIcon arial-label="unlike" />
                ) : (
                  <ClapBorderIcon arial-label="like" />
                )}
                {nFormatter(project.likes.length)}
              </Fab>
              <Typography
                className={classes.titleStyle}
                variant="h5"
                component="h2"
              >
                {project.title}
              </Typography>
              <Typography
                className={classes.descriptionStyle}
                variant="subtitle2"
                color="textSecondary"
                component="p"
              >
                {project.description}
              </Typography>
              <Link
                to={`/profile/${project.creator.username}`}
                className={classes.textDecorationNone}
              >
                <Box className={classes.creatorBoxStyle}>
                  <Avatar
                    className={classes.creatorAvatarStyle}
                    src={project.creator.avatar}
                    alt={project.creator.username}
                  />
                  <Typography
                    color="textSecondary"
                    variant="caption"
                    component="p"
                  >
                    {project.creator.username}
                  </Typography>
                </Box>
              </Link>
              <Box className={classes.captionStyle}>
                <Box className={classes.captionStyle}>
                  <Typography
                    className={clsx(
                      classes.captionIconStyle,
                      classes.VisibilityIconStyle
                    )}
                    color="textSecondary"
                    variant="caption"
                    component="span"
                  >
                    <VisibilityIcon /> {project.views_count}
                  </Typography>
                  <Typography
                    className={classes.captionIconStyle}
                    color="textSecondary"
                    variant="caption"
                    component="span"
                  >
                    <CommentIcon /> {project.comments_count}
                  </Typography>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  component="span"
                >
                  {dFormatter(project.created_on)}
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    );
  }
}

Project.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Project);
