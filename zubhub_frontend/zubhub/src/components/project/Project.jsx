import React from 'react';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LockIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/Public';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';

import {
  Tooltip,
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Fab,
  Typography,
} from '@material-ui/core';

import ClapIcon, { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import CommentIcon from '../../assets/js/icons/CommentIcon';
import playIcon from '../../assets/images/play-icon.svg';
import { dFormatter, nFormatter, buildVideoThumbnailURL, isBaseTag } from '../../assets/js/utils/scripts';
import { publish_type } from '../../assets/js/utils/constants';
import { toggleLike, toggleSave, formatProjectDescription, getPublishTypeLabel } from './projectScripts';
import styles from '../../assets/js/styles/components/project/projectStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function Project Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function Project(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const { project, t } = props;
  return (
    <Link to={`/projects/${project.id}`} className={classes.textDecorationNone}>
      <Card className={classes.root}>
        <CardMedia className={classes.mediaBoxStyle} title={project.title}>
          <Tooltip title={getPublishTypeLabel(project.publish.type)} placement="right-start" arrow>
            <Box className={classes.publishStyle}>
              {project.publish.type === publish_type.Draft ? <BorderColorOutlinedIcon/> : ''}
              {project.publish.type === publish_type.Preview ? t('project.publish.preview') : ''}
              {project.publish.type === publish_type['Authenticated Creators'] ? <LockIcon /> : ''}
              {project.publish.type === publish_type.Public ? <PublicIcon /> : ''}
            </Box>
          </Tooltip>
          {project.video ? (
            <>
              <img
                className={classes.mediaImageStyle}
                src={buildVideoThumbnailURL(project.video)}
                alt={project.title}
              />
              <img className={classes.playIconStyle} src={playIcon} alt="" />
            </>
          ) : project.images.length > 0 ? (
            <img className={classes.mediaImageStyle} src={project.images[0].image_url} alt={project.title} />
          ) : null}
        </CardMedia>
        <CardActionArea className={classes.actionAreaStyle}>
          <CardContent className={clsx(classes.contentStyle, classes.positionRelative)}>
            <Fab
              className={classes.fabButtonStyle}
              size="small"
              aria-label="save button"
              onClick={(e, id = project?.id) => toggleSave(e, id, props)}
            >
              {project.saved_by.includes(props.auth?.id) ? (
                <BookmarkIcon aria-label="unsave" />
              ) : (
                <BookmarkBorderIcon aria-label="save" />
              )}
            </Fab>
            <Fab
              className={clsx(classes.fabButtonStyle, classes.likeButtonStyle)}
              size="small"
              aria-label="like button"
              variant="extended"
              onClick={(e, id = project.id) => toggleLike(e, id, props)}
            >
              {project.likes.includes(props.auth?.id) ? (
                <ClapIcon arial-label="unlike" />
              ) : (
                <ClapBorderIcon arial-label="like" />
              )}
              {nFormatter(project.likes.length)}
            </Fab>
            <Typography className={classes.titleStyle} variant="h5" component="h2">
              {project.title}
            </Typography>
            <Box className={classes.descriptionStyle}>
              <Typography variant="subtitle2" color="textSecondary" component="p">
                {formatProjectDescription(project.description)}
              </Typography>
            </Box>
            <Link
              style={{ marginTop: 'auto' }}
              to={`/creators/${project.creator.username}`}
              className={classes.textDecorationNone}
            >
              <Box className={classes.creatorBoxStyle}>
                <Avatar
                  className={classes.creatorAvatarStyle}
                  src={project.group?project.group.avatar:project.creator.avatar}
                  alt={project.group? project.group.groupname: project.creator.username}
                />
                <Tooltip
                  title={project.group? project.group.groupname: project.creator.username}
                  placement="bottom"
                  arrow
                  className={classes.creatorUsernameStyle}
                >
                  <Box>
                    <Typography color="textSecondary" variant="caption" component="p" className={classes.username}>
                      {project.creator.username}
                    </Typography>
                  </Box>
                </Tooltip>
                <Box className={classes.tagsContainer}>
                  {project.creator.tags.map((tag, index) => {
                    index == 0 && (
                      <Link
                        key={index + tag}
                        className={clsx(
                          common_classes.baseTagStyle,
                          classes.tagContainer,
                          common_classes.textDecorationNone,
                          { [common_classes.extendedTagStyle]: !isBaseTag(tag) },
                        )}
                        to={`/search/?q=${tag}&tab=creators`}
                      >
                        <Typography className={classes.tagName} component="div">
                          {tag}
                        </Typography>
                      </Link>
                    );
                    index == 1 && (
                      <Link key={index + tag} className={common_classes.textDecorationNone} to={`#`}>
                        <Typography
                          className={clsx(common_classes.baseTagStyle, classes.restOfTags, {
                            [common_classes.extendedTagStyle]: !isBaseTag(tag),
                          })}
                          component="div"
                        >
                          + {project.creator.tags.length - 1}
                        </Typography>
                      </Link>
                    );
                  })}
                </Box>
              </Box>
            </Link>
            <Box className={classes.footer}>
              <Box className={classes.captionStyle}>
                <Typography
                  className={clsx(classes.captionIconStyle, classes.VisibilityIconStyle)}
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
                  <CommentIcon /> {project.comments ? project.comments.length : project.comments_count }
                </Typography>
              </Box>
              <Typography color="textSecondary" variant="caption" component="span" className={classes.date}>
                {`${dFormatter(project.created_on).value} ${t(`date.${dFormatter(project.created_on).key}`)} ${t(
                  'date.ago',
                )}`}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

Project.propTypes = {
  auth: PropTypes.object.isRequired,
  updateProjects: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default Project;
