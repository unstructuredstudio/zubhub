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
import clsx from 'clsx';
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function BreadCrumb({ props }) {
  const history = useHistory();
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const [link, setLink] = useState('/');
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
  useEffect(() => {
    history.push(link);
  }, [link]);

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
            {props.t('breadCrumb.link.projects')}
          </MenuItem>
          <MenuItem value={'/activities'}>
            {props.t('breadCrumb.link.activities')}
          </MenuItem>
        </Select>
      </Box>
      {pathList &&
        pathList[0] !== '' &&
        pathList.map((item, index) => (
          <Box
            className={clsx(common_classes.textDecorationNone, classes.link)}
          >
            {index < 1 ? (
              <Link
                id={`${index}-link`}
                to={getLink(props.match.url, index)}
                className={clsx(
                  common_classes.textDecorationNone,
                  classes.textStyle,
                )}
              >
                {props.t(`breadCrumb.link.${item}`)}
              </Link>
            ) : /^:/.test(item) ? (
              <Link
                id={`${index}-link`}
                to={getLink(props.match.url, index)}
                className={clsx(common_classes.textDecorationNone)}
              >
                <Typography component="span" className={classes.textStyle}>
                  {pathList[index - 1] === 'activities'
                    ? store.activities?.selectedActivity?.title?.toLowerCase()
                    : pathList[index - 1] === 'projects'
                    ? store.projects?.all_projects?.results?.filter(
                        project => project.id === props.match.params.id,
                      )[0].title
                    : pathList[index - 1] === 'creators' &&
                      props.match.params.username}
                </Typography>
              </Link>
            ) : (
              <Link
                id={`${index}-link`}
                to={getLink(props.match.url, index)}
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