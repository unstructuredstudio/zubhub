import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { deleteActivity } from './activityDetailsScripts';
import CustomButton from '../../components/button/Button';
import GeneratePdf from '../../components/generatePdf/generatePdf';
import styles from '../../assets/js/styles/views/activity_details/activityDetailsStyles';
import commonStyles from '../../assets/js/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, CardMedia, Typography } from '@material-ui/core';
import ActionIconsContainer from '../../components/actionIconsContainer/actionIconsContainer';
import ReactQuill from 'react-quill';
import clsx from 'clsx';
//import logo from '../../assets/images/logos/logo.png';
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

  const activity = activities.all_activities.filter(item => item.id === id)[0];
  console.log('activity_details', activities, activity);
  const [docDefinitionDefault, setDocDefinitionDefault] = useState({});
  useEffect(async () => {
    const response = await getBase64ImageFromURL(
      activity.images[0].image.file_url,
    );
    
    setDocDefinitionDefault(() => {
      return {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [40, 20, 40, 60],
        content: [
          {
            text: 'Zubhub Activities',
            style: 'header',
            alignment: 'center',
          },
          {
            alignment: 'justify',
            columns: [
              {
                text: activity.title,
                style: 'textBody',
                alignment: 'justify',
              },
              {
                image: response,
                width: 200,
                height: 200,
              },
            ],
          },
          {
            text: activity.motivation,
            alignment: 'center'
          }
        ],
        defaultStyle: {
          columnGap: 20,
          // font: 'NimbusSans',
        },
        styles: {
          withMargin: {
            margin: [20, 20, 20, 20],
          },
          alignCenter: {
            alignment: 'center',
          },
          header: {
            fontSize: 20,
            bold: true,
            marginBottom: 20,
          },
          textBody: {
            fontSize: 12,
          },
          subheader: {
            fontSize: 15,
            bold: true,
          },
          quote: {
            italics: true,
          },
          small: {
            fontSize: 8,
          },
        },
      };
    });
  }, []);

  const handleDelete = () => {
    console.log('delete clicked');
    deleteActivity({ token: auth.token, id: id, history: history });
  };
  return (
    <div>
      <Box
        id="activityDetailContainer"
        //key="activityDetailContainer"

        className={clsx(
          classes.activityDetailContainer,
          common_classes.marginTop1em,
          // common_classes.marginLeft1em,
          // common_classes.marginRight1em,
          //common_classes.centerContainer,
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
          className={clsx(common_classes.marginTop1em)}
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
              id="ActivityImage"
              className={clsx(
                classes.demoImageStyle,
                common_classes.marginBottom1em,
              )}
              component={'img'}
              image={activity.images[0].image.file_url}
            />
          </Grid>
          <Grid item lg={6} md={4} xs={12} sm={4} align={'center'}>
            {/* <Grid container> */}
            <Box
              sx={{ height: '100%' }}
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
                  <GeneratePdf
                    activity={activity}
                    docDefinitionDefault={docDefinitionDefault}
                  />
                  {/* <Link
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
                  </Link> */}
                </Grid>
              </Grid>
            </Box>
            {/* </Grid> */}
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
            id="activityMotivation"
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
          item
          //alignItems="center"
          // className={clsx(
          //   common_classes.marginTop1em,
          //   common_classes.marginBottom1em,
          // )}
        >
          {activity.video && (
            <CardMedia
              id="activityVideo"
              className={classes.videoPlayer}
              component={videoOrUrl(activity.video) ? 'video' : 'iframe'}
              image={activity.video}
              controls
            />
          )}
        </Grid>
        <Grid align="left" item>
          <Typography
            className={clsx(common_classes.marginTop1em, classes.subTitles)}
            variant="h3"
            align="left"
          >
            Learning Goals
          </Typography>
          <ReactQuill
            className={classes.motivationBodyStyle}
            theme={'bubble'}
            readOnly={true}
            value={activity.learning_goals || ''}
          />
        </Grid>
        <Grid align="left" item>
          <Typography
            className={clsx(common_classes.marginTop1em, classes.subTitles)}
            variant="h3"
            align="left"
          >
            Materials Required
          </Typography>
          <Grid container>
            <Grid item xs={6} lg={8} sm={8}>
              {activity.materials_used &&
                activity.materials_used.split(',').map(material => (
                  <Typography
                    // className={clsx(common_classes.marginTop1em)}
                    variant="h6"
                    align="left"
                  >
                    {material}
                  </Typography>
                ))}
            </Grid>
            {activity.materials_used_image ? (
              <Grid item xs={6} lg={4} sm={4}>
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

          {activity.making_steps && (
            <>
              <Typography
                className={clsx(common_classes.marginTop1em, classes.subTitles)}
                variant="h3"
                align="left"
              >
                Making Process
              </Typography>

              {activity.making_steps.map(making_step => (
                <Grid container>
                  <Grid item xs={6} lg={8} sm={8}>
                    {making_step.description && (
                      <ReactQuill
                        //className={classes.motivationBodyStyle}
                        theme={'bubble'}
                        readOnly={true}
                        value={making_step.description || ''}
                      />
                    )}
                  </Grid>
                  <Grid item xs={6} lg={4} sm={4}>
                    {making_step.image && (
                      <CardMedia
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
          {/* {activity.inspiring_examples && (
            <Grid container>
              <Typography
                className={clsx(common_classes.marginTop1em, classes.subTitles)}
                variant="h3"
                align="left"
              >
                Some Inspiring Examples
              </Typography>
              
              {activity.inspiring_examples.map(example => (
                
                  <Grid item xs={6} lg={8} sm={8}>
                    {making_step.description && (
                      <ReactQuill
                        //className={classes.motivationBodyStyle}
                        theme={'bubble'}
                        readOnly={true}
                        value={making_step.description || ''}
                      />
                    )}
                  </Grid>
                  <Grid item xs={6} lg={4} sm={4}>
                    {making_step.image && (
                      <CardMedia
                        className={classes.materialsImage}
                        component="img"
                        image={making_step.image.file_url}
                      ></CardMedia>
                    )}
                  </Grid>
                
              ))}</Grid>
            </>
          )} */}
        </Grid>
      </Box>
    </div>
  );
}

export default ActivityDetails;
