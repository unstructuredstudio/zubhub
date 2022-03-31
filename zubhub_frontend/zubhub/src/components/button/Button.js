import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import styles from '../../assets/js/styles/components/button/buttonStyles';

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
    secondaryButtonStyle,
    dangerButtonStyle,
    darkDangerButtonStyle,
    mediaUploadButtonStyle,
    customButtonStyle,
    fullWidth,
    className,
    muiClasses,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.primaryButtonStyle]: primaryButtonStyle,
    [classes.secondaryButtonStyle]: secondaryButtonStyle,
    [classes.dangerButtonStyle]: dangerButtonStyle,
    [classes.darkDangerButtonStyle]: darkDangerButtonStyle,
    [classes.mediaUploadButtonStyle]: mediaUploadButtonStyle,
    [classes.customButtonStyle]: customButtonStyle,
    [classes.fullWidth]: fullWidth,
    [className]: className,
  });

  return (
    <Button ref={ref} {...rest} classes={muiClasses} className={btnClasses}>
      {children}
    </Button>
  );
});

Button.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
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
