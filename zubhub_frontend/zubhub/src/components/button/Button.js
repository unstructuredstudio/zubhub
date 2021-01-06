import React from "react";
import PropTypes from "prop-types";

import classNames from "classnames";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import styles from "../../assets/js/styles/components/button/buttonStyles";

function CustomButton(props){
  const classes = makeStyles(styles)();

  const {
    children,
    primaryButtonStyle,
    secondaryButtonStyle,
    imageUploadButtonStyle,
    fullWidth,
    className,
    muiClasses,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.primaryButtonStyle]: primaryButtonStyle,
    [classes.secondaryButtonStyle]: secondaryButtonStyle,
    [classes.imageUploadButtonStyle]: imageUploadButtonStyle,
    [classes.fullWidth]:fullWidth,
    [className]: className
  });

return (
  <Button {...rest} classes={muiClasses} className={btnClasses}>
  {children}
</Button>
    )
}

Button.propTypes = {
  size: PropTypes.oneOf(["small", "large"]),
  primaryButtonStyle: PropTypes.bool,
  secondaryButtonStyle: PropTypes.bool,
  imageUploadButtonStyle: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.string,
  fullWidth: PropTypes.bool,
  type: PropTypes.string,
  muiClasses: PropTypes.object,
  children: PropTypes.node
}

export default CustomButton;