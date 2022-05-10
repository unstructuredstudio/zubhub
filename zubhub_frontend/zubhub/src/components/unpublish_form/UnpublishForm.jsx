import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import {
  Modal,
  Box,
  Button,
  MenuItem,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/components/unpublish_form/unpublishFormStyles';
import commonStyles from '../../assets/js/styles';
import API from '../../api';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function UnpublishForm({ id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState(new Set());
  const mediaQuery = useMediaQuery('(max-width: 600px)');
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchReasons = async () => {
      const api = new API();
      const res = await api.getReasons({ token });
      setReasons(res);
    };

    fetchReasons();
  }, []);

  const handleHideProject = async () => {
    const body = {};
    body['reasons'] = [...selectedReasons].map(reason => ({ id: reason }));
    const api = new API();
    try {
      await api.addViolation({ token, body, id });
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckboxClick = e => {
    const id = e.target.value;
    if (selectedReasons.has(id)) {
      selectedReasons.delete(id);
    } else {
      selectedReasons.add(id);
    }
    setSelectedReasons(new Set(selectedReasons));
  };

  console.log(selectedReasons);
  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>Unpublish</MenuItem>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className={
            mediaQuery
              ? classes.unpublishModalMobileStyle
              : classes.unpublishModalStyle
          }
        >
          <CloseIcon
            onClick={() => setOpen(false)}
            className={
              mediaQuery ? classes.closeIconMobileStyle : classes.closeIconStyle
            }
          />
          <div className={classes.overflowWrapper}>
            <Typography
              className={
                mediaQuery
                  ? classes.descriptionHeadingMobileStyle
                  : classes.descriptionHeadingStyle
              }
            >
              Why are you unpublishing this?
            </Typography>
            <Typography
              className={
                mediaQuery
                  ? classes.descriptionSubtitleMobileStyle
                  : classes.descriptionBodyStyle
              }
            >
              Please select the terms of use that have been breached.
            </Typography>

            <FormGroup
              className={
                mediaQuery
                  ? classes.descriptionBodyMobileStyle
                  : classes.descriptionBodyStyle
              }
            >
              {reasons.map(reason => (
                <FormControlLabel
                  className={classes.checkboxStyle}
                  control={
                    <Checkbox
                      className={classes.checkboxStyle}
                      onClick={handleCheckboxClick}
                      value={reason.id}
                    />
                  }
                  label={reason.description}
                  key={reason.id}
                />
              ))}
            </FormGroup>

            <CustomButton
              dangerButtonStyle
              className={
                mediaQuery
                  ? classes.hideProjectButtonMobileStyle
                  : classes.hideProjectButtonStyle
              }
              onClick={handleHideProject}
            >
              Hide Project
            </CustomButton>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default UnpublishForm;
