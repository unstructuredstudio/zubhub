import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Typography, Breadcrumbs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/components/breadCrumb/breadCrumbStyle';
import commonStyles from '../../assets/js/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import clsx from 'clsx';
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function BreadCrumb() {
  const classes = useStyles();
  const common_classes = useCommonStyles();
  return (
    <Breadcrumbs
      separator=""
      aria-label="breadcrumb"
      className={classes.container}
    >
      <Link
        to="/activities/all"
        className={clsx(common_classes.textDecorationNone, classes.link)}
      >
        Activities
      </Link>
      <Link
        to="/"
        className={clsx(common_classes.textDecorationNone, classes.link)}
      >
        Projects
      </Link>
    </Breadcrumbs>
  );
}

export default BreadCrumb;
