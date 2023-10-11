import React, { useState, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteActivity, togglePublish } from './activityDetailsScripts';
import CustomButton from '../../components/button/Button';
import GeneratePdf from '../../components/generatePdf/generatePdf';
import styles from '../../assets/js/styles/views/activity_details/activityDetailsStyles';
import commonStyles from '../../assets/js/styles';
import { makeStyles } from '@mui/styles';
import { Grid, Box, CardMedia, Typography } from '@mui/material';
import ActionIconsContainer from '../../components/actionIconsContainer/actionIconsContainer';
import ReactQuill from 'react-quill';
import clsx from 'clsx';
import { activityTogglePublish, getUnPublishedActivities } from '../../store/actions/activityActions';
import { videoOrUrl, dFormatter, getBase64ImageFromURL } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function ActivityDetails(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const common_classes = useCommonStyles();
  const { t } = props;
  const { id } = props.match.params;
  const { activities, auth } = useSelector(state => state);
  let activity = {};

  if (activities.selectedActivity['id'] && activities.selectedActivity['id'] === id) {
    activity = activities.selectedActivity;
  } else {
    let result = activities.all_activities.filter(item => item.id === id);
    activity = result.length === 0 ? [] : result[0];
  }

  const [imageCredit, setImageCredit] = useState('');
  useEffect(() => {
    setImageCredit(state => {
      state = '';
      activity.inspiring_examples.map((example, index) => {
        state += example['description'] && ` ${example.description}-`;
        state += example['credit'] && ` ${example.credit},`;
      });
      return state;
    });
    window.scrollTo(0, 0);
  }, []);

  const handleDelete = () => {
    deleteActivity({ token: auth.token, id: id, navigate: navigate, t: t });
  };

  return (
    <>
      {activity['title'] ? (
        <Box
          id="activityDetailContainer"
          className={clsx(classes.activityDetailContainer, common_classes.marginTop1em)}
        >
          <Grid className={clsx(classes.activityDetailBlockContainer)}>
            <Grid container>
              {activity?.creators?.filter(item => item.id === auth.id).length > 0 ? (
                <Grid item>
                  <Link to={`/activities/${id}/edit`} className={common_classes.textDecorationNone}>
                    <CustomButton className={common_classes.marginLeft1em} variant="contained" primaryButtonStyle>
                      {t('activityDetails.activity.edit.label')}
                    </CustomButton>
                  </Link>
                  <CustomButton
                    className={common_classes.marginLeft1em}
                    variant="contained"
                    primaryButtonStyle
                    onClick={() => handleDelete()}
                  >
                    {t('activityDetails.activity.delete.label')}
                  </CustomButton>
                </Grid>
              ) : (
                ''
              )}
              <Grid item>
                {auth.tags.filter(tag => tag === 'moderator' || tag === 'staff').length > 0 && (
                  <CustomButton
                    className={common_classes.marginLeft1em}
                    variant="contained"
                    primaryButtonStyle
                    onClick={e => togglePublish(e, activity.id, auth, navigate, props.activityTogglePublish, t)}
                  >
                    {activity.publish
                      ? t('activityDetails.activity.unpublish.label')
                      : t('activityDetails.activity.publish.label')}
                  </CustomButton>
                )}
              </Grid>
            </Grid>
            <Grid
              className={clsx(
                common_classes.addOnSmallScreen,
                common_classes.justifyCenter,
                common_classes.marginTop1em,
              )}
            >
              <Typography id="activityTitle" className={clsx(classes.titleStyle)}>
                {activity.title}
              </Typography>
            </Grid>
            <Grid
              className={clsx(
                common_classes.marginTop1em,
                common_classes.justifySpaceBetween,
                common_classes.marginBottom3em,
              )}
              container
              spacing={2}
            >
              <Grid item md={6} xs={12} sm={6} lg={6} className={clsx(classes.demoImageContainerStyle)}>
                <CardMedia
                  id="activityImage"
                  className={clsx(classes.demoImageStyle, common_classes.marginBottom1em, common_classes.marginTop1em)}
                  component={'img'}
                  image={activity.images[0].image.file_url}
                />
                {/* <ActionIconsContainer activity={activity} t={t} auth={auth} /> */}
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                sx={12}
                sm={6}
                className={clsx(classes.marginAuto, common_classes.centerVertically, common_classes.justifySelfCenter)}
              >
                <Grid
                  className={clsx(
                    common_classes.marginLeft1em,
                    common_classes.justifyCenter,
                    common_classes.alignCenter,
                  )}
                >
                  <Typography
                    id="activityTitle"
                    className={clsx(classes.titleStyle, common_classes.removeOnSmallScreen)}
                    variant="h3"
                  >
                    {activity.title}
                  </Typography>
                  <Link to={`/creators/${activity.creators[0].username}`} className={common_classes.link}>
                    <Typography className={classes.createdOn} variant="h6">
                      {`${t('activityDetails.made')} ${activity.creators[0].username} ${
                        dFormatter(activity.created_on).value
                      } ${t(`date.${dFormatter(activity.created_on).key}`)} ${t('date.ago')}`}
                    </Typography>
                  </Link>
                  <Grid container className={clsx(common_classes.justifyCenter, common_classes.marginTop1em)}>
                    <Grid item lg={8} xs={12}>
                      <CustomButton
                        variant="contained"
                        primaryButtonStyle
                        primaryButtonStyle3
                        fullWidth
                        onClick={() => {
                          navigate('/projects/create', { state: { activity_id: id } });
                        }}
                      >
                        {t('activityDetails.activity.build')}
                      </CustomButton>
                    </Grid>
                    <Grid item lg={8} xs={12} className={common_classes.marginTop1em}>
                      <GeneratePdf activity={activity} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={clsx(classes.activityDetailBlock, common_classes.marginTop3em)}>
            <Grid className={clsx(common_classes.justifyCenter)}>
              <ReactQuill
                id="activityMotivation"
                className={clsx(classes.quillBodyStyle, classes.quillTextCenter)}
                theme={'bubble'}
                readOnly={true}
                value={activity.motivation || ''}
              />
            </Grid>

            <Grid container className={clsx(common_classes.marginTop3em, common_classes.justifyCenter)}>
              {activity.video && (
                <Grid item xs={12} sm={12} md={12} className={clsx(classes.videoWrapperStyle)}>
                  <CardMedia
                    id="activityVideo"
                    sx={{ height: 400 }}
                    className={classes.iframeStyle}
                    component={videoOrUrl(activity.video) ? 'video' : 'iframe'}
                    image={activity.video}
                    controls
                  />
                </Grid>
              )}
            </Grid>
            <Grid
              item
              className={clsx(
                common_classes.justifyCenter,
                common_classes.marginTop3em,
                common_classes.marginBottom3em,
              )}
            >
              <Typography className={clsx(common_classes.marginTop1em, classes.subTitles)} variant="h3" align="left">
                {t('activityDetails.subTitles.learning_goals')}
              </Typography>
              <ReactQuill
                id="activityLearningGoals"
                className={clsx(classes.quillBodyStyle, classes.quillTextCenter)}
                theme={'bubble'}
                readOnly={true}
                value={activity.learning_goals || ''}
              />
            </Grid>
            <Grid
              // align="left"
              item
              className={clsx(common_classes.marginBottom3em, common_classes.justifyCenter)}
            >
              <Typography className={clsx(common_classes.marginTop1em, classes.subTitles)} variant="h3" align="left">
                {t('activityDetails.subTitles.materials_required')}
              </Typography>
              <Grid container className={clsx(common_classes.justifyCenter)}>
                <Grid item xs={12} lg={8} sm={8}>
                  {activity.materials_used &&
                    activity.materials_used.split(',').map((material, index) => (
                      <Grid container className={clsx(common_classes.alignCenter)}>
                        {' '}
                        <Box className={common_classes.listDotsStyle}>{}</Box>
                        <Typography
                          key={`materialUsedKey${index}`}
                          variant="h6"
                          className={clsx(classes.quillBodyStyle)}
                        >
                          {`${material}`}
                        </Typography>
                      </Grid>
                    ))}
                </Grid>
                {activity.materials_used_image && (
                  <Grid item xs={12} lg={4} sm={4}>
                    <CardMedia
                      className={classes.materialsImage}
                      component="img"
                      image={activity.materials_used_image.file_url}
                    ></CardMedia>
                  </Grid>
                )}
              </Grid>
              <Box
                className={clsx(common_classes.marginTop3em, common_classes.marginBottom3em)}
                style={{
                  minHeight: '5px',
                  width: '10%',
                  margin: 'auto',
                  backgroundColor: 'var(--primary-color2)',
                }}
              ></Box>
            </Grid>
          </Grid>
          <Grid container className={clsx(classes.inspiringExamplesContainer, common_classes.justifyCenter)}>
            <Typography className={clsx(common_classes.marginTop3em, classes.subTitles)} variant="h3">
              {t('activityDetails.subTitles.inspiring_person')}
            </Typography>
            <Grid container className={clsx(common_classes.justifyCenter, common_classes.marginBottom3em)}>
              {activity.inspiring_artist && activity.inspiring_artist['image'] ? (
                <>
                  {activity.inspiring_artist.image && (
                    <Grid item xs={12} lg={6} sm={6}>
                      <CardMedia
                        className={classes.demoImageStyle}
                        component="img"
                        image={activity.inspiring_artist.image.file_url}
                      ></CardMedia>
                    </Grid>
                  )}
                  {activity.inspiring_artist.short_biography && (
                    <Grid item xs={12} lg={6} sm={6} className={clsx(classes.artistBiography)}>
                      <ReactQuill
                        id={`inspiringArtistBiography`}
                        className={clsx(classes.quillBodyStyle, common_classes.justifyCenter)}
                        theme={'bubble'}
                        readOnly={true}
                        value={activity.inspiring_artist.short_biography || ''}
                      />
                    </Grid>
                  )}
                </>
              ) : (
                'Coming soon!'
              )}{' '}
            </Grid>
            {activity.inspiring_examples ? (
              <Grid container className={common_classes.justifyCenter}>
                <Typography
                  className={clsx(common_classes.marginTop3em, classes.subTitles)}
                  variant="h3"
                  align="center"
                >
                  {t('activityDetails.subTitles.inspiring_examples')}
                </Typography>
                <Grid container spacing={1} className={common_classes.justifyCenter}>
                  {activity.inspiring_examples.map((example, index) => (
                    <Grid item xs={6} lg={4} sm={4} key={`inspiringExampleImageContainerKey${index}`}>
                      {example.image && (
                        <CardMedia
                          key={`inspiringExampleImageKey${index}`}
                          className={classes.inspiringExampleImageStyle}
                          component="img"
                          image={example.image.file_url}
                        ></CardMedia>
                      )}
                    </Grid>
                  ))}
                  {activity.inspiring_examples && activity.inspiring_examples.length > 0 && imageCredit !== '' ? (
                    <Grid
                      item
                      xs={12}
                      lg={12}
                      className={clsx(common_classes.justifyCenter, common_classes.textCenter)}
                    >
                      <Typography
                        className={clsx(common_classes.marginTop1em, classes.imageCreditStyle)}
                        variant="caption"
                      >
                        {` From left to right : ${imageCredit}.`}
                      </Typography>
                    </Grid>
                  ) : (
                    'Coming soon!'
                  )}
                </Grid>
              </Grid>
            ) : (
              ''
            )}
          </Grid>
          <Grid
            className={clsx(
              classes.activityDetailBlock,
              common_classes.justifyCenter,
              common_classes.marginTop3em,
              common_classes.marginBottom3em,
            )}
          >
            {activity.making_steps && (
              <>
                <Typography className={clsx(common_classes.marginTop1em, classes.subTitles)} variant="h3" align="left">
                  {t('activityDetails.subTitles.making_steps')}
                </Typography>

                {activity.making_steps.map((making_step, index) => (
                  <Grid
                    container
                    className={clsx(
                      common_classes.marginBottom1em,
                      // common_classes.justifyCenter,
                    )}
                    key={`makingStepImageContainerKey${index}`}
                  >
                    <Grid
                      container
                      xs={12}
                      lg={making_step.image && 8}
                      sm={making_step.image && 8}
                      key={`makingStepImageSubContainerKey${index}`}
                    >
                      <Box className={common_classes.fieldNumberStyle}>{making_step.step_order}</Box>
                      {making_step.description && (
                        <ReactQuill
                          id={`makingStep${index}description`}
                          className={clsx(classes.quillBodyStyle)}
                          theme={'bubble'}
                          readOnly={true}
                          value={making_step.description || ''}
                        />
                      )}
                    </Grid>

                    {making_step.image && (
                      <Grid item xs={12} lg={4} sm={4}>
                        <CardMedia
                          key={`makingStepImageKey${index}`}
                          className={classes.materialsImage}
                          component="img"
                          image={making_step.image.file_url}
                        ></CardMedia>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </>
            )}
          </Grid>
          <Grid
            container
            className={clsx(classes.leftCropedContainer, common_classes.justifyCenter, common_classes.alignCenter)}
          >
            <Typography className={clsx(classes.subTitles)} variant="h3" align="center">
              {t('activityDetails.subTitles.facilitation_tips')}
            </Typography>
            {activity.facilitation_tips ? (
              <Grid item xs={12} lg={12} sm={12}>
                <ReactQuill
                  id={`facilitationTips`}
                  className={clsx(classes.quillBodyStyle, classes.quillTextCenter)}
                  theme={'bubble'}
                  readOnly={true}
                  value={activity.facilitation_tips || ''}
                />
              </Grid>
            ) : (
              'Coming soon!'
            )}
          </Grid>
          <Grid>
            <Typography className={clsx(common_classes.marginTop1em, classes.subTitles)} variant="h3" align="center">
              {t('activityDetails.subTitles.contributors')}
            </Typography>
            <Grid container className={clsx(classes.activityDetailBlock, common_classes.justifyCenter)}>
              {activity.creators.map((creator, index) => (
                <Grid item lg={3} md={3} xs={4} key={`activityDetailsCreatorContainer${index}`}>
                  <CardMedia
                    key={`activityDetailsCreatorAvatar${index}`}
                    className={classes.creatorImage}
                    component="img"
                    image={creator.avatar}
                  ></CardMedia>
                  <Typography key={`activityDetailsCreatorUserName${index}`} variant="h6" align="center">
                    {creator.username}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>
      ) : (
        navigate('/activities')
      )}
    </>
  );
}

const mapStateToProps = state => {
  return {
    activities: state.activities,
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    activityTogglePublish: args => {
      return dispatch(activityTogglePublish(args));
    },
    getUnPublishedActivities: args => {
      return dispatch(getUnPublishedActivities(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetails);
