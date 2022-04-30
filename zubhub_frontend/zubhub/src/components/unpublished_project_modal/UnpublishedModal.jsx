import React, { useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Modal, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import styles from '../../assets/js/styles/components/unpublished/unpublishedModalStyles';
import commonStyles from '../../assets/js/styles';
import CustomButton from '../button/Button';

const useStyles = makeStyles(styles);

function UnpublishedModal({ violations }) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const mediaQuery = useMediaQuery('(max-width: 600px)');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <center>
        <div onClick={handleOpen} className={classes.unpublishedLabelStyle}>
          UNPUBLISHED
        </div>
      </center>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className={mediaQuery ? classes.modalMobileStyle : classes.modalStyle}
        >
          <Grid container>
            <Grid item className = {classes.closeIconWrapper}>
              <CloseIcon
                onClick={handleClose}
                className={classes.closeIconStyle}
              ></CloseIcon>
            </Grid>
            <Grid item className = {classes.descriptionWrapper}>
              <div className={classes.overflowWrapper}>
                <Typography
                  variant="h6"
                  className={classes.descriptionHeadingStyle}
                >
                  Your project has been unpublished.
                </Typography>
                <Typography className={classes.modalBodyStyle}>
                  This is because your project contains information that:
                </Typography>
                {violations.map(violation => (
                  <Typography className={classes.violationReasonStyle}>
                    {violation}
                  </Typography>
                ))}
                <Typography className={classes.modalBodyStyle}>
                  You must make changes to your project before it can be
                  republished.
                  You must make changes to your project before it can be
                  republished.
                  You must make changes to your project before it can be
                  republished.
                  You must make changes to your project before it can be
                  republished.
                  You must make changes to your project before it can be
                  republished.
                  You must make changes to your project before it can be
                  republished.
                  You must make changes to your project before it can be
                  republished.

                </Typography>
                <CustomButton
                  variant="contained"
                  dangerButtonStyle
                  onClick={handleClose}
                  className={classes.understandButtonStyle}
                >
                  I UNDERSTAND
                </CustomButton>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}

export default UnpublishedModal;
