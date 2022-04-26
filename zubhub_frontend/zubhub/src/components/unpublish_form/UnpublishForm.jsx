import React, {useState, useEffect, useSelector} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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

import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/components/unpublish_form/unpublishFormStyles';
import commonStyles from '../../assets/js/styles'

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function UnpublishForm() {
    const classes = useStyles();
    const common_classes = useCommonStyles();
    const [open, setOpen] = useState(false);
    const [reasons, setReasons] = useState(['hello', 'why', 'unstructured']);

    // const token = useSelector(state => state.auth.token);

    // const fetchReasons = () => {
    //   fetch("/api/projects/violations-reasons")
    //   .then(response => {
    //     return response.json()
    //   })
    //   .then(data => {
    //     setReasons(data)
    //   })
    // }

    // useEffect(() => {
    //     fetchReasons()
    //   }, [])

    return (
        <>
        <CustomButton
            onClick={() => setOpen(true)}
        >
            Unpublish
        </CustomButton>
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-lebelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box className={classes.unpublishModalStyle}>
            <Typography
                className={classes.descriptionHeadingStyle}
            >
                Why are you unpublishing this?
            </Typography>
            <Typography
                className={classes.descriptionBodyStyle}
            >
                Please select the terms of use that have been breached.
            </Typography>

            <FormGroup className={classes.descriptionBodyStyle}>
                {
                    reasons.map(reason => (
                        <FormControlLabel control={<Checkbox className={classes.checkboxStyle}/>} label={reason}/>
                    ))
                }
            </FormGroup>

            <CustomButton dangerButtonStyle className={classes.hideProjectButtonStyle}>
                Hide Project
            </CustomButton>
          </Box>
        </Modal>
        </>
    );
};

export default UnpublishForm;