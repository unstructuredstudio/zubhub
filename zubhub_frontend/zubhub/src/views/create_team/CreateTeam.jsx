import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  Typography,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
  CloseOutlined,
  CloudDoneOutlined,
  Person,
} from '@material-ui/icons';
import { useSelector } from 'react-redux';
import DoneRounded from '@material-ui/icons/DoneRounded';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, lazy } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import StepWizard from 'react-step-wizard';
import { toast } from 'react-toastify';
import { colors } from '../../assets/js/colors';
import styles from '../../assets/js/styles';
import Modal from '../../components/modals/Modal';
import CustomButton from '../../components/button/Button';
import { useDomElementHeight } from '../../hooks/userDomElementHeight.hook';
import * as AuthActions from '../../store/actions/authActions';
import * as ProjectActions from '../../store/actions/projectActions';
import * as UserActions from '../../store/actions/userActions';
import { createProjectStyle } from './createTeam.style';
import * as script from './script';
import Step1 from './step1/Step1';
import Step2 from './step2/Step2';
import Step3 from './step3/Step3';
// import { TEAM_ENABLED } from '../../utils.js';

// const PreviewProject = lazy(() => import('../../components/previewProject/PreviewProject'));

const DRAFT_STATUSES = { saved: 'SAVED', saving: 'SAVING', idle: 'IDLE' };
const steps = ['Team Details', 'Add Team Members', 'Select Team Project'];


function CreateTeam(props) {
  const [completedSteps, setcompletedSteps] = useState([]);
  const { height } = useDomElementHeight('navbar-root');
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const wizardRef = useRef(null);
  const classes = makeStyles(createProjectStyle)({ height });
  const commonClasses = makeStyles(styles)();
  const [draftStatus, setDraftStatus] = useState(DRAFT_STATUSES.idle);
  const [activeStep, setActiveStep] = useState(1);
  const [state, setState] = useState({ ...JSON.parse(JSON.stringify(script.vars.default_state)) });
  const [publishOrAddTags, setPublishOrAddTags] = useState(false);
  const [addTagsDialog, setAddTagsDialog] = useState(false);
  const [value, setValue] = useState('');
  const [remoteTags, setRemoteTags] = useState([]);
  const [popularTags, setPopularTags] = useState(script.testTags);
  const [mode, setMode] = useState('');
  const [preview, setPreview] = useState(false);
  // const [selectedProjects, setSelectedProjects] = useState([]);
  let projs;

  const updateSelectedProjects = (newSelectedProjects) => {
    projs=newSelectedProjects;
  };


  const isActive = index => index + 1 === activeStep;
  const isCompleted = index => completedSteps.includes(index + 1);
  const togglePublishOrAddTags = () => {
    formik.values?.tags.length == 0 ? setPublishOrAddTags(!publishOrAddTags) : toggleAddTagsDialog();
  };
  const toggleAddTagsDialog = () => setAddTagsDialog(!addTagsDialog);
  const clearSuggestions = () => setRemoteTags([]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const getToastMessage = () => {
    let message = '';
    if (activeStep === 1 && props.match.path === '/projects/create') {
      message = 'createProject.addedToDraft';
    }
    if ([1, 2].includes(activeStep) && props.match.params.id) {
      message = 'createProject.savedStep';
    }
    if (activeStep === 3 && props.match.params.id) {
      message = 'createProject.createToastSuccess';
    }
    return message;
  };

  useEffect(() => {
    if (props.match.params.id) {
      // Promise.all([script.getProject({ ...props, ...formik }, state), script.getCategories(props)]).then(result =>
      //   handleSetState({ ...result[0], ...result[1] }),
      // );
    } else {
      // handleSetState(script.getCategories(props));
    }
    const params = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(params.entries());
    if ('mode' in queryParams) setMode(queryParams.mode);
  }, []);

  const handleBlur = name => {
    formik.setTouched({ [name]: true }, true);
  };

  useEffect(() => {
    if (state.success) {
      if (props.location.pathname === '/projects/create') props.history.replace(`/projects/${state.id}/edit`);
      toast.success(props.t(getToastMessage()));
      if (activeStep === 3) {
        return props.history.push(`/projects/${props.match.params.id}?success=true`);
      }
      go('next');
    }
  }, [state.success]);

  const togglePreview = () => setPreview(!preview);

  useEffect(() => {
    if (state.default_state?.loading) {
      setDraftStatus(DRAFT_STATUSES.saving);
    } else {
      setDraftStatus(DRAFT_STATUSES.saved);
    }
  }, [state.default_state?.loading]);

  const draftContainerText = () => {
    if (draftStatus === DRAFT_STATUSES.idle) return 'Draft';
    if (draftStatus === DRAFT_STATUSES.saving) return !isSmallScreen ? 'Saving to draft' : 'Saving...';
    if (draftStatus === DRAFT_STATUSES.saved) return !isSmallScreen ? 'Saved to draft' : '';
  };

  const formik = useFormik(script.formikSchema);

  const previous = () => go('prev');
  const next = async () => {
    go('next');
  };

  const handleAddTags = () => {
    togglePublishOrAddTags();
    toggleAddTagsDialog();
  };
  const history = useHistory();

  const submitData = async () => {
    try {
      if (!script.vars.upload_in_progress) {
        const uploadStatus = await script.initUpload(state, { ...props, ...formik, step: activeStep }, handleSetState, projs);
  
        if (uploadStatus === 'success') {
          // Redirect to the desired URL on success
          const teamGroupName = formik.values.groupname; // Get the groupname from props
          history.push(`/teams/${teamGroupName}`);
        } else if (uploadStatus === 'authError') {
          // Redirect to login page or handle authentication error
          // You might want to define a function for handling auth errors
          // handleAuthError();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkErrors = () => {
    if (activeStep === 1) {
      return formik.setTouched({ title: true, bio: true }, true);
    }

    if (activeStep === 2) {
      return formik.setTouched({ admins: true, members: true }, true);
    }

    if (activeStep === 3) {
      return formik.setTouched({ selectedProjects: true }, true);
    }
  };

  const go = direction => {
    if (direction === 'next') {
      if (activeStep !== 3) {
        wizardRef.current.nextStep();
        let completedStepsTemp = [...new Set([...completedSteps, activeStep])];
        setcompletedSteps(completedStepsTemp);
        setActiveStep(step => step + 1);
      }
    }
    if (direction === 'prev') {
      if (activeStep !== 1) {
        wizardRef.current.previousStep();
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

  // if (TEAM_ENABLED) {
  //   if (!['team', 'personal'].includes(mode)) {
  //     return <SelectModeUI setMode={mode => setMode(mode)} />;
  //   }

  //   if (mode.length == 0) return null;
  // }

  return (
    <div className={classes.container}>
      <Dialog open={preview} fullScreen>
        {/* <PreviewProject {...props} onClose={togglePreview} /> */}
      </Dialog>
      {/* Banner */}
      <Box className={classes.banner}>
        <KeyboardBackspaceRoundedIcon />
        {props.match.params.id && (
          <>
            <CustomButton onClick={togglePreview} className={classes.previewButton} variant="outlined">
              Preview
            </CustomButton>
            <Box className={clsx(classes.draft, draftStatus === DRAFT_STATUSES.saved && classes.savedToDraft)}>
              {draftStatus === DRAFT_STATUSES.saving ? <CircularProgress size={20} color="inherit" /> : null}
              {draftStatus === DRAFT_STATUSES.saved ? <CloudDoneOutlined size={20} color="inherit" /> : null}

              <Link className={classes.linkToDraft} href={`/creators/${props.auth.username}/drafts`}>
                <Typography>{draftContainerText()}</Typography>
              </Link>
            </Box>
          </>
        )}
      </Box>

      {/* Form */}
      <Box className={classes.formContainer}>
        <Grid item md={12} lg={12}>
          <Box sx={{ textAlign: isSmallScreen ? 'left' : 'center' }}>
            <Typography className={clsx(commonClasses.title1)}>Create Team</Typography>
            <Typography>Create a team for group of creatives</Typography>
          </Box>

          {/* Step Navigation UI */}
          <Box className={classes.stepperContainer}>{renderSteps}</Box>

          <Box style={{ marginTop: 100 }}>
            <StepWizard initialStep={activeStep} ref={wizardRef}>
              <Step1 handleBlur={handleBlur} formik={formik} />
              <Step2 formik={formik} />
              <Step3
                formik={formik}
                handleBlur={handleBlur}
                auth={props.auth}
                updateSelectedProjects={updateSelectedProjects}
              />
            </StepWizard>
          </Box>
        </Grid>

        {/* Previous and Next buttons */}
        <Box className={classes.buttonGroup}>
          {activeStep > 1 && (
            <CustomButton
              onClick={previous}
              primaryButtonOutlinedStyle
              startIcon={<ArrowBackIosRounded className={classes.nextButton} />}
            >
              Previous
            </CustomButton>
          )}

          <CustomButton
            onClick={activeStep == 3 ?submitData :next}
            loading={state.default_state?.loading}
            style={{ marginLeft: 'auto' }}
            primaryButtonStyle
            endIcon={<ArrowForwardIosRounded className={classes.nextButton} />}
          >
            {activeStep == 3 ? 'Create Team' : 'Next'}
          </CustomButton>

          <Modal.WithIcon
            icon={<AiOutlineExclamationCircle color={colors['tertiary-dark']} fontSize={25} />}
            open={publishOrAddTags}
            onClose={togglePublishOrAddTags}
          >
            <DialogTitle>
              <Typography className={clsx(commonClasses.title2, classes.dialogTitle1)}>
                Would you like to tag your project?
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Add relevant hashtags to your project for more visibility on ZubHub. If your project is generic in
                nature, use General tag.
              </DialogContentText>
              <DialogActions className={commonClasses.justifySpaceBetween}>
                <CustomButton primaryButtonOutlinedStyle onClick={handleAddTags}>
                  Add tags
                </CustomButton>
                <CustomButton primaryButtonStyle onClick={submitData}>
                  Publish without tags
                </CustomButton>
              </DialogActions>
            </DialogContent>
          </Modal.WithIcon>

          <Modal open={addTagsDialog} onClose={toggleAddTagsDialog}>
            <DialogActions className={commonClasses.justifySpaceBetween}>
              <CustomButton onClick={toggleAddTagsDialog} style={{ padding: 15 }} startIcon={<CloseOutlined />}>
                Close
              </CustomButton>
              <CustomButton onClick={submitData} style={{ margin: '0 15px' }} primaryButtonStyle>
                Publish
              </CustomButton>
            </DialogActions>

            <DialogTitle>
              <Typography align="center" className={commonClasses.title2}>
                What hashtag best describes your project?
              </Typography>
              <Typography align="center">
                For example, if you made flower from cardboard, you can write: cardboard, flowers, colours or leave it
                blank if you’re unsure.
              </Typography>
            </DialogTitle>

            <DialogContent style={{ paddingBottom: 30 }}>
              {/* <TagsInput
                name="tags"
                selectedTags={formik.values.tags}
                popularTags={popularTags}
                onChange={handleChangeTag}
                addTag={addTag}
                value={value}
                remoteData={remoteTags}
                clearSuggestions={clearSuggestions}
                removeTag={removeTag}
                placeholder="Start typing to search"
              /> */}
            </DialogContent>
          </Modal>
        </Box>
      </Box>
    </div>
  );
}

const SelectModeUI = ({ setMode }) => {
  const classes = makeStyles(createProjectStyle)();
  const commonClasses = makeStyles(styles)();
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [mode, setModeItem] = useState('');
  const modes = { personal: 'personal', team: 'team' };

  const handleCreate = () => {
    const params = new URLSearchParams(window.location.search);
    params.set('mode', mode);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, null, newUrl);
    setMode(mode);
  };

  return (
    <div className={classes.container}>
      <Box className={clsx(classes.selectMode)}>
        <Box sx={{ textAlign: isSmallScreen ? 'left' : 'center' }}>
          <Typography className={clsx(commonClasses.title1)}>Create Project</Typography>
          <Typography>
            Select what kind of project it is, if you worked on the project alone select Personal project, if you worked
            on your project with other creators select Team project.
          </Typography>
        </Box>
        <div className={clsx(classes.modeItemContainer)}>
          <div
            onClick={() => setModeItem(modes.personal)}
            className={clsx(classes.modeItem, mode == modes.personal ? classes.modeItemSelected : null)}
          >
            <Person style={{ color: colors.primary, marginBottom: 5, fontSize: 30 }} />
            <Typography className={clsx(commonClasses.title2, classes.modeItemTitle)}>Personal Project</Typography>
            <Typography>If you worked on the project alone </Typography>
          </div>

          <div
            onClick={() => setModeItem(modes.team)}
            className={clsx(classes.modeItem, mode == modes.team && classes.modeItemSelected)}
          >
            <Person style={{ color: colors.primary, marginBottom: 5, fontSize: 30 }} />
            <Typography className={clsx(commonClasses.title2, classes.modeItemTitle)}>Team Project</Typography>
            <Typography>If you worked on the project with other creators </Typography>
          </div>
        </div>
        <CustomButton
          onClick={handleCreate}
          primaryButtonStyle
          style={{ marginTop: 40, alignSelf: 'center' }}
          disabled={mode.length === 0}
        >
          Create Project
        </CustomButton>
      </Box>
    </div>
  );
};

CreateTeam.propTypes = {
  auth: PropTypes.object.isRequired,

};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);
