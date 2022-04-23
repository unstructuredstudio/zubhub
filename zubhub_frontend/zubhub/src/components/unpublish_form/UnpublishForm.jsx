import React, {useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Modal,
    Typography,
  } from '@material-ui/core';

import styles from '../../assets/js/styles/components/unpublish_form/unpublishFormStyles';
import commonStyles from '../../assets/js/styles'

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function UnpublishForm({open, setOpen}) {
    const classes = useStyles();
    const common_classes = useCommonStyles();

    return (
        // use andrew's endpoint to set the checkboxes in the form
        <Modal
            // open={open}
            // onClose={() => setOpen(false)}
            // className={classes.unpublishModalStyle}
            
        >
            <Typography
                className={classes.titleStyle}
                variant="h1"
                
            >
                Why are you unpublishing this?
            </Typography>
            <Typography
                className={classes.subtitleStyle}
                variant="h5"
            >
                Please select the terms of use that have been breached.
            </Typography>

        </Modal>
    );
};

export default UnpublishForm;