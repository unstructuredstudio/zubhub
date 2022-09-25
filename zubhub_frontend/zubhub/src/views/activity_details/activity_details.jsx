import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { deleteActivity, getBase64Images } from './activityDetailsScripts';
import CustomButton from '../../components/button/Button';
import GeneratePdf from '../../components/generatePdf/generatePdf';
import styles from '../../assets/js/styles/views/activity_details/activityDetailsStyles';
import commonStyles from '../../assets/js/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, CardMedia, Typography } from '@material-ui/core';
import ActionIconsContainer from '../../components/actionIconsContainer/actionIconsContainer';
import ReactQuill from 'react-quill';
import clsx from 'clsx';
import {
  videoOrUrl,
  getBase64ImageFromURL,
} from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function ActivityDetails(props) {
  const classes = useStyles();
  const history = useHistory();
  const common_classes = useCommonStyles();
  const { t } = props;
  const { id } = props.match.params;
  const { activities, auth } = useSelector(state => state);
  let activity = {};
  console.log('activities', activities);
  if (
    activities.selectedActivity['id'] &&
    activities.selectedActivity['id'] === id
  ) {
    activity = activities.selectedActivity;
  } else {
    activity = activities.all_activities.filter(item => item.id === id)[0];
  }
  console.log('activity_details', activities, activity);

  const [videoHeight, setVideoHeight] = useState();
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
    console.log('delete clicked');
    deleteActivity({ token: auth.token, id: id, history: history, t: t });
  };
  return (
    <Box
      id="activityDetailContainer"
      className={clsx(
        classes.activityDetailContainer,
        common_classes.marginTop1em,
      )}
    >
      <Box className={clsx(classes.activityDetailBlockContainer)}>
        {activity.creators.filter(item => item.id === auth.id).length > 0 ? (
          <Grid>
            <Link
              to={`/activities/${id}/edit`}
              className={common_classes.textDecorationNone}
            >
              <CustomButton
                className={common_classes.marginLeft1em}
                variant="contained"
                primaryButtonStyle
              >
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
        <Grid
          className={clsx(
            common_classes.marginTop1em,
            common_classes.justifyCenter,
          )}
          container
          spacing={2}
        >
          <Grid
            item
            md={6}
            xs={12}
            sm={8}
            lg={6}
            className={classes.demoImageContainerStyle}
          >
            <CardMedia
              id="activityImage"
              className={clsx(
                classes.demoImageStyle,
                common_classes.marginBottom1em,
              )}
              component={'img'}
              image={activity.images[0].image.file_url}
            />
          </Grid>
          <Grid
            item
            lg={6}
            md={4}
            sx={12}
            sm={4}
            className={clsx(
              common_classes.centerVertically,
              // common_classes.justifyCenter,
            )}
          >
            {/* <Grid container> */}
            <Box
              //sx={{ height: '100%' }}
              align="center"
              justify="center"
              direction="column"
              className={common_classes.marginLeft1em}
            >
              <Typography
                id="activityTitle"
                className={clsx(
                  classes.titleStyle,
                  common_classes.marginBottom1em,
                )}
                variant="h3"
              >
                {activity.title}
              </Typography>
              <Typography className={classes.createdOn} variant="h6">
                {`Made a year ago by ${activity.creators[0].username}`}
              </Typography>
              <Grid container className={common_classes.justifyCenter}>
                <Grid item lg={8} xs={12}>
                  <Link
                    to={`/projects/${id}/create`}
                    className={common_classes.textDecorationNone}
                  >
                    <CustomButton
                      variant="contained"
                      primaryButtonStyle
                      primaryButtonStyle3
                      fullWidth
                    >
                      {t('activityDetails.activity.build')}
                    </CustomButton>
                  </Link>
                </Grid>
                <Grid
                  item
                  lg={8}
                  xs={12}
                  className={common_classes.marginTop1em}
                >
                  <GeneratePdf activity={activity} />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid
          md={6}
          xs={12}
          sm={8}
          lg={6}
          item
          className={clsx(
            common_classes.marginTop1em,
            common_classes.marginBottom3em,
          )}
        >
          <ActionIconsContainer activity={activity} t={t} auth={auth} />
        </Grid>

        <Grid lg={8} item className={common_classes.textCenter}>
          <ReactQuill
            id="activityMotivation"
            className={classes.facilitationBodyStyle}
            theme={'bubble'}
            readOnly={true}
            value={activity.motivation || ''}
          />
        </Grid>
        {}
        <Typography
          className={clsx(common_classes.marginBottom1em)}
          variant="h5"
        ></Typography>
        <Grid
          className={clsx(
            common_classes.marginTop1em,
            common_classes.marginBottom1em,
          )}
        >
          {activity.video && (
            <div
            // style={{ position: 'relative', height: 'max-content' }}`calc((${videoHeight} * 9) / 16)`
            >
              <CardMedia
                id="activityVideo"
                sx={{ height: 400 }}
                className={classes.videoPlayer}
                component={videoOrUrl(activity.video) ? 'video' : 'iframe'}
                image={activity.video}
                controls
              />
            </div>
          )}
        </Grid>
        <Grid align="left" item>
          <Typography
            className={clsx(common_classes.marginTop1em, classes.subTitles)}
            variant="h3"
            align="left"
          >
            LEARNING GOALS
          </Typography>
          <ReactQuill
            id="activityLearningGoals"
            className={classes.facilitationBodyStyle}
            theme={'bubble'}
            readOnly={true}
            value={activity.learning_goals || ''}
          />
        </Grid>
        <Grid
          // align="left"
          item
          className={clsx(
            common_classes.marginBottom3em,
            common_classes.justifyCenter,
          )}
        >
          <Typography
            className={clsx(common_classes.marginTop1em, classes.subTitles)}
            variant="h3"
            align="left"
          >
            MATERIALS REQUIRED
          </Typography>
          <Grid container className={common_classes.justifyCenter}>
            <Grid item xs={12} lg={8} sm={8}>
              {activity.materials_used &&
                activity.materials_used.split(',').map((material, index) => (
                  <Typography
                    key={`materialUsedKey${index}`}
                    variant="h6"
                    className={clsx(
                      classes.facilitationBodyStyle,
                      // common_classes.textCenter,
                    )}
                  >
                    {`. ${material}`}
                  </Typography>
                ))}
            </Grid>
            {activity.materials_used_image ? (
              <Grid item xs={12} lg={4} sm={4}>
                <CardMedia
                  className={classes.materialsImage}
                  component="img"
                  image={activity.materials_used_image.file_url}
                ></CardMedia>
              </Grid>
            ) : (
              ''
            )}
          </Grid>
          <Box
            className={clsx(
              common_classes.marginTop3em,
              common_classes.marginBottom3em,
            )}
            style={{
              minHeight: '5px',
              width: '10%',
              margin: 'auto',
              backgroundColor: '#FFCE0C',
            }}
          ></Box>
        </Grid>
      </Box>
      <Grid
        container
        className={clsx(
          classes.inspiringExamplesContainer,
          // common_classes.displayFlex,
          common_classes.justifyCenter,
        )}
      >
        <Typography
          className={clsx(common_classes.marginTop3em, classes.subTitles)}
          variant="h3"
          sx={{ width: '100%' }}
        >
          INSPIRING PERSON
        </Typography>
        <Grid
          container
          className={
            (common_classes.justifyCenter, common_classes.marginBottom3em)
          }
        >
          {activity.inspiring_artist && activity.inspiring_artist['image'] ? (
            <>
              {activity.inspiring_artist.image && (
                <Grid item xs={12} lg={4} sm={4}>
                  <CardMedia
                    className={classes.demoImageStyle}
                    component="img"
                    image={activity.inspiring_artist.image.file_url}
                  ></CardMedia>
                </Grid>
              )}
              {activity.inspiring_artist.short_biography && (
                <Grid
                  item
                  xs={12}
                  lg={6}
                  sm={6}
                  className={clsx(classes.artistBiography)}
                >
                  <ReactQuill
                    id={`inspiringArtistBiography`}
                    className={classes.motivationBodyStyle}
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
              SOME INSPIRING EXAMPLES
            </Typography>
            <Grid
              container
              spacing={1}
              className={common_classes.justifyCenter}
            >
              {activity.inspiring_examples.map((example, index) => (
                <Grid
                  item
                  xs={6}
                  lg={4}
                  sm={4}
                  key={`inspiringExampleImageContainerKey${index}`}
                >
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
              {activity.inspiring_examples &&
              activity.inspiring_examples.length > 0 ? (
                <Grid
                  item
                  xs={12}
                  lg={12}
                  className={clsx(
                    common_classes.justifyCenter,
                    common_classes.textCenter,
                  )}
                >
                  <Typography
                    className={clsx(
                      common_classes.marginTop1em,
                      classes.imageCreditStyle,
                    )}
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
          classes.activityDetailBlockContainer,
          common_classes.justifyCenter,
        )}
      >
        {activity.making_steps && (
          <>
            <Typography
              className={clsx(common_classes.marginTop1em, classes.subTitles)}
              variant="h3"
              align="left"
            >
              MAKING STEPS
            </Typography>

            {activity.making_steps.map((making_step, index) => (
              <Grid
                container
                className={clsx(
                  common_classes.marginBottom1em,
                  common_classes.justifyCenter,
                )}
                key={`makingStepImageContainerKey${index}`}
              >
                <Grid
                  item
                  xs={12}
                  lg={8}
                  sm={8}
                  className={clsx(common_classes.justifyCenter)}
                  key={`makingStepImageSubContainerKey${index}`}
                >
                  {making_step.description && (
                    <ReactQuill
                      id={`makingStep${index}description`}
                      className={clsx(
                        common_classes.justifyCenter,
                        classes.facilitationBodyStyle,
                        //classes.makingStepsDescriptionStyle,
                      )}
                      theme={'bubble'}
                      readOnly={true}
                      value={making_step.description || ''}
                    />
                  )}
                </Grid>
                <Grid item xs={12} lg={4} sm={4}>
                  {making_step.image && (
                    <CardMedia
                      key={`makingStepImageKey${index}`}
                      className={classes.materialsImage}
                      component="img"
                      image={making_step.image.file_url}
                    ></CardMedia>
                  )}
                </Grid>
              </Grid>
            ))}
          </>
        )}
      </Grid>
      <Grid
        container
        className={clsx(
          classes.leftCropedContainer,
          common_classes.justifyCenter,
          common_classes.marginBottom3em,
        )}
      >
        <Typography
          className={clsx(classes.subTitles)}
          variant="h3"
          align="center"
        >
          FACILITATION TIPS
        </Typography>

        <Grid item xs={12} lg={12} sm={12}>
          {activity.facilitation_tips ? (
            <ReactQuill
              id={`facilitationTips`}
              className={classes.facilitationBodyStyle}
              theme={'bubble'}
              readOnly={true}
              value={activity.facilitation_tips || ''}
            />
          ) : (
            'Coming soon!'
          )}
        </Grid>
      </Grid>
      <Grid>
        <Typography
          className={clsx(common_classes.marginTop1em, classes.subTitles)}
          variant="h3"
          align="center"
        >
          CONTRIBUTORS
        </Typography>
        <Grid
          container
          className={clsx(
            classes.activityDetailBlockContainer,
            common_classes.justifyCenter,
          )}
        >
          {activity.creators.map((creator, index) => (
            <Grid
              item
              lg={3}
              md={3}
              xs={4}
              key={`activityDetailsCreatorContainer${index}`}
            >
              <CardMedia
                key={`activityDetailsCreatorAvatar${index}`}
                className={classes.creatorImage}
                component="img"
                image={creator.avatar}
              ></CardMedia>
              <Typography
                key={`activityDetailsCreatorUserName${index}`}
                //className={clsx(classes.subTitles)}
                variant="h6"
                align="center"
              >
                {creator.username}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ActivityDetails;
