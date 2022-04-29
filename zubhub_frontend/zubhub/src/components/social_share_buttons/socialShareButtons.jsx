import React from 'react';
import { ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import IconButton from '@material-ui/core/IconButton';
import { useMediaQuery } from '@material-ui/core';
import styles from '../../assets/js/styles/components/social_share_buttons/socialShareButtonsStyles';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const useStyles = makeStyles(styles);
const SocialButtons = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const url = window.location.href;
  const mediaQuery = useMediaQuery('(min-width: 1080px)');
  return (
    <>
      <ButtonGroup
        className={classes.buttonGroup}
        orientation={(mediaQuery && 'vertical') || 'horizontal'}
      >
        <IconButton
          className={classes.button}
          sx={{ backgroundColor: '#1877f2' }}
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
    </>
  );
};

export default SocialButtons;
