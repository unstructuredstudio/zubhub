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
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

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

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  sendPasswordResetLink = (e) => {
    e.preventDefault();
    this.props.api
      .send_password_reset_link(this.props.values.email)
      .then((res) => {
        if (res.detail !== "Password reset e-mail has been sent.") {
          throw new Error(JSON.stringify(res));
        } else {
          toast.success("We just sent a password reset link to your email!");
          setTimeout(() => {
            this.props.history.push("/");
          }, 4000);
        }
      })
      .catch((error) => {
        const messages = JSON.parse(error.message);
        if (typeof messages === "object") {
          Object.keys(messages).forEach((key) => {
            if (key !== "email") {
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

  render() {
    let { error } = this.state;
    let { classes } = this.props;

    return (
      <Box className={classes.root}>
        <Container maxWidth="sm">
          <Card className={classes.cardStyle}>
            <CardActionArea>
              <CardContent>
                <form
                  className="auth-form"
                  name="password_reset"
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
                    Password Reset
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Input your email so we can send you a password reset link
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
                    <Grid item xs={12}>
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
                          labelWidth={50}
                        />
                        <FormHelperText error>
                          {this.props.touched["email"] &&
                            this.props.errors["email"]}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size="large"
                        className={classes.primaryButton}
                        onClick={this.sendPasswordResetLink}
                      >
                        Send Reset Link
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

PasswordReset.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withFormik({
  mapPropsToValue: () => ({
    email: "",
  }),
  validationSchema: Yup.object().shape({
    email: Yup.string().email("invalid email").required("email required"),
  }),
  handleSubmit: (values, { setSubmitting }) => {},
})(withStyles(styles)(PasswordReset));
