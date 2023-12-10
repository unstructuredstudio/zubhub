import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, CardMedia, Typography } from '@mui/material';
import styles from '../../assets/js/styles/components/actionIconsContainer/actionIconsContainerStyles';
import { makeStyles } from '@mui/styles';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomButton from '../../components/button/Button';
import SocialButtons from '../social_share_buttons/socialShareButtons.jsx';
import { ButtonGroup } from '@mui/material';
import { activityToggleSave } from '../../store/actions/activityActions';
import LinkIcon from '@mui/icons-material/Link';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import IconButton from '@mui/material/IconButton';
import { useMediaQuery } from '@mui/material';
import { toggleSave } from '../activity/activityScripts';
import { toast } from 'react-toastify';
const useStyles = makeStyles(styles);
function ActionIconsContainer(props) {
  const classes = useStyles();
  const { activity, t, auth, url } = props;
  const navigate = useNavigate();
  const [state, handleSetState] = useState({ loading: false });

  return (
    <Box className={classes.actionBoxStyle}>
      <Box className={classes.saveContainer}>
        <CustomButton
          className={classes.actionBoxButtonStyle}
          size="small"
          aria-label={t('projectDetails.ariaLabels.saveButton.label')}
          onClick={e => toggleSave(e, activity.id, auth, navigate, handleSetState, activityToggleSave, t)}
        >
          <Box className={classes.iconsBoxStyle}>
            {activity.saved_by.includes(auth.id) ? (
              <BookmarkIcon aria-label={t('projectDetails.ariaLabels.saveButton.unsave')} />
            ) : (
              <BookmarkBorderIcon aria-label={t('projectDetails.ariaLabels.saveButton.save')} />
            )}
          </Box>
        </CustomButton>
        <Typography color="textSecondary" variant="caption" component="span" className={classes.actionBoxButtonStyle}>
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
              'https://www.facebook.com/sharer/sharer.php?u=' + url + '&quote=' + t('projectDetails.socialShare.fbwa'),
            )
          }
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          className={classes.button}
          onClick={() =>
            window.open('https://web.whatsapp.com/send?text=' + t('projectDetails.socialShare.fbwa') + url)
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
