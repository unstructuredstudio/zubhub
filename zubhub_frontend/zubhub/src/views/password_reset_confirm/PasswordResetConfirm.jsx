import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import { toast } from "react-toastify";

import { withFormik } from "formik";
import * as Yup from "yup";

import { makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  FormControl,
} from "@material-ui/core";

import CustomButton from "../../components/button/Button";
import styles from "../../assets/js/styles/views/password_reset_confirm/passwordResetConfirmStyles";

function PasswordResetConfirm(props) {
  const classes = makeStyles(styles)();

  const [state, setState] = React.useState({
    error: null,
    showPassword1: false,
    showPassword2: false,
  });

  const getUidAndToken = (queryString) => {
    let uid = queryString.split("&&");
    let token = uid[1].split("=")[1];
    uid = uid[0].split("=")[1];
    return { uid, token };
  };

  const resetPassword = (e) => {
    e.preventDefault();
    let { uid, token } = getUidAndToken(props.location.search);
    props.api
      .password_reset_confirm({ ...props.values, uid, token })
      .then((res) => {
        toast.success(
          "Congratulations! your password reset was successful! you will now be redirected to login"
        );
        setTimeout(() => {
          props.history.push("/login");
        }, 4000);
      })
      .catch((error) => {
        if (error.message.startsWith("Unexpected")) {
          setState({
            ...state,
            error:
              "An error occured while performing this action. Please try again later",
          });
        } else {
          setState({ ...state, error: error.message });
        }
      });
  };

  const handleClickShowPassword = (field) => {
    if (field === 1) {
      let { showPassword1 } = state;
      setState({ ...state, showPassword1: !showPassword1 });
    } else if (field === 2) {
      let { showPassword2 } = state;
      setState({ ...state, showPassword2: !showPassword2 });
    }
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  let { error, showPassword1, showPassword2 } = state;

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="password_reset_confirm"
                noValidate="noValidate"
                onSubmit={resetPassword}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  Password Reset Confirmation
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box component="p" className={error && classes.errorBox}>
                      {error && (
                        <Box component="span" className={classes.error}>
                          {error}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched["new_password1"] &&
                        props.errors["new_password1"]
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="new_password1"
                      >
                        New Password
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="new_password1"
                        name="new_password1"
                        type={showPassword1 ? "text" : "password"}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={(e, field = 1) =>
                                handleClickShowPassword(field)
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword1 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                      />
                      <FormHelperText error>
                        {props.touched["new_password"] &&
                          props.errors["new_password"]}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched["new_password2"] &&
                        props.errors["new_password2"]
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="new_password2"
                      >
                        Confirm Password
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="new_password2"
                        name="new_password2"
                        type={showPassword2 ? "text" : "password"}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={(e, field = 2) =>
                                handleClickShowPassword(field)
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword2 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={150}
                      />
                      <FormHelperText error>
                        {props.touched["new_password2"] &&
                          props.errors["new_password2"]}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      type="submit"
                      primaryButtonStyle
                      fullWidth
                    >
                      Reset Password
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
  );
}

PasswordResetConfirm.propTypes = {
  api: PropTypes.object.isRequired,
};

export default withFormik({
  mapPropsToValue: () => ({
    new_password1: "",
    new_password2: "",
  }),
  validationSchema: Yup.object().shape({
    new_password1: Yup.string()
      .min(8, "your password is too short")
      .required("input your password"),
    new_password2: Yup.string()
      .oneOf([Yup.ref("new_password1"), null], "Passwords must match")
      .required("input a confirmation password"),
  }),
})(PasswordResetConfirm);
