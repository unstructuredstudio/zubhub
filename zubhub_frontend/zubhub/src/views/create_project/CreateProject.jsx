import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@material-ui/icons/Image';
import VideoIcon from '@material-ui/icons/Movie';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import MovieIcon from '@material-ui/icons/Movie';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
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
  InputLabel,
  ClickAwayListener,
} from '@material-ui/core';

import {
  vars,
  validationSchema,
  getCategories,
  initUpload,
  getProject,
  handleImageFieldChange,
  handleVideoSelectDone,
  handleVideoFieldCancel,
  handleVideoFieldChange,
  handleTextFieldChange,
  handleTextFieldBlur,
  handleDescFieldChange,
  handleDescFieldFocusChange,
  handleMaterialsUsedFieldBlur,
  handleImageButtonClick,
  handleVideoButtonClick,
  handleAddMaterialFieldChange,
  addMaterialsUsedNode,
  removeTag,
  handleAddTags,
  handleSuggestTags,
  buildPublishTypes,
  handleRemovePublishVisibleTo,
  handleAddPublishVisibleTo,
  handleSuggestPublishVisibleTo,
  handlePublishFieldChange,
  handlePublishFieldBlur,
  checkMediaFilesErrorState,
  handleSelectVideoFileChecked,
} from './createProjectScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import * as UserActions from '../../store/actions/userActions';
import * as AuthActions from '../../store/actions/authActions';
import ErrorPage from '../error/ErrorPage';
import { calculateLabelWidth } from '../../assets/js/utils/scripts';
import { publish_type } from '../../assets/js/utils/constants';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/create_project/createProjectStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function buildMaterialUsedNodes
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const buildMaterialUsedNodes = ({ props, refs, classes, common_classes }) => {
  if (props.values['materials_used']) {
    return props.values['materials_used']
      .split(',')
      .map((material, index) => (
        <OutlinedInput
          key={index}
          className={clsx(
            classes.customInputStyle,
            common_classes.marginTop1em,
          )}
          type="text"
          onBlur={() => handleMaterialsUsedFieldBlur(props)}
          onChange={e => handleAddMaterialFieldChange(e, props, refs)}
          value={material}
          placeholder={`${index + 1}.`}
        />
      ));
  } else {
    return ['', '', ''].map((_, index) => (
      <OutlinedInput
        key={index}
        className={clsx(classes.customInputStyle, common_classes.marginTop1em)}
        type="text"
        onBlur={() => props.setFieldTouched('materials_used', true)}
        onChange={e => handleAddMaterialFieldChange(e, props, refs)}
        placeholder={`${index + 1}.`}
      />
    ));
  }
};

/**
 * @function CreateProject View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function CreateProject(props) {
  const [category, setCategory] = React.useState([]);
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const refs = {
    title_el: React.useRef(null),
    desc_el: React.useRef(null),
    image_el: React.useRef(null),
    image_upload_button_el: React.useRef(null),
    video_upload_button_el: React.useRef(null),
    image_count_el: React.useRef(null),
    video_el: React.useRef(null),
    video_file_el: React.useRef(null),
    video_selection_feedback_el: React.useRef(null),
    add_materials_used_el: React.useRef(null),
    add_tags_el: React.useRef(null),
    publish_type_el: React.useRef(null),
    publish_visible_to_el: React.useRef(null),
  };

  const [state, setState] = React.useState({
    ...JSON.parse(JSON.stringify(vars.default_state)),
  });

  React.useEffect(() => {
    if (props.match.params.id) {
      Promise.all([getProject(refs, props, state), getCategories(props)]).then(
        result => handleSetState({ ...result[0], ...result[1] }),
      );
    } else {
      handleSetState(getCategories(props));
    }
    handleSetState(buildPublishTypes(props));
  }, []);

  React.useEffect(() => {
    checkMediaFilesErrorState(refs, props);
  }, [
    props.errors['project_images'],
    props.touched['project_images'],
    props.errors['video'],
    props.touched['video'],
  ]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    desc_input_is_focused,
    video_upload_dialog_open,
    media_upload,
    categories,
    tag_suggestion,
    tag_suggestion_open,
    select_video_file,
    publish_types,
    publish_visible_to_suggestion_open,
    publish_visible_to_suggestion,
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
                  onSubmit={e =>
                    !vars.upload_in_progress
                      ? initUpload(e, state, props, handleSetState)
                      : e.preventDefault()
                  }
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

                    <Grid item xs={12} className={common_classes.marginTop1em}>
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
                              common_classes.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>1</Box>
                            {t('createProject.inputs.title.label')}
                          </Typography>
                        </label>
                        <OutlinedInput
                          ref={refs.title_el}
                          className={classes.customInputStyle}
                          id="title"
                          name="title"
                          type="text"
                          onChange={e => handleTextFieldChange(e, props)}
                          onBlur={e => handleTextFieldBlur(e, props)}
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

                    <Grid item xs={12} className={common_classes.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                      >
                        <label htmlFor="description">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              classes.customLabelStyle,
                              common_classes.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>2</Box>
                            {t('createProject.inputs.description.label')}
                          </Typography>
                        </label>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            common_classes.marginBottom1em,
                          )}
                        >
                          {t('createProject.inputs.description.helperText')}
                        </Typography>
                        <ClickAwayListener
                          onClickAway={() =>
                            handleSetState({ desc_input_is_focused: false })
                          }
                        >
                          <ReactQuill
                            ref={refs.desc_el}
                            className={clsx(
                              classes.descInputStyle,
                              {
                                [classes.descInputFocusStyle]:
                                  desc_input_is_focused,
                              },
                              {
                                [classes.descInputErrorStyle]:
                                  (props.status &&
                                    props.status['description']) ||
                                  (props.touched['description'] &&
                                    props.errors['description']),
                              },
                            )}
                            modules={vars.quill.modules}
                            formats={vars.quill.formats}
                            defaultValue={''}
                            placeholder={t(
                              'createProject.inputs.description.placeholder',
                            )}
                            onChange={value =>
                              handleDescFieldChange(
                                value,
                                props,
                                handleSetState,
                              )
                            }
                            onFocus={() =>
                              handleDescFieldFocusChange(
                                null,
                                props,
                                handleSetState,
                              )
                            }
                          />
                        </ClickAwayListener>
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

                    <Grid item xs={12} className={common_classes.marginTop1em}>
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
                            common_classes.marginBottom1em,
                          )}
                        >
                          {t(
                            'createProject.inputs.projectImages.topHelperText',
                          )}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6} md={6}>
                            <CustomButton
                              ref={refs.image_upload_button_el}
                              variant="outlined"
                              size="large"
                              margin="normal"
                              id="image_upload_button"
                              startIcon={<ImageIcon />}
                              onClick={e =>
                                handleImageButtonClick(e, props, refs)
                              }
                              secondaryButtonStyle
                              mediaUploadButtonStyle
                              customButtonStyle
                              fullWidth
                            >
                              {t('createProject.inputs.projectImages.label2')}
                            </CustomButton>
                            <Typography
                              color="textSecondary"
                              variant="caption"
                              component="span"
                              ref={refs.image_count_el}
                            ></Typography>
                          </Grid>
                        </Grid>
                        <input
                          ref={refs.image_el}
                          className={classes.displayNone}
                          aria-hidden="true"
                          type="file"
                          accept="image/*"
                          id="project_images"
                          name="project_images"
                          multiple
                          onChange={_ =>
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
                          {(props.status && props.status['images']) ||
                            (props.errors['project_images'] &&
                              t(
                                `createProject.inputs.projectImages.errors.${props.errors['project_images']}`,
                              ))}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className={common_classes.marginTop1em}>
                      <FormControl
                        fullWidth
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
                            common_classes.marginBottom1em,
                          )}
                        >
                          {t('createProject.inputs.video.topHelperText')}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6} md={6}>
                            <CustomButton
                              ref={refs.video_upload_button_el}
                              variant="outlined"
                              size="large"
                              margin="normal"
                              id="video_upload_button"
                              startIcon={<VideoIcon />}
                              onClick={e =>
                                handleSetState(
                                  handleVideoButtonClick(
                                    e,
                                    props,
                                    video_upload_dialog_open,
                                  ),
                                )
                              }
                              secondaryButtonStyle
                              mediaUploadButtonStyle
                              customButtonStyle
                              fullWidth
                            >
                              {t('createProject.inputs.video.label2')}
                            </CustomButton>
                            <Typography
                              color="textSecondary"
                              variant="caption"
                              component="span"
                              ref={refs.video_selection_feedback_el}
                            ></Typography>
                          </Grid>
                        </Grid>
                        <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['video']) ||
                            (props.errors['video'] &&
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

                    <Grid item xs={12} className={common_classes.marginTop1em}>
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
                              common_classes.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>5</Box>
                            {t('createProject.inputs.materialsUsed.label')}
                          </Typography>
                        </label>

                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item xs={12} sm={8}>
                            <Box ref={refs.add_materials_used_el}>
                              {buildMaterialUsedNodes({
                                props,
                                refs,
                                classes,
                                common_classes,
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

                    <Grid item xs={12} className={common_classes.marginTop1em}>
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
<<<<<<< Updated upstream
                            <Box
                              className={classes.fieldNumberStyle}
                              id="sixCenter"
                            >
                              6
                            </Box>
=======
                            <Box className={classes.customBoxStyle}>6</Box>
>>>>>>> Stashed changes
                            {t('createProject.inputs.category.label')}
                          </Typography>
                        </label>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            common_classes.marginBottom1em,
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

                    <Grid item xs={12} className={common_classes.marginTop1em}>
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
                            common_classes.marginBottom1em,
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
                            ref={refs.add_tags_el}
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
                                  ? common_classes.displayNone
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
                                      clearTimeout(vars.timer.id);
                                      handleSetState(
                                        handleAddTags(
                                          {
                                            currentTarget: {
                                              value: `${tag.name},`,
                                            },
                                          },
                                          props,
                                          refs.add_tags_el,
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

                    <Grid item xs={12} className={common_classes.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={
                          (props.status && props.status['publish']) ||
                          (props.touched['publish'] && props.errors['publish'])
                        }
                      >
                        <label htmlFor="publish">
                          <Typography
                            color="textSecondary"
                            className={classes.customLabelStyle}
                          >
<<<<<<< Updated upstream
                            <Box
                              className={classes.fieldNumberStyle}
                              id="eightCenter"
                            >
                              8
                            </Box>
=======
                            <Box className={classes.customBoxStyle}>8</Box>
>>>>>>> Stashed changes
                            {t('createProject.inputs.publish.label')}
                          </Typography>
                        </label>

                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            common_classes.marginBottom1em,
                          )}
                        >
                          {t('createProject.inputs.publish.topHelperText')}
                        </Typography>

                        <Select
                          ref={refs.publish_type_el}
                          labelId="publish"
                          id="publish"
                          name="publish"
                          className={classes.customInputStyle}
                          value={
                            props.values.publish
                              ? props.values.publish.type
                              : publish_types[0]
                              ? publish_types[0].value
                              : ''
                          }
                          onChange={e => handlePublishFieldChange(e, props)}
                          onBlur={e => handlePublishFieldBlur(e, props)}
                        >
                          {publish_types.map(type => (
                            <MenuItem key={type.name} value={type.value}>
                              {t(
                                `createProject.inputs.publish.publishTypes.${type.name}`,
                              )}
                            </MenuItem>
                          ))}
                        </Select>

                        <Box
                          className={clsx(
                            classes.tagsViewStyle,
                            common_classes.marginTop1em,
                            {
                              [common_classes.displayNone]:
                                props.values.publish?.type !==
                                publish_type['Preview'],
                            },
                          )}
                        >
                          {props.values.publish?.visible_to &&
                            props.values['publish']['visible_to'].map(
                              (username, num) =>
                                username ? (
                                  <Chip
                                    className={classes.customChipStyle}
                                    key={num}
                                    label={username}
                                    onDelete={e =>
                                      handleRemovePublishVisibleTo(
                                        e,
                                        props,
                                        username,
                                      )
                                    }
                                    color="secondary"
                                    variant="outlined"
                                  />
                                ) : null,
                            )}
                          <input
                            ref={refs.publish_visible_to_el}
                            className={classes.tagsInputStyle}
                            name="publish_visible_to"
                            type="text"
                            autocomplete="off"
                            placeholder={`${t(
                              'createProject.inputs.publish.addUsernames',
                            )}...`}
                            onChange={e => {
                              handleSuggestPublishVisibleTo(
                                e,
                                props,
                                state,
                                handleSetState,
                              );
                              handleSetState(
                                handleAddPublishVisibleTo(e, props),
                              );
                            }}
                            onBlur={e => {
                              handleAddPublishVisibleTo(e, props);
                            }}
                          />
                          <ClickAwayListener
                            onClickAway={() =>
                              handleSetState({
                                publish_visible_to_suggestion_open: false,
                                publish_visible_to_suggestion: [],
                              })
                            }
                          >
                            <Box
                              className={clsx(
                                classes.tagSuggestionStyle,
                                !publish_visible_to_suggestion_open
                                  ? common_classes.displayNone
                                  : null,
                              )}
                            >
                              {publish_visible_to_suggestion &&
                              publish_visible_to_suggestion.length > 0 ? (
                                publish_visible_to_suggestion.map(
                                  (username, index) => (
                                    <Typography
                                      key={index}
                                      color="textPrimary"
                                      className={classes.tagSuggestionTextStyle}
                                      onClick={() => {
                                        clearTimeout(vars.timer.id);
                                        handleSetState(
                                          handleAddPublishVisibleTo(
                                            {
                                              currentTarget: {
                                                value: `${username},`,
                                              },
                                            },
                                            props,
                                            refs.publish_visible_to_el,
                                          ),
                                        );
                                      }}
                                    >
                                      {username}
                                    </Typography>
                                  ),
                                )
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
                          {(props.status && props.status['publish']) ||
                            (props.touched['publish'] &&
                              props.errors['publish'] &&
                              t(
                                `createProject.inputs.publish.errors.${props.errors['publish']}`,
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

                  <Dialog
                    PaperProps={{
                      style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                      },
                    }}
                    open={video_upload_dialog_open}
                    onClose={async () =>
                      handleSetState({
                        ...(await handleVideoFieldCancel(refs, props, state)),
                        video_upload_dialog_open: false,
                      })
                    }
                    aria-labelledby="video upload dialog"
                  >
                    <Container
                      className={clsx(
                        classes.containerStyle,
                        classes.videoInputDialogContainerStyle,
                      )}
                    >
                      <Card
                        className={clsx(
                          classes.cardStyle,
                          classes.videoInputDialogCardStyle,
                        )}
                      >
                        <CardActionArea>
                          <CardContent>
                            <div
                              className={
                                classes.videoInputDialogControlSectionStyle
                              }
                            >
                              <CustomButton
                                className={
                                  classes.videoInputDialogControlButtonStyle
                                }
                                primaryButtonStyle={!select_video_file}
                                secondaryButtonStyle={select_video_file}
                                size="medium"
                                onClick={_ =>
                                  handleSetState({ select_video_file: false })
                                }
                              >
                                <div
                                  className={
                                    classes.videoInputDialogControlButtonUseTextDescStyle
                                  }
                                >
                                  {t(
                                    'createProject.inputs.video.dialogURLToggle',
                                  )}
                                </div>
                                <InsertLinkIcon
                                  className={
                                    classes.videoInputDialogControlButtonUseIconDescStyle
                                  }
                                />
                              </CustomButton>
                              <CustomButton
                                className={
                                  classes.videoInputDialogControlButtonStyle
                                }
                                primaryButtonStyle={select_video_file}
                                secondaryButtonStyle={!select_video_file}
                                size="medium"
                                onClick={_ =>
                                  handleSetState(
                                    handleSelectVideoFileChecked(
                                      refs.video_file_el.current,
                                    ),
                                  )
                                }
                              >
                                <div
                                  className={
                                    classes.videoInputDialogControlButtonUseTextDescStyle
                                  }
                                >
                                  {t(
                                    'createProject.inputs.video.dialogFileToggle',
                                  )}
                                </div>
                                <MovieIcon
                                  className={
                                    classes.videoInputDialogControlButtonUseIconDescStyle
                                  }
                                />
                              </CustomButton>
                            </div>
                            <Grid container spacing={1} alignItems="flex-end">
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={clsx(
                                  common_classes.marginTop1em,
                                  classes.videoInputDialogBodyGridStyle,
                                )}
                              >
                                {!select_video_file ? (
                                  <FormControl
                                    className={clsx(
                                      classes.margin,
                                      classes.textField,
                                      classes.videoInputDialogURLFormControlStyle,
                                    )}
                                    variant="outlined"
                                    size="small"
                                  >
                                    <InputLabel
                                      className={classes.customLabelStyle}
                                      htmlFor="url-input"
                                    >
                                      {t(
                                        'createProject.inputs.video.dialogURLFieldLabel',
                                      )}
                                    </InputLabel>
                                    <OutlinedInput
                                      ref={refs.video_el}
                                      className={classes.customInputStyle}
                                      type="text"
                                      name="url-input"
                                      labelWidth={calculateLabelWidth(
                                        t(
                                          'createProject.inputs.video.dialogURLFieldLabel',
                                        ),
                                        document,
                                      )}
                                      placeholder="https://youtube.com/..."
                                      onChange={async e =>
                                        handleSetState(
                                          await handleVideoFieldChange(
                                            e,
                                            refs,
                                            props,
                                            state,
                                            handleSetState,
                                          ),
                                        )
                                      }
                                    />
                                  </FormControl>
                                ) : null}
                                {select_video_file ? (
                                  <p className={classes.videoFileName}>
                                    {refs.video_file_el.current?.files?.[0]
                                      ? refs.video_file_el.current?.files?.[0]
                                          ?.name
                                      : t(
                                          'createProject.inputs.video.dialogFileToggle',
                                        )}
                                  </p>
                                ) : null}
                                <CustomButton
                                  className={
                                    classes.videoInputDialogActionButtonStyle
                                  }
                                  secondaryButtonStyle
                                  variant="outlined"
                                  size="medium"
                                  onClick={async () =>
                                    handleSetState({
                                      ...(await handleVideoFieldCancel(
                                        refs,
                                        props,
                                        state,
                                      )),
                                      video_upload_dialog_open: false,
                                    })
                                  }
                                >
                                  <CloseIcon />
                                </CustomButton>

                                <CustomButton
                                  className={
                                    classes.videoInputDialogActionButtonStyle
                                  }
                                  primaryButtonStyle
                                  size="medium"
                                  onClick={async () =>
                                    handleSetState({
                                      ...(await handleVideoSelectDone(
                                        refs,
                                        props,
                                        state,
                                      )),
                                      video_upload_dialog_open: false,
                                    })
                                  }
                                >
                                  <CheckIcon />
                                </CustomButton>

                                <input
                                  className={common_classes.displayNone}
                                  ref={refs.video_file_el}
                                  type="file"
                                  accept="video/*"
                                  id="video"
                                  name="video"
                                  onChange={async e => {
                                    handleSetState(
                                      await handleVideoFieldChange(
                                        e,
                                        refs,
                                        props,
                                        state,
                                        handleSetState,
                                      ),
                                    );
                                  }}
                                  onBlur={props.handleBlur}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Container>
                  </Dialog>
                </form>
                <Dialog
                  PaperProps={{
                    style: {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                    },
                  }}
                  className={classes.uploadProgressDialogStyle}
                  open={media_upload.upload_dialog}
                  aria-labelledby="upload progress dialog"
                >
                  <Box
                    className={classes.uploadProgressIndicatorContainerStyle}
                  >
                    <CircularProgress
                      className={classes.uploadProgressStyle}
                      variant="determinate"
                      size={70}
                      thickness={6}
                      value={media_upload.upload_percent}
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
                        media_upload.upload_percent,
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
  getProject: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  suggestTags: PropTypes.func.isRequired,
  createProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSignature: args => {
      return dispatch(AuthActions.getSignature(args));
    },
    getProject: values => {
      return dispatch(ProjectActions.getProject(values));
    },
    getCategories: values => {
      return dispatch(ProjectActions.getCategories(values));
    },
    suggestTags: args => {
      return dispatch(ProjectActions.suggestTags(args));
    },
    suggestCreators: args => {
      return dispatch(UserActions.suggestCreators(args));
    },
    createProject: props => {
      return dispatch(ProjectActions.createProject(props));
    },
    updateProject: props => {
      return dispatch(ProjectActions.updateProject(props));
    },
    shouldUploadToLocal: args => {
      return dispatch(ProjectActions.shouldUploadToLocal(args));
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
    validationSchema,
  })(CreateProject),
);
