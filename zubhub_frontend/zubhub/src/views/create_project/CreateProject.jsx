import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withFormik } from 'formik';
import * as Yup from 'yup';

import 'react-toastify/dist/ReactToastify.css';

import { nanoid } from 'nanoid';

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@material-ui/icons/Image';
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
} from '@material-ui/core';

import * as ProjectActions from '../../store/actions/projectActions';
import ErrorPage from '../error/ErrorPage';
import DO, { doConfig } from '../../assets/js/DO';
import { useStateUpdateCallback } from '../../assets/js/customHooks';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/create_project/createProjectStyles';

const useStyles = makeStyles(styles);

let image_field_touched = false;
let video_field_touched = false;

const handleImageFieldChange = (e, refs, props) => {
  props.setFieldValue(e.currentTarget.name, refs.imageEl.current);
  refs.imageCountEl.current.innerText = refs.imageEl.current.files.length;
  refs.imageCountEl.current.style.fontSize = '0.8rem';
};

const handleImageButtonClick = (e, props, refs) => {
  e.preventDefault();
  refs.imageEl.current.click();
  props.setFieldTouched('project_images');
};

const removeMaterialsUsed = (e, props, refs, value) => {
  e.preventDefault();
  const hidden_materials_field = refs.materialsUsedEl.current;
  hidden_materials_field.value = hidden_materials_field.value
    .split(',')
    .filter(material => material !== value)
    .join(',');

  props.setFieldValue('materials_used', hidden_materials_field.value, true);
  return { materials_used: hidden_materials_field.value.split(',') };
};

const handleAddMaterialFieldChange = (e, props, refs) => {
  props.validateField('materials_used');
  const value = refs.addMaterialsUsedEl.current.firstChild.value;
  if (value.includes(',')) {
    refs.addMaterialsUsedEl.current.firstChild.value = value.split(',')[0];
    return addMaterialUsed(e, props, refs);
  }
};

const addMaterialUsed = (e, props, refs) => {
  e.preventDefault();
  const new_material = refs.addMaterialsUsedEl.current.firstChild;
  if (new_material.value !== '') {
    const hidden_materials_field = refs.materialsUsedEl.current;
    hidden_materials_field.value = hidden_materials_field.value
      ? `${hidden_materials_field.value},${new_material.value}`
      : new_material.value;
    new_material.value = '';
    props.setFieldValue('materials_used', hidden_materials_field.value, true);
    new_material.focus();
    return { materials_used: hidden_materials_field.value.split(',') };
  }
};

function CreateProject(props) {
  const refs = {
    imageEl: React.useRef(null),
    imageUploadButtonEl: React.useRef(null),
    imageCountEl: React.useRef(null),
    videoEl: React.useRef(null),
    addMaterialsUsedEl: React.useRef(null),
    materialsUsedEl: React.useRef(null),
  };
  const classes = useStyles();

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
      handleSetState(upload_project());
    }
  }, [state.image_upload.successful_uploads]);

  React.useEffect(() => {
    if (props.touched['project_images'] && props.errors['project_images']) {
      refs.imageUploadButtonEl.current.setAttribute(
        'style',
        'border-color:#F54336; color:#F54336',
      );
    } else {
      refs.imageUploadButtonEl.current.setAttribute(
        'style',
        'border-color: #00B8C4; color:#00B8C4',
      );
    }

    if (props.touched['project_images']) {
      image_field_touched = true;
    } else {
      image_field_touched = false;
    }

    if (props.touched['video']) {
      video_field_touched = true;
    } else {
      video_field_touched = false;
    }
  }, [
    props.errors['project_images'],
    props.touched['project_images'],
    props.touched['video'],
  ]);

  const upload = image => {
    const params = {
      Bucket: `${doConfig.bucketName}`,
      Key: `${doConfig.project_images}/${nanoid()}`,
      Body: image,
      ContentType: image.type,
      ACL: 'public-read',
    };

    DO.upload(params)
      .on('httpUploadProgress', e => {
        const progress = Math.round((e.loaded * 100.0) / e.total);
        const { image_upload } = state;
        image_upload.upload_info[image.name] = progress;

        let total = 0;
        Object.keys(image_upload.upload_info).forEach(each => {
          total = total + image_upload.upload_info[each];
        });

        total = total / Object.keys(image_upload.upload_info).length;
        image_upload.upload_percent = total;

        handleSetState({ image_upload });
      })
      .send((err, data) => {
        if (err) {
          const { image_upload } = state;
          image_upload.upload_dialog = false;

          if (err.message.startsWith('Unexpected')) {
            handleSetState({
              error:
                'An error occured while performing this action. Please try again later',
              image_upload,
            });
          } else {
            handleSetState({ error: err.message, image_upload });
          }
        } else {
          const secure_url = data.Location;
          const public_id = data.Key;
          const { image_upload } = state;

          image_upload.uploaded_images_url.push({
            image_url: secure_url,
            public_id,
          });
          image_upload.successful_uploads = image_upload.successful_uploads + 1;

          handleSetState({ image_upload });
        }
      });
  };

  const upload_project = () => {
    const { image_upload } = state;
    image_upload.upload_dialog = false;
    handleSetState({ image_upload });
    return props.create_project({
      ...props.values,
      token: props.auth.token,
      images: state.image_upload.uploaded_images_url,
      video: props.values.video ? props.values.video : '',
    });
  };

  const init_project = e => {
    e.preventDefault();
    if (!props.auth.token) {
      props.history.push('/login');
    } else {
      props.setFieldTouched('title');
      props.setFieldTouched('description');
      props.setFieldTouched('project_images');
      props.setFieldTouched('video');
      props.setFieldTouched('materials_used');
      props.validateField('title');
      props.validateField('description');
      props.validateField('project_images');
      props.validateField('video');
      props.validateField('materials_used');

      if (
        props.errors['title'] ||
        props.errors['description'] ||
        props.errors['project_images'] ||
        props.errors['video'] ||
        props.errors['materials_used']
      ) {
        return;
      } else if (refs.imageEl.current.files.length === 0) {
        handleSetState(upload_project());
      } else {
        const project_images = refs.imageEl.current.files;

        const { image_upload } = state;
        image_upload.images_to_upload = project_images.length;
        image_upload.upload_dialog = true;
        image_upload.upload_percent = 0;
        handleSetState({ image_upload });

        for (let index = 0; index < project_images.length; index++) {
          upload(project_images[index]);
        }
      }
    }
  };

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { error, image_upload, materials_used } = state;
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
                        error={props.touched['title'] && props.errors['title']}
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
                          {props.touched['title'] && props.errors['title']}
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
                          props.touched['description'] &&
                          props.errors['description']
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
                          <Typography
                            color="textSecondary"
                            variant="caption"
                            component="span"
                          >
                            Tell us something interesting about the project! You
                            can share what it is about, what inspired you to
                            make it, your making process, fun and challenging
                            moments you experienced, etc.
                          </Typography>
                          <br />
                          {props.touched['description'] &&
                            props.errors['description']}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl
                        fullWidth
                        error={
                          props.touched['project_images'] &&
                          props.errors['project_images']
                        }
                      >
                        <label htmlFor="project_images">
                          <CustomButton
                            ref={refs.imageUploadButtonEl}
                            variant="outlined"
                            size="large"
                            margin="normal"
                            id="image_upload_button"
                            startIcon={<ImageIcon />}
                            endIcon={
                              <span
                                ref={refs.imageCountEl}
                                className="imageCountStyle"
                              ></span>
                            }
                            onClick={e =>
                              handleImageButtonClick(e, props, refs)
                            }
                            secondaryButtonStyle
                            imageUploadButtonStyle
                            fullWidth
                          >
                            Images
                          </CustomButton>
                        </label>
                        <input
                          ref={refs.imageEl}
                          className={classes.displayNone}
                          aria-hidden="true"
                          type="file"
                          accept="image/*"
                          id="project_images"
                          name="project_images"
                          multiple
                          onChange={e => handleImageFieldChange(e, refs, props)}
                          onBlur={props.handleBlur}
                        />
                        <FormHelperText error>
                          {props.errors['project_images']}
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
                        error={props.touched['video'] && props.errors['video']}
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="video"
                        >
                          Video URL
                        </InputLabel>
                        <OutlinedInput
                          ref={refs.videoEl}
                          className={classes.customInputStyle}
                          id="video"
                          name="video"
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          labelWidth={90}
                        />
                        <FormHelperText error>
                          <Typography
                            color="textSecondary"
                            variant="caption"
                            component="span"
                          >
                            YouTube, Vimeo, Google Drive links are supported
                          </Typography>
                          <br />
                          {props.touched['video'] && props.errors['video']}
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
                          props.touched['materials_used'] &&
                          props.errors['materials_used']
                        }
                      >
                        <InputLabel
                          className={clsx(
                            classes.customLabelStyle,
                            classes.largeLabel,
                          )}
                          htmlFor="add_materials_used"
                          shrink
                        >
                          Materials Used
                        </InputLabel>
                        <Box className={classes.materialsUsedViewStyle}>
                          {materials_used.map((material, num) =>
                            material !== '' ? (
                              <Chip
                                className={classes.customChipStyle}
                                key={num}
                                label={material}
                                onDelete={e =>
                                  handleSetState(
                                    removeMaterialsUsed(
                                      e,
                                      props,
                                      refs,
                                      material,
                                    ),
                                  )
                                }
                                color="secondary"
                                variant="outlined"
                              />
                            ) : null,
                          )}
                        </Box>
                        <Grid container spacing={1}>
                          <Grid item xs={8} sm={8} md={8}>
                            <OutlinedInput
                              ref={refs.addMaterialsUsedEl}
                              className={classes.customInputStyle}
                              id="add_materials_used"
                              name="add_materials_used"
                              type="text"
                              placeholder="Add a material and click the + button"
                              onClick={() =>
                                props.setFieldTouched('materials_used')
                              }
                              onChange={e =>
                                handleSetState(
                                  handleAddMaterialFieldChange(e, props, refs),
                                )
                              }
                              onBlur={() =>
                                props.validateField('materials_used')
                              }
                            />
                            <FormHelperText error>
                              {props.touched['materials_used'] &&
                                props.errors['materials_used']}
                            </FormHelperText>
                          </Grid>
                          <Grid item xs={4} sm={4} md={4}>
                            <CustomButton
                              variant="outlined"
                              size="large"
                              onClick={e =>
                                handleSetState(addMaterialUsed(e, props, refs))
                              }
                              secondaryButtonStyle
                              fullWidth
                            >
                              <AddIcon />
                            </CustomButton>
                          </Grid>
                        </Grid>
                        <input
                          ref={refs.materialsUsedEl}
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
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
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
                        image_upload.upload_percent,
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
  create_project: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    create_project: props => {
      return dispatch(ProjectActions.create_project(props));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      title: '',
      description: '',
      video: '',
      materials_used: '',
    }),
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .max(100, "your project title shouldn't be more than 100 characters")
        .required('title is required'),
      description: Yup.string()
        .max(10000, "your description shouldn't be more than 10,000 characters")
        .required('description is required'),
      project_images: Yup.mixed()
        .test(
          'image_is_empty',
          'you must provide either image(s) or video url',
          function (value) {
            return image_field_touched && !value && !this.parent.video
              ? false
              : true;
          },
        )
        .test('too_many_images', 'too many images uploaded', value => {
          if (value) {
            return value.files.length > 10 ? false : true;
          } else {
            return true;
          }
        })
        .test(
          'image_size_too_large',
          'one or more of your image is greater than 3mb',
          value => {
            if (value) {
              let image_size_too_large = false;
              for (let index = 0; index < value.files.length; index++) {
                if (value.files[index].size / 1000 > 3072) {
                  image_size_too_large = true;
                }
              }
              return image_size_too_large ? false : true;
            } else {
              return true;
            }
          },
        ),
      video: Yup.string()
        .url('you are required to submit a video url here')
        .max(1000, "your video url shouldn't be more than 1000 characters")
        .test(
          'video_is_empty',
          'you must provide either image(s) or video url',
          function (value) {
            return video_field_touched && !value && !this.parent.project_images
              ? false
              : true;
          },
        ),
      materials_used: Yup.string()
        .max(
          10000,
          "your materials used shouldn't be more than 10,000 characters",
        )
        .required('materials used is required'),
    }),
  })(CreateProject),
);
