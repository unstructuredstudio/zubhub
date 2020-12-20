import React, { Component } from "react";
import { withFormik } from "formik";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles, fade } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
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
    [theme.breakpoints.down("573")]: {
      width: "20%",
    },
    [theme.breakpoints.down("423")]: {
      marginLeft: "0.5em",
      marginRight: "0.5em",
    },
    [theme.breakpoints.down("378")]: {
      width: "10%",
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

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      error: null,
      showPassword1: false,
      showPassword2: false,
      toolTipOpen: false,
    };
  }

  componentDidMount() {
    this.props.api
      .get_locations()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0 && res[0].name) {
          return this.setState({ locations: res });
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  signup = (e) => {
    if (this.props.values.location.length < 1) {
      this.props.validateField("location");
    } else {
      this.props.api
        .signup(this.props.values)
        .then((res) => {
          if (!res.key) {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
          return this.props.set_auth_user({ token: res.key });
        })
        .then((val) => this.props.api.get_auth_user(this.props.auth.token))
        .then((res) =>
          this.props.set_auth_user({
            ...this.props.auth,
            username: res.username,
            id: res.id,
          })
        )
        .then((val) => this.props.history.push("/profile"))
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
    }
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

  handleTooltipClose = () => {
    this.setState({ toolTipOpen: false });
  };

  handleTooltipOpen = () => {
    this.setState({ toolTipOpen: true });
  };

  render() {
    let {
      error,
      locations,
      showPassword1,
      showPassword2,
      toolTipOpen,
    } = this.state;
    let { classes } = this.props;
    return (
      <Box className={classes.root}>
        <Container maxWidth="sm">
          <Card className={classes.cardStyle}>
            <CardActionArea>
              <CardContent>
                <form
                  className="auth-form"
                  name="signup"
                  noValidate="noValidate"
                  onSubmit={this.props.handleSubmit}
                >
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    color="textPrimary"
                  >
                    Welcome to Zubhub
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Create an account to submit a project
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
                          Username
                        </InputLabel>
                        <ClickAwayListener
                          onClickAway={this.handleTooltipClose}
                        >
                          <Tooltip
                            title="Do not use your real name here!"
                            placement="top-start"
                            arrow
                            onClose={this.handleTooltipClose}
                            PopperProps={{
                              disablePortal: true,
                            }}
                            open={toolTipOpen}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                          >
                            <OutlinedInput
                              className={classes.customInputStyle}
                              id="username"
                              name="username"
                              type="text"
                              onClick={this.handleTooltipOpen}
                              onChange={this.props.handleChange}
                              onBlur={this.props.handleBlur}
                              labelWidth={90}
                            />
                          </Tooltip>
                        </ClickAwayListener>

                        <FormHelperText error>
                          {this.props.errors["username"]}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        error={
                          this.props.touched["email"] &&
                          this.props.errors["email"]
                        }
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="email"
                        >
                          Email
                        </InputLabel>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="email"
                          name="email"
                          type="text"
                          onChange={this.props.handleChange}
                          onBlur={this.props.handleBlur}
                          labelWidth={70}
                        />
                        <FormHelperText error>
                          {this.props.errors["email"]}
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
                          this.props.touched["dateOfBirth"] &&
                          this.props.errors["dateOfBirth"]
                        }
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="dateOfBirth"
                          shrink
                        >
                          Date Of Birth
                        </InputLabel>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          defaultValue=""
                          onChange={this.props.handleChange}
                          onBlur={this.props.handleBlur}
                          labelWidth={90}
                        />
                        <FormHelperText error>
                          {this.props.errors["dateOfBirth"]}
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
                          this.props.touched["user_location"] &&
                          this.props.errors["user_location"]
                        }
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          id="user_location"
                        >
                          Location
                        </InputLabel>
                        <Select
                          labelId="user_location"
                          id="user_location"
                          name="user_location"
                          className={classes.customInputStyle}
                          defaultValue=""
                          onChange={this.props.handleChange}
                          onBlur={this.props.handleBlur}
                          label="Location"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {locations.map((location) => (
                            <MenuItem key={location.name} value={location.name}>
                              {location.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error>
                          {this.props.errors["user_location"]}
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
                          this.props.touched["password1"] &&
                          this.props.errors["password1"]
                        }
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="password1"
                        >
                          Password
                        </InputLabel>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="password1"
                          name="password1"
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
                          {this.props.errors["password1"]}
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
                          this.props.touched["password2"] &&
                          this.props.errors["password2"]
                        }
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="password2"
                        >
                          Confirm Password
                        </InputLabel>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="password2"
                          name="password2"
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
                          labelWidth={70}
                        />
                        <FormHelperText error>
                          {this.props.errors["password2"]}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size="large"
                        className={classes.primaryButton}
                        onClick={this.signup}
                      >
                        Signup
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
                        Already a Member ?
                      </Typography>
                      <Divider className={classes.divider} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Link to="/login" className={classes.textDecorationNone}>
                      <Button
                        variant="outlined"
                        size="large"
                        className={classes.secondaryButton}
                      >
                        Login
                      </Button>
                    </Link>
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

Signup.propTypes = {
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
      user_location: "",
      password1: "",
      password2: "",
    }),
    validationSchema: Yup.object().shape({
      email: Yup.string().email("invalid email").required("invalid email"),
      user_location: Yup.string()
        .min(1, "your location is too short")
        .required("please input your location"),
      password1: Yup.string()
        .min(8, "your password is too short")
        .required("input your password"),
      password2: Yup.string()
        .oneOf([Yup.ref("password1"), null], "Passwords must match")
        .required("input a confirmation password"),
    }),
    handleSubmit: (values, { setSubmitting }) => {},
  })(withStyles(styles)(Signup))
);
