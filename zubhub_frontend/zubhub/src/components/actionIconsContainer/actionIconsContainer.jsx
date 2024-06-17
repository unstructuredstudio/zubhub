import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Typography, ButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link as LinkIcon, WhatsApp as WhatsAppIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

import CustomButton from '../button/Button';
import { activityToggleSave } from '../../store/actions/activityActions';
import styles from '../../assets/js/styles/components/actionIconsContainer/actionIconsContainerStyles';
import { toggleSave } from '../activity/activityScripts';

const useStyles = makeStyles(styles);

function ActionIconsContainer(props) {
  const classes = useStyles();
  const { activity, t, auth, url } = props;
  const navigate = useNavigate();

  return (
    <Box className={classes.actionBoxStyle}>
      <Box className={classes.saveContainer}>
        <CustomButton
          className={classes.actionBoxButtonStyle}
          size="small"
          aria-label={t('projectDetails.ariaLabels.saveButton.label')}
          onClick={e => toggleSave(e, activity.id, auth, navigate, activityToggleSave, t)}
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
              `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${t('projectDetails.socialShare.fbwa')} `,
            )
          }
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          className={classes.button}
          onClick={() =>
            window.open(`https://api.whatsapp.com/send?text=${t('projectDetails.socialShare.fbwa')} ${url}`)
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
