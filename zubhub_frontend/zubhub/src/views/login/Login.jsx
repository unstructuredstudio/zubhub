import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  Grid,
  Box,
  Divider,
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

import { withFormik } from "formik";
import * as Yup from "yup";

import CustomButton from "../../components/button/Button";
import * as AuthActions from "../../store/actions/authActions";
import styles from "../../assets/js/styles/views/login/loginStyles";

function Login(props) {
  const classes = makeStyles(styles)();

  const [state, setState] = React.useState({
    error: null,
    showPassword: false,
  });

  const login = (e) => {
    e.preventDefault();
    props.api
      .login(props.values)
      .then((res) => {
        if (!res.key) {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
        return props.set_auth_user({ token: res.key });
      })

      .then((val) => props.history.push("/profile"))
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

  const handleClickShowPassword = () => {
    let { showPassword } = state;
    setState({ ...state, showPassword: !showPassword });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  let { error, showPassword } = state;

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="login"
                noValidate="noValidate"
                onSubmit={login}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  Welcome to Zubhub
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Login to get started!
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
                        props.touched["username"] && props.errors["username"]
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="username"
                      >
                        Username Or Email
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="username"
                        name="username"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={150}
                      />
                      <FormHelperText error>
                        {props.touched["username"] && props.errors["username"]}
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
                        props.touched["password"] && props.errors["password"]
                      }
                    >
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
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
                        {props.touched["password"] && props.errors["password"]}
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
                      Login
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Divider className={classes.divider} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Not a Member ?
                    </Typography>
                    <Divider className={classes.divider} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Link to="/signup" className={classes.textDecorationNone}>
                    <CustomButton
                      variant="outlined"
                      size="large"
                      secondaryButtonStyle
                      fullWidth
                    >
                      Signup
                    </CustomButton>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Link
                      to="/password-reset"
                      className={classes.secondaryLink}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
  );
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  set_auth_user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    set_auth_user: (auth_user) => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValue: () => ({
      password: "",
    }),
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, "your password is too short")
        .required("input your password"),
    }),
  })(Login)
);
