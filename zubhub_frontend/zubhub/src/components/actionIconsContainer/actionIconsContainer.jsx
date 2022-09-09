import React from 'react';
import { Grid, Box, CardMedia, Typography } from '@material-ui/core';
import styles from '../../assets/js/styles/components/actionIconsContainer/actionIconsContainerStyles';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CustomButton from '../../components/button/Button';
import SocialButtons from '../social_share_buttons/socialShareButtons.jsx';
import { ButtonGroup } from '@material-ui/core';

import LinkIcon from '@material-ui/icons/Link';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import IconButton from '@material-ui/core/IconButton';
import { useMediaQuery } from '@material-ui/core';
import { toast } from 'react-toastify';
const useStyles = makeStyles(styles);
function ActionIconsContainer(props) {
  const classes = useStyles();
  const { activity, t, url } = props;
  return (
    // <Box>
    //   <Grid container>
    //     <Grid item></Grid>
    //     <Grid item></Grid>
    //     <Grid item></Grid>
    //     <Grid item></Grid>
    //   </Grid>
    // </Box>
    <Box className={classes.actionBoxStyle}>
      <Box className={classes.saveContainer}>
        <CustomButton
          className={classes.actionBoxButtonStyle}
          size="small"
          aria-label={t('projectDetails.ariaLabels.saveButton.label')}
          // onClick={e => handleSetState(toggleSave(e, props, project.id))}
        >
          <Box className={classes.iconsBoxStyle}>
            {activity.saved_by.includes(props.auth.id) ? (
              <BookmarkIcon
                aria-label={t('projectDetails.ariaLabels.saveButton.unsave')}
              />
            ) : (
              <BookmarkBorderIcon
                aria-label={t('projectDetails.ariaLabels.saveButton.save')}
              />
            )}
          </Box>
        </CustomButton>
        <Typography
          color="textSecondary"
          variant="caption"
          component="span"
          className={classes.actionBoxButtonStyle}
        >
          <Box className={classes.iconsBoxStyle}>
            <VisibilityIcon />
          </Box>
          <Typography>{activity.views_count}</Typography>
        </Typography>
      </Box>
      {/* <SocialButtons /> */}
      <ButtonGroup className={classes.buttonGroup} orientation="horizontal">
        <IconButton
          className={classes.button}
          onClick={() =>
            window.open(
              'https://www.facebook.com/sharer/sharer.php?u=' +
                url +
                '&quote=' +
                t('projectDetails.socialShare.fbwa'),
            )
          }
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          className={classes.button}
          onClick={() =>
            window.open(
              'https://web.whatsapp.com/send?text=' +
                t('projectDetails.socialShare.fbwa') +
                url,
            )
          }
        >
          <WhatsAppIcon />
        </IconButton>
        <IconButton
          className={classes.button}
          onClick={() => {
            navigator.clipboard
              .writeText(url)
              .then(() => {
                toast.success(t('projectDetails.socialShare.copySuccess'));
              })
              .catch(() => {
                toast.warning(t('projectDetails.socialShare.copyFail'));
              });
          }}
        >
          <LinkIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
}

export default ActionIconsContainer;
