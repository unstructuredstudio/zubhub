import React from 'react';
import { ButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LinkIcon from '@mui/icons-material/Link';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { RiFacebookCircleFill, RiWhatsappFill } from 'react-icons/ri';
import { colors } from '../../assets/js/colors';
import styles from '../../assets/js/styles/components/social_share_buttons/socialShareButtonsStyles';

const useStyles = makeStyles(styles);
const SocialButtons = ({ facebook, whatsapp, link, withColor, containerStyle = {}, styleOverrides }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const url = window.location.href;
  const showAll = !facebook && !whatsapp && !link;

  return (
    <>
      <ButtonGroup className={clsx(classes.buttonGroup, styleOverrides?.containerStyle)} style={containerStyle}>
        {(showAll || facebook) && (
          <IconButton
            className={clsx(classes.button, withColor && classes.outlined, styleOverrides?.outlined)}
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${t('projectDetails.socialShare.fbwa')}`,
              )
            }
          >
            {!withColor && <FacebookIcon />}
            {withColor && <RiFacebookCircleFill color="#4267b2" />}
          </IconButton>
        )}

        {(showAll || whatsapp) && (
          <IconButton
            className={clsx(classes.button, withColor && classes.outlined, styleOverrides?.outlined)}
            onClick={() =>
              window.open(`https://api.whatsapp.com/send?text=${t('projectDetails.socialShare.fbwa')} ${url}`)
            }
          >
            {!withColor && <WhatsAppIcon />}
            {withColor && <RiWhatsappFill color="#60d66a" />}
          </IconButton>
        )}

        {(showAll || link) && (
          <IconButton
            className={clsx(classes.button, withColor && classes.outlined, styleOverrides?.outlined)}
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
            <LinkIcon style={{ color: withColor ? colors.black : colors.white }} />
          </IconButton>
        )}
      </ButtonGroup>
    </>
  );
};

export default SocialButtons;
