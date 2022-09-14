import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { deleteActivity } from './activityDetailsScripts';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/activity_details/activityDetailsStyles';
import commonStyles from '../../assets/js/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, CardMedia, Typography } from '@material-ui/core';
import ActionIconsContainer from '../../components/actionIconsContainer/actionIconsContainer';
import ReactQuill from 'react-quill';
import clsx from 'clsx';
import { videoOrUrl } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function ActivityDetails(props) {
  const classes = useStyles();
  const history = useHistory();
  const common_classes = useCommonStyles();
  const { t } = props;
  const { id } = props.match.params;
  const { activities, auth } = useSelector(state => state);

  const activity = activities.all_activities.filter(item => item.id === id)[0];
  console.log('activity_details', activities, activity);
  const handleDelete = () => {
    console.log('delete clicked');
    deleteActivity({ token: auth.token, id: id, history: history });
  };
  return (
    <div>
      <Box
        className={clsx(
          common_classes.margin,
          common_classes.marginLeft1em,
          common_classes.marginRight1em,
          common_classes.centerContainer,
        )}
      >
        <Link
          to={`/activities/${id}/edit`}
          className={common_classes.textDecorationNone}
        >
          <CustomButton
            className={common_classes.marginLeft1em}
            variant="contained"
            primaryButtonStyle
          >
            {t('activityDetails.activity.edit')}
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
        <Grid
          className={clsx(common_classes.marginTop3em)}
          container
          spacing={2}
        >
          <Grid
            item
            md={6}
            xs={12}
            sm={8}
            lg={4}
            className={classes.demoImageContainerStyle}
          >
            <CardMedia
              className={clsx(
                classes.demoImageStyle,
                common_classes.marginBottom1em,
              )}
              component={'img'}
              image={activity.images[0].image.file_url}
            />
          </Grid>
          <Grid
            container
            lg={4}
            md={4}
            xs={12}
            sm={4}
            sx={{ height: '100%' }}
            align="center"
            justify="center"
            direction="column"
            // className={common_classes.marginLeft1em}
          >
            <Box>
              <Typography
                className={clsx(
                  classes.titleStyle,
                  common_classes.marginBottom1em,
                )}
                variant="h3"
                gutterBottom
              >
                {activity.title}
              </Typography>
              <Typography
                className={classes.createdOn}
                variant="h6"
                gutterBottom
              >
                {`Made a year ago by ${activity.creators[0].username}`}
              </Typography>
              <Grid container lg={6} xs={12}>
                <Grid item lg={12} xs={12}>
                  <Link
                    to={`/projects/create`}
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
                  lg={12}
                  xs={12}
                  className={common_classes.marginTop1em}
                >
                  <Link
                    to={`/projects/create`}
                    className={common_classes.textDecorationNone}
                  >
                    <CustomButton
                      variant="contained"
                      primaryButtonStyle
                      primaryButtonStyle3
                      fullWidth
                    >
                      {t('activityDetails.activity.pdf')}
                    </CustomButton>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid
          md={6}
          xs={12}
          sm={8}
          lg={4}
          item
          className={clsx(
            common_classes.marginTop1em,
            common_classes.marginBottom3em,
          )}
        >
          <ActionIconsContainer activity={activity} t={t} auth={auth} />
        </Grid>
        {/* <Typography variant="h5" className={classes.descriptionHeadingStyle}>
          {t('projectDetails.project.description')}
        </Typography> */}
        <Grid lg={8} item justifyContent="center">
          <ReactQuill
            className={classes.motivationBodyStyle}
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
          xs={12}
          sm={8}
          lg={8}
          container
          alignItems="center"
          // className={clsx(
          //   common_classes.marginTop1em,
          //   common_classes.marginBottom1em,
          // )}
        >
          {activity.video && (
            <CardMedia
              //sx={{ height: 200 }}
              className={classes.videoPlayer}
              component={videoOrUrl(activity.video) ? 'video' : 'iframe'}
              //
              //height={150}
              image={activity.video}
              controls
            />
          )}
        </Grid>
      </Box>
    </div>
  );
}

export default ActivityDetails;
