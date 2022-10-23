import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Breadcrumbs,
  MenuItem,
  Select,
} from '@material-ui/core';
import { capitalize } from '../../assets/js/utils/scripts';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/components/breadCrumb/breadCrumbStyle';
import commonStyles from '../../assets/js/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import clsx from 'clsx';
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function BreadCrumb({ props }) {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const [link, setLink] = useState(location.pathname);

  useEffect(() => {
    setLink(location.pathname);
  }, [location]);

  let pathList = history.location.pathname.split('/');
  pathList.shift();
  if (props.match) {
    pathList = props.match.path.split('/');
    pathList.shift();
  }
  const store = useSelector(state => state);
  const handleChange = e => {
    setLink(e.target.value);
  };

  const getLink = (url, index) => {
    let arr = url.split('/').slice(0, index + 2);
    let newUrl = arr.join('/');
    return /^\/((projects)?(creators)?)$/.test(newUrl) ? '/' : newUrl;
  };

  return (
    <Breadcrumbs
      maxItems={3}
      separator={
        <NavigateNextIcon fontSize="large" className={classes.separator} />
      }
      aria-label="breadcrumb"
      className={classes.container}
    >
      <Box className={clsx(common_classes.textDecorationNone, classes.link)}>
        <Select
          className={clsx(common_classes.textDecorationNone, classes.select)}
          value={
            link.split('/').splice(0, 2).join('/') !== '/activities'
              ? '/'
              : '/activities'
          }
          label="link"
          disableUnderline={true}
          inputProps={{
            classes: {
              icon: classes.icon,
            },
          }}
          onChange={handleChange}
        >
          <MenuItem
            className={classes.item}
            value={'/'}
            onClick={e => history.push('/')}
          >
            {props.t('breadCrumb.link.projects')}
          </MenuItem>
          <MenuItem
            value={'/activities'}
            onClick={e => history.push('/activities')}
          >
            {props.t('breadCrumb.link.activities')}
          </MenuItem>
        </Select>
      </Box>
      {pathList &&
        pathList[0] !== '' &&
        pathList[0] !== 'activities' &&
        pathList[0] !== 'projects' && (
          <Box
            className={clsx(common_classes.textDecorationNone, classes.link)}
          >
            <Link
              id={`firstItem-link`}
              to={getLink(props.match.url, 0)}
              className={clsx(
                common_classes.textDecorationNone,
                classes.textStyle,
              )}
            >
              {props.t(`breadCrumb.link.${pathList[0]}`)}
            </Link>
          </Box>
        )}
      {pathList &&
        pathList.length > 1 &&
        pathList.slice(1, pathList.length).map((item, index) => (
          <Box
            className={clsx(common_classes.textDecorationNone, classes.link)}
          >
            {/^:/.test(item) ? (
              <Link
                id={`${index}-link`}
                to={getLink(props.match.url, index + 1)}
                className={clsx(common_classes.textDecorationNone)}
              >
                <Typography component="span" className={classes.textStyle}>
                  {pathList[index] === 'activities'
                    ? store.activities?.selectedActivity?.title &&
                      capitalize(store.activities.selectedActivity.title)
                    : pathList[index] === 'projects'
                    ? store.projects?.all_projects?.results &&
                      capitalize(
                        store.projects?.all_projects?.results.filter(
                          project => project.id === props.match.params.id,
                        )[0].title,
                      )
                    : pathList[index] === 'creators' &&
                      capitalize(props.match.params.username)}
                </Typography>
              </Link>
            ) : (
              <Link
                id={`${index}-link`}
                to={getLink(props.match.url, index + 1)}
                className={clsx(common_classes.textDecorationNone)}
              >
                <Typography component="span" className={classes.textStyle}>
                  {props.t(`breadCrumb.link.${item}`)}
                </Typography>
              </Link>
            )}
          </Box>
        ))}
    </Breadcrumbs>
  );
}

export default BreadCrumb;
