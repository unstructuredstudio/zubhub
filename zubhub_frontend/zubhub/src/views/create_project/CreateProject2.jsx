import { Box, CircularProgress, FormControl, Grid, Link, TextField, Typography, makeStyles } from '@material-ui/core';
import { ArrowBackIosRounded, ArrowForwardIosRounded, CloudDoneOutlined } from '@material-ui/icons';
import DoneRounded from '@material-ui/icons/DoneRounded';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import StepWizard from 'react-step-wizard';
import * as Yup from 'yup';
import styles from '../../assets/js/styles';
import { Dropdown, Editor, ImageInput, TagsInput, VideoInput } from '../../components';
import CustomButton from '../../components/button/Button';
import { createProjectStyle } from './createProject.style';
import { searchTags } from './createProjectScripts';
import { useDomElementHeight } from '../../hooks/useDomElementHeight.hook';

const DRAFT_STATUSES = { saved: 'SAVED', saving: 'SAVING', idle: 'IDLE' };
const steps = ['Project Details', 'Add Photos/Videos', 'Project Features'];

export default function CreateProject2() {
  const [draftStatus, setDraftStatus] = useState(DRAFT_STATUSES.saved);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setcompletedSteps] = useState([]);
  const { height } = useDomElementHeight('navbar-root');
  const wizard = useRef(null);
  const classes = makeStyles(createProjectStyle)({ height });
  const commonClasses = makeStyles(styles)();

  const isActive = index => index + 1 === activeStep;
  const isCompleted = index => completedSteps.includes(index + 1);

  const draftContainerText = () => {
    if (draftStatus === DRAFT_STATUSES.idle) return 'Draft';
    if (draftStatus === DRAFT_STATUSES.saving) return 'Saving to draft';
    if (draftStatus === DRAFT_STATUSES.saved) return 'Saved to draft';
  };

  const next = () => {
    // formik.handleSubmit();
    go('next');
    console.log(formik.values);
    console.log(formik.errors);
  };

  const previous = () => go('prev');

  const go = direction => {
    if (direction === 'next') {
      if (activeStep !== 3) {
        wizard.current.nextStep();
        let completedStepsTemp = [...new Set([...completedSteps, activeStep])];
        setcompletedSteps(completedStepsTemp);
        setActiveStep(step => step + 1);
      }
    }
    if (direction === 'prev') {
      if (activeStep !== 1) {
        wizard.current.previousStep();
        setActiveStep(step => step - 1);
      }
    }
  };

  const renderSteps = steps.map((label, index) => (
    <Box
      key={index}
      className={clsx(classes.stepperLine, (isActive(index) || isCompleted(index)) && classes.activeStep)}
    >
      <Box className={clsx(classes.stepBall, (isActive(index) || isCompleted(index)) && classes.activeStep)}>
        {isCompleted(index) && !isActive(index) ? (
          <DoneRounded style={{ fontSize: 14 }} />
        ) : (
          <Typography style={{ fontWeight: '600' }}>{index + 1}</Typography>
        )}
      </Box>
      <Typography className={clsx(classes.stepLabel, (isActive(index) || isCompleted(index)) && classes.activeLabel)}>
        {label}
      </Typography>
    </Box>
  ));

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      materials_used: [],
      video: [],
      images: [],
      video_link: '',
      hashtags: '',
      categories: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Please add a name for your project'),
      description: Yup.string().required('Please add a description'),
      materials_used: Yup.array().required('Please add the materials you used'),
    }),
    onSubmit: values => {
      console.log(values); // Perform form submission or further processing
    },
  });
  console.log(height);

  return (
    <div className={classes.container}>
      {/* Banner */}
      <Box className={classes.banner}>
        <KeyboardBackspaceRoundedIcon />
        <CustomButton className={classes.previewButton} variant="outlined">
          Preview
        </CustomButton>
        <Box className={clsx(classes.draft, draftStatus === DRAFT_STATUSES.saved && classes.savedToDraft)}>
          {draftStatus === DRAFT_STATUSES.saving ? <CircularProgress size={20} color={'inherit'} /> : null}
          {draftStatus === DRAFT_STATUSES.saved ? <CloudDoneOutlined size={20} color={'inherit'} /> : null}

          <Link className={classes.linkToDraft} href="#">
            <Typography>{draftContainerText()}</Typography>
          </Link>
        </Box>
      </Box>

      {/* Form */}
      <Box className={classes.formContainer}>
        <Grid item md={12} lg={8}>
          <Typography className={clsx(commonClasses.title1)}>Create Project</Typography>
          <Typography className={clsx()}>Tell us about your amazing project !</Typography>

          {/* Step Navigation UI */}
          <Box className={classes.stepperContainer}>{renderSteps}</Box>

          <Box style={{ marginTop: 100 }}>
            <StepWizard initialStep={activeStep} ref={wizard}>
              <Step1 formik={formik} />
              <Step2 formik={formik} />
              <Step3 formik={formik} />
            </StepWizard>
          </Box>
        </Grid>

        {/* Previous and Next buttons */}
        <Box className={classes.buttonGroup}>
          <CustomButton
            onClick={previous}
            primaryButtonOutlinedStyle
            startIcon={<ArrowBackIosRounded className={classes.nextButton} />}
          >
            Previous
          </CustomButton>

          <CustomButton
            onClick={next}
            primaryButtonStyle
            style={{ marginLeft: 'auto' }}
            endIcon={<ArrowForwardIosRounded className={classes.nextButton} />}
          >
            Next
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
}

const Step1 = ({ formik }) => {
  const commonClasses = makeStyles(styles)();
  const [value, setValue] = useState('');
  const [remoteTags, setRemoteTags] = useState([]);
  const [popularTags, setPopularTags] = useState(['Glue', 'Water', 'Battery', 'Masuring tape']);

  const clearSuggestions = () => setRemoteTags([]);

  const handleChange = async value => {
    setValue(value);
    searchTags(value, (error, data) => {
      if (!error) setRemoteTags(data);
    });
  };

  const addTag = value => {
    const values = [...formik.values.materials_used, value];
    formik.setFieldValue('materials_used', values);
    clearSuggestions();
    setValue('');
  };

  const removeTag = tagIndex => {
    const tags = [...formik.values.materials_used].filter((_, index) => index !== tagIndex);
    formik.setFieldValue('materials_used', tags);
  };

  let quillRef = null;

  return (
    <div>
      <Editor />
      <Box marginY={6}>
        <FormControl fullWidth>
          <label className={commonClasses.title2}>
            Name your project <span className={commonClasses.colorRed}>*</span>
          </label>
          <TextField
            variant="outlined"
            name="title"
            placeholder="Choose a name that best suites your project i.e Fun with Science"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? true : false}
            helperText={formik.touched.title && formik.errors.title}
          />
        </FormControl>
      </Box>

      <Box marginTop={3} marginBottom={3}>
        <FormControl fullWidth>
          <label className={commonClasses.title2}>
            Share a few things about your Project <span className={commonClasses.colorRed}>*</span>
          </label>
          <TextField
            variant="outlined"
            name="description"
            multiline
            minRows={4}
            placeholder="Choose a name that best suites your project i.e Fun with Science"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description ? true : false}
            helperText={formik.touched.description && formik.errors.description}
          />
        </FormControl>
      </Box>

      <Box marginTop={6} marginBottom={1}>
        <TagsInput
          required
          name="materials_used"
          label="What materials did you use?"
          description="Include the materials you used for your project, this could be measuring tapes, pencils, etc"
          selectedTags={formik.values.materials_used}
          error={formik.errors.materials_used}
          popularTags={popularTags}
          onChange={handleChange}
          addTag={addTag}
          value={value}
          remoteData={remoteTags}
          clearSuggestions={clearSuggestions}
          removeTag={removeTag}
          placeholder="Start typing to materials used"
        />
      </Box>
    </div>
  );
};

const Step2 = ({ formik }) => {
  const handleImageChange = imgs => {
    formik.setFieldValue('images', imgs);
  };

  const handleVideoChange = (vids, link) => {
    if (!link) {
      formik.setFieldValue('video', vids);
      return;
    }
    formik.setFieldValue('video_link', link);
  };

  return (
    <>
      <ImageInput
        name="images"
        value={formik.values.images}
        handleChange={handleImageChange}
        label="Add some photos"
        required
      />
      <VideoInput
        name="videos"
        value={formik.values.video}
        linkValue={formik.values.videoLink}
        handleChange={handleVideoChange}
        label="Add some videos"
        required
        acceptLink
      />
    </>
  );
};

const Step3 = ({ formik }) => {
  const handleChange = data => {
    console.log(data);
  };

  const commonClasses = makeStyles(styles)();
  const [value, setValue] = useState('');
  const [remoteTags, setRemoteTags] = useState([]);
  const [popularTags, setPopularTags] = useState([
    '#Clothing',
    '#Animation',
    '#Painting',
    '#Science & Technology',
    '#Mechanics',
    '#Music',
    '#General',
  ]);

  const data = [
    { label: 'Yaya', value: 'yaya' },
    { label: 'Mamoudou', value: 'mamoudou' },
  ];

  const clearSuggestions = () => setRemoteTags([]);

  const handleChangeTag = async value => {
    setValue(value);
    searchTags(value, (error, data) => {
      if (!error) setRemoteTags(data);
    });
  };

  const addTag = value => {
    const values = [...formik.values.hashtags, value];
    formik.setFieldValue('hashtags', values);
    clearSuggestions();
    setValue('');
  };

  const removeTag = tagIndex => {
    const tags = [...formik.values.hashtags].filter((_, index) => index !== tagIndex);
    formik.setFieldValue('hashtags', tags);
  };

  return (
    <>
      <Dropdown
        label="What category does your project belong too?"
        placeholder="Select Categories"
        handleChange={handleChange}
        data={data}
        description="Select any of the categories that best describe your project. Select none of you are unsure about your category."
        required
      />

      <Box marginTop={6} marginBottom={1}>
        <TagsInput
          required
          label="What hashtag best describes your project?"
          description="For example, if you made flower from cardboard, you can write: cardboard, flowers, colours or leave it blank if you’re unsure."
          selectedTags={formik.values.hashtags}
          popularTags={popularTags}
          onChange={handleChangeTag}
          addTag={addTag}
          value={value}
          remoteData={remoteTags}
          clearSuggestions={clearSuggestions}
          removeTag={removeTag}
          placeholder="Start typing to materials used"
        />
      </Box>
    </>
  );
};
