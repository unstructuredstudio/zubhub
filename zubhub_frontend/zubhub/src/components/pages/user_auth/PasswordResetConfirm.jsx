import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles, fade } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
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

import robots from "../../../assets/images/robots.png";

const styles = {
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
    top: -20,
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
};

class PasswordResetConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showPassword1: false,
      showPassword2: false,
    };
  }

  getUidAndToken = (queryString) => {
    let uid = queryString.split("&&");
    let token = uid[1].split("=")[1];
    uid = uid[0].split("=")[1];
    return { uid, token };
  };

  resetPassword = (e) => {
    e.preventDefault();
    let { uid, token } = this.getUidAndToken(this.props.location.search);
    this.props.api
      .password_reset_confirm({ ...this.props.values, uid, token })
      .then((res) => {
        toast.success(
          "Congratulations! your password reset was successful! you will now be redirected to login"
        );
        setTimeout(() => {
          this.props.history.push("/login");
        }, 4000);
      })
      .catch((error) => {
        if (error.message.startsWith("Unexpected")) {
          this.setState({
            error:
              "An error occured while performing this action. Please try again later",
          });
        } else {
          this.setState({ error: error.message });
        }
      });
  };

  handleClickShowPassword = (field) => {
    if (field === 1) {
      let { showPassword1 } = this.state;
      this.setState({ showPassword1: !showPassword1 });
    } else if (field === 2) {
      let { showPassword2 } = this.state;
      this.setState({ showPassword2: !showPassword2 });
    }
  };

  handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  render() {
    let { error, showPassword1, showPassword2 } = this.state;
    let { classes } = this.props;

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
                  onSubmit={this.props.handleSubmit}
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
                          this.props.touched["new_password1"] &&
                          this.props.errors["new_password1"]
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
                          onChange={this.props.handleChange}
                          onBlur={this.props.handleBlur}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={(e, field = 1) =>
                                  this.handleClickShowPassword(field)
                                }
                                onMouseDown={this.handleMouseDownPassword}
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
                          {this.props.touched["new_password"] &&
                            this.props.errors["new_password"]}
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
                          this.props.touched["new_password2"] &&
                          this.props.errors["new_password2"]
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
                          onChange={this.props.handleChange}
                          onBlur={this.props.handleBlur}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={(e, field = 2) =>
                                  this.handleClickShowPassword(field)
                                }
                                onMouseDown={this.handleMouseDownPassword}
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
                          {this.props.touched["new_password2"] &&
                            this.props.errors["new_password2"]}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size="large"
                        className={classes.primaryButton}
                        onClick={this.resetPassword}
                      >
                        Reset Password
                      </Button>
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
}

PasswordResetConfirm.propTypes = {
  classes: PropTypes.object.isRequired,
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
  handleSubmit: (values, { setSubmitting }) => {},
})(withStyles(styles)(PasswordResetConfirm));
