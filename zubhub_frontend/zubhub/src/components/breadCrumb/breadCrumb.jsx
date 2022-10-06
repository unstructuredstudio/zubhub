import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Breadcrumbs,
  MenuItem,
  Select,
  Tooltip,
  FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/components/breadCrumb/breadCrumbStyle';
import commonStyles from '../../assets/js/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import clsx from 'clsx';
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function BreadCrumb({ props }) {
  const history = useHistory();
  const classes = useStyles();
  const { activities, projects } = useSelector(state => state);
  const common_classes = useCommonStyles();
  const [link, setLink] = useState('/');
  let pathList = history.location.pathname.split('/');
  pathList.shift();
  if (props.match) {
    pathList = props.match.path.split('/');
    pathList.shift();
  }
  const handleChange = e => {
    setLink(e.target.value);
  };
  useEffect(() => {
    history.push(link);
  }, [link]);

  return (
    <Breadcrumbs
      separator={
        <NavigateNextIcon fontSize="large" className={classes.separator} />
      }
      aria-label="breadcrumb"
      className={classes.container}
    >
      <Box className={clsx(common_classes.textDecorationNone, classes.link)}>
        <Select
          className={clsx(common_classes.textDecorationNone, classes.select)}
          value={link}
          label="link"
          disableUnderline={true}
          inputProps={{
            classes: {
              icon: classes.icon,
            },
          }}
          onChange={handleChange}
        >
          <MenuItem className={classes.item} value={'/'}>
            Projects
          </MenuItem>
          <MenuItem value={'/activities'}>Activities</MenuItem>
          {/* {props.auth.tags.filter(tag => tag === 'staff' || tag === 'moderator')
            .length > 0 && (
            <MenuItem value={'/activities'}>Unpublished Activities</MenuItem>
          )} */}
        </Select>
      </Box>
      {pathList.map((item, index) => (
        <Box className={clsx(common_classes.textDecorationNone, classes.link)}>
          {index < 1 ? (
            <Link
              to={item === 'projects' ? '/' : `/${item}`}
              className={clsx(
                common_classes.textDecorationNone,
                classes.textStyle,
              )}
            >
              {item}
            </Link>
          ) : pathList[0] === 'activities' ? (
            item === ':id' ? (
              <Link
                to={`/activities/${activities.selectedActivity.id}`}
                className={clsx(common_classes.textDecorationNone)}
              >
                <Tooltip
                  title={activities.selectedActivity.title}
                  placement="top"
                >
                  <Typography component="span" className={classes.textStyle}>
                    {activities.selectedActivity.title.toLowerCase()}
                  </Typography>
                </Tooltip>
              </Link>
            ) : (
              <Typography component="span" className={classes.textStyle}>
                {item}
              </Typography>
            )
          ) : (
            ''
          )}
        </Box>
      ))}
    </Breadcrumbs>
  );
}

export default BreadCrumb;
