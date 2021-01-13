import React, { Component } from "react";
import { withFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "../../infos/ErrorPage";
import clsx from "clsx";
import PropTypes from "prop-types";
import DO, { doConfig } from "../../../../assets/js/DO";
import { nanoid } from "nanoid";
import { withStyles, fade } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Chip from "@material-ui/core/Chip";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import ImageIcon from "@material-ui/icons/Image";
import AddIcon from "@material-ui/icons/Add";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

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
    width: "100%",
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
  imageUploadButton: {
    "& MuiButton-label": {
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
      "& imageCountStyle": {
        flexGrow: 1,
      },
    },
  },
  uploadProgressLabelStyle: {
    color: "white",
  },
  uploadProgressStyle: {
    color: "#00B8C4",
  },
  customChipStyle: {
    border: "1px solid #00B8C4",
    color: "#00B8C4",
    margin: "0.5em",
  },
  materialsUsedViewStyle: {
    padding: "0.5em",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textDecorationNone: {
    textDecoration: "none",
  },
  displayNone: { display: "none" },
  largeLabel: {
    fontSize: "1.3rem",
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

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      materialsUsedModalOpen: false,
      materials_used: [],
      image_upload: {
        upload_dialog: false,
        images_to_upload: 0,
        successful_uploads: 0,
        upload_info: {},
        upload_percent: 0,
        uploaded_images_url: [],
      },
    };
  }

  upload = (image) => {
    const params = {
      Bucket: `${doConfig.bucketName}`,
      Key: `${doConfig.project_images}/${nanoid()}`,
      Body: image,
      ContentType: image.type,
      ACL: "public-read",
    };

    DO.upload(params)
      .on("httpUploadProgress", (e) => {
        let progress = Math.round((e.loaded * 100.0) / e.total);
        let { image_upload } = this.state;
        image_upload.upload_info[image.name] = progress;

        let total = 0;
        Object.keys(image_upload.upload_info).forEach((each) => {
          total = total + image_upload.upload_info[each];
        });

        total = total / Object.keys(image_upload.upload_info).length;
        image_upload.upload_percent = total;

        this.setState({ image_upload });
      })
      .send((err, data) => {
        if (err) {
          let { image_upload } = this.state;
          image_upload.upload_dialog = false;

          if (err.message.startsWith("Unexpected")) {
            this.setState({
              error: this.props.t("createProject.others.errors.unexpected"),
              image_upload,
            });
          } else {
            this.setState({ error: err.message, image_upload });
          }
        } else {
          let secure_url = data.Location;
          let public_id = data.Key;
          let { image_upload } = this.state;

          image_upload.uploaded_images_url.push({
            image_url: secure_url,
            public_id,
          });
          image_upload.successful_uploads = image_upload.successful_uploads + 1;

          this.setState({ image_upload }, () => {
            if (
              this.state.image_upload.images_to_upload ===
              this.state.image_upload.successful_uploads
            ) {
              this.upload_project();
            }
          });
        }
      });
  };

  upload_project = () => {
    let { image_upload } = this.state;
    image_upload.upload_dialog = false;
    this.setState({ image_upload });
    this.props.api
      .create_project({
        ...this.props.values,
        token: this.props.auth.token,
        images: this.state.image_upload.uploaded_images_url,
        video: this.props.values.video ? this.props.values.video : "",
      })
      .then((res) => {
        if (!res.title) {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
        toast.success(this.props.t("createProject.others.toast_success"));
        return this.props.history.push("/profile");
      })
      .catch((error) => {
        if (error.message.startsWith("Unexpected")) {
          this.setState({
            error: this.props.t("createProject.others.errors.unexpected"),
          });
        } else {
          this.setState({ error: error.message });
        }
      });
  };

  init_project = (e) => {
    if (!this.props.auth.token) {
      this.props.history.push("/login");
    } else {
      let media_fields = this.mediaFieldsValidation();

      if (media_fields.image_is_empty && media_fields.video_is_empty) {
        this.props.setErrors({
          project_images: "image_or_video",
        });
        this.props.setErrors({
          video: "image_or_video",
        });
      } else if (media_fields.too_many_images === true) {
        this.props.setErrors({
          project_images: "too_many_images",
        });
      } else if (media_fields.image_size_too_large === true) {
        this.props.setErrors({
          project_images: "large_file",
        });
      } else if (media_fields.image_is_empty) {
        this.upload_project();
      } else {
        let project_images = document.querySelector("#project_images").files;

        let { image_upload } = this.state;
        image_upload.images_to_upload = project_images.length;
        image_upload.upload_dialog = true;
        image_upload.upload_percent = 0;
        this.setState({ image_upload });

        for (let index = 0; index < project_images.length; index++) {
          this.upload(project_images[index]);
        }
      }
    }
  };

  mediaFieldsValidation = () => {
    let image_upload_button = document.querySelector("#image_upload_button");
    let media_fields = document.querySelector("#project_images");
    let video = document.querySelector("#video");
    let imageCount = document.querySelector(".imageCountStyle");
    imageCount.innerText = media_fields.files.length;
    imageCount.style.fontSize = "0.8rem";

    let result = {};

    if (media_fields.files.length < 1) {
      result["image_is_empty"] = true;
      if (video.value === "") {
        image_upload_button.setAttribute(
          "style",
          "border-color:#F54336; color:#F54336"
        );
        this.props.setErrors({
          project_images: "image_or_video",
        });
        this.props.setErrors({
          video: "image_or_video",
        });
        result["video_is_empty"] = true;
      }
    } else if (media_fields.files.length > 10) {
      image_upload_button.setAttribute(
        "style",
        "border-color:#F54336; color:#F54336"
      );
      this.props.setErrors({
        project_images: "too_many_images",
      });
      result["too_many_images"] = true;
    } else {
      let image_size_too_large = false;

      for (let index = 0; index < media_fields.files.length; index++) {
        if (media_fields.files[index].size / 1000 > 3072) {
          image_size_too_large = true;
        }
      }
      if (image_size_too_large) {
        image_upload_button.setAttribute(
          "style",
          "border-color:#F54336; color:#F54336"
        );
        this.props.setErrors({
          project_images: "image_size_too_large",
        });
        result["image_size_too_large"] = image_size_too_large;
      }

      return result;
    }

    image_upload_button.setAttribute(
      "style",
      "border-color: #00B8C4; color:#00B8C4"
    );
    return result;
  };

  handleImageButtonClick = () => {
    document.querySelector("#project_images").click();
    this.props.setFieldTouched("project_images");
  };

  handleAddMaterialFieldChange = (e) => {
    this.props.validateField("materials_used");
    let value = e.currentTarget.value;
    if (value.includes(",")) {
      e.currentTarget.value = value.split(",")[0];
      this.addMaterialUsed(e);
    }
  };

  addMaterialUsed = (e) => {
    e.preventDefault();
    let new_material = document.querySelector("#add_materials_used");
    if (new_material.value !== "") {
      let hidden_materials_field = document.querySelector("#materials_used");
      hidden_materials_field.value = hidden_materials_field.value
        ? `${hidden_materials_field.value},${new_material.value}`
        : new_material.value;
      new_material.value = "";
      this.props.setFieldValue(
        "materials_used",
        hidden_materials_field.value,
        true
      );
      this.setState({
        materials_used: hidden_materials_field.value.split(","),
      });
    }
    new_material.focus();
  };

  removeMaterialsUsed = (e, value) => {
    e.preventDefault();
    let hidden_materials_field = document.querySelector("#materials_used");
    hidden_materials_field.value = hidden_materials_field.value
      .split(",")
      .filter((material) => material !== value)
      .join(",");

    this.props.setFieldValue(
      "materials_used",
      hidden_materials_field.value,
      true
    );
    this.setState({ materials_used: hidden_materials_field.value.split(",") });
  };

  render() {
    let { error, image_upload, materials_used } = this.state;
    let { classes, t } = this.props;
    if (!this.props.auth.token) {
      return (
        <ErrorPage error={t("createProject.others.errors.not_logged_in")} />
      );
    } else {
      return (
        <Box className={classes.root}>
          <Container maxWidth="sm">
            <Card className={classes.cardStyle}>
              <CardActionArea>
                <CardContent>
                  <form
                    className="project-create-form"
                    name="create_project"
                    noValidate="noValidate"
                    onSubmit={this.props.handleSubmit}
                  >
                    <Typography
                      className={classes.titleStyle}
                      gutterBottom
                      variant="h5"
                      component="h2"
                      color="textPrimary"
                    >
                      {t("createProject.welcome.primary")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t("createProject.welcome.secondary")}
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
                          margin="small"
                          error={
                            this.props.touched["title"] &&
                            this.props.errors["title"]
                          }
                        >
                          <InputLabel
                            className={classes.customLabelStyle}
                            htmlFor="title"
                          >
                            {t("createProject.inputs.title.label")}
                          </InputLabel>
                          <OutlinedInput
                            className={classes.customInputStyle}
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Project Title"
                            onChange={this.props.handleChange}
                            onBlur={this.props.handleBlur}
                            labelWidth={40}
                          />
                          <FormHelperText error>
                            {this.props.touched["title"] &&
                              this.props.errors["title"] &&
                              t(
                                `createProject.inputs.title.errors.${this.props.errors["title"]}`
                              )}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl
                          className={clsx(classes.margin, classes.textField)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          margin="small"
                          error={
                            this.props.touched["description"] &&
                            this.props.errors["description"]
                          }
                        >
                          <InputLabel
                            className={classes.customLabelStyle}
                            htmlFor="description"
                          >
                            {t("createProject.inputs.description.label")}
                          </InputLabel>
                          <OutlinedInput
                            className={classes.customInputStyle}
                            id="description"
                            name="description"
                            type="text"
                            multiline
                            rowsMax={6}
                            onChange={this.props.handleChange}
                            onBlur={this.props.handleBlur}
                            labelWidth={90}
                          />
                          <FormHelperText error>
                            {this.props.touched["description"] &&
                              this.props.errors["description"] &&
                              t(
                                `createProject.inputs.description.errors.${this.props.errors["description"]}`
                              )}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6}>
                        <FormControl
                          fullWidth
                          error={
                            this.props.touched["project_images"] &&
                            this.props.errors["project_images"]
                          }
                        >
                          <label htmlFor="project_images">
                            <Button
                              className={clsx(
                                classes.secondaryButton,
                                classes.imageUploadButton
                              )}
                              variant="outlined"
                              size="large"
                              margin="normal"
                              id="image_upload_button"
                              startIcon={<ImageIcon />}
                              endIcon={
                                <span className="imageCountStyle"></span>
                              }
                              onClick={this.handleImageButtonClick}
                            >
                              {t("createProject.inputs.project_images.label")}
                            </Button>
                          </label>
                          <input
                            className={classes.displayNone}
                            aria-hidden="true"
                            type="file"
                            accept="image/*"
                            id="project_images"
                            name="project_images"
                            multiple
                            onChange={this.mediaFieldsValidation}
                            onBlur={this.props.handleBlur}
                          />
                          <FormHelperText error>
                            {this.props.errors["project_images"] &&
                              t(
                                `createProject.inputs.project_images.errors.${this.props.errors["project_images"]}`
                              )}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6}>
                        <FormControl
                          className={clsx(classes.margin, classes.textField)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          margin="small"
                          error={
                            this.props.touched["video"] &&
                            this.props.errors["video"]
                          }
                        >
                          <InputLabel
                            className={classes.customLabelStyle}
                            htmlFor="video"
                          >
                            {t("createProject.inputs.video.label")}
                          </InputLabel>
                          <OutlinedInput
                            className={classes.customInputStyle}
                            id="video"
                            name="video"
                            type="text"
                            onChange={this.props.handleChange}
                            onBlur={this.props.handleBlur}
                            labelWidth={90}
                          />
                          <FormHelperText error>
                            <Typography
                              color="textSecondary"
                              variant="caption"
                              component="span"
                            >
                              {t("createProject.inputs.video.helper_text")}
                            </Typography>
                            <br />
                            {this.props.touched["video"] &&
                              this.props.errors["video"] &&
                              t(
                                `createProject.inputs.video.errors.${this.props.errors["video"]}`
                              )}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={12} md={12}>
                        <FormControl
                          className={clsx(classes.margin, classes.textField)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          margin="small"
                          error={
                            this.props.touched["materials_used"] &&
                            this.props.errors["materials_used"]
                          }
                        >
                          <InputLabel
                            className={clsx(
                              classes.customLabelStyle,
                              classes.largeLabel
                            )}
                            htmlFor="add_materials_used"
                            shrink
                          >
                            {t("createProject.inputs.materials_used.label")}
                          </InputLabel>
                          <Box className={classes.materialsUsedViewStyle}>
                            {materials_used.map((material, num) =>
                              material !== "" ? (
                                <Chip
                                  className={classes.customChipStyle}
                                  key={num}
                                  label={material}
                                  onDelete={(e, value = material) =>
                                    this.removeMaterialsUsed(e, value)
                                  }
                                  color="secondary"
                                  variant="outlined"
                                />
                              ) : null
                            )}
                          </Box>
                          <Grid container spacing={1}>
                            <Grid item xs={8} sm={8} md={8}>
                              <OutlinedInput
                                className={classes.customInputStyle}
                                id="add_materials_used"
                                name="add_materials_used"
                                type="text"
                                placeholder="Add a material and click the + button"
                                onClick={() =>
                                  this.props.setFieldTouched("materials_used")
                                }
                                onChange={this.handleAddMaterialFieldChange}
                                onBlur={() =>
                                  this.props.validateField("materials_used")
                                }
                              />
                              <FormHelperText error>
                                {this.props.touched["materials_used"] &&
                                  this.props.errors["materials_used"] &&
                                  t(
                                    `createProject.inputs.materials_used.errors.${this.props.errors["materials_used"]}`
                                  )}
                              </FormHelperText>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4}>
                              <Button
                                className={classes.secondaryButton}
                                variant="outlined"
                                size="large"
                                onClick={this.addMaterialUsed}
                              >
                                <AddIcon />
                              </Button>
                            </Grid>
                          </Grid>
                          <input
                            id="materials_used"
                            name="materials_used"
                            className={classes.displayNone}
                            onChange={this.props.handleChange}
                            onBlur={this.props.handleBlur}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          size="large"
                          className={classes.primaryButton}
                          onClick={this.init_project}
                        >
                          {t("createProject.submit")}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                  <Dialog
                    PaperProps={{
                      style: {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      },
                    }}
                    className={classes.uploadProgressDialogStyle}
                    open={image_upload.upload_dialog}
                    aria-labelledby="upload progress dialog"
                  >
                    <Box position="relative" display="inline-flex">
                      <CircularProgress
                        className={classes.uploadProgressStyle}
                        variant="determinate"
                        size={70}
                        thickness={6}
                        value={image_upload.upload_percent}
                      />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography
                          className={classes.uploadProgressLabelStyle}
                          variant="caption"
                          component="div"
                        >{`${Math.round(
                          image_upload.upload_percent
                        )}%`}</Typography>
                      </Box>
                    </Box>
                  </Dialog>
                </CardContent>
              </CardActionArea>
            </Card>
          </Container>
        </Box>
      );
    }
  }
}

CreateProject.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(
  withFormik({
    mapPropsToValue: () => ({
      title: "",
      description: "",
      video: "",
      materials_used: "",
    }),
    validationSchema: Yup.object().shape({
      title: Yup.string().max(100, "max").required("required"),
      description: Yup.string().max(10000, "max").required("required"),
      video: Yup.string().url("should_be_video_url").max(1000, "max"),
      materials_used: Yup.string().max(10000, "max").required("required"),
    }),
    handleSubmit: (values, { setSubmitting }) => {},
  })(withStyles(styles)(CreateProject))
);
