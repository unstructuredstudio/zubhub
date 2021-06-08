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
import HelpIcon from '@material-ui/icons/Help';
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  OutlinedInput,
  FormHelperText,
  FormControl,
  Tooltip,
  ClickAwayListener,
} from '@material-ui/core';

import * as ProjectActions from '../../store/actions/projectActions';
import ErrorPage from '../error/ErrorPage';
import DO, { doConfig } from '../../assets/js/DO';
import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import Compress from '../../assets/js/Compress';
import { useStateUpdateCallback } from '../../assets/js/customHooks';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/create_project/createProjectStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

let image_field_touched = false;
let video_field_touched = false;
const timer = { id: null };

const get_categories = props => {
  return props.get_categories({ t: props.t });
};

const getProject = (refs, props, state) => {
  return props
    .get_project({
      id: props.match.params.id,
      token: props.auth.token,
    })
    .then(obj => {
      if (!obj.project) {
        return obj;
      } else {
        const { image_upload } = state;

        if (refs.titleEl.current && obj.project.title) {
          props.setFieldValue('title', obj.project.title);
          refs.titleEl.current.firstChild.value = obj.project.title;
        }

        if (refs.descEl.current && obj.project.description) {
          props.setFieldValue('description', obj.project.description);
          refs.descEl.current.firstChild.value = obj.project.description;
        }

        if (refs.videoEl.current && obj.project.video) {
          props.setFieldValue('video', obj.project.video);
          refs.videoEl.current.firstChild.value = obj.project.video;
        }

        if (refs.imageCountEl.current && obj.project.images.length > 0) {
          refs.imageCountEl.current.innerText = `${
            obj.project.images.length
          } ${props.t(
            `createProject.inputs.${
              obj.project.images.length < 2 ? 'image' : 'images'
            }`,
          )}`;
        }

        if (refs.addMaterialsUsedEl.current && obj.project.materials_used) {
          props.setFieldValue(
            'materials_used',
            obj.project.materials_used,
            true,
          );
        }

        if (obj.project.category) {
          props.setFieldValue('category', obj.project.category);
        }

        if (refs.addTagsEl.current && obj.project.tags) {
          props.setFieldValue('tags', JSON.stringify(obj.project.tags), true);
        }

        image_upload.uploaded_images_url = obj.project.images;

        return {
          loading: false,
          materials_used: obj.project.materials_used.split(','),
          image_upload,
        };
      }
    });
};

const handleImageFieldChange = (refs, props, state, handleSetState) => {
  refs.imageCountEl.current.innerText = `${
    refs.imageEl.current.files.length
  } ${props.t(
    `createProject.inputs.${
      refs.imageEl.current.files.length < 2 ? 'image' : 'images'
    }`,
  )}`;

  props.setFieldValue('project_images', refs.imageEl.current).then(errors => {
    if (!errors['project_images']) {
      removeMetaData(refs.imageEl.current.files, state, handleSetState);
    }
  });
};

const removeMetaData = (images, state, handleSetState) => {
  const newWorker = worker();
  newWorker.removeMetaData(images);
  newWorker.addEventListener('message', e => {
    Compress(e.data, state, handleSetState);
  });
};

const handleImageButtonClick = (e, props, refs) => {
  e.preventDefault();
  refs.imageEl.current.click();
  props.setFieldTouched('project_images');
};

const handleDescTooltipOpen = () => {
  return { descToolTipOpen: true };
};

const handleDescTooltipClose = () => {
  return { descToolTipOpen: false };
};

const handleAddMaterialFieldChange = (e, props, refs) => {
  const children = refs.addMaterialsUsedEl.current.children;
  let value = '';
  for (let index = 0; index < children.length; index++) {
    if (children[index].children[0].value) {
      if (index < 1) {
        value = value.concat(children[index].children[0].value);
      } else {
        value = value.concat(`,${children[index].children[0].value}`);
      }
    } else {
      if (index >= 1) {
        value = value.concat(',');
      }
    }
  }

  props.setFieldValue('materials_used', value, true);
};

const buildMaterialUsedNodes = ({ props, refs, classes, commonClasses }) => {
  if (props.values['materials_used']) {
    return props.values['materials_used']
      .split(',')
      .map((material, index) => (
        <OutlinedInput
          key={index}
          className={clsx(classes.customInputStyle, commonClasses.marginTop1em)}
          type="text"
          onBlur={() => props.setFieldTouched('materials_used', true)}
          onChange={e => handleAddMaterialFieldChange(e, props, refs)}
          value={material}
          placeholder={`${index + 1}.`}
        />
      ));
  } else {
    return ['', '', ''].map((material, index) => (
      <OutlinedInput
        key={index}
        className={clsx(classes.customInputStyle, commonClasses.marginTop1em)}
        type="text"
        onBlur={() => props.setFieldTouched('materials_used', true)}
        onChange={e => handleAddMaterialFieldChange(e, props, refs)}
        placeholder={`${index + 1}.`}
      />
    ));
  }
};

const addMaterialsUsedNode = (e, props) => {
  e.preventDefault();
  let materials_used = props.values['materials_used'];
  if (!materials_used) {
    props.setFieldValue('materials_used', ',,,');
  } else {
    props.setFieldValue('materials_used', materials_used.concat(','));
  }
};

const removeTag = (e, props, value) => {
  let tags = props.values['tags'];
  tags = tags ? JSON.parse(tags) : [];
  tags = tags.filter(tag => tag.name !== value);
  props.setFieldValue('tags', JSON.stringify(tags));
};

const handleAddTags = (e, props, addTagsEl) => {
  props.setFieldTouched('tags', true, true);
  let value = e.currentTarget.value.split(',');
  value[0] = value[0].trim();
  let tags = props.values['tags'];
  tags = tags ? JSON.parse(tags) : [];

  const exists =
    tags.filter(tag => tag.name === value[0]).length > 0 ? true : false;

  if (!exists && value.length > 1 && value[0] && !(tags.length >= 5)) {
    tags.push({ name: value[0] });
    props.setFieldValue('tags', JSON.stringify(tags));
    e.currentTarget.value = '';
    if (e.currentTarget.focus) e.currentTarget.focus();
    if (addTagsEl) {
      addTagsEl.current.value = '';
      addTagsEl.current.focus();
    }
  }

  return { tag_suggestion_open: false, tag_suggestion: [] };
};

const handleSuggestTags = (e, props, state, handleSetState) => {
  clearTimeout(timer.id);
  const value = e.currentTarget.value;

  if (value !== '' && value.search(',') === -1) {
    timer.id = setTimeout(() => {
      suggestTags(value, props, handleSetState, state);
    }, 500);
  }
};

const suggestTags = (value, props, handleSetState, state) => {
  handleSetState({ tag_suggestion_open: true });
  handleSetState(props.suggest_tags({ value, t: props.t }));
};

function CreateProject(props) {
  const refs = {
    titleEl: React.useRef(null),
    descEl: React.useRef(null),
    imageEl: React.useRef(null),
    imageUploadButtonEl: React.useRef(null),
    imageCountEl: React.useRef(null),
    videoEl: React.useRef(null),
    addMaterialsUsedEl: React.useRef(null),
    addTagsEl: React.useRef(null),
  };
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    desc_tool_tip_open: false,
    loading: true,
    error: null,
    materials_used: [],
    categories: [],
    tag_suggestion: [],
    tag_suggestion_open: false,
    image_upload: {
      upload_dialog: false,
      images_to_upload: 0,
      successful_uploads: 0,
      upload_info: {},
      upload_percent: 0,
      uploaded_images_url: [],
    },
  });

  React.useEffect(() => {
    if (props.match.params.id) {
      Promise.all([
        getProject(refs, props, state),
        get_categories(props),
      ]).then(result => handleSetState({ ...result[0], ...result[1] }));
    } else {
      handleSetState(get_categories(props));
    }
  }, []);

  useStateUpdateCallback(() => {
    if (
      state.image_upload.images_to_upload.length ===
      state.image_upload.successful_uploads
    ) {
      upload_project();
    }
  }, [state.image_upload.successful_uploads]);

  React.useEffect(() => {
    if (props.auth.token) {
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
              error: props.t('createProject.errors.unexpected'),
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

    const materials_used = props.values['materials_used']
      .split(',')
      .filter(value => (value ? true : false))
      .join(',');

    const tags = props.values['tags']
      ? JSON.parse(props.values['tags']).filter(tag =>
          tag.name ? true : false,
        )
      : [];

    const create_or_update = props.match.params.id
      ? props.update_project
      : props.create_project;

    return create_or_update({
      ...props.values,
      materials_used,
      tags,
      id: props.match.params.id,
      token: props.auth.token,
      images: state.image_upload.uploaded_images_url,
      video: props.values.video ? props.values.video : '',
      category: props.values.category,
      t: props.t,
    }).catch(error => {
      const messages = JSON.parse(error.message);
      if (typeof messages === 'object') {
        const server_errors = {};
        Object.keys(messages).forEach(key => {
          if (key === 'non_field_errors') {
            server_errors['non_field_errors'] = messages[key][0];
          } else {
            server_errors[key] = messages[key][0];
          }
        });
        props.setStatus({ ...server_errors });
      } else {
        props.setStatus({
          non_field_errors: props.t('createProject.errors.unexpected'),
        });
      }
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
      props.setFieldTouched('category');
      props.setFieldTouched('tags');

      image_field_touched = true;
      video_field_touched = true;

      props.validateForm().then(errors => {
        if (
          Object.keys(errors).length > 0 &&
          !(Object.keys(errors).length === 2) &&
          !(errors['project_images'] === 'imageOrVideo') &&
          state.image_upload.uploaded_images_url.length === 0
        ) {
          return;
        } else if (refs.imageEl.current.files.length === 0) {
          upload_project();
        } else {
          const { image_upload } = state;
          image_upload.upload_dialog = true;
          image_upload.upload_percent = 0;
          handleSetState({ image_upload });

          for (
            let index = 0;
            index < image_upload.images_to_upload.length;
            index++
          ) {
            upload(image_upload.images_to_upload[index]);
          }
        }
      });
    }
  };

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    desc_tool_tip_open,
    image_upload,
    categories,
    tag_suggestion,
    tag_suggestion_open,
  } = state;
  const { t } = props;
  const id = props.match.params.id;
  if (!props.auth.token) {
    return <ErrorPage error={t('createProject.errors.notLoggedIn')} />;
  } else {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
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
                    {!id
                      ? t('createProject.welcomeMsg.primary')
                      : t('createProject.inputs.edit')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    className={classes.descStyle}
                  >
                    {t('createProject.welcomeMsg.secondary')}
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box
                        component="p"
                        className={
                          props.status &&
                          props.status['non_field_errors'] &&
                          classes.errorBox
                        }
                      >
                        {props.status && props.status['non_field_errors'] && (
                          <Box component="span" className={classes.error}>
                            {props.status['non_field_errors']}
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} className={commonClasses.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={
                          (props.status && props.status['title']) ||
                          (props.touched['title'] && props.errors['title'])
                        }
                      >
                        <label htmlFor="title">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              classes.customLabelStyle,
                              commonClasses.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>1</Box>
                            {t('createProject.inputs.title.label')}
                          </Typography>
                        </label>
                        <OutlinedInput
                          ref={refs.titleEl}
                          className={classes.customInputStyle}
                          id="title"
                          name="title"
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        />
                        <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['title']) ||
                            (props.touched['title'] &&
                              props.errors['title'] &&
                              t(
                                `createProject.inputs.title.errors.${props.errors['title']}`,
                              ))}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className={commonClasses.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={
                          (props.status && props.status['description']) ||
                          (props.touched['description'] &&
                            props.errors['description'])
                        }
                      >
                        <label htmlFor="description">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              classes.customLabelStyle,
                              commonClasses.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>2</Box>
                            {t('createProject.inputs.description.label')}
                          </Typography>
                        </label>
                        <ClickAwayListener
                          onClickAway={() =>
                            handleSetState(handleDescTooltipClose())
                          }
                        >
                          <Tooltip
                            placement="bottom-end"
                            PopperProps={{
                              disablePortal: true,
                            }}
                            onClose={() =>
                              handleSetState(handleDescTooltipClose())
                            }
                            open={desc_tool_tip_open}
                            disableFocusListener
                            disableHoverListener
                            title={t(
                              'createProject.inputs.description.helperText',
                            )}
                          >
                            <HelpIcon
                              className={classes.questionIconStyle}
                              onClick={() =>
                                handleSetState(handleDescTooltipOpen())
                              }
                            />
                          </Tooltip>
                        </ClickAwayListener>
                        <OutlinedInput
                          ref={refs.descEl}
                          className={classes.customInputStyle}
                          id="description"
                          name="description"
                          type="text"
                          multiline
                          rows={6}
                          rowsMax={6}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        />
                        <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['description']) ||
                            (props.touched['description'] &&
                              props.errors['description'] &&
                              t(
                                `createProject.inputs.description.errors.${props.errors['description']}`,
                              ))}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className={commonClasses.marginTop1em}>
                      <FormControl
                        fullWidth
                        error={
                          (props.status && props.status['project_images']) ||
                          (props.touched['project_images'] &&
                            props.errors['project_images'])
                        }
                      >
                        <label htmlFor="project_images">
                          <Typography
                            color="textSecondary"
                            className={classes.customLabelStyle}
                          >
                            <Box className={classes.fieldNumberStyle}>3</Box>
                            {t('createProject.inputs.projectImages.label')}
                          </Typography>
                        </label>

                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            commonClasses.marginBottom1em,
                          )}
                        >
                          {t(
                            'createProject.inputs.projectImages.topHelperText',
                          )}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6} md={6}>
                            <CustomButton
                              ref={refs.imageUploadButtonEl}
                              variant="outlined"
                              size="large"
                              margin="normal"
                              id="image_upload_button"
                              startIcon={<ImageIcon />}
                              onClick={e =>
                                handleImageButtonClick(e, props, refs)
                              }
                              secondaryButtonStyle
                              imageUploadButtonStyle
                              customButtonStyle
                              fullWidth
                            >
                              {t('createProject.inputs.projectImages.label2')}
                            </CustomButton>
                            <Typography
                              color="textSecondary"
                              variant="caption"
                              component="span"
                              ref={refs.imageCountEl}
                            ></Typography>
                          </Grid>
                        </Grid>
                        <input
                          ref={refs.imageEl}
                          className={classes.displayNone}
                          aria-hidden="true"
                          type="file"
                          accept="image/*"
                          id="project_images"
                          name="project_images"
                          multiple
                          onChange={e =>
                            handleImageFieldChange(
                              refs,
                              props,
                              state,
                              handleSetState,
                            )
                          }
                          onBlur={props.handleBlur}
                        />
                        <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['project_images']) ||
                            (props.errors['project_images'] &&
                              t(
                                `createProject.inputs.projectImages.errors.${props.errors['project_images']}`,
                              ))}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className={commonClasses.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={
                          (props.status && props.status['video']) ||
                          (props.touched['video'] && props.errors['video'])
                        }
                      >
                        <label htmlFor="video">
                          <Typography
                            color="textSecondary"
                            className={classes.customLabelStyle}
                          >
                            <Box className={classes.fieldNumberStyle}>4</Box>
                            {t('createProject.inputs.video.label')}
                          </Typography>
                        </label>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            commonClasses.marginBottom1em,
                          )}
                        >
                          {t('createProject.inputs.video.topHelperText')}
                        </Typography>
                        <OutlinedInput
                          ref={refs.videoEl}
                          className={clsx(
                            classes.customInputStyle,
                            classes.staticLabelInputStyle,
                          )}
                          id="video"
                          name="video"
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          labelWidth={90}
                        />
                        <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['video']) ||
                            (props.touched['video'] &&
                              props.errors['video'] &&
                              t(
                                `createProject.inputs.video.errors.${props.errors['video']}`,
                              ))}
                        </FormHelperText>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={classes.fieldHelperTextStyle}
                        >
                          {t('createProject.inputs.video.bottomHelperText')}
                        </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className={commonClasses.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={
                          (props.status && props.status['materials_used']) ||
                          (props.touched['materials_used'] &&
                            props.errors['materials_used'])
                        }
                      >
                        <label htmlFor="add_materials_used">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              classes.customLabelStyle,
                              commonClasses.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>5</Box>
                            {t('createProject.inputs.materialsUsed.label')}
                          </Typography>
                        </label>

                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item xs={12} sm={8}>
                            <Box ref={refs.addMaterialsUsedEl}>
                              {buildMaterialUsedNodes({
                                props,
                                refs,
                                classes,
                                commonClasses,
                              })}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4} md={4}>
                            <CustomButton
                              variant="outlined"
                              size="large"
                              onClick={e => addMaterialsUsedNode(e, props)}
                              secondaryButtonStyle
                              customButtonStyle
                              fullWidth
                            >
                              <AddIcon />{' '}
                              {t('createProject.inputs.materialsUsed.addMore')}
                            </CustomButton>
                          </Grid>
                          <FormHelperText
                            error
                            className={classes.fieldHelperTextStyle}
                          >
                            {(props.status && props.status['materials_used']) ||
                              (props.touched['materials_used'] &&
                                props.errors['materials_used'] &&
                                t(
                                  `createProject.inputs.materialsUsed.errors.${props.errors['materials_used']}`,
                                ))}
                          </FormHelperText>
                        </Grid>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className={commonClasses.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={
                          (props.status && props.status['category']) ||
                          (props.touched['category'] &&
                            props.errors['category'])
                        }
                      >
                        <label htmlFor="category">
                          <Typography
                            color="textSecondary"
                            className={classes.customLabelStyle}
                          >
                            <Box className={classes.fieldNumberStyle}>6</Box>
                            {t('createProject.inputs.category.label')}
                          </Typography>
                        </label>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            commonClasses.marginBottom1em,
                          )}
                        >
                          {t('createProject.inputs.category.topHelperText')}
                        </Typography>
                        <Select
                          labelId="category"
                          id="category"
                          name="category"
                          className={classes.customInputStyle}
                          value={
                            props.values.category ? props.values.category : ''
                          }
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          label="Category"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {Array.isArray(categories) &&
                            categories.map(category => (
                              <MenuItem key={category.id} value={category.name}>
                                {category.name}
                              </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['category']) ||
                            (props.touched['category'] &&
                              props.errors['category'] &&
                              t(
                                `createProject.inputs.category.errors.${props.errors['category']}`,
                              ))}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className={commonClasses.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={
                          (props.status && props.status['tags']) ||
                          (props.touched['tags'] && props.errors['tags'])
                        }
                      >
                        <label htmlFor="add_tags">
                          <Typography
                            color="textSecondary"
                            className={classes.customLabelStyle}
                          >
                            <Box className={classes.fieldNumberStyle}>7</Box>
                            {t('createProject.inputs.tags.label')}
                          </Typography>
                        </label>

                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            commonClasses.marginBottom1em,
                          )}
                        >
                          {t('createProject.inputs.tags.topHelperText')}
                        </Typography>
                        <Box className={classes.tagsViewStyle}>
                          {props.values['tags'] &&
                            JSON.parse(props.values['tags']).map((tag, num) =>
                              tag && tag.name ? (
                                <Chip
                                  className={classes.customChipStyle}
                                  key={num}
                                  label={tag.name}
                                  onDelete={e => removeTag(e, props, tag.name)}
                                  color="secondary"
                                  variant="outlined"
                                />
                              ) : null,
                            )}
                          <input
                            ref={refs.addTagsEl}
                            className={classes.tagsInputStyle}
                            name="tags"
                            type="text"
                            autocomplete="off"
                            placeholder={
                              props.values['tags'] &&
                              JSON.parse(props.values['tags']).length >= 5
                                ? t(
                                    'createProject.inputs.tags.errors.limitReached',
                                  )
                                : `${t('createProject.inputs.tags.addTag')}...`
                            }
                            onChange={e => {
                              handleSuggestTags(
                                e,
                                props,
                                state,
                                handleSetState,
                              );
                              handleSetState(handleAddTags(e, props));
                            }}
                            onBlur={e => {
                              handleAddTags(e, props);
                            }}
                          />
                          <ClickAwayListener
                            onClickAway={() =>
                              handleSetState({
                                tag_suggestion_open: false,
                                tag_suggestion: [],
                              })
                            }
                          >
                            <Box
                              className={clsx(
                                classes.tagSuggestionStyle,
                                !tag_suggestion_open
                                  ? commonClasses.displayNone
                                  : null,
                              )}
                            >
                              {tag_suggestion && tag_suggestion.length > 0 ? (
                                tag_suggestion.map((tag, index) => (
                                  <Typography
                                    key={index}
                                    color="textPrimary"
                                    className={classes.tagSuggestionTextStyle}
                                    onClick={() => {
                                      clearTimeout(timer.id);
                                      handleSetState(
                                        handleAddTags(
                                          {
                                            currentTarget: {
                                              value: `${tag.name},`,
                                            },
                                          },
                                          props,
                                          refs.addTagsEl,
                                        ),
                                      );
                                    }}
                                  >
                                    {tag.name}
                                  </Typography>
                                ))
                              ) : (
                                <CircularProgress size={30} thickness={3} />
                              )}
                            </Box>
                          </ClickAwayListener>
                        </Box>
                        <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['tags']) ||
                            (props.touched['tags'] &&
                              props.errors['tags'] &&
                              t(
                                `createProject.inputs.tags.errors.${props.errors['tags']}`,
                              ))}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <CustomButton
                        variant="contained"
                        size="large"
                        type="submit"
                        primaryButtonStyle
                        customButtonStyle
                        fullWidth
                      >
                        {!id
                          ? t('createProject.inputs.submit')
                          : t('createProject.inputs.edit')}
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
  get_project: PropTypes.func.isRequired,
  get_categories: PropTypes.func.isRequired,
  suggest_tags: PropTypes.func.isRequired,
  create_project: PropTypes.func.isRequired,
  update_project: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    get_project: values => {
      return dispatch(ProjectActions.get_project(values));
    },
    get_categories: values => {
      return dispatch(ProjectActions.get_categories(values));
    },
    suggest_tags: args => {
      return dispatch(ProjectActions.suggest_tags(args));
    },
    create_project: props => {
      return dispatch(ProjectActions.create_project(props));
    },
    update_project: props => {
      return dispatch(ProjectActions.update_project(props));
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
      title: Yup.string().max(100, 'max').required('required'),
      description: Yup.string().max(10000, 'max').required('required'),
      project_images: Yup.mixed()
        .test('image_is_empty', 'imageOrVideo', function (value) {
          return image_field_touched && !value && !this.parent.video
            ? false
            : true;
        })
        .test('not_an_image', 'onlyImages', value => {
          if (value) {
            let not_an_image = false;
            for (let index = 0; index < value.files.length; index++) {
              if (value.files[index].type.split('/')[0] !== 'image') {
                not_an_image = true;
              }
            }
            return not_an_image ? false : true;
          } else {
            return true;
          }
        })
        .test('too_many_images', 'tooManyImages', value => {
          if (value) {
            return value.files.length > 10 ? false : true;
          } else {
            return true;
          }
        })
        .test('image_size_too_large', 'imageSizeTooLarge', value => {
          if (value) {
            let image_size_too_large = false;
            for (let index = 0; index < value.files.length; index++) {
              if (value.files[index].size / 1000 > 10240) {
                image_size_too_large = true;
              }
            }
            return image_size_too_large ? false : true;
          } else {
            return true;
          }
        }),
      video: Yup.string()
        .url('shouldBeVideoUrl')
        .max(1000, 'max')
        .test('video_is_empty', 'imageOrVideo', function (value) {
          return video_field_touched && !value && !this.parent.project_images
            ? false
            : true;
        }),
      materials_used: Yup.string()
        .max(10000, 'max')
        .test('empty', 'required', value => {
          let is_empty = true;

          value &&
            value.split(',').forEach(material => {
              if (material) {
                is_empty = false;
              }
            });

          return !is_empty;
        }),
      category: Yup.string().min(1, 'min'),
      tags: Yup.mixed().test('unsupported', 'unsupported', tags => {
        if (tags) {
          tags = JSON.parse(tags);
          const re = /^[0-9A-Za-z\s\-]+$/;
          let unsupported = false;
          for (let tag of tags) {
            if (!re.test(tag.name)) {
              unsupported = true;
            }
          }
          return unsupported ? false : true;
        } else {
          return true;
        }
      }),
    }),
  })(CreateProject),
);
