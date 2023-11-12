import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';
import Project from '../project/Project';
import CustomButton from '../button/Button';

import styles from '../../assets/js/styles/components/staff_pick/staffPickStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function StaffPick
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function StaffPick(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const { staff_pick, ...rest } = props;
  return staff_pick.projects &&
    staff_pick.projects.results &&
    staff_pick.projects.results.length > 0 ? (
    <Box className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            // component="h2"
            // variant="h6"
            // color="textPrimary"
            className={classes.MessagePrimaryStyle}
          >
            {staff_pick.title}
            {/* <CustomButton
              className={clsx(common_classes.floatRight)}
              variant="outlined"
              margin="normal"
              secondaryButtonStyle
              onClick={() =>
                props.history.push(`/projects/staff-picks/${staff_pick.id}`)
              }
            >
              {rest.t('staffPicks.viewAll')}
            </CustomButton> */}
          </Typography>
        </Grid>
        {staff_pick.projects.results.map((project, index) =>
          index <= 2 ? (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              spacing={4}
              align="center"
              className={classes.projectGridStyle}
              key={project.id}
            >
              <Project {...rest} project={project} />
            </Grid>
          ) : null,
        )}
      </Grid>
    </Box>
  ) : null;
}

StaffPick.propTypes = {
  staff_pick: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default StaffPick;
