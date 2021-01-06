import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withFormik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { nanoid } from "nanoid";

import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ImageIcon from "@material-ui/icons/Image";
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  Chip,
  Typography,
  CircularProgress,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  FormControl,
} from "@material-ui/core";

import ErrorPage from "../error/ErrorPage";
import DO, { doConfig } from "../../assets/js/DO";
import { useStateUpdateCallback } from "../../assets/js/customHooks";
import CustomButton from "../../components/button/Button";
import styles from "../../assets/js/styles/views/create_project/createProjectStyles";

function CreateProject(props) {
  const classes = makeStyles(styles)();

  const [state, setState] = React.useState({
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
  });

  useStateUpdateCallback(() => {
    if (
      state.image_upload.images_to_upload ===
      state.image_upload.successful_uploads
    ) {
      upload_project();
    }
  }, [state.image_upload.successful_uploads]);

  const upload = (image) => {
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
        let { image_upload } = state;
        image_upload.upload_info[image.name] = progress;

        let total = 0;
        Object.keys(image_upload.upload_info).forEach((each) => {
          total = total + image_upload.upload_info[each];
        });

        total = total / Object.keys(image_upload.upload_info).length;
        image_upload.upload_percent = total;

        setState({ ...state, image_upload });
      })
      .send((err, data) => {
        if (err) {
          let { image_upload } = state;
          image_upload.upload_dialog = false;

          if (err.message.startsWith("Unexpected")) {
            setState({
              ...state,
              error:
                "An error occured while performing this action. Please try again later",
              image_upload,
            });
          } else {
            setState({ ...state, error: err.message, image_upload });
          }
        } else {
          let secure_url = data.Location;
          let public_id = data.Key;
          let { image_upload } = state;

          image_upload.uploaded_images_url.push({
            image_url: secure_url,
            public_id,
          });
          image_upload.successful_uploads = image_upload.successful_uploads + 1;

          setState({ ...state, image_upload });
        }
      });
  };

  const upload_project = () => {
    let { image_upload } = state;
    image_upload.upload_dialog = false;
    setState({ ...state, image_upload });
    props.api
      .create_project({
        ...props.values,
        token: props.auth.token,
        images: state.image_upload.uploaded_images_url,
        video: props.values.video ? props.values.video : "",
      })
      .then((res) => {
        if (!res.comments) {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        } else {
          toast.success("Your project was created successfully!!");
          return props.history.push("/profile");
        }
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

  const init_project = (e) => {
    e.preventDefault();
    if (!props.auth.token) {
      props.history.push("/login");
    } else {
      props.setFieldTouched("title");
      props.setFieldTouched("description");
      props.setFieldTouched("materials_used");

      props.validateField("title");
      props.validateField("description");
      props.validateField("materials_used");

      let media_fields = mediaFieldsValidation();

      if (media_fields.image_is_empty && media_fields.video_is_empty) {
        return;
      } else if (media_fields.video_value_not_url) {
        return;
      } else if (media_fields.too_many_images === true) {
        return;
      } else if (media_fields.image_size_too_large === true) {
        return;
      } else if (media_fields.image_is_empty) {
        upload_project();
      } else {
        let project_images = document.querySelector("#project_images").files;

        let { image_upload } = state;
        image_upload.images_to_upload = project_images.length;
        image_upload.upload_dialog = true;
        image_upload.upload_percent = 0;
        setState({ ...state, image_upload });

        for (let index = 0; index < project_images.length; index++) {
          upload(project_images[index]);
        }
      }
    }
  };

  const mediaFieldsValidation = () => {
    let image_upload_button = document.querySelector("#image_upload_button");
    let media_fields = document.querySelector("#project_images");
    let video = document.querySelector("#video");
    let imageCount = document.querySelector(".imageCountStyle");
    imageCount.innerText = media_fields.files.length;
    imageCount.style.fontSize = "0.8rem";

    let result = {};

    if (/^(ftp|http|https):\/\/[^ "]+$/.test(video.value) === false) {
      props.setFieldTouched("video");
      props.setFieldError(
        "video",
        "you are required to submit a video url here"
      );
      result["video_value_not_url"] = true;
    }

    if (media_fields.files.length < 1) {
      result["image_is_empty"] = true;
      if (video.value === "") {
        image_upload_button.setAttribute(
          "style",
          "border-color:#F54336; color:#F54336"
        );
        props.setFieldTouched("project_images");
        props.setFieldTouched("video");
        props.setFieldError(
          "project_images",
          "you must provide either image(s) or video url"
        );
        props.setFieldError(
          "video",
          "you must provide either image(s) or video url"
        );
        result["video_is_empty"] = true;
      }
    } else if (media_fields.files.length > 10) {
      image_upload_button.setAttribute(
        "style",
        "border-color:#F54336; color:#F54336"
      );
      props.setFieldTouched("project_images");
      props.setFieldError("project_images", "too many images uploaded");
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
        props.setFieldTouched("project_images");
        props.setFieldError(
          "project_images",
          "one or more of your image is greater than 3mb"
        );
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

  const handleImageButtonClick = () => {
    document.querySelector("#project_images").click();
    props.setFieldTouched("project_images");
  };

  const handleAddMaterialFieldChange = (e) => {
    props.validateField("materials_used");
    let value = e.currentTarget.value;
    if (value.includes(",")) {
      e.currentTarget.value = value.split(",")[0];
      addMaterialUsed(e);
    }
  };

  const addMaterialUsed = (e) => {
    e.preventDefault();
    let new_material = document.querySelector("#add_materials_used");
    if (new_material.value !== "") {
      let hidden_materials_field = document.querySelector("#materials_used");
      hidden_materials_field.value = hidden_materials_field.value
        ? `${hidden_materials_field.value},${new_material.value}`
        : new_material.value;
      new_material.value = "";
      props.setFieldValue("materials_used", hidden_materials_field.value, true);
      setState({
        ...state,
        materials_used: hidden_materials_field.value.split(","),
      });
    }
    new_material.focus();
  };

  const removeMaterialsUsed = (e, value) => {
    e.preventDefault();
    let hidden_materials_field = document.querySelector("#materials_used");
    hidden_materials_field.value = hidden_materials_field.value
      .split(",")
      .filter((material) => material !== value)
      .join(",");

    props.setFieldValue("materials_used", hidden_materials_field.value, true);
    setState({
      ...state,
      materials_used: hidden_materials_field.value.split(","),
    });
  };

  let { error, image_upload, materials_used } = state;
  if (!props.auth.token) {
    return (
      <ErrorPage error="You are not logged in. Click on the signin button to get started" />
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
                  onSubmit={init_project}
                >
                  <Typography
                    className={classes.titleStyle}
                    gutterBottom
                    variant="h5"
                    component="h2"
                    color="textPrimary"
                  >
                    Create Project
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Tell us about your project!
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

                    <Grid item xs={12}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={props.touched["title"] && props.errors["title"]}
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="title"
                        >
                          Title
                        </InputLabel>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="title"
                          name="title"
                          type="text"
                          placeholder="Project Title"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          labelWidth={90}
                        />
                        <FormHelperText error>
                          {props.touched["title"] && props.errors["title"]}
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
                          props.touched["description"] &&
                          props.errors["description"]
                        }
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="description"
                        >
                          Description
                        </InputLabel>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="description"
                          name="description"
                          type="text"
                          multiline
                          rowsMax={6}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          labelWidth={90}
                        />
                        <FormHelperText error>
                          {props.touched["description"] &&
                            props.errors["description"]}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl
                        fullWidth
                        error={
                          props.touched["project_images"] &&
                          props.errors["project_images"]
                        }
                      >
                        <label htmlFor="project_images">
                          <CustomButton
                            variant="outlined"
                            size="large"
                            margin="normal"
                            id="image_upload_button"
                            startIcon={<ImageIcon />}
                            endIcon={<span className="imageCountStyle"></span>}
                            onClick={handleImageButtonClick}
                            secondaryButtonStyle
                            imageUploadButtonStyle
                            fullWidth
                          >
                            Images
                          </CustomButton>
                        </label>
                        <input
                          className={classes.displayNone}
                          aria-hidden="true"
                          type="file"
                          accept="image/*"
                          id="project_images"
                          name="project_images"
                          multiple
                          onChange={mediaFieldsValidation}
                          onBlur={props.handleBlur}
                        />
                        <FormHelperText error>
                          {props.errors["project_images"]}
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
                        error={props.touched["video"] && props.errors["video"]}
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="video"
                        >
                          Video URL
                        </InputLabel>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="video"
                          name="video"
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          labelWidth={90}
                        />
                        <FormHelperText error>
                          {props.touched["video"] && props.errors["video"]}
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
                          props.touched["materials_used"] &&
                          props.errors["materials_used"]
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
                          Materials Used
                        </InputLabel>
                        <Box className={classes.materialsUsedViewStyle}>
                          {materials_used.map((material, num) =>
                            material !== "" ? (
                              <Chip
                                className={classes.customChipStyle}
                                key={num}
                                label={material}
                                onDelete={(e, value = material) =>
                                  removeMaterialsUsed(e, value)
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
                                props.setFieldTouched("materials_used")
                              }
                              onChange={handleAddMaterialFieldChange}
                              onBlur={() =>
                                props.validateField("materials_used")
                              }
                            />
                            <FormHelperText error>
                              {props.touched["materials_used"] &&
                                props.errors["materials_used"]}
                            </FormHelperText>
                          </Grid>
                          <Grid item xs={4} sm={4} md={4}>
                            <CustomButton
                              variant="outlined"
                              size="large"
                              onClick={addMaterialUsed}
                              secondaryButtonStyle
                              fullWidth
                            >
                              <AddIcon />
                            </CustomButton>
                          </Grid>
                        </Grid>
                        <input
                          id="materials_used"
                          name="materials_used"
                          className={classes.displayNone}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        />
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
                        Create Project
                      </CustomButton>
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

CreateProject.propTypes = {
  auth: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
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
      title: Yup.string()
        .max(100, "your project title shouldn't be more than 100 characters")
        .required("title is required"),
      description: Yup.string()
        .max(10000, "your description shouldn't be more than 10,000 characters")
        .required("description is required"),
      video: Yup.string()
        .url("you are required to submit a video url here")
        .max(1000, "your video url shouldn't be more than 1000 characters"),
      materials_used: Yup.string()
        .max(
          10000,
          "your materials used shouldn't be more than 10,000 characters"
        )
        .required("materials used is required"),
    }),
  })(CreateProject)
);
