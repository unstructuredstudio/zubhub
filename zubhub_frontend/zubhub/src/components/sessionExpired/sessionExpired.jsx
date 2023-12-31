import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Card, CardContent, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link, useNavigate } from 'react-router-dom';
import { sessionExpiredStyle } from './sessionExpired.Style';
import Modal from '../modals/Modal';
import CustomButton from '../button/Button';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const useStyles = makeStyles(sessionExpiredStyle);

const SessionExpiredModal = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setModalOpen(false);
    navigate('/login');
  };
  const { t } = useTranslation();

  return (
    <Modal open={modalOpen}>
      <Card className={classes.card}>
        <div className={classes.cardHeader}>
          <Typography variant="h6">{t(`sessionExpired.heading`)}</Typography>
          <Typography variant="button" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </Typography>
        </div>
        <CardContent className={classes.cardContent}>
          <div className={classes.iconWrapper}>
            <ErrorOutlineIcon className={clsx(classes.icon, classes.errorIcon)} />
          </div>
          <Typography variant="body1" color="textPrimary" className={clsx(classes.centerText, classes.titleStyle)}>
            {t(`sessionExpired.title`)}
          </Typography>
          <Typography variant="body2" className={classes.centerText}>
            {t(`sessionExpired.text`)}
          </Typography>
          <div className={classes.buttonContainer}>
            <Link to="/login" className={classes.textDecorationNone}>
              <CustomButton variant="outlined" size="small" primaryButtonStyle customButtonStyle>
                {t(`sessionExpired.buttonLabel`)}
              </CustomButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default SessionExpiredModal;
