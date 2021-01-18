import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

class EmailConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      username: null,
      key: null,
    };
  }

  componentDidMount() {
    let { username, key } = this.getUsernameAndKey(this.props.location.search);
    this.setState({ username, key });
  }

  getUsernameAndKey = (queryString) => {
    let username = queryString.split("&&");
    let key = username[1].split("=")[1];
    username = username[0].split("=")[1];
    return { username, key };
  };

  confirmEmail = (e) => {
    e.preventDefault();
    this.props.api
      .send_email_confirmation(this.state.key)
      .then((res) => {
        if (res.detail !== "ok") {
          throw new Error(res.detail);
        } else {
          toast.success("Congratulations!, your email has been confirmed!");
          setTimeout(() => {
            this.props.history.push("/");
          }, 4000);
        }
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

  render() {
    let { error, username } = this.state;
    let { classes } = this.props;

    return (
      <Box className={classes.root}>
        <Container maxWidth="sm">
          <Card className={classes.cardStyle}>
            <CardActionArea>
              <CardContent>
                <form
                  className="auth-form"
                  name="email_confirm"
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
                    Email Confirmation
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Please Confirm that you are {username} and that the email
                    belongs to you:
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
                      <Button
                        variant="contained"
                        size="large"
                        className={classes.primaryButton}
                        onClick={this.confirmEmail}
                      >
                        Confirm
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

EmailConfirm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmailConfirm);
