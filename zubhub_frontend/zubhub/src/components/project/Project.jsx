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
import playIcon from '../../assets/images/play-icon.png';
import {
  dFormatter,
  nFormatter,
  buildVideoThumbnailURL,
  isBaseTag,
} from '../../assets/js/utils/scripts';
import { publish_type } from '../../assets/js/utils/constants';
import {
  toggleLike,
  toggleSave,
  formatProjectDescription,
  getPublishTypeLabel,
} from './projectScripts';
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

  // const tags = ['staff']
  // const tags = [ 'moderator','staff']
  // const tags = ['moderator', 'staff', 'group']
  const tags = ['stafffin the place of wein palace nottingham', 'moderator', 'group', 'creator']

  const { project, t } = props;
  return (
    <Link to={`/projects/${project.id}`} className={classes.textDecorationNone}>
      <Card className={classes.root}>
        <CardMedia className={classes.mediaBoxStyle} title={project.title}>
          <Tooltip
            title={getPublishTypeLabel(project.publish.type)}
            placement="right-start"
            arrow
          >
            <Box className={classes.publishStyle}>
              {project.publish.type === publish_type.Draft
                ? t('project.publish.draft')
                : ''}
              {project.publish.type === publish_type.Preview
                ? t('project.publish.preview')
                : ''}
              {project.publish.type ===
                publish_type['Authenticated Creators'] ? (
                <LockIcon />
              ) : (
                ''
              )}
              {project.publish.type === publish_type.Public ? (
                <PublicIcon />
              ) : (
                ''
              )}
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
            <img
              className={classes.mediaImageStyle}
              src={project.images[0].image_url}
              alt={project.title}
            />
          ) : null}
        </CardMedia>
        <CardActionArea className={classes.actionAreaStyle}>
          <CardContent
            className={clsx(classes.contentStyle, classes.positionRelative)}
          >
            <Fab
              className={classes.fabButtonStyle}
              size="small"
              aria-label="save button"
              onClick={(e, id = project.id) => toggleSave(e, id, props)}
            >
              {project.saved_by.includes(props.auth.id) ? (
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
              {project.likes.includes(props.auth.id) ? (
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
            <Box className={classes.descriptionStyle}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                component="p"
              >
                {formatProjectDescription(project.description)}
              </Typography>
            </Box>
            <Link
              to={`/creators/${project.creator.username}`}
              className={classes.textDecorationNone}
            >
              <Box className={classes.creatorBoxStyle}>
                <Avatar
                  className={classes.creatorAvatarStyle}
                  src={project.creator.avatar}
                  alt={project.creator.username}
                />
                <Tooltip
                  title={project.creator.username}
                  placement="bottom"
                  arrow
                  className={classes.creatorUsernameStyle}
                >
                  <Box>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                      component="p"
                      style={{
                        flex: 1, textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        fontWeight: '700'
                      }}
                    >
                      {project.creator.username}
                    </Typography>
                  </Box>
                </Tooltip>
                <Box style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', gap: '5px' }}>
                  {tags.map((tag, index) => (
                    <>
                      {index == 0 &&
                        <Link
                          className={clsx(common_classes.baseTagStyle, common_classes.textDecorationNone, { [common_classes.extendedTagStyle]: !isBaseTag(tag) })}
                          style={{
                            padding: '4px 10px',
                            overflow: 'hidden',
                          }}
                          to={`/search/?q=${tag}&tab=creators`}
                        >
                          <Typography style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: '700',
                            fontSize: '0.8rem'
                          }} component="div">
                            {tag}
                          </Typography>
                        </Link>
                      }
                      {index == 1 &&
                        <Link
                          className={common_classes.textDecorationNone}
                          to={`#`}
                        >
                          <Typography
                            style={{ fontWeight: '700', fontSize: '0.85rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
                            className={clsx(common_classes.baseTagStyle, { [common_classes.extendedTagStyle]: !isBaseTag(tag) })}
                            component="div"
                          >
                            + {tags.length - 1}
                          </Typography>
                        </Link>

                      }
                    </>

                  ))}

                </Box>
              </Box>
            </Link>
            <Box className={classes.captionStyle}>
              <Box className={classes.captionStyle}>
                <Typography
                  className={clsx(
                    classes.captionIconStyle,
                    classes.VisibilityIconStyle,
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
                {`${dFormatter(project.created_on).value} ${t(
                  `date.${dFormatter(project.created_on).key}`,
                )} ${t('date.ago')}`}
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
