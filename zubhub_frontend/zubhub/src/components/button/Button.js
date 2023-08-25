import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from '../../assets/js/styles/components/button/buttonStyles';
import clsx from 'clsx'
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(styles);

/**
 * @function CustomButton Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const CustomButton = React.forwardRef((props, ref) => {
  const classes = useStyles();

  const {
    children,
    primaryButtonStyle,
    primaryButtonStyle2,
    primaryButtonOutlinedStyle,
    primaryButtonStyle3,
    secondaryButtonStyle,
    dangerButtonStyle,
    darkDangerButtonStyle,
    customWarningButtonStyle,
    mediaUploadButtonStyle,
    customButtonStyle,
    fullWidth,
    className,
    muiClasses,
    disabled,
    loading,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.primaryButtonStyle]: primaryButtonStyle,
    [classes.primaryButtonStyle2]: primaryButtonStyle2,
    [classes.primaryButtonStyle3]: primaryButtonStyle3,
    [classes.secondaryButtonStyle]: secondaryButtonStyle,
    [classes.dangerButtonStyle]: dangerButtonStyle,
    [classes.darkDangerButtonStyle]: darkDangerButtonStyle,
    [classes.customWarningButtonStyle]: customWarningButtonStyle,
    [classes.mediaUploadButtonStyle]: mediaUploadButtonStyle,
    [classes.customButtonStyle]: customButtonStyle,
    [classes.fullWidth]: fullWidth,
    [classes.primaryButtonOutlinedStyle]: primaryButtonOutlinedStyle,
    [className]: className,
  });

  return (
    <Button
      ref={ref}
      classes={muiClasses}
      className={btnClasses}
      disabled={disabled ? disabled : false}
    >
      {children}
      {loading && <CircularProgress size={20} color="inherit" />}
    </Button>
  );
});

Button.propTypes = {
  size: PropTypes.oneOf(['small', 'large', 'medium']),
  primaryButtonStyle: PropTypes.bool,
  secondaryButtonStyle: PropTypes.bool,
  dangerButtonStyle: PropTypes.bool,
  darkDangerButtonStyle: PropTypes.bool,
  mediaUploadButtonStyle: PropTypes.bool,
  customButtonStyle: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.string,
  fullWidth: PropTypes.bool,
  type: PropTypes.string,
  muiClasses: PropTypes.object,
  children: PropTypes.node,
};

export default CustomButton;