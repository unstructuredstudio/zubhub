import React, { Component } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import { withStyles, fade } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { withFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import * as AuthActions from "../../../store/actions/authActions";
import robots from "../../../assets/images/robots.png";

const styles = (theme) => ({
  root: {
    paddingTop: "2em",
    paddingBottom: "2em",
    flex: "1 0 auto",
    background: "rgba(255,204,0,1)",
    background:
      "-moz-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,204,0,1)), color-stop(25%, rgba(255,229,133,1)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))",
    background:
      "-webkit-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-o-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-ms-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    filter:
      "progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffcc00', endColorstr='#ffffff', GradientType=0 )",
  },
  background: {
    position: "absolute",
    backgroundImage: `url(${robots})`,
    filter: "blur(5px)",
    webkitFilter: "blur(8px)",
    top: -100,
    height: "100%",
    width: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    zIndex: -1,
  },
  cardStyle: {
    border: 0,
    borderRadius: 15,
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .12)",
    color: "white",
    padding: "0 30px",
  },
  titleStyle: {
    fontWeight: 900,
  },
  customLabelStyle: {
    "&.MuiFormLabel-root.Mui-focused": {
      color: "#00B8C4",
    },
  },
  customInputStyle: {
    borderRadius: 15,
    "&.MuiOutlinedInput-notchedOutline": {
      border: "1px solid #00B8C4",
      boxShadow: `${fade("#00B8C4", 0.25)} 0 0 0 0.2rem`,
    },
    "&.MuiOutlinedInput-root": {
      "&:hover fieldset": {
        border: "1px solid #00B8C4",
        boxShadow: `${fade("#00B8C4", 0.25)} 0 0 0 0.2rem`,
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #00B8C4",
        boxShadow: `${fade("#00B8C4", 0.25)} 0 0 0 0.2rem`,
      },
    },
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#00B8C4",
    borderRadius: 15,
    color: "white",
    "&:hover": {
      backgroundColor: "#03848C",
    },
  },
  secondaryButton: {
    width: "100%",
    borderRadius: 15,
    borderColor: "#00B8C4",
    color: "#00B8C4",
    "&:hover": {
      color: "#03848C",
      borderColor: "#03848C",
    },
  },
  secondaryLink: {
    color: "#00B8C4",
    "&:hover": {
      color: "#03848C",
    },
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: "30%",
    marginRight: "1em",
    marginLeft: "1em",
    [theme.breakpoints.down("510")]: {
      width: "20%",
    },
    [theme.breakpoints.down("381")]: {
      marginLeft: "0.5em",
      marginRight: "0.5em",
    },
  },
  textDecorationNone: {
    textDecoration: "none",
  },
  errorBox: {
    width: "100%",
    padding: "1em",
    borderRadius: 6,
    borderWidth: "1px",
    borderColor: "#a94442",
    backgroundColor: "#ffcdd2",
  },
  error: {
    color: "#a94442",
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showPassword: false,
    };
  }

  login = (e) => {
    this.props.api
      .login(this.props.values)
      .then((res) => {
        if (!res.key) {
          throw new Error(JSON.stringify(res));
        }
        return this.props.set_auth_user({ token: res.key });
      })
      .then((val) => this.props.api.get_auth_user(this.props.auth.token))
      .then((res) => {
        this.props.set_auth_user({
          ...this.props.auth,
          username: res.username,
          id: res.id,
        });
      })
      .then((val) => this.props.history.push("/profile"))
      .catch((error) => {
        const messages = JSON.parse(error.message);
        if (typeof messages === "object") {
          Object.keys(messages).forEach((key) => {
            if (key === "non_field_errors") {
              this.setState({ error: messages[key][0] });
            } else {
              this.props.setFieldTouched(key, true, false);
              this.props.setFieldError(key, messages[key][0]);
            }
          });
        } else {
          this.setState({
            error:
              "An error occured while performing this action. Please try again later",
          });
        }
      });
  };

  handleClickShowPassword = () => {
    let { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  render() {
    let { error, showPassword } = this.state;
    let { classes } = this.props;

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
                  onSubmit={this.props.handleSubmit}
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
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Login to get started!
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box
                        component="p"
                        className={error !== null && classes.errorBox}
                      >
                        {error !== null && (
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
                          this.props.touched["username"] &&
                          this.props.errors["username"]
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
                          onChange={this.props.handleChange}
                          onBlur={this.props.handleBlur}
                          labelWidth={150}
                        />
                        <FormHelperText error>
                          {this.props.touched["username"] &&
                            this.props.errors["username"]}
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
                          this.props.touched["password"] &&
                          this.props.errors["password"]
                        }
                      >
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          onChange={this.props.handleChange}
                          onBlur={this.props.handleBlur}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={this.handleClickShowPassword}
                                onMouseDown={this.handleMouseDownPassword}
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
                          {this.props.touched["password"] &&
                            this.props.errors["password"]}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size="large"
                        className={classes.primaryButton}
                        onClick={this.login}
                      >
                        Login
                      </Button>
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
                      <Button
                        variant="outlined"
                        size="large"
                        className={classes.secondaryButton}
                      >
                        Signup
                      </Button>
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
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
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
      email: "",
      password: "",
    }),
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, "your password is too short")
        .required("input your password"),
    }),
  })(withStyles(styles)(Login))
);
