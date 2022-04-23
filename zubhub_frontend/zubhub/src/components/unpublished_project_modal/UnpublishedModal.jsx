import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LockIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/Public';
import {
  Tooltip,
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Fab,
  Typography,
  Modal,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import ClapIcon, { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import CommentIcon from '../../assets/js/icons/CommentIcon';
import playIcon from '../../assets/images/play-icon.png';
import {
  dFormatter,
  nFormatter,
  buildVideoThumbnailURL,
  isBaseTag,
} from '../../assets/js/utils/scripts';
import { publish_type } from '../../assets/js/utils/constants';
import styles from '../../assets/js/styles/components/unpublished/unpublishedModalStyles';
import commonStyles from '../../assets/js/styles';
import CustomButton from '../button/Button';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function UnpublishedModal() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <CustomButton variant="contained" dangerButtonStyle onClick={handleOpen}>
        UNPUBLISHED
      </CustomButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalStyle}>
          <CloseIcon onClick = {handleClose} className = {classes.closeIconStyle}></CloseIcon>
          <Typography variant="h6" className={classes.descriptionHeadingStyle}>
            Your project has been unpublished.
          </Typography>
          <Typography className={classes.modalBodyStyle}>
            This is because your project contains information that:
            <Typography className={classes.violationReasonStyle}>
              Threatens, harasses, or intimidates any other person, whether that
              person is a ZubHub user or not
            </Typography>
            You must make changes to your project before it can be republished.
          </Typography>
          <CustomButton
            variant="contained"
            dangerButtonStyle
            onClick={handleClose}
            className={classes.understandButtonStyle}
          >
            I UNDERSTAND
          </CustomButton>
        </Box>
      </Modal>
    </>
  );
}

export default UnpublishedModal;
