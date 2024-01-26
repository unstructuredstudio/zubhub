import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Breadcrumbs, MenuItem, Select, Container } from '@mui/material';
import { capitalize } from '../../assets/js/utils/scripts';
import { makeStyles } from '@mui/styles';
import { styles } from '../../assets/js/styles/components/breadCrumb/breadCrumbStyle';
import commonStyles from '../../assets/js/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import clsx from 'clsx';
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function BreadCrumb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const [link, setLink] = useState(location.pathname);

  useEffect(() => {
    setLink(location.pathname);
  }, [location]);

  const store = useSelector(state => state);
  const handleChange = e => {
    setLink(e.target.value);
  };

  const getLink = (url, index) => {
    let arr = url.split('/').slice(0, index + 2);
    let newUrl = arr.join('/');
    return /^\/((projects)?(creators)?)$/.test(newUrl) ? '/' : newUrl;
  };

  const getActivityTitle = id => {
    if (store.activities.selectedActivity['id'] === id) {
      return capitalize(store.activities.selectedActivity.title);
    } else {
      let arr = store.activities.all_activities.filter(item => item.id === id);
      return arr.length > 0 ? capitalize(arr[0].title) : '';
    }
  };

  const getProjectTitle = id => {
    if (store.projects.all_projects.results) {
      let arr = store.projects.all_projects.results.filter(project => project.id === id);
      return arr.length > 0 ? capitalize(arr[0].title) : '';
    } else {
      return '';
    }
  };

  const mapLinkToTitle = {
    activities: id => getActivityTitle(id),
    projects: id => getProjectTitle(id),
    creators: username => capitalize(username),
  };

  const createPathList = () => {
    let pathList = window.location.pathname.split('/');
    let pathListUrl = window.location.href.split('/');
    pathList.shift();
    pathListUrl.shift();
    let result = [];
    if (pathList.length <= 1) {
      return result;
    } else {
      let path = {};
      for (let i = 1; i < pathList.length; i++) {
        path = {};
        if (/^:/.test(pathList[i]) && mapLinkToTitle[pathList[0]]) {
          path['link'] = getLink(window.location.href, i);
          path['title'] = mapLinkToTitle[pathList[0]](pathListUrl[i]);
        } else {
          path['title'] = t(capitalize(pathList[i]));
          pathList.forEach((_p, i) => {
            path['link'] = getLink(window.location.href, i);
          });
        }
        if (path['title']) {
          result.push(path);
        }
      }
    }
    return result;
  };

  const pathResult = createPathList();

  return (
    <div className={classes.container}>
      <Container style={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          maxItems={2}
          separator={<NavigateNextIcon fontSize="large" className={classes.separator} />}
          aria-label="breadcrumb"
        >
          <Box className={clsx(common_classes.textDecorationNone, classes.link)}>
            <Select
              className={clsx(common_classes.textDecorationNone, classes.select)}
              value={link.split('/').splice(0, 2).join('/') !== '/activities' ? '/' : '/activities'}
              label="link"
              disableUnderline={true}
              inputProps={{
                classes: {
                  icon: classes.icon,
                },
              }}
              onChange={handleChange}
            >
              <MenuItem className={classes.item} value={'/'} onClick={e => navigate('/')}>
                {t(`breadCrumb.link.projects`)}
              </MenuItem>
              <MenuItem value={'/activities'} onClick={e => navigate('/activities')}>
                {t(`breadCrumb.link.activities`)}
              </MenuItem>
            </Select>
          </Box>
          {pathResult.map((item, index) => (
            <Box key={`link-box-${index}`} className={clsx(common_classes.textDecorationNone, classes.link)}>
              <Link id={`${index}-link`} to={item.link} className={clsx(common_classes.textDecorationNone)}>
                <Typography component="span" className={classes.textStyle}>
                  {item.title}
                </Typography>
              </Link>
            </Box>
          ))}
        </Breadcrumbs>
      </Container>
    </div>
  );
}

export default BreadCrumb;
