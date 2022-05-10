import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/js/styles/components/projects_drafts/projectsDraftsGridStyles';
import commonStyles from '../../assets/js/styles';
import cn from 'classnames';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CustomButton from '../../components/button/Button';
import {
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Box,
  Divider,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../../store/actions/authActions';
import { useHistory } from 'react-router-dom';
import Project from '../../components/project/Project';
import {
  updateProjects,
  updateDrafts,
} from '../../views/profile/profileScripts';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ProjectsDraftsGrid = ({
  profile,
  projects,
  drafts,
  handleSetState,
  ...props
}) => {
  const classes = useStyles();

  const history = useHistory();
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.profileLowerStyle}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          classes={{
            indicator: classes.indicator,
          }}
        >
          <Tab
            label="Projects"
            {...a11yProps(0)}
            className={classes.tabStyle}
          />
          <Tab label="Drafts" {...a11yProps(1)} className={classes.tabStyle} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CustomButton
          className={clsx(classes.viewAllBtn)}
          variant="outlined"
          margin="normal"
          secondaryButtonStyle
          onClick={() => history.push(`/creators/${profile.username}/projects`)}
        >
          {t('profile.projects.viewAll')}
        </CustomButton>
        <Grid container>
          {Array.isArray(projects) &&
            projects.map(project => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                className={classes.gridStyle}
                align="center"
              >
                <Project
                  project={project}
                  key={project.id}
                  updateProjects={res =>
                    handleSetState(updateProjects(res, projects, t, toast))
                  }
                  {...props}
                />
              </Grid>
            ))}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CustomButton
          className={clsx(classes.viewAllBtn)}
          variant="outlined"
          margin="normal"
          secondaryButtonStyle
          onClick={() => history.push(`/creators/${profile.username}/drafts`)}
        >
          {t('profile.projects.viewAll')}
        </CustomButton>
        <Grid container>
          {Array.isArray(drafts) &&
            drafts.map(draft => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                className={classes.gridStyle}
                align="center"
              >
                <Project
                  project={draft}
                  key={draft.id}
                  updateProjects={res =>
                    handleSetState(updateDrafts(res, drafts, t, toast))
                  }
                  {...props}
                />
              </Grid>
            ))}
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default ProjectsDraftsGrid;
